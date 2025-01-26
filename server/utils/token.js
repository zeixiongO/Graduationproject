//用于生成和解析token
var jwt = require('jsonwebtoken');
const config = require('../config/config');

exports.setToken = function (user) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({
            user
        }, config.jwtSecretKey, { expiresIn: config.expiresIn });
        resolve('Bearer ' + token);
    })
}

exports.verToken = function (token) {
    return new Promise((resolve, reject) => {
        var info = jwt.verify(token.split(' ')[1], config.jwtSecretKey);
        resolve(info);
    })
}