import request from './config/http'

// 获取分类列表
export const list = params => {
    return request({
        url: '/api/poem/list',
        method: 'get',
        params
    })
}

// 获取诗词详情
export const detail = params => {
    return request({
        url: '/api/poem/detail',
        method: 'get',
        params
    })
}

// 收藏诗词
export const star = params => {
    return request({
        url: '/poem/star',
        method: 'post',
        data: params
    })
}

// 获取是否已收藏诗词
export const isStared = params => {
    return request({
        url: '/poem/isStar',
        method: 'get',
        params
    })
}

// 作者详情
export const authorDetail = params => {
    return request({
        url: '/api/author/detail',
        method: 'get',
        params
    })
}

// 根据作者id获取诗词列表
export const listByAuthor = params => {
    return request({
        url: '/api/poem/listByAuthor',
        method: 'get',
        params
    })
}

// 搜索
export const search = params => {
    return request({
        url: '/api/poem/search',
        method: 'get',
        params
    })
}

// 获取formList
export const formList = params => {
    return request({
        url: '/api/form/list',
        method: 'get',
        params
    })
}

// 获取dynastysList
export const dynastysList = params => {
    return request({
        url: '/api/dynasty/list',
        method: 'get',
        params
    })
}

// 获取作者列表
export const authorList = params => {
    return request({
        url: '/api/author/list',
        method: 'get',
        params
    })
}

// 获取随机摘抄
export const random = params => {
    return request({
        url: '/api/poem/random',
        method: 'get',
        params
    })
}

// 浏览量增长
export const views = params => {
    return request({
        url: '/api/poem/views',
        method: 'get',
        params
    })
}

// 学习
export const learn = params => {
    return request({
        url: '/poem/learn',
        method: 'post',
        data: params
    })
}

// 周学习量
export const weekLearnCount = params => {
    return request({
        url: '/poem/weekLearnCount',
        method: 'get',
        params
    })
}

// 删除收藏
export const delStar = params => {
    return request({
        url: '/poem/delStar',
        method: 'post',
        data: params
    })
}

// 获取用户收藏的诗词
export const starListByUser = params => {
    return request({
        url: '/poem/starListByUser',
        method: 'get',
        params
    })
}
