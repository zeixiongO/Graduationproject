import request from './config/http'

// 获取视频列表
export const list = params => {
    return request({
        url: '/api/video/list',
        method: 'get',
        params
    })
}

// 视频播放量增长
export const views = params => {
    return request({
        url: '/api/video/views',
        method: 'get',
        params
    })
}

// 收藏视频
export const star = params => {
    return request({
        url: '/video/star',
        method: 'post',
        data: params
    })
}

// 查看是否已收藏
export const isStar = params => {
    return request({
        url: '/video/isStar',
        method: 'get',
        params
    })
}

// 获取收藏的视频列表
export const starList = params => {
    return request({
        url: '/video/starList',
        method: 'get',
        params
    })
}

// 删除收藏的视频
export const deleteStar = params => {
    return request({
        url: '/video/starDel',
        method: 'get',
        params
    })
}
