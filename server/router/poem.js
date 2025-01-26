const express = require('express');
const router = express.Router();
//导入数据库操作模块
const db = require('../db/index');
const logError = require('../utils/logError');
const moment = require('moment');

// 查询诗词列表
router.get('/list', async (req, res) => {

    const page = +req.query.page;
    const pageSize = +req.query.pageSize;

    // 获取诗词 同时通过dynasty_id获取dynasty、category_id获取category、form_id获取form、author_id获取author
    const sql = `
    SELECT
        p.id,
        p.title,
        p.content,
        p.translation,
        p.analyze,
        p.create_time,
        p.status,
        p.dynasty_id,
        p.form_id,
        p.author_id,
        p.category1_id,
        p.category2_id,
        p.category3_id,
        d.dynasty,
        c1.category as category1,
        c2.category as category2,
        c3.category as category3,
        f.form,
        a.name
    FROM
        poem p
        LEFT JOIN dynasty d ON p.dynasty_id = d.id
        LEFT JOIN category c1 ON p.category1_id = c1.id
        LEFT JOIN category c2 ON p.category2_id = c2.id
        LEFT JOIN category c3 ON p.category3_id = c3.id
        LEFT JOIN form f ON p.form_id = f.id
        LEFT JOIN author a ON p.author_id = a.id 
    ORDER BY p.create_time
        LIMIT ?,?;
    `

    db.query(sql, [(page - 1) * pageSize, pageSize], (err, list) => {
        if (err) {
            logError(err);
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        // 查询总数
        const sql2 = `SELECT COUNT(*) as total FROM poem`
        db.query(sql2, (err, result) => {
            if (err) {
                logError(err);
                return res.send({
                    code: 500,
                    message: '服务器错误'
                })
            } else {
                res.send({
                    code: 200,
                    message: '查询成功',
                    list,
                    total: result[0].total
                })
            }
        })
    })
});

// 新增诗词
router.post('/add', async (req, res) => {
    const { title, author_id, dynasty_id, content, translation, analyze, category1_id, category2_id, category3_id, form_id } = req.body;

    const sql = `INSERT INTO poem set ?`

    const poem = {
        title,
        author_id: +author_id,
        dynasty_id: +dynasty_id,
        content,
        translation,
        analyze,
        category1_id: +category1_id,
        category2_id: +category2_id || null,
        category3_id: +category3_id || null,
        form_id: +form_id,
        create_time: new Date()
    }

    db.query(sql, poem, (err, result) => {
        if (err) {
            logError(err);
            res.send({
                code: 500,
                message: '服务器错误'
            })
        } else {
            res.send({
                code: 200,
                message: '新增成功'
            })
        }
    })
});

//编辑诗词
router.post('/edit', async (req, res) => {
    const { id, title, author_id, dynasty_id, content, translation, analyze, category1_id, category2_id, category3_id, form_id } = req.body;
    const sql = `UPDATE poem set ? WHERE id = ?`
    const poem = {
        title,
        author_id,
        dynasty_id,
        content,
        translation,
        analyze,
        category1_id,
        category2_id,
        category3_id,
        form_id
    }
    db.query(sql, [poem, id], (err, result) => {
        if (err) {
            logError(err);
            res.send({
                code: 500,
                message: '服务器错误'
            })
        } else {
            res.send({
                code: 200,
                message: '编辑成功'
            })
        }
    })
});

// 删除诗词
router.post('/del', async (req, res) => {
    const { id } = req.body;
    const sql = `DELETE FROM poem WHERE id = ?`
    db.query(sql, id, (err, result) => {
        if (err) {
            logError(err);
            res.send({
                code: 500,
                message: '服务器错误'
            })
        } else {
            res.send({
                code: 200,
                message: '删除成功'
            })
        }
    })
});

// 搜索诗词
router.get('/search', async (req, res) => {
    const { page, pageSize, keyword } = req.query;

    const sql =
        `SELECT * FROM poem 
    WHERE 
    title LIKE '%${keyword}%'
    LIMIT ${(page - 1) * pageSize} , ${pageSize}`

    db.query(sql, (err, list) => {
        if (err) {
            logError(err);
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        const sql2 = `SELECT COUNT(*) as total FROM poem WHERE title LIKE '%${keyword}%'`
        db.query(sql2, (err, result) => {
            if (err) {
                logError(err);
                return res.send({
                    code: 500,
                    message: '服务器错误'
                })
            } else {
                res.send({
                    code: 200,
                    message: '查询成功',
                    list,
                    total: result[0].total
                })
            }
        })
    })
});

// 收藏诗词
router.post('/star', (req, res) => {
    const { user_id, poem_id } = req.body;

    if (!user_id || !poem_id) {
        return res.send({
            code: 400,
            message: '参数错误'
        })
    }

    // 先查看是否已经收藏
    db.query('SELECT * FROM poem_star WHERE user_id=? AND poem_id=?', [user_id, poem_id], (err, results) => {
        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        if (results.length > 0) {
            // 删除收藏
            db.query('DELETE FROM poem_star WHERE user_id=? AND poem_id=?', [user_id, poem_id], (err, results) => {
                if (err) {
                    logError(err)
                    return res.send({
                        code: 500,
                        message: '服务器错误'
                    })
                }

                return res.send({
                    code: 300,
                    message: '已取消'
                })
            })

        } else {
            db.query('INSERT INTO poem_star set ?', { user_id, poem_id, create_time: new Date() }, (err, results) => {
                if (err) {
                    logError(err)
                    return res.send({
                        code: 500,
                        message: '服务器错误'
                    })
                }

                return res.send({
                    code: 200,
                    message: '收藏成功'
                })
            })
        }
    })
})

// 获取是否已收藏诗词
router.get('/isStar', (req, res) => {
    const { user_id, poem_id } = req.query;

    if (!user_id || !poem_id) {
        return res.send({
            code: 400,
            message: '参数错误'
        })
    }

    db.query('SELECT * FROM poem_star WHERE user_id=? AND poem_id=?', [user_id, poem_id], (err, results) => {
        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }
        if (results.length > 0) {
            return res.send({
                code: 200,
                message: '已收藏'
            })
        } else {
            return res.send({
                code: 400,
                message: '未收藏'
            })
        }
    })
})

// 学习诗词
router.post('/learn', (req, res) => {
    const { user_id, poem_id } = req.body;

    if (!user_id || !poem_id) {
        return res.send({
            code: 400,
            message: '参数错误'
        })
    }

    // 先检查当天是否学习过
    db.query('SELECT * FROM learn WHERE user_id=? AND poem_id=? ORDER BY create_time DESC', [user_id, poem_id], (err, results) => {
        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        if (results.length > 0) {
            if (results[0].create_time > new Date().setDate(new Date().getDate() - 1)) {
                return res.send({
                    code: 300,
                    message: '今天已经学习过了'
                })
            } else {
                db.query('INSERT INTO learn set ?', { user_id, poem_id, create_time: new Date() }, (err, results) => {
                    if (err) {
                        logError(err)
                        return res.send({
                            code: 500,
                            message: '服务器错误'
                        })
                    }

                    return res.send({
                        code: 200,
                        message: '已学习'
                    })
                })
            }
        } else {
            db.query('INSERT INTO learn set ?', { user_id, poem_id, create_time: new Date() }, (err, results) => {
                if (err) {
                    logError(err)
                    return res.send({
                        code: 500,
                        message: '服务器错误'
                    })
                }

                return res.send({
                    code: 200,
                    message: '已学习'
                })
            })
        }
    })
})

// 获取用户本周内，每天学习的诗词数量
router.get('/weekLearnCount', async (req, res) => {
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

        // 查询数据库获得用户学习记录
        const queryResult = await new Promise((resolve, reject) => {
            db.query(
                'SELECT COUNT(*) as count, DATE_FORMAT(create_time, "%Y-%m-%d") as date FROM learn WHERE user_id = ? AND create_time >= ? AND create_time < ? GROUP BY date',
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

        return res.send({
            code: 200,
            message: '获取成功',
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

// 获取用户收藏的诗词列表
router.get('/starListByUser', (req, res) => {
    const { user_id } = req.query;
    const page = +req.query.page || 1;
    const pageSize = +req.query.pageSize || 10;

    if (!user_id) {
        return res.send({
            code: 400,
            message: '参数错误'
        })
    }

    db.query('SELECT poem_star.*,poem.title FROM poem_star,poem WHERE user_id=? AND poem.id = poem_star.poem_id ORDER BY create_time DESC LIMIT ?,?', [user_id, (page - 1) * pageSize, pageSize], (err, list) => {
        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        // 获取总数
        db.query('SELECT COUNT(*) as count FROM poem_star WHERE user_id=?', [user_id], (err, results) => {
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
                total: results[0].count
            })
        })
    })
})

// 删除诗词收藏
router.post('/delStar', (req, res) => {

    const id = req.body.id;

    if (!id) {
        return res.send({
            code: 400,
            message: '参数错误'
        })
    }

    db.query('DELETE FROM poem_star WHERE id=?', [id], (err, results) => {
        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }
        return res.send({
            code: 200,
            message: '删除成功'
        })
    })

})

const upload = require('../middleware/imageMulter')
// 上传图片
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.send({
            code: 500,
            message: '服务器错误'
        })
    }
    return res.send({
        code: 200,
        message: '上传成功',
        file: req.file
    })
})


module.exports = router;