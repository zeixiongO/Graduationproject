import request from './config/http'

//朝代增删改查
export const list = params => {
    return request({
        url: '/dynasty/list',
        method: 'get',
        params
    })
}

export const add = params => {
    return request({
        url: '/dynasty/add',
        method: 'post',
        data: params
    })
}

export const edit = params => {
    return request({
        url: '/dynasty/edit',
        method: 'post',
        data: params
    })
}

export const del = params => {
    return request({
        url: '/dynasty/del',
        method: 'post',
        data: params
    })
}

//修改排序
export const sequence = params => {
    return request({
        url: '/dynasty/sequence',
        method: 'post',
        data: params
    })
}