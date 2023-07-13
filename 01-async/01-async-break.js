const async = require("async");
const {fetchAjax} = require("../lib/Mock");


// 并发获取data数据
const asyncFetchData = async (ref) => {
    let results = [];
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, -1, -2, -3, 10, 11, 12, 13, 14, 15, 16];
    await async.mapLimit(nums, 2, (num, next) => {
        console.log(`迭代到${num}`)
        fetchAjax(num, 1000)
            .then(res => {
                results.push(res.data);
                ref.push(res.data);
                next();
            }).catch(e => {
            next(new Error(`时间不同`));
        });
    })
    return results;
}

/**
 * 请注意，由于没有返回dataList，所以没有得到中间数据
 * 可以利用参数插入进去，可感知到实时数据
 */
(async () => {
    let dataList = []
    let ref = []
    try {
        dataList = await asyncFetchData(ref);
    } catch (e) {
        console.log(`捕获到async中的错误`)
        console.log(dataList)
        console.log(ref)
    }
})()
