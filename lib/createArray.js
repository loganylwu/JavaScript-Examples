const createArray = (length) => {
    if (length <= 0) return [];
    let res = [];
    for (let i = 0; i < length; i++) {
        res.push(i + 1)
    }
    return res;
}

module.exports = createArray;
