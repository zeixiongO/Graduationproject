const multer = require('multer');
const moment = require('moment');
const crypto = require('crypto');
const path = require('path');

// 配置上传文件目录和文件名
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/images');
    },
    filename: function (req, file, cb) {
        //将Date.now格式化成YYYYMMDDHHmmss时间格式 把原始文件名通过md5变短，保留后缀名

        let filename = moment(new Date()).format('YYYYMMDDHHmmss') + '_' + file.originalname;

        const extName = path.extname(filename);
        const md5Hash = crypto.createHash('md5').update(filename).digest('hex');
        const shortenedName = md5Hash.substring(0, 12); // 只取前 8 位

        const newFileName = `${shortenedName}${extName}`;

        cb(null, newFileName);
    }
});


// 创建multer实例
const upload = multer({ storage: storage });

module.exports = upload;