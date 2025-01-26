import request from './config/http'

// 请求模板
export const adminLogin = params => {
    return request({
        url: '/api/adminLogin',
        method: 'post',
        data: params
    })
}
