const express = require('express');
const router = express.Router();
//导入数据库操作模块
const db = require('../db/index');
const logError = require('../utils/logError');
const moment = require('moment');
const fs = require('fs');


// 获取列表
router.get('/list', (req, res) => {

    const page = +req.query.page;
    const pageSize = +req.query.pageSize;

    const sql = `
    SELECT note.*,user.nickname FROM note,user
    WHERE note.user_id = user.id
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
            db.query('SELECT COUNT(*) AS count FROM note', (err, results) => {

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

// 发表笔记
router.post('/add', (req, res) => {
    const { user_id, content, title, cover } = req.body;

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
            if (content.match(reg) || title.match(reg)) {
                flag = true;
            }
        })

        if (flag) {
            return res.send({
                code: 500,
                message: '发布失败，请勿发表违禁词'
            })
        }

        const note = {
            user_id,
            title,
            content,
            cover,
            create_time: new Date()
        }

        db.query('INSERT INTO note set ?', note, (err, results) => {

            if (err) {
                logError(err)
                return res.send({
                    code: 500,
                    message: '服务器错误'
                })
            } else {
                res.send({
                    code: 200,
                    message: '发布成功'
                })
            }
        })
    })
})

// 点赞
router.post('/like', (req, res) => {
    const { note_id, user_id } = req.body;

    db.query('select * from note_like where note_id=? and user_id=?', [note_id, user_id], (err, results) => {
        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        } else if (results.length > 0) {
            // 取消点赞
            db.query('DELETE FROM note_like where note_id=? and user_id=?', [note_id, user_id], (err, results) => {

                if (err) {
                    logError(err)
                    return res.send({
                        code: 500,
                        message: '服务器错误'
                    })
                } else {
                    res.send({
                        code: 201,
                        message: '已取消点赞'
                    })
                }
            })
        } else {
            db.query('INSERT INTO note_like set ?', { note_id, user_id }, (err, results) => {

                if (err) {
                    logError(err)
                    return res.send({
                        code: 500,
                        message: '服务器错误'
                    })
                } else {
                    res.send({
                        code: 200,
                        message: '点赞成功'
                    })
                }
            })
        }
    })
})

//编辑
router.post('/edit', (req, res) => {

    const { id, content, title, cover } = req.body;

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
            if (content.match(reg) || title.match(reg)) {
                flag = true;
            }
        })

        if (flag) {
            return res.send({
                code: 500,
                message: '发布失败，请勿发表违禁词'
            })
        }

        const note = {
            title,
            content,
            cover
        }

        db.query('UPDATE note set ? where id=?', [note, id], (err, results) => {

            if (err) {
                logError(err)
                return res.send({
                    code: 500,
                    message: '服务器错误'
                })
            }

            return res.send({
                code: 200,
                message: '操作成功'
            })
        })
    })
})

// 删除
router.post('/del', (req, res) => {
    const { id } = req.body;

    // 查询改该笔记
    db.query('SELECT * FROM note WHERE id=?', [id], (err, results) => {
        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        if (results.length > 0) {
            const cover = results[0].cover

            fs.unlink(`./uploads/images/${cover}`, (err) => {
                if (err) {
                    logError(err);
                }

                db.query('DELETE FROM note WHERE id=?', [id], (err, results) => {

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
        }
    })
})

// 获取用户本周内，每天发布的笔记数量
router.get('/weekCount', async (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.send({
            code: 400,
            message: '参数错误'
        });
    }

    try {
        // 获取当前周的开始和结束日期
        const startDate = moment().startOf('week').format('YYYY-MM-DD');
        const endDate = moment().endOf('week').format('YYYY-MM-DD');

        // 创建本周日期数组
        const weekDates = [];
        for (let m = moment(startDate); m.isBefore(endDate); m.add(1, 'days')) {
            weekDates.push(m.format('YYYY-MM-DD'));
        }

        // 查询数据库获得用户发布的笔记记录
        const queryResult = await new Promise((resolve, reject) => {
            db.query(
                'SELECT COUNT(*) as count, DATE_FORMAT(create_time, "%Y-%m-%d") as date FROM note WHERE user_id = ? AND create_time >= ? AND create_time < ? GROUP BY date',
                [user_id, startDate, endDate],
                (err, results) => err ? reject(err) : resolve(results)
            );
        });

        // 合并查询结果与完整日期数组，填补0值
        const processedData = weekDates.map(date => {
            const entry = queryResult.find(item => item.date === date);
            return {
                date,
                count: entry ? entry.count : 0
            };
        });

        res.send({
            code: 200,
            message: '操作成功',
            data: processedData
        });
    } catch (err) {
        logError(err);
        return res.send({
            code: 500,
            message: '服务器错误'
        });
    }
});

// 用户发布的笔记列表
router.get('/listByUser', (req, res) => {
    const user_id = req.query.user_id;
    const page = +req.query.page || 1;
    const pageSize = +req.query.pageSize || 10;

    db.query('SELECT * FROM note WHERE user_id=? ORDER BY create_time DESC LIMIT ?,?', [user_id, (page - 1) * pageSize, pageSize], (err, list) => {

        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        // 获取总数
        db.query('SELECT COUNT(*) as count FROM note WHERE user_id=?', [user_id], (err, results) => {

            if (err) {
                logError(err)
                return res.send({
                    code: 500,
                    message: '服务器错误'
                })
            }

            res.send({
                code: 200,
                message: '操作成功',
                total: results[0].count,
                list
            })
        })
    })
})

module.exports = router;