import request from './config/http'

// 获取分类列表
export const list = params => {
    return request({
        url: '/api/category/list',
        method: 'get',
        params
    })
}