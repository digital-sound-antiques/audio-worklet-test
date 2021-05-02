function _concatWaves(a, b) {
    const res = new Float32Array(a.length + b.length);
    res.set(a, 0);
    res.set(b, a.length);
    return res;
}
export class AudioPlayerServiceProcessor extends AudioWorkletProcessor {
    constructor(options) {
        super(options);
        this._buffers = [new Float32Array(sampleRate * 600), new Float32Array(sampleRate * 600)];
        this._rp = 0;
        this._wp = 0;
        this._end = false;
        this.port.onmessage = (e) => {
            if (e.data.type === 'wave') {
                this.put(e.data.waves);
            }
            else if (e.data.type === 'end') {
                this._end = true;
            }
        };
        this.put(this.calcSilent());
    }
    static get parameterDescriptors() { return []; }
    ;
    calcSilent() {
        const length = sampleRate >> 1; // 500ms
        const data = new Float32Array(length);
        for (let i = 0; i < length; i++) {
            data[i] = 0;
        }
        return [data, data];
    }
    process(inputs, outputs, parameters) {
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
    put(waves) {
        for (let i = 0; i < waves.length; i++) {
            const wav = waves[i];
            for (let j = 0; j < wav.length; j++) {
                this._buffers[i][this._wp + j] = wav[j];
            }
        }
        this._wp += waves[0].length;
    }
    seek(frame) {
        if (frame < this._buffers[0].length) {
            this._rp = frame;
            return true;
        }
        return false;
    }
}
