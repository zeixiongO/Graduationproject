import { defineStore } from 'pinia'

export const useAsideStore = defineStore('aside', {
    state: () => ({
        isDrawer: false, //是否使用抽屉形式
        isCollapse: false, //是否展开
    }),
    getters: {

    },
    actions: {

    }
})