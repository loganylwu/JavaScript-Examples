var async = require('async');
var mockData = {
    fileList: ["新建文档1.doc", "新建文档2.doc", "新建文档3.doc", "新建文档4.doc"],
    limit: 2,
}
var mockFn = {
    // 模拟1s后出错
    sleep() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject('success');
            }, 1000)
        })
    }
}

const iterator = (fileItem, next) => {
    const isError = fileItem.includes('2') || fileItem.includes('3')
    if (isError) {
        next({msg: "不支持的文档", item: fileItem});
    } else {
        next();
    }
}
// next(),next(err) 也一样只能被调用一次
const badIterator = (fileItem, next) => {
    const isError = fileItem.includes('2') || fileItem.includes('3')
    if (isError) {
        next({msg: "不支持的文档", item: fileItem});
    }
    next();
}
// next只能被调用一次
const badIterator2 = (fileItem, next) => {
    next();
    next();
}
const callback = (err) => {
    console.error(`接收到了一个错误`, err)
}
async.eachLimit(mockData.fileList, mockData.limit, iterator, callback)
