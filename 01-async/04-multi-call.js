const async = require("async");
const Mock = require("../lib/Mock");

// 并发获取数据
const asyncFetchData = async (prefix) => {
    return async.mapLimit(Mock.createNumbers(20), 2, (num, next) => {
        console.log(`发起调用${prefix}-${num}`)
        Mock.fetchData(num, 1000).then(res => {
            next();
        });
    })
}

(
    async () => {
        console.log(`====发起第1次调用====`)
        asyncFetchData(`a`)
        console.log(`====发起第2次调用====`)
        asyncFetchData(`b`);
        console.log(`====发起第3次调用====`)
        asyncFetchData(`c`);
    }
)()
