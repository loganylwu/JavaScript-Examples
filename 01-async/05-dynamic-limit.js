const async = require("async");
const fetchAjax = require('../../lib/fetchAjax');
const createArray = require('../../lib/createArray');

let limit = 4;
const dynamicLimit = async () => {
    const numbers = createArray(20);
    let runningTask = new Map();
    await async.eachLimit(numbers, limit, (item, callback) => {
        runningTask.set(item, item);
        // ---------- 在item为10的时候，修改limit的值 -----------
        if (item === 10) {
            limit = 2;
        }
        fetchAjax(item)
            .then(() => {
                callback();
            })
            .catch(e => {
                callback(e);
            })
            .finally(() => {
                runningTask.delete(item);
                console.log(`检查运行中数量`, runningTask.values());
            })
    })
}

dynamicLimit();
