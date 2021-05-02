import * as Comlink from 'comlink';

interface AudioWorkletProcessor {
  readonly port: MessagePort;
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>
  ): boolean;
}

declare var AudioWorkletProcessor: {
  prototype: AudioWorkletProcessor;
  new(options?: AudioWorkletNodeOptions): AudioWorkletProcessor;
};

declare var sampleRate: number;
declare var currentFrame: number;
declare var currentTime: number;

declare function registerProcessor(
  name: string,
  processorCtor: (new (
    options?: AudioWorkletNodeOptions
  ) => AudioWorkletProcessor) & {
    parameterDescriptors?: AudioParamDescriptor[];
  }
): undefined;

function _concatWaves(a: Float32Array, b: Float32Array) {
  const res = new Float32Array(a.length + b.length);
  res.set(a, 0);
  res.set(b, a.length);
  return res;
}

export class AudioPlayerServiceProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() { return [] };

  _buffers: [Float32Array, Float32Array];
  _rp: number;
  _wp: number;
  _end: boolean;

  constructor(options: AudioWorkletNodeOptions) {
    super(options);
    this._buffers = [new Float32Array(sampleRate * 600), new Float32Array(sampleRate * 600)];
    this._rp = 0;
    this._wp = 0;
    this._end = false;

    this.port.onmessage = (e:any) => {
      if (e.data.type === 'wave') {
        this.put(e.data.waves);
      } else if (e.data.type === 'end') {
        this._end = true;
      }
    }

    this.put(this.calcSilent());
  }

  calcSilent(): [Float32Array, Float32Array] {
    const length = sampleRate >> 1; // 500ms
    const data = new Float32Array(length);
    for (let i = 0; i < length; i++) {
      data[i] = 0;
    }
    return [data, data];
  }

  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters): boolean {
    const output = outputs[0];
    output.forEach((channel, ch) => {
      const buf = this._buffers[ch];
      if (buf && buf.length > sampleRate) {
        for (let i = 0; i < channel.length; i++) {
          if (this._rp + i < this._wp) {
            channel[i] = buf[this._rp + i];
          }
        }
      }
    });
    this._rp += output[0].length;

    if (this._rp >= this._wp && this._end) {
      return false;
    }
    return true;
  }

  put(waves: Float32Array[]): void {
    for (let i = 0; i < waves.length; i++) {
      const wav = waves[i];
      for (let j = 0; j < wav.length; j++) {
        this._buffers[i][this._wp + j] = wav[j];
      }
    }
    this._wp += waves[0].length;
  }

  seek(frame: number): boolean {
    if (frame < this._buffers[0].length) {
      this._rp = frame;
      return true;
    }
    return false;
  }
}