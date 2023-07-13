const {Transform} = require('stream');

class LimitStream extends Transform {
    sentBytes = 0;
    startTime;
    limit;

    /**
     *
     * @param limit 限速 单位 kb/s
     * @param options
     */
    constructor(limit, options) {
        super(options);
        this.startTime = Date.now();
        this.limit = (limit * 1024) / 1000.0; // converts to bytes per ms
    }


    _transform(chunk, encoding, callback) {
        this.push(chunk, encoding);
        this.sentBytes += chunk.length;
        if (this.limit) {
            this._limit(chunk, encoding, callback);
        } else {
            callback();
        }
    }

    _limit(chunk, encoding, callback) {
        if (!this.limit) {
            callback();
            return;
        }
        try {
            const now = Date.now();
            //  流逝的时间
            const elapsedTime = now - Number(this.startTime);
            // 消耗掉chunk数据所需要的时间
            const assumedTime = this.sentBytes / this.limit;
            // 需要让当前流延后的时间
            const lag = assumedTime - elapsedTime;
            // 若延后时间大于0，则代表超速了，需要延后
            if (lag > 0) {
                setTimeout(() => callback(null), lag);
            } else {
                callback(null);
            }
        } catch (e) {
            callback(e);
        }
    }
}

module.exports = LimitStream;
