const express = require('express');
const router = express.Router();
//导入数据库操作模块
const db = require('../db/index');
const logError = require('../utils/logError');

// 获取列表
router.get('/list', (req, res) => {
    const page = +req.query.page;
    const pageSize = +req.query.pageSize;

    const sql = `SELECT rp.*,p.title from random_poem rp LEFT JOIN poem p ON rp.poem_id = p.id LIMIT ?,?`

    db.query(sql, [(page - 1) * pageSize, pageSize], (err, list) => {
        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        // 获取总数
        db.query('select count(*) as count from random_poem', (err, result) => {
            if (err) {
                logError(err)
                return res.send({
                    code: 500,
                    message: '服务器错误'
                })
            }

            return res.send({
                code: 200,
                message: '获取成功',
                list,
                total: result[0].count
            })
        })
    })

})

// 添加
router.post('/add', (req, res) => {

    const { excerpt, poem_id } = req.body;

    // 先查询excerpt是否存在
    db.query('select id from random_poem where excerpt = ?', [excerpt], (err, result) => {
        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }
        if (result.length > 0) {
            return res.send({
                code: 400,
                message: '该摘抄已存在'
            })
        } else {
            const sql = `INSERT INTO random_poem(poem_id, excerpt) values (?, ?)`

            db.query(sql, [poem_id, excerpt], (err, result) => {
                if (err) {
                    logError(err)
                    return res.send({
                        code: 500,
                        message: '服务器错误'
                    })
                }

                return res.send({
                    code: 200,
                    message: '添加成功'
                })
            })
        }
    })
})

// 编辑
router.post('/edit', (req, res) => {
    const { id, excerpt } = req.body;

    db.query('update random_poem set excerpt = ? where id = ?', [excerpt, id], (err, result) => {
        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        res.send({
            code: 200,
            message: '编辑成功'
        })
    })
})

// 删除
router.post('/del', (req, res) => {
    const { id } = req.body;

    db.query('delete from random_poem where id = ?', [id], (err, result) => {
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

module.exports = router;