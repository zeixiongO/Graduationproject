import request from './config/http'

//类型增删改查
export const list = params => {
    return request({
        url: '/category/list',
        method: 'get',
        params
    })
}

export const add = params => {
    return request({
        url: '/category/add',
        method: 'post',
        data: params
    })
}

export const edit = params => {
    return request({
        url: '/category/edit',
        method: 'post',
        data: params
    })
}

export const del = params => {
    return request({
        url: '/category/del',
        method: 'post',
        data: params
    })
}