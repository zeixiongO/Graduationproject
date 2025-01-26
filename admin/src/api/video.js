import request from './config/http'

//形式增删改查
export const list = params => {
    return request({
        url: '/video/list',
        method: 'get',
        params
    })
}

export const add = params => {
    return request({
        url: '/video/add',
        method: 'post',
        data: params
    })
}

export const edit = params => {
    return request({
        url: '/video/edit',
        method: 'post',
        data: params
    })
}

export const del = params => {
    return request({
        url: '/video/del',
        method: 'post',
        data: params
    })
}