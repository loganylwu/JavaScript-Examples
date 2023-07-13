// 模拟睡眠时间
const sleep = (time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null);
        }, time)
    })
}
// 模拟占用微任务执行的操作
const delay = (time = 1000) => {
    const start = Date.now();
    // 占用时间
    while (Date.now() - start < time) {
    }
}
const createNumbers = (length) => {
    if (length <= 0) return [];
    let res = [];
    for (let i = 0; i < length; i++) {
        res.push(i + 1)
    }
    return res;
}

const fetchData = (id, wait = 1000) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id < 0) {
                reject({
                    code: -1,
                    data: `id 不能小于0`
                })
            } else {
                resolve({
                    code: 200,
                    data: `hello ${id} , you are success `
                })
            }
        }, wait)
    })
}

module.exports = fetchData;

const Mock = {
    sleep,
    delay,
    createNumbers,
    fetchData,
}

module.exports = Mock;
