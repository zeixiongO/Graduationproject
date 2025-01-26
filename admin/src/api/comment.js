import request from './config/http'

//评论列表
export const list = params => {
    return request({
        url: '/comment/list',
        method: 'get',
        params
    })
}

export const del = params => {
    return request({
        url: '/comment/del',
        method: 'post',
        data: params
    })
}