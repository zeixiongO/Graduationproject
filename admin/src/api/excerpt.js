import request from './config/http'

//摘抄增删改查
export const list = params => {
    return request({
        url: '/excerpt/list',
        method: 'get',
        params
    })
}

export const add = params => {
    return request({
        url: '/excerpt/add',
        method: 'post',
        data: params
    })
}

export const edit = params => {
    return request({
        url: '/excerpt/edit',
        method: 'post',
        data: params
    })
}

export const del = params => {
    return request({
        url: '/excerpt/del',
        method: 'post',
        data: params
    })
}