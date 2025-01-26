import { defineStore } from 'pinia'

export const useVideoStore = defineStore('video', {
    state: () => ({
        currentVideo: {},
        page: 1,
        pageSize: 8,
        total: 0,
        list: []
    }),
    actions: {
        setCurrent(video) {
            this.currentVideo = video
        },
        setList(list) {
            this.list = list
        }
    }
})
