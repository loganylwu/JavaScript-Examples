const data = [1, 2, 3, 22, 4, 66, 98, 123, 22, 112, 221];

const search = (data, target) => {
    for (let i = 0; i < data.length; i++) {
        if (data[i] === target) return i
    }
    return -1;
}

const res = search(data, 2);

console.log(res);


