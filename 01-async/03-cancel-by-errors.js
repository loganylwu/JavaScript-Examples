var async = require("async");
const Mock = require("../lib/Mock");


// 定义一个全局的调用开始时间
let startTime = null;

// 并发获取数据
const asyncFetchData = async (callTime) => {
    return async.mapLimit(Mock.createNumbers(20), 2, (num, next) => {
        console.log(`发起调用num ${num}`)
        Mock.fetchData(num, 1000).then(res => {
            if (callTime === startTime) {
                next();
            } else {
                next(new Error(`时间不同`));
            }
        });
    })
}

(
    async () => {

        console.log(`====发起第1次调用====`)
        // 调用前更新time
        startTime = Date.now();
        asyncFetchData(startTime).catch(e => {
            console.log(`=====第1次调用错误了====`)
        });
        // 模拟2S后，再次点击调用
        await Mock.sleep(2 * 1000);

        // 调用前更新time
        startTime = Date.now();
        console.log(`====发起第2次调用====`)
        await asyncFetchData(startTime);
    }
)()
