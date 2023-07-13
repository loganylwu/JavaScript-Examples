const path = require("path");
const fs = require("fs");

// 创建文件
const writeFileBySize = (size, filePath) => {
    const ws = fs.createWriteStream(filePath);
    const randomString = Math.random().toString(36).substring(2);
    let currentSize = 0;
    while (currentSize < size) {
        ws.write(randomString);
        currentSize += randomString.length;
    }
    ws.close();
}

/**
 * 文件生成器
 * @param length 文件个数
 * @param size   文件大小 bytes
 */
const genFiles = (length, size) => {
    const outDir = path.join(__dirname, "./out")
    if (length <= 0 || size <= 0) {
        throw new Error('length 或者 size 不可小于0')
    }
    // 若不存在，自动创建文件夹
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
    }
    for (let i = 0; i < length; i++) {
        const outFilePath = path.join(outDir, `gen_${i}-copy.txt`);
        console.log(`开始生成${outFilePath}文件`);
        console.log(`memory total`, `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}mb`)
        // console.log(`memory`,process.memoryUsage().heapUsed)
        writeFileBySize(size, outFilePath)
    }
}
// 设置node运行内存1024mb
// node --max-old-space-size=1024 gen-files.js
genFiles(100, 20 * 1024 * 1024);
