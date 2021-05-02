import { KSS, KSSPlay } from 'libkss-js';

let started = false;
let port;

onmessage = async (e) => {
  switch (e.data.type) {
    case 'start':
      port = e.ports[0];
      started = true;
      run(e.data.url, e.data.sampleRate);
      break;
  }
}

async function loadKSSFromUrl(url) {
  const res = await fetch(url);
  const ab = await res.arrayBuffer();
  return KSS.createUniqueInstance(new Uint8Array(ab), url);
}

const fadeTime = 5000;
const maxTime = 5 * 60 * 1000;

function generateWave(kssplay, currentTime, samples) {
  if (kssplay.getStopFlag() || kssplay.getFadeFlag() == 2) {
    return null;
  }
  if (kssplay.getFadeFlag() == 0) {
    const loop = kssplay.getLoopCount();
    const remains = maxTime - currentTime;
    if (2 <= loop || (fadeTime && remains <= fadeTime)) {
      kssplay.fadeStart(fadeTime);
    }
  }
  return kssplay.calc(samples);
}

async function run(url, sampleRate) {
  const rate = sampleRate;
  await KSSPlay.initialize();
  const kss = await loadKSSFromUrl(url);
  const kssplay = new KSSPlay(rate);
  kssplay.setDeviceQuality({ psg: 1, scc: 0, opll: 1, opl: 1 });
  kssplay.setData(kss);
  kssplay.reset();

  const f32a = new Float32Array(rate);
  for (let t = 0; t < 600; t++) {
    const start = Date.now();
    const i16a = generateWave(kssplay, t * 1000, rate);

    if (i16a != null) {
      for (let i = 0; i < rate; i++) {
        f32a[i] = i16a[i] / 16384.0;
      }
      // console.log(`${i} ${Date.now() - start}ms`);
      const message = { type: 'wave', id: t, ts: Date.now(), waves: [f32a, f32a] };
      port.postMessage(message);
    }

    if (kssplay.getStopFlag() || kssplay.getFadeFlag() == 2) {
      port.postMessage({ type: 'end' });
      break;
    }
  }
}
