import request from './config/http'

//登录
export const login = params => {
    return request({
        url: '/api/login',
        method: 'post',
        data: params
    })
}

//注册
export const register = params => {
    return request({
        url: '/api/register',
        method: 'post',
        data: params
    })
}

// 获取用户信息
export const getUserInfo = params => {
    return request({
        url: '/user/userinfo',
        method: 'get',
        params
    })
}

// 修改用户信息
export const edit = params => {
    return request({
        url: '/user/edit',
        method: 'post',
        data: params
    })
}

// 修改密码
export const changepassword = params => {
    return request({
        url: '/user/changepassword',
        method: 'post',
        data: params
    })
}