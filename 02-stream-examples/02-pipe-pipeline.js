const fs = require("fs");
let {Transform, pipeline} = require("stream");

// 定义一个非常简单的转换流
class BaseTransformStream extends Transform {
    _transform(chunk, encoding, callback) {
        this.push(chunk);
        callback();
    }
}

// 创建读文件流
const rs = fs.createReadStream("../../files/demo.txt");
// 创建转换流
const ts = new BaseTransformStream();
// 创建写文件流
const ws = fs.createWriteStream("../../files/demo-copy.txt");

// 模拟读文件流出错
let time = 0
rs.on("data", (chunk) => {
    time++;
    if (time > 4) {
        rs.destroy('读文件流出错了')
    }
})


// 使用pipe进行绑定
const main1 = () => {
    rs.pipe(ts).pipe(ws);
    rs.on('error', (e) => {
        console.log('read error', e)
    })

    ws.on('error', (e) => {
        console.log('ws error', e)
    })

    ts.on('error', (err) => {
        console.log('transformStream error', err)
    })

}
const main2 = () => {
    rs.pipe(ts).pipe(ws);
    rs.on('error', (e) => {
        console.log('read error', e)
        rs.close()
        ts.destroy(`123`)
        ws.close(`22`)
    })

    ws.on('error', (e) => {
        console.log('ws error', e)
    })

    ts.on('error', (err) => {
        console.log('transformStream error', err)
    })

}
const main3 = () => {
    pipeline([rs, ts, ws], (err) => {
        if (err) {
            console.log('error pipeline', err)
        }
    })
    rs.on('error', (e) => {
        console.log('read error', e)
        ts.destroy(`123`)
        ws.destroy(`22`)
    })

    ws.on('error', (e) => {
        console.log('ws error', e)
    })

    ts.on('error', (err) => {
        console.log('transformStream error', err)
    })

}


main1();
// main2();
// main3();
setTimeout(() => {
    console.log(`rs`, rs.readable ? `可读` : `已关闭`)
    console.log(`ts`, ts.readable ? `可读` : `已关闭`)
    console.log(`ts`, ts.writable ? `可写` : `已关闭`)
    console.log(`ws`, ws.writable ? `可写` : `已关闭`)
}, 2000)
