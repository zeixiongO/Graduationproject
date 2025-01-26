const moment = require('moment');
const logger = require('morgan');

// 自定义日志格式
logger.token('time', () => {
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    return `\x1b[33m${currentDate}\x1b[0m`;
});

logger.token('coloredUrl', (req, res) => {
    const status = res.statusCode;
    const color = status >= 500 ? 31 // 红色
        : status >= 400 ? 33 // 黄色
            : status >= 300 ? 36 // 青色
                : status >= 200 ? 32 // 绿色
                    : 0; // 无颜色
    const url = '\x1b[' + color + 'm' + req.originalUrl + '\x1b[0m';
    return `${url}`;
});

module.exports = logger;