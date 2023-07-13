const async = require("async");
const fetchAjax = require('../../lib/fetchAjax');
const createArray = require('../../lib/createArray');


const dynamicLimitConfig = (limit) => {
    // 默认limit
    let defaultLimit = new Number(limit);
    let myLimit = defaultLimit;
    const updateLimit = (limit) => {
        myLimit = limit;
    }
    const proxyLimit = new Proxy(defaultLimit, {
        get(target, prop, receiver) {
            // 读取数字本质其实是读取valueOf返回值，此时拦截valueOf返回值，返回想要的数据即可
            if (prop === 'valueOf') {
                if (target.valueOf() !== myLimit.valueOf()) {
                    return myLimit.valueOf.bind(myLimit);
                }
                return target.valueOf.bind(target);
            }
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
            console.log(`正在设置属性 ${prop} 的值为 ${value}`);
            return Reflect.set(target, prop, value, receiver);
        }
    })
    return {
        proxyLimit,
        updateLimit,
    }
};

const {proxyLimit, updateLimit} = dynamicLimitConfig(3);

const dynamicLimit = async () => {
    const numbers = createArray(20);
    let runningTask = new Map();
    await async.eachLimit(numbers, proxyLimit, (item, callback) => {
        runningTask.set(item, item);
        // ---------- 在item为10的时候，修改limit的值 -----------
        if (item === 10) {
            updateLimit(4)
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
