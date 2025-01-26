import request from './config/http'

// 获取所有用户
export const all = params => {
    return request({
        url: '/user/all',
        method: 'get',
        params
    })
}

export const add = params => {
    return request({
        url: '/user/add',
        method: 'post',
        data: params
    })
}

export const edit = params => {
    return request({
        url: '/user/edit',
        method: 'post',
        data: params
    })
}

export const del = params => {
    return request({
        url: '/user/del',
        method: 'post',
        data: params
    })
}

export const changePassword = params => {
    return request({
        url: '/user/modifyPsd',
        method: 'post',
        data: params
    })
}
