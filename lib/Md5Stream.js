const crypto = require('crypto');
const {Transform} = require('stream');

/**
 * 使用示例
 * const md5Stream = new MD5Stream();
 * md5Stream.on('finish', () => {
 *   console.log(md5Stream.read().toString());
 * });
 */
class MD5Stream extends Transform {
    constructor(options) {
        super(options);
        this.md5 = crypto.createHash('md5');
    }

    _transform(chunk, encoding, callback) {
        this.md5.update(chunk);
        callback();
    }

    _flush(callback) {
        const md5Value = this.md5.digest('hex');
        this.push(md5Value);
        callback();
    }
}


module.exports = Md5Stream;
