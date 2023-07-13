const async = require("async");
const {fetchData} = require("../lib/Mock");


// 并发获取data数据
const asyncFetchData = async (ref) => {
    let results = [];
    const nums = [1, 2, -1, -2, -3, 10, 11, 12, 13, 14, 15, 16];
    await async.mapLimit(nums, 2, (num, next) => {
        console.log(`迭代到${num}`)
        fetchData(num, 1000)
            .then(res => {
                results.push(res.data);
                ref.push(res.data);
                next();
            }).catch(e => {
            let error = new Error(`时间不同`);
            error.myData = results;
            next(error);
        });
    })
    return results;
}

/**
 * 请注意，由于没有返回dataList，所以没有得到中间数据
 * 可以利用参数插入进去，可感知到实时数据
 */
(async () => {
    let result = [];
    let ref = []
    try {
        result = await asyncFetchData(ref);
    } catch (e) {
        console.log(`result 无法获取到数据`, result);
        console.log(`利用错误e，从中获取数据`, e.myData);
        console.log(`利用引用，从中获取数据`, ref);
    }
})()
