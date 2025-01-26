<template>
    <div class="noteCard">
        <div class="user">
            <div class="profile">
                <img :src="imgDomin + props.note.profile" alt="" />
                <div class="info">
                    <div class="name">{{ props.note.nickname }}</div>
                    <div class="tag">发布了笔记</div>
                </div>
            </div>
            <div>
                <div class="time">
                    {{ dayjs(props.note.create_time).format('YYYY-MM-DD') }}
                </div>
            </div>
        </div>
        <div class="cover" v-if="props.note.cover" @click="toDetail">
            <img :src="imgDomin + props.note.cover" alt="" />
        </div>
        <div class="text" @click="toDetail">
            <h3 class="title">
                {{ props.note.title }}
            </h3>
            <div class="content">
                {{ props.isCut ? props.note.content.slice(0, 100) + '...' : props.note.content }}
            </div>
        </div>
        <div class="panel">
            <div class="like" @click="handleLike" :class="{ 'active': isLiked }">
                <Like />
            </div>
            <a class="comment" :href="'/noteDetail/' + props.note.id + '#comment'" @click="toDetailComment">
                <Comment />
            </a>
            <div class="share" @click="share">
                <Share />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Like from '../Icon/Like.vue'
import Share from '../Icon/Share.vue';
import Comment from '../Icon/Comment.vue';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'vue-router';
import { like } from '@/api/note'

const website = import.meta.env.VITE_WEBSITE
const imgDomin = import.meta.env.VITE_API_DOMAIN + 'source/images/'

const userStore = useUserStore()
const router = useRouter()
const props = defineProps(['note', 'isCut'])


// 分享
const share = async () => {
    let str = `分享${props.note.nickname}的笔记《${props.note.title}》给你，快去看看吧！链接：${website + 'noteDetail/' + props.note.id}【诗词文化网】`
    // 复制到剪切板
    await navigator.clipboard.writeText(str)
    ElMessage.success('已复制到剪切板')
}

const isLiked = ref(false)

// 点赞
const handleLike = async () => {
    if (!userStore.userinfo.id) {
        ElMessage.warning('请先登录')
        return
    }

    like({
        user_id: userStore.userinfo.id,
        note_id: props.note.id
    }).then(res => {
        if (res.code === 200) {
            ElMessage.success(res.message)
            isLiked.value = true
        } else {
            ElMessage.warning(res.message)
            isLiked.value = false
        }
    })
}

// 跳转到详情页
const toDetail = () => {
    router.push('/noteDetail/' + props.note.id)
}

const toDetailComment = () => {
    router.push('/noteDetail/' + props.note.id + '#comment')
}
</script>

<style scoped lang='less'>
.noteCard {
    width: 100%;
    height: fit-content;
    box-sizing: border-box;
    padding: 1rem;
    border: 1px solid #efefef;
    box-shadow: 1px 1px 1px 1px rgba(189, 189, 189, 0.1);

    .user {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;

        .profile {
            display: flex;
            align-items: center;

            img {
                width: 2.5rem;
                height: 2.5rem;
                object-fit: cover;
                border-radius: 50%;
            }

            .info {
                margin-left: 12px;
                display: flex;
                flex-direction: column;
                justify-content: center;

                .name {
                    font-family: 'song';
                    font-size: 1rem;
                    font-weight: bold;
                    color: #444;
                }

                .tag {
                    font-size: 10px;
                    font-family: '微软雅黑';
                    color: #888;
                    background-color: #f3f3f3;
                    padding: 2px 5px;
                    border-radius: 2px;
                    margin-top: 8px;
                }
            }
        }

        .time {
            font-family: '微软雅黑';
            font-size: 12px;
            color: #888;
        }
    }

    .cover {
        cursor: pointer;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .text {
        border-left: 3px solid var(--primary-color);
        padding: 5px 10px;
        background-color: #f8f8f8;
        cursor: pointer;

        h3 {
            font-size: 0.9rem;
            font-family: 'song';
            display: inline-block;
            padding: 2px 8px;
            background-color: var(--primary-color);
            color: #fff;
            border-radius: 5px;
        }

        .content {
            white-space: pre-wrap;
            font-family: 'song';
            margin-top: 0.5rem;
            color: #444;
            font-size: 0.8rem;
            line-height: 1.5rem;
        }
    }

    .panel {
        display: flex;
        justify-content: space-between;
        margin-top: 1.5rem;

        div {
            padding: 0 1rem;
            color: #999;
            cursor: pointer;
        }

        .like {
            font-size: 1.1rem;
        }

        .comment {
            font-size: 1.1rem;
        }

        .share {
            font-size: 1rem;
        }

        .active {
            color: var(--primary-color);
        }
    }
}
</style>