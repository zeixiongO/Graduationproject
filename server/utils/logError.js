function logError(err, req, res, next) {
    const errorMessage = `[ERROR]: ${err}`; // 添加自定义的错误信息
    console.error("\x1b[31m", errorMessage, "\x1b[0m"); // 在错误前面打印自定义信息
}

module.exports = logError;