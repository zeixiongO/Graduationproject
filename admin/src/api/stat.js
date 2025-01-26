import request from './config/http'

// 诗词总数
export const poemTotal = params => {
    return request({
        url: '/stat/poem/total',
        method: 'get',
        params
    })
}

// 作者总数
export const authorTotal = params => {
    return request({
        url: '/stat/author/total',
        method: 'get',
        params
    })
}

// 用户数量
export const userTotal = params => {
    return request({
        url: '/stat/user/total',
        method: 'get',
        params
    })
}

// 笔记总数
export const noteTotal = params => {
    return request({
        url: '/stat/note/total',
        method: 'get',
        params
    })
}

// 视频总数
export const videoTotal = params => {
    return request({
        url: '/stat/video/total',
        method: 'get',
        params
    })
}

// 评论数量
export const commentTotal = params => {
    return request({
        url: '/stat/comment/total',
        method: 'get',
        params
    })
}

// 获取各朝代,以及各朝代的诗词数量 
export const dynastyPoemCount = params => {
    return request({
        url: '/stat/dynastyPoemCount',
        method: 'get',
        params
    })
}

// 诗词类型统计
export const categoryCount = params => {
    return request({
        url: '/stat/categoryCount',
        method: 'get',
        params
    })
}

// 一周笔记发布数量
export const weekNoteCount = params => {
    return request({
        url: '/stat/weekNoteCount',
        method: 'get',
        params
    })
}