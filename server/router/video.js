const express = require('express');
const router = express.Router();
//导入数据库操作模块
const db = require('../db/index');
const logError = require('../utils/logError');
const fs = require('fs');

// 获取列表
router.get('/list', (req, res) => {

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

// 添加
router.post('/add', (req, res) => {

    const { video, title } = req.body;

    const v = {
        video,
        title,
        create_time: new Date()
    }

    db.query('INSERT INTO video set ?', v, (err, results) => {

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
    const { id, title, video } = req.body;

    const v = {
        id,
        title,
        video
    }

    db.query('UPDATE video SET ? where id =?', [v, id], (err, results) => {

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


    // 通过id查询视频地址 删除文件
    db.query('SELECT * FROM video WHERE id=?', [id], (err, results) => {
        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        if (results.length > 0) {
            const video = results[0].video

            fs.unlink(`./uploads/videos/${video}`, (err) => {
                if (err) {
                    logError(err);
                }

                db.query('DELETE FROM video WHERE id=?', [id], (err, results) => {

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
        } else {
            res.send({
                code: 400,
                message: '文件不存在'
            })
        }
    })
})

const upload = require('../middleware/videoMulter')

//上传视频
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


// 浏览量增长
router.get('/view', (req, res) => {
    const { id } = req.query;
    db.query('UPDATE video SET view=view+1 WHERE id=?', [id], (err, results) => {
        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        res.send({
            code: 200,
            message: '浏览量+1'
        })
    })
})

// 获取是否已收藏视频
router.get('/isStar', (req, res) => {
    const { user_id, video_id } = req.query;

    if (!user_id || !video_id) {
        return res.send({
            code: 400,
            message: '参数错误'
        })
    }

    db.query('SELECT * FROM video_star WHERE user_id=? AND video_id=?', [user_id, video_id], (err, results) => {
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

// 收藏视频
router.post('/star', (req, res) => {
    const { user_id, video_id } = req.body;

    if (!user_id || !video_id) {
        return res.send({
            code: 400,
            message: '参数错误'
        })
    }

    // 先查看是否已经收藏
    db.query('SELECT * FROM video_star WHERE user_id=? AND video_id=?', [user_id, video_id], (err, results) => {
        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        if (results.length > 0) {
            // 删除收藏
            db.query('DELETE FROM video_star WHERE user_id=? AND video_id=?', [user_id, video_id], (err, results) => {
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
            db.query('INSERT INTO video_star set ?', { user_id, video_id, create_time: new Date() }, (err, results) => {
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

// 获取用户收藏的视频
router.get('/starList', (req, res) => {

    const { user_id } = req.query;
    const page = +req.query.page
    const pageSize = +req.query.pageSize

    if (!user_id || !page || !pageSize) {
        return res.send({
            code: 400,
            message: '参数错误'
        })
    }

    db.query('SELECT video_star.*,video.title FROM video_star,video WHERE user_id=? AND video.id = video_star.video_id LIMIT ?,?', [user_id, pageSize * (page - 1), pageSize], (err, list) => {

        if (err) {
            logError(err)
            return res.send({
                code: 500,
                message: '服务器错误'
            })
        }

        // 获取收藏的总数
        db.query('SELECT COUNT(*) as count FROM video_star WHERE user_id=?', [user_id], (err, results) => {
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


// 删除收藏的视频
router.post('/starDel', (req, res) => {
})


module.exports = router;