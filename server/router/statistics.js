const express = require('express');
const router = express.Router();
//导入数据库操作模块
const db = require('../db/index');
const logError = require('../utils/logError');
const moment = require('moment');

// 获取诗词总数
router.get('/poem/total', (req, res) => {

    db.query('select COUNT(*) as total from poem', (err, result) => {
        if (err) {
            logError(err);
            res.send({ code: 500, message: '服务器错误' });
        } else {
            res.send({ code: 200, message: '获取成功', total: result[0].total });
        }
    })
})

// 获取作者总数
router.get('/author/total', (req, res) => {

    db.query('select COUNT(*) as total from author', (err, result) => {
        if (err) {
            logError(err);
            res.send({ code: 500, message: '服务器错误' });
        } else {
            res.send({ code: 200, message: '获取成功', total: result[0].total });
        }
    })
})

// 获取用户总数
router.get('/user/total', (req, res) => {

    db.query('select COUNT(*) as total from user', (err, result) => {
        if (err) {
            logError(err);
            res.send({ code: 500, message: '服务器错误' });
        } else {
            res.send({ code: 200, message: '获取成功', total: result[0].total });
        }
    })
})

// 获取笔记总数
router.get('/note/total', (req, res) => {
    db.query('select COUNT(*) as total from note', (err, result) => {
        if (err) {
            logError(err);
            res.send({ code: 500, message: '服务器错误' });
        } else {
            res.send({ code: 200, message: '获取成功', total: result[0].total });
        }
    })
})

// 获取视频数量
router.get('/video/total', (req, res) => {
    db.query('select COUNT(*) as total from video', (err, result) => {
        if (err) {
            logError(err);
            res.send({ code: 500, message: '服务器错误' });
        } else {
            res.send({ code: 200, message: '获取成功', total: result[0].total });
        }
    })
})

// 获取评论数量
router.get('/comment/total', (req, res) => {
    db.query('select COUNT(*) as total from note_comment', (err, result) => {
        if (err) {
            logError(err);
            res.send({ code: 500, message: '服务器错误' });
        } else {
            res.send({ code: 200, message: '获取成功', total: result[0].total });
        }
    })
})

// 获取各朝代,以及各朝代的诗词数量
router.get('/dynastyPoemCount', (req, res) => {

    const sql = `
    SELECT d.dynasty AS 'dynasty', COUNT(p.id) AS 'count'
    FROM dynasty d
    LEFT JOIN poem p ON d.id = p.dynasty_id
    GROUP BY d.id, d.dynasty;
    `

    db.query(sql, (err, result) => {
        if (err) {
            logError(err);
            res.send({ code: 500, message: '服务器错误' });
        } else {
            res.send({ code: 200, message: '获取成功', data: result });
        }
    })
})

// 诗词类型统计
router.get('/categoryCount', (req, res) => {

    const sql = `
    SELECT c.category, COUNT(p.id) AS 'count'
    FROM category c
    LEFT JOIN poem p ON (c.id = p.category1_id OR c.id = p.category2_id OR c.id = p.category3_id)
    GROUP BY c.id, c.category;
    `

    db.query(sql, (err, result) => {
        if (err) {
            logError(err);
            res.send({ code: 500, message: '服务器错误' });
        } else {
            res.send({ code: 200, message: '获取成功', data: result });
        }
    })
})

// 获取本周内，每天发布的笔记数量
router.get('/weekNoteCount', async (req, res) => {

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
                'SELECT COUNT(*) as count, DATE_FORMAT(create_time, "%Y-%m-%d") as date FROM note WHERE create_time >= ? AND create_time < ? GROUP BY date',
                [startDate, endDate],
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


module.exports = router;