const async = require("async");
const fetchAjax = require('../../lib/fetchAjax');
const createArray = require('../../lib/createArray');

// 并发获取数据
const asyncFetchData = async (prefix) => {
    return async.mapLimit(createArray(20), 2, (num, next) => {
        console.log(`发起调用${prefix}-${num}`)
        fetchAjax(num, 1000).then(res => {
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
