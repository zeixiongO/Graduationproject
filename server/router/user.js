const express = require('express');
const router = express.Router();
//导入数据库操作模块
const db = require('../db/index');
const logError = require('../utils/logError');

//获取用户信息
router.get('/userinfo', (req, res) => {

    const id = req.query.id

    if (id == '') {
        return res.send({
            code: 400,
            message: '获取失败'
        })
    }

    const sql = 'select id,account,nickname,phone,profile from user where id = ?'

    db.query(sql, id, (err, results) => {

        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        if (results.length === 1) {
            res.send({
                code: 200,
                message: '获取成功',
                user: results[0]
            })
        } else {
            res.send({
                code: 400,
                message: '获取失败'
            })
        }

    })
})

// 编辑用户信息
router.post('/edit', (req, res) => {

    const { id, account, nickname, email, phone, profile, status } = req.body;

    db.query(`UPDATE user SET ? WHERE id='${id}'`, [{
        account,
        nickname,
        email,
        phone,
        profile,
        status
    }], (err, result) => {
        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        } else if (result.affectedRows === 0) {
            res.json({ code: 400, message: '该用户不存在' });
        } else {
            res.json({ code: 200, message: '编辑成功' });
        }
    });
});

//修改密码
router.post('/changepassword', (req, res) => {
    const { id, oldPassword, newPassword } = req.body;

    // 首先验证旧密码是否正确
    db.query(`SELECT password FROM user WHERE id='${id}'`, (err, result) => {
        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        } else if (result.length === 0) {
            return res.send({ code: 400, message: '该用户不存在' });
        } else if (result[0].password !== oldPassword) {
            return res.send({ code: 400, message: '密码不正确' });
        } else {
            // 更新密码
            db.query(`UPDATE user SET password='${newPassword}' WHERE id='${id}'`, (err, result) => {
                if (err) {
                    return res.send({ code: 500, message: '服务器出错' });
                } else {
                    return res.send({ code: 200, message: '密码修改成功' });
                }
            });
        }
    });
});

//获取所有用户 分页
router.get('/all', (req, res) => {

    const page = +req.query.page;
    const pageSize = +req.query.pageSize;

    const sql = `SELECT * FROM user LIMIT ${(page - 1) * pageSize},${pageSize}`;

    db.query(sql, (err, users) => {

        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        //获取用户总数
        db.query('SELECT COUNT(*) AS count FROM user', (err, results) => {

            if (err) {
                logError(err)
                return res.send({
                    code: 500,
                    message: '服务器错误'
                })
            }

            res.send({
                code: 200,
                message: '获取成功',
                users,
                total: results[0].count
            })
        })
    })
})

//搜索用户 分页
router.get('/search', (req, res) => {

    const { page, pageSize, keyword } = req.query;

    const sql = `SELECT id,account,nickname,phone FROM user WHERE id = '${keyword}' or account LIKE '%${keyword}%' OR nickname LIKE '%${keyword}%' OR phone LIKE '%${keyword}%'  LIMIT ${(page - 1) * pageSize},${pageSize}`;

    db.query(sql, (err, users) => {

        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误[1]'
            })
        }

        //获取搜索到的用户总数
        db.query(`SELECT COUNT(*) AS count FROM user WHERE id = '${keyword}' or account LIKE '%${keyword}%' OR nickname LIKE '%${keyword}%' OR phone LIKE '%${keyword}%'`, (err, results) => {

            if (err) return res.cc('服务器错误[2]')

            res.send({
                code: 200,
                message: '获取成功',
                users,
                total: results[0].count
            })
        })
    })
})

//编辑用户信息
router.post('/modify', (req, res) => {

    const { id, account, password, nickname, profile, phone } = req.body;

    db.query(`UPDATE user SET account = '${account}',password='${password}', nickname='${nickname}', phone='${phone}', profile='${profile}' where id =${id}`, (err, result) => {
        if (err) {
            console.log(err);
            res.send({ code: 500, message: '服务器出错' });
        } else if (result.affectedRows === 0) {
            res.send({ code: 400, message: '该用户不存在' });
        } else {
            res.send({ code: 200, message: '编辑成功' });
        }
    });
});

//批量删除用户
router.post('/del', (req, res) => {

    const { id } = req.body;

    db.query(`DELETE FROM user WHERE id =?`, id, (err, result) => {
        if (err) {
            logError(err)
            res.send({ code: 500, message: '服务器出错' });
        } else if (result.affectedRows === 0) {
            res.send({ code: 400, message: '该用户不存在' });
        } else {
            res.send({ code: 200, message: '删除成功' });
        }
    });
});

//直接修改密码
router.post('/modifyPsd', (req, res) => {
    const { id, password } = req.body;

    db.query(`UPDATE user SET password='${password}' WHERE id='${id}'`, (err, result) => {
        if (err) {
            logError(err)
            return res.send({ code: 500, message: '服务器出错' });
        } else {
            return res.send({ code: 200, message: '密码修改成功' });
        }
    });
});

//创建用户
router.post('/add', (req, res) => {
    const { account, password, nickname, email, phone, status } = req.body;

    db.query(`INSERT INTO user set ?`, { account, password, nickname, email, phone, status, create_time: new Date() }, (err, result) => {
        if (err) {
            logError(err)
            res.json({ code: 500, message: '服务器出错' });
        } else {
            res.json({ code: 200, message: '创建成功' });
        }
    });
});


module.exports = router;