const express = require('express');
const router = express.Router();
//导入数据库操作模块
const db = require('../db/index');
const logError = require('../utils/logError');

// 获取列表
router.get('/list', (req, res) => {

    const sql = `SELECT * FROM dynasty order by sequence;`;

    db.query(sql, (err, list) => {

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
        })
    })
});

// 添加
router.post('/add', (req, res) => {
    const { dynasty, time_range } = req.body;

    db.query('INSERT INTO dynasty(dynasty, time_range) VALUES(?,?)', [dynasty, time_range], (err, results) => {

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
    const { id, dynasty, sequence, time_range } = req.body;
    db.query('UPDATE dynasty SET dynasty=?,time_range=?,sequence=? WHERE id=?', [dynasty, time_range, sequence, id], (err, results) => {

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
    db.query('DELETE FROM dynasty WHERE id=?', [id], (err, results) => {

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

//修改排序
router.post('/sequence', (req, res) => {
    const { id, sequence } = req.body;
    db.query('UPDATE dynasty SET sequence=? WHERE id=?', [sequence, id], (err, results) => {

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


module.exports = router;