const fetchAjax = (id, wait = 1000) => {
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

module.exports = fetchAjax;
