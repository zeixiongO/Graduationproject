const express = require('express');
const router = express.Router();
//导入数据库操作模块
const db = require('../db/index');
const logError = require('../utils/logError');

// 获取列表
router.get('/list', (req, res) => {

    const page = +req.query.page;
    const pageSize = +req.query.pageSize;

    const sql = `
    SELECT note_comment.*,note.title,user.nickname FROM note_comment,note,user
    WHERE note_comment.note_id = note.id and note_comment.user_id = user.id
    LIMIT ${(page - 1) * pageSize},${pageSize}
    `;

    db.query(sql, (err, list) => {

        db.query(sql, (err, list) => {

            if (err) {
                logError(err)
                return res.send({
                    code: 500,
                    message: '服务器错误'
                })
            }

            //获取总数
            db.query('SELECT COUNT(*) AS count FROM note_comment', (err, results) => {

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
    })
});

// 评论
router.post('/add', (req, res) => {
    const { user_id, note_id, content } = req.body;

    db.query('select * from keyword', (err, keywords) => {
        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        let flag = false;
        keywords.forEach(keyword => {
            const reg = new RegExp(keyword.word, 'i');
            if (content.match(reg)) {
                flag = true;
            }
        })

        if (flag) {
            return res.send({
                code: 500,
                message: '发布失败，请勿发表违禁词'
            })
        }

        const comment = {
            user_id,
            note_id,
            content,
            create_time: new Date()
        }

        db.query('INSERT INTO note_comment set ?', comment, (err, results) => {

            if (err) {
                logError(err)
                return res.send({
                    code: 500,
                    message: '服务器错误'
                })
            }

            res.send({
                code: 200,
                message: '评论成功'
            })
        })
    })
})

// 删除
router.post('/del', (req, res) => {
    const { id } = req.body;
    db.query('DELETE FROM note_comment WHERE id=?', [id], (err, results) => {

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

// 通过用户id获取评论列表
router.get('/listByUser', (req, res) => {

    const user_id = +req.query.user_id;
    const page = +req.query.page;
    const pageSize = +req.query.pageSize;

    db.query(`
    SELECT note_comment.*,note.title FROM note_comment,note
    WHERE note_comment.note_id = note.id and note_comment.user_id = ?
    LIMIT ${(page - 1) * pageSize},${pageSize}
    `, [user_id], (err, list) => {

        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        // 获取总数
        db.query('SELECT COUNT(*) AS count FROM note_comment WHERE user_id=?', [user_id], (err, results) => {

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
})

module.exports = router;