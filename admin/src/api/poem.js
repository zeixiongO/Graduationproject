import request from './config/http'

export const list = params => {
    return request({
        url: '/poem/list',
        method: 'get',
        params
    })
}

export const add = params => {
    return request({
        url: '/poem/add',
        method: 'post',
        data: params
    })
}

export const edit = params => {
    return request({
        url: '/poem/edit',
        method: 'post',
        data: params
    })
}

export const del = params => {
    return request({
        url: '/poem/del',
        method: 'post',
        data: params
    })
}

//搜索
export const search = params => {
    return request({
        url: '/api/poem/search',
        method: 'get',
        params
    })
}