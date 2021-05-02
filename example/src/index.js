import * as Comlink from 'comlink';

let isPlaying = false;

class Player {

  async init(url) {
    this.worker = new Worker(new URL('./worker', import.meta.url));
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    await this.audioContext.audioWorklet.addModule('./dist/processor.js');
    this.workletNode = new AudioWorkletNode(this.audioContext, 'audio-player');
    this.workletNode.connect(this.audioContext.destination);
    this.worker.postMessage({
      type: 'start', 
      url: url, 
      sampleRate: this.audioContext.sampleRate
    }, [ this.workletNode.port ]);
  }

  async dispose() {
    await this.audioContext.close();
    this.workletNode.disconnect();
    this.workletNode = null;
    this.worklet = null;
    this.worker.terminate();
    this.worker = null;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('ready');

  let player = new Player();
  let btn = document.getElementById('play');

  btn.addEventListener('click', async () => {
    if (!isPlaying) {
      const url = document.getElementById('url').value;
      await player.init(url);
      isPlaying = true;
      document.body.classList.add('playing');
    } else {
      await player.dispose();
      isPlaying = false;
      document.body.classList.remove('playing');
    }
  });
});

