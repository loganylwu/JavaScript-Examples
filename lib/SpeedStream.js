const {Transform} = require('stream');

class SpeedStream extends Transform {

    startTime;
    sentBytes = 0;
    receivedBytes = 0;

    constructor(options) {
        super(options);
        this.id = Date.now();
        this.startTime = Date.now();
    }

    _read(size) {
        const chunk = super._read(size);
        if (chunk) {
            this.receivedBytes += chunk.length;
            this._rate();
        }
    }

    _rate() {
        const now = Date.now();
        const elapsedSeconds = (now - this.startTime) / 1000;
        const bytesPerSecond = this.sentBytes / elapsedSeconds;
        let speed = (bytesPerSecond / 1024).toFixed(2);
        this.emit('progress',speed);
        // console.log(`log check Speed ${this.id}: ${speed} mb/s`);
    }

    _transform(chunk, encoding, callback) {
        this.push(chunk, encoding);
        this.sentBytes += chunk.length;
        console.log(`speed 读取了 ${this.sentBytes}`)
        this._rate();
        callback();
    }
}

module.exports = SpeedStream;
