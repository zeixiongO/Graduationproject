const express = require('express');
const router = express.Router();
//导入数据库操作模块
const db = require('../db/index');
const logError = require('../utils/logError');

// 获取列表
router.get('/list', (req, res) => {

    const page = +req.query.page;
    const pageSize = +req.query.pageSize;

    const sql = `SELECT * FROM author LIMIT ${(page - 1) * pageSize},${pageSize}`;

    db.query(sql, (err, list) => {

        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        //获取总数
        db.query('SELECT COUNT(*) AS count FROM author', (err, results) => {

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
                list,
                total: results[0].count
            })
        })
    })
});

// 添加
router.post('/add', (req, res) => {
    const { name, profile, intro } = req.body;

    db.query('INSERT INTO author(name, intro, profile) VALUES(?,?,?)', [name, intro, profile], (err, results) => {

        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        res.send({
            code: 200,
            message: '添加成功'
        })
    })
})

// 编辑
router.post('/edit', (req, res) => {
    const { id, name, intro, profile } = req.body;
    db.query('UPDATE author SET name=?, intro=?, profile=? WHERE id=?', [name, intro, profile, id], (err, results) => {

        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        res.send({
            code: 200,
            message: '修改成功'
        })
    })
})

// 删除
router.post('/del', (req, res) => {
    const { id } = req.body;
    db.query('DELETE FROM author WHERE id=?', [id], (err, results) => {

        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        res.send({
            code: 200,
            message: '删除成功'
        })
    })
})

// 搜索作者
router.get('/search', (req, res) => {
    const { name } = req.query;

    db.query(`SELECT * FROM author WHERE name LIKE '%${name}%'`, (err, results) => {
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
            list: results
        })
    })
})

module.exports = router;