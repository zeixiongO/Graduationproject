import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', {
    state: () => ({
        userinfo: {

        },
        token: '',
    }),
    persist: {
        enabled: true,
        //需要缓存的数据
        strategies: [
            {
                key: "userinfo",
                paths: ["userinfo"],
                storage: localStorage
            },
            {
                key: "tokenStr",
                paths: ["token"],
                storage: sessionStorage
            }
        ],
    },
    getters: {

    },
    actions: {
        logout() {
            this.token = ''
            this.userinfo = {
                id: '',
                account: '',
                nickname: ''
            }
            sessionStorage.clear()
            localStorage.removeItem('token')
        }
    }
})
