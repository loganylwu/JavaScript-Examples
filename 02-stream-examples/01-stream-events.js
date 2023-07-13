const fs = require("fs");
let {Transform, pipeline} = require("stream");

class MyTransformStream extends Transform {
    _transform(chunk, encoding, callback) {
        this.push(chunk);
        callback();
    }
}

const rs = fs.createReadStream("../../files/demo.txt");
let ts = new MyTransformStream();
const ws = fs.createWriteStream("../../files/demo-copy.txt");

pipeline(rs, ws, (err) => {
    if (err) {
        console.log(err)
        ts = null;
    }
})
// rs.pipe(ts);
// ts.pipe(ws);

// 添加监听器
const addListener = (stream, name) => {
    const writeableEvents = [`close`, `drain`, `error`, `finish`, `pipe`, `unpipe`]
    let readableEvents = [`close`, `data`, `end`, `error`, `pause`, /*`readable`,*/ `resume`]
    const allEvents = [`close`, `data`, `drain`, `end`, `error`, `finish`, `pause`, `pipe`, /*`readable`,*/ `resume`, `unpipe`,]
    let streamEvents = [];
    name === 'ws' && (streamEvents = writeableEvents);
    name === 'rs' && (streamEvents = readableEvents);
    name === 'ts' && (streamEvents = allEvents);
    streamEvents.forEach(event => {
        stream.on(event, (chunk) => {
            const moreInfo = event === 'data' ? `chunk.length:${chunk.length}` : '';
            console.log(`${name} on ${event} ${moreInfo}`)
        })
    })
}
addListener(rs, 'rs')
addListener(ts, 'ts')
addListener(ws, 'ws')
