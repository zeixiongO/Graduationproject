import request from './config/http'

export const list = params => {
    return request({
        url: '/note/list',
        method: 'get',
        params
    })
}

export const add = params => {
    return request({
        url: '/note/add',
        method: 'post',
        data: params
    })
}

export const edit = params => {
    return request({
        url: '/note/edit',
        method: 'post',
        data: params
    })
}

export const del = params => {
    return request({
        url: '/note/del',
        method: 'post',
        data: params
    })
}

export const search = params => {
    return request({
        url: '/note/search',
        method: 'get',
        params
    })
}