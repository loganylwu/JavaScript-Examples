const wait = (time) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null);
        }, time)
    })
}

module.exports = wait;
