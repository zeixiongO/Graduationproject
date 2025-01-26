import request from './config/http'

// 获取分类列表
export const list = params => {
    return request({
        url: '/api/note/list',
        method: 'get',
        params
    })
}

// 发布笔记
export const add = params => {
    return request({
        url: '/note/add',
        method: 'post',
        data: params
    })
}

// 编辑笔记
export const edit = params => {
    return request({
        url: '/note/edit',
        method: 'post',
        data: params
    })
}

// 删除
export const del = params => {
    return request({
        url: '/note/del',
        method: 'post',
        data: params
    })
}

// 点赞笔记
export const like = params => {
    return request({
        url: '/note/like',
        method: 'post',
        data: params
    })
}

// 笔记详情
export const detail = params => {
    return request({
        url: '/api/note/detail',
        method: 'get',
        params
    })
}

// 获取笔记评论
export const comment = params => {
    return request({
        url: '/api/note/comment',
        method: 'get',
        params
    })
}

// 发表评论
export const commentAdd = params => {
    return request({
        url: '/comment/add',
        method: 'post',
        data: params
    })
}

//删除评论
export const commentDel = params => {
    return request({
        url: '/comment/del',
        method: 'post',
        data: params
    })
}

// 浏览量增长
export const views = params => {
    return request({
        url: '/api/note/views',
        method: 'get',
        params
    })
}

// 获取用户本周 发布笔记统计
export const weekNoteCount = params => {
    return request({
        url: '/note/weekCount',
        method: 'get',
        params
    })
}

// 通过用户获取列表
export const listByUser = params => {
    return request({
        url: '/note/listByUser',
        method: 'get',
        params
    })
}

// 通过用户获取评论列表
export const commentListByUser = params => {
    return request({
        url: '/comment/listByUser',
        method: 'get',
        params
    })
}