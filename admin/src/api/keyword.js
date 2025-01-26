import request from './config/http'

//形式增删改查
export const list = params => {
    return request({
        url: '/keyword/list',
        method: 'get',
        params
    })
}

export const add = params => {
    return request({
        url: '/keyword/add',
        method: 'post',
        data: params
    })
}

export const edit = params => {
    return request({
        url: '/keyword/edit',
        method: 'post',
        data: params
    })
}

export const del = params => {
    return request({
        url: '/keyword/del',
        method: 'post',
        data: params
    })
}