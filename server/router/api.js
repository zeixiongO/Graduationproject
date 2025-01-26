const express = require('express');
const router = express.Router();
//导入数据库操作模块
const db = require('../db/index');
const logError = require('../utils/logError');

// 获取笔记列表
router.get('/note/list', async (req, res) => {

    const page = +req.query.page;
    const pageSize = +req.query.pageSize;

    const sql = `
    SELECT note.*,user.nickname,user.profile FROM note,user
    WHERE note.user_id = user.id
    ORDER BY note.views DESC,note.create_time DESC
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

// 获取笔记详情
router.get('/note/detail', async (req, res) => {
    const id = +req.query.id;

    const sql = `
    SELECT note.*,user.nickname,user.profile FROM note,user
    WHERE note.user_id = user.id AND note.id = ${id}
    `;

    db.query(sql, (err, results) => {
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
            data: results
        })
    })

});


// 笔记浏览量增长
router.get('/note/views', async (req, res) => {

    const id = +req.query.id;
    const sql = `UPDATE note SET views = views + 1 WHERE id = ${id}`;
    db.query(sql, (err, results) => {
        if (err) {
            logError(err);
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        } else {
            res.send({
                code: 200,
                message: '浏览量+1'
            })
        }
    })
});


//根据笔记id获取评论
router.get('/note/comment', async (req, res) => {
    const id = +req.query.id;

    const sql = `
    SELECT
        c.id,
        c.content,
        c.create_time,
        c.user_id,
        u.nickname,
        u.profile
    FROM
        note_comment c
        LEFT JOIN user u ON c.user_id = u.id
    WHERE
        c.note_id = ${id}
    ORDER BY c.create_time DESC
    `;

    db.query(sql, (err, results) => {
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
});

// 获取诗词列表
router.get('/poem/list', async (req, res) => {
    const page = +req.query.page;
    const pageSize = +req.query.pageSize;

    // 获取诗词 同时通过dynasty_id获取dynasty、category_id获取category、form_id获取form、author_id获取author
    const sql = `
    SELECT
        p.id,
        p.title,
        p.content,
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
    ORDER BY p.views DESC
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

// 搜索诗词
router.get('/poem/search', async (req, res) => {
    const keyword = req.query.keyword;
    const type = req.query.type;
    const page = +req.query.page;
    const pageSize = +req.query.pageSize;

    let str = '';

    if (type === 'category') {
        str = `WHERE p.category1_id = ${keyword} OR p.category2_id = ${keyword} OR p.category3_id = ${keyword}`
    } else if (type === 'dynasty') {
        str = `WHERE p.dynasty_id = ${keyword}`
    } else if (type === 'author') {
        str = `WHERE p.author_id = ${keyword}`
    } else if (type === 'form') {
        str = `WHERE p.form_id = ${keyword}`
    } else if (type === 'title') {
        str = `WHERE p.title LIKE '%${keyword}%'`
    }

    // 获取诗词 同时通过dynasty_id获取dynasty、category_id获取category、form_id获取form、author_id获取author
    const sql = `
        SELECT
            p.id,
            p.title,
            p.content,
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
        ${str}
        LIMIT ?,?
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
        const sql2 = `
        SELECT
            COUNT(*) as total,
            p.id,
            p.title,
            p.content,
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
        ${str}
        `

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

// 获取诗词详情
router.get('/poem/detail', async (req, res) => {

    const id = +req.query.id;

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
    WHERE p.id = ?;
    `

    db.query(sql, [id], (err, result) => {
        if (err) {
            logError(err);
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        res.send({
            code: 200,
            message: '查询成功',
            data: result[0]
        })
    })
});

// 诗词浏览量增长
router.get('/poem/views', async (req, res) => {
    const id = +req.query.id;

    const sql = `UPDATE poem SET views = views + 1 WHERE id = ?`;

    db.query(sql, [id], (err) => {

        if (err) {
            logError(err);
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        res.send({
            code: 200,
            message: '更新成功'
        })
    })
});

// 获取视频列表
router.get('/video/list', async (req, res) => {
    const page = +req.query.page;
    const pageSize = +req.query.pageSize;

    const sql = `SELECT * FROM video LIMIT ${(page - 1) * pageSize},${pageSize}`;

    db.query(sql, (err, list) => {

        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        //获取总数
        db.query('SELECT COUNT(*) AS count FROM video', (err, results) => {

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

// 视频播放量增长
router.get('/video/views', async (req, res) => {

    const id = +req.query.id;

    db.query('UPDATE video SET views = views + 1 WHERE id = ?', [id], (err, results) => {

        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        res.send({
            code: 200,
            message: '浏览量+1',
        })
    })
});

// 诗词浏览量增长
router.get('/poem/views', async (req, res) => {

    const id = req.query.id;

    db.query('UPDATE poem SET views = views + 1 WHERE id = ?', [id], (err, results) => {

        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        res.send({
            code: 200,
            message: '浏览量+1',
        })
    })
});

// 获取全部分类列表
router.get('/category/list', async (req, res) => {
    const sql = `SELECT * FROM category`;

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

// 获取作者详情
router.get('/author/detail', async (req, res) => {
    const id = +req.query.id;

    const sql = `SELECT * FROM author WHERE id = ?`;

    db.query(sql, [id], (err, result) => {

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
            data: result[0]
        })
    })
});

// 根据作者id获取其诗词列表
router.get('/poem/listByAuthor', async (req, res) => {

    const id = +req.query.id;

    const sql = `SELECT id,title FROM poem WHERE author_id = ?`;

    db.query(sql, [id], (err, list) => {

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

// 获取formList
router.get('/form/list', async (req, res) => {
    const sql = `SELECT * FROM form`;

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

// 获取dynastyList
router.get('/dynasty/list', async (req, res) => {
    const sql = `SELECT * FROM dynasty`;

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

// 获取authorList
router.get('/author/list', async (req, res) => {
    const sql = `SELECT * FROM author`;

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


// 获取随机摘抄
router.get('/poem/random', async (req, res) => {

    const count = +req.query.count

    const sql = `
    SELECT
        rp.*,
        p.id,
        p.title,
        p.content,
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
        a.name,
        a.profile
    FROM
        random_poem rp
        LEFT JOIN poem p ON rp.poem_id = p.id
        LEFT JOIN dynasty d ON p.dynasty_id = d.id
        LEFT JOIN category c1 ON p.category1_id = c1.id
        LEFT JOIN category c2 ON p.category2_id = c2.id
        LEFT JOIN category c3 ON p.category3_id = c3.id
        LEFT JOIN form f ON p.form_id = f.id
        LEFT JOIN author a ON p.author_id = a.id 
    ORDER BY RAND()
    LIMIT ?
    `

    db.query(sql, [count], (err, list) => {
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
        })
    })
});

module.exports = router;