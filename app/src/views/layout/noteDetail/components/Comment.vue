<template>
    <div id="comment">
        <h3>评论</h3>
        <div class="input">
            <el-input v-model="content" type="textarea" placeholder="请输入评论内容" :autosize="{ minRows: 4, maxRows: 10 }"
                maxlength="300" show-word-limit></el-input>
            <div class="btn">
                <el-button type="primary" @click="addComment" size="small">发布</el-button>
            </div>
        </div>
        <ul>
            <li v-for="item in comments" :key="item.id">
                <div class="avatar">
                    <img :src="imgDomin + item.profile" alt="">
                </div>
                <div class="content">
                    <div class="info">
                        <span class="nickname">{{ item.nickname }}</span>
                        <span> {{ dayjs(item.create_time).format('YYYY-MM-DD HH:mm') }}</span>
                    </div>
                    <div class="text">
                        <p>{{ item.content }}</p>
                        <a v-if="item.user_id === userStore.userinfo.id" @click="handleDel(item.id)">删除</a>
                    </div>

                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { comment, commentAdd, commentDel } from '@/api/note';
import { useUserStore } from '@/stores/useUserStore';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs'

const userStore = useUserStore()
const props = defineProps(['id'])
const imgDomin = import.meta.env.VITE_API_DOMAIN + 'source/images/'

const content = ref('')
const comments = ref([])

const initData = async () => {
    comment({ id: props.id }).then(res => {
        if (res.code === 200) {
            comments.value = res.list
        }
    })
}
initData()

// 评论
const addComment = async () => {

    if (!userStore.userinfo.id) {
        ElMessage.warning('请先登录')
        return
    }

    if (content.value === '') {
        ElMessage.warning('内容不能为空')
        return
    }

    commentAdd({
        note_id: props.id,
        content: content.value,
        user_id: userStore.userinfo.id
    }).then(res => {
        if (res.code === 200) {
            ElMessage.success(res.message)
            content.value = ''
            initData()
        } else {
            ElMessage.error(res.message)
        }
    })
}

// 删除评论
const handleDel = (id) => {
    commentDel({
        id
    }).then(res => {
        if (res.code === 200) {
            ElMessage.success(res.message)
            initData()
        } else {
            ElMessage.error(res.message)
        }
    })
}

</script>

<style scoped lang='less'>
#comment {
    padding: 1rem;
    margin-top: 1.5rem;
    border: 1px solid #efefef;
    box-shadow: 1px 1px 1px 1px rgba(189, 189, 189, 0.1);

    .input {
        margin-top: 1rem;

        .btn {
            text-align: end;
            margin-top: 0.5rem;
        }
    }

    ul {
        margin-top: 1.5rem;
        font-family: '微软雅黑';

        li {
            display: flex;
            margin-top: 1.5rem;

            .avatar {
                img {
                    width: 2rem;
                    height: 2rem;
                    border-radius: 50%;
                    flex-shrink: 0;
                }
            }

            .content {
                flex: 1;
                margin-left: 0.5rem;

                .info {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;

                    span {
                        font-size: 0.8rem;
                        color: #777;
                    }

                    .nickname {
                        font-family: 'song';
                        font-weight: bold;
                        color: var(--primary-color);
                        font-size: 1rem;
                    }
                }

                .text {
                    display: flex;
                    justify-content: space-between;

                    p {
                        margin-top: 0.5rem;
                        line-height: 1.6rem;
                        color: #333;
                    }

                    a {
                        cursor: pointer;
                        font-size: 0.8rem;
                        flex-shrink: 0;
                    }
                }


            }
        }
    }
}
</style>