const express = require('express')
//创建web服务器
const app = express();
const logError = require('./utils/logError');

//跨域
const cors = require('cors');
app.use(cors());

//配置解析 application/json 格式数据的内置中间件
app.use(express.json());
//配置解析 application/x-www-from-urlencoded 格式数据的内置中间件
app.use(express.urlencoded({ extended: false }));

// 日志中间件
const logger = require('./middleware/logger');
// 配置 morgan 使用自定义日志格式
app.use(logger('[:method :status] [:coloredUrl] [IP :remote-addr] [:time] '));

//导入token配置文件
const config = require('./config/config');
// token解析器
var vertoken = require('./utils/token');
var expressJWT = require('express-jwt');
//配置
app.use(function (req, res, next) {
    var token = req.headers['authorization'];
    if (token == undefined) {
        return next();
    } else {
        vertoken.verToken(token).then((data) => {
            req.user = data.user;
            return next();
        }).catch((error) => {
            return next();
        })
    }
});
app.use(expressJWT.expressjwt({ algorithms: ['HS256'], secret: config.jwtSecretKey }).unless({
    path: [
        { url: /^\/api\// },
        { url: /^\/source\// }
    ]
}));

//对外提供静态资源
app.use('/source', express.static('./uploads'));

// 导入登录路由
const loginRouter = require('./router/userLogin');
app.use('/api', loginRouter)

//导入api路由
const apiRouter = require('./router/api');
app.use('/api', apiRouter)

//导入用户路由
const userRouter = require('./router/user');
app.use('/user', userRouter)

//导入形式路由
const formRouter = require('./router/form');
app.use('/form', formRouter)

// 导入朝代路由
const dynastyRouter = require('./router/dynasty');
app.use('/dynasty', dynastyRouter)

//导入分类路由
const categoryRouter = require('./router/category');
app.use('/category', categoryRouter)

//导入作者路由
const authorRouter = require('./router/author');
app.use('/author', authorRouter)

//导入诗词路由
const poemRouter = require('./router/poem');
app.use('/poem', poemRouter)

//导入关键词路由
const keywordRouter = require('./router/keyword');
app.use('/keyword', keywordRouter)

//导入视频路由
const videoRouter = require('./router/video');
app.use('/video', videoRouter)

//导入评论路由
const commentRouter = require('./router/comment');
app.use('/comment', commentRouter)

//导入笔记路由
const noteRouter = require('./router/note');
app.use('/note', noteRouter)

//导入摘抄路由
const excerptRouter = require('./router/excerpt');
app.use('/excerpt', excerptRouter)

// 导入数据统计路由
const statRouter = require('./router/statistics');
app.use('/stat', statRouter)

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    if (err.status == 401) {
        return res.send({ code: 401, message: 'token失效，请重新登录' });
    }

    logError(err)
    //未知错误
    res.send({ code: 400, message: '未知错误' })
})

//调用app.listen(端口号，启动成功后的回调函数)，启动服务器
app.listen(3000, () => {
    console.log('Service started successfully');
})
