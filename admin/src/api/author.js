import request from './config/http'

//作者增删改查
export const list = params => {
    return request({
        url: '/author/list',
        method: 'get',
        params
    })
}

export const add = params => {
    return request({
        url: '/author/add',
        method: 'post',
        data: params
    })
}

export const edit = params => {
    return request({
        url: '/author/edit',
        method: 'post',
        data: params
    })
}

export const del = params => {
    return request({
        url: '/author/del',
        method: 'post',
        data: params
    })
}

//搜索
export const search = params => {
    return request({
        url: '/author/search',
        method: 'get',
        params
    })
}