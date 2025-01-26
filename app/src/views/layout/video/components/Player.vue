<template>
    <div class="palyer">
        <video :src="videoDomin + videoStore.currentVideo.video" controls
            style="width: 100%;height:auto; cursor: pointer;" />
        <div>
            <div class="title">{{ videoStore.currentVideo.title }}</div>
            <div class="like" @click="starVideo" :class="{ 'active': isStar }">
                <el-icon>
                    <Star />
                </el-icon>
            </div>
        </div>
        <div class="info">
            <span>
                <el-icon>
                    <View />
                </el-icon>
                {{ videoStore.currentVideo.views }}
            </span>
            <span>
                <el-icon>
                    <Clock />
                </el-icon>
                {{ dayjs(videoStore.currentVideo.create_time).format('YYYY-MM-DD HH:mm') }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useVideoStore } from '@/stores/useVideoStore'
import { useUserStore } from '@/stores/useUserStore'
import { Star, Clock, View } from '@element-plus/icons-vue'
import { star, isStar as getIsStar } from '@/api/video'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const videoDomin = import.meta.env.VITE_VIDEO_DOMAIN
const videoStore = useVideoStore()
const userStore = useUserStore()

const isStar = ref(false)

const starVideo = () => {
    if (userStore.token) {
        star({
            user_id: userStore.userinfo.id,
            video_id: videoStore.currentVideo.id
        }).then(res => {
            if (res.code === 200) {
                ElMessage.success(res.message)
                isStar.value = !isStar.value
            } else {
                ElMessage.warning(res.message)
            }
        })
    } else {
        ElMessage.error('请先登录')
    }
}


if (userStore.token) {
    getIsStar({
        user_id: userStore.userinfo.id,
        video_id: videoStore.currentVideo.id
    }).then(res => {
        if (res.code === 200) {
            isStar.value = true
        } else {
            isStar.value = false
        }
    })
}


</script>

<style scoped lang='less'>
.palyer {
    padding: 1.5rem 0;
    border-bottom: 1px solid #eee;

    &>div {
        margin-top: 1rem;
        font-size: 1.3rem;
        font-weight: bold;
        display: flex;
        justify-content: space-between;

        .title {
            width: 95%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }

        .like {
            width: 5%;
            text-align: end;
            cursor: pointer;
            color: #999;
        }

        .active {
            color: var(--primary-color);
        }
    }

    .info {
        display: flex;
        // justify-content: flex-start;
        font-size: 0.8rem;
        color: #777;

        span {
            display: flex;
            align-items: center;
            // margin-right: 2rem;

            i {
                margin-right: 5px;
            }
        }
    }
}
</style>