const express = require('express');

const router = express.Router();
//导入数据库操作模块
const db = require('../db/index');
//导入生成token包
const token = require('../utils/token')

//注册新用户处理函数
router.post('/register', (req, res) => {
    //获取用户提交的用户信息
    const userinfo = req.body.userinfo;

    if (!userinfo.account || !userinfo.password) {
        return res.send({ code: 400, message: '账号和密码不能为空' });
    }

    const selectSql = 'select * from user where account=?'
    db.query(selectSql, userinfo.account, (err, results) => {

        if (err) return res.send({
            code: 400,
            message: '服务器错误'
        })

        if (results.length > 0) return res.send({
            code: 400,
            message: '该账号已存在'
        })

        //插入新用户sql语句
        const insertSql = 'insert into user set ?'
        db.query(insertSql, { account: userinfo.account, password: userinfo.password, nickname: userinfo.nickname, create_time: new Date() }, (err, results) => {
            if (err) return res.send({
                code: 500,
                message: '服务器错误'
            })


            //判断影响行数是否为1
            if (results.affectedRows !== 1) return res.send({
                code: 400,
                message: '注册失败'
            })

            //注册成功
            res.send({ code: 200, message: '注册成功' })
        })
    })
})


//登录处理函数
router.post('/login', (req, res) => {
    const userinfo = req.body.userinfo

    if (!userinfo.account || !userinfo.password) {
        return res.send({ code: 400, message: '请输入账号和密码' })
    }

    const selectSql = 'select * from user where account=?'
    db.query(selectSql, userinfo.account, (err, results) => {
        if (err) return res.send({
            code: 500,
            message: '服务器错误'
        })


        if (results.length === 0) return res.send({
            code: 400,
            message: '该账号不存在'
        })

        if (results.length > 1) return res.send({
            code: 400,
            message: '账号错误'
        })

        if (results[0].password !== userinfo.password) {
            return res.send({
                code: 400,
                message: '账号或密码错误'
            })
        }

        //将用户的敏感信息去除 密码和用户头像置空
        const user = { ...results[0], password: '' }

        //生成token
        token.setToken(user).then(data => {
            res.send({
                code: 200,
                message: '登录成功',
                userinfo: user,
                token: data
            })
        }).catch(err => {
            res.send({
                code: 500,
                message: '服务器错误'
            })
        })
    })
})

//管理员登录
router.post('/adminLogin', (req, res) => {
    const userinfo = req.body.userinfo

    if (!userinfo.account || !userinfo.password) {
        return res.send({ code: 400, message: '请输入账号和密码' })
    }

    const selectSql = 'select * from user where account=? and role = 1'
    db.query(selectSql, userinfo.account, (err, results) => {
        if (err) return res.send({
            code: 500,
            message: '服务器错误',
            err
        })

        if (results.length === 0) return res.send({
            code: 400,
            message: '该账号不存在'
        })

        if (results.length > 1) return res.send({
            code: 400,
            message: '账号错误'
        })

        if (results[0].password !== userinfo.password) {
            return res.send({
                code: 400,
                message: '账号或密码错误'
            })
        }

        //将用户的敏感信息去除 密码和用户头像置空
        const user = { ...results[0], password: '' }

        //生成token
        token.setToken(user).then(data => {
            res.send({
                code: 200,
                message: '登录成功',
                userinfo: user,
                token: data
            })
        }).catch(err => {
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        })
    })
})

module.exports = router;