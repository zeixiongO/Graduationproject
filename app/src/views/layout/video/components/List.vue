<template>
    <ul class="list">
        <li v-for="item in videoStore.list" :key="item.id" @click="changeCurrent(item)">
            <div class="video">
                <video :src="videoDomin + item.video" style="width: 100%;height:auto; cursor: pointer;" />
            </div>
            <h5>{{ item.title }}</h5>
        </li>
    </ul>
    <div class="pagination">
        <el-pagination small v-model="videoStore.page" :page-size="videoStore.pageSize" layout="prev, pager, next"
            :total="videoStore.total" @update:current-page="handleVideoCurrentPage" />
    </div>
</template>

<script setup>
import { useVideoStore } from '@/stores/useVideoStore'
import { list, views } from '@/api/video'
import { useRoute } from 'vue-router'

const videoDomin = import.meta.env.VITE_VIDEO_DOMAIN
const route = useRoute()

const videoStore = useVideoStore()
const getList = () => {
    list({
        page: videoStore.page,
        pageSize: videoStore.pageSize,
    }).then(res => {
        videoStore.list = res.list
        videoStore.total = res.total

        if (route.query.id) {
            videoStore.currentVideo = videoStore.list.find(item => item.id == route.query.id)
        } else {
            videoStore.currentVideo = res.list[0]
        }
    })
}
getList()


// 切换当前视频
const changeCurrent = item => {
    videoStore.currentVideo = item

    views({
        id: item.id
    }).then(res => { })

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 分页
const handleVideoCurrentPage = (val) => {
    videoStore.page = val
    getList()
}

</script>

<style scoped lang='less'>
.list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-flow: row;
    gap: 1rem;

    margin-top: 2rem;

    li {
        width: 200px;

        margin-bottom: 1.5rem;

        h5 {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            margin-top: 0.5rem;
        }
    }
}

.pagination {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
}
</style>