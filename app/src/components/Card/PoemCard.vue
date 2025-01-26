<template>
    <div class="card">
        <div class="title">
            <h4 @click="toDetail">{{ props.poem.title }}</h4>
            <div class="star">
                <span @click="starPoem" :class="{ 'active': isStar }">
                    <el-icon size="18">
                        <Star />
                    </el-icon>
                </span>
                <span @click="copyPoem">
                    <el-icon size="16">
                        <CopyDocument />
                    </el-icon>
                </span>
            </div>
        </div>
        <div class="info">
            <span @click="toAuthor">
                [{{ props.poem.dynasty }}]
                <b style="cursor: pointer;">{{ props.poem.name }}</b>
            </span>

            <span @click="toSearch('form', props.poem.form)">
                形式：
                <b style="cursor: pointer;">{{ props.poem.form }}</b>
            </span>
        </div>
        <div class="content">
            {{ props.poem.content }}
        </div>
        <div class="category">
            类型：
            <span @click="toSearch('category', props.poem.category1)">{{ props.poem.category1 }}</span>
            <span @click="toSearch('category', props.poem.category2)">{{ props.poem.category2 }}</span>
            <span @click="toSearch('category', props.poem.category3)">{{ props.poem.category3 }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import { Star, CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { star } from '@/api/poem'

const router = useRouter()
const userStore = useUserStore()
const props = defineProps(['poem'])

const toDetail = () => {
    router.push('/poemDetail/' + props.poem.id)
}

const isStar = ref(false)

// 收藏
const starPoem = () => {
    star({
        poem_id: props.poem.id,
        user_id: userStore.userinfo.id
    }).then(res => {
        if (res.code === 200) {
            isStar.value = true
            ElMessage.success(res.message)
        } else {
            isStar.value = false
            ElMessage.warning(res.message)
        }
    })
}

// 复制
const copyPoem = async () => {
    // 复制到剪切板
    await navigator.clipboard.writeText(props.poem.content)

    ElMessage({
        message: '复制成功',
        type: 'success'
    })
}

// 跳转到作者页面
const toAuthor = () => {
    if (props.poem.author_id) {
        router.push(`/author/${props.poem.author_id}`)
    }
}

// 跳转到搜索页
const toSearch = (type, keyword) => {
    router.push({ path: '/search', query: { keyword, type } })
}

</script>

<style scoped lang='less'>
.card {
    width: 100%;
    padding: 1.5rem;
    border: 1px solid var(--primary-color);
    box-sizing: border-box;
    margin-bottom: 2rem;
    background: linear-gradient(to left, var(--borderColor), var(--borderColor)) left top no-repeat,
        linear-gradient(to bottom, var(--borderColor), var(--borderColor)) left top no-repeat,
        linear-gradient(to left, var(--borderColor), var(--borderColor)) right top no-repeat,
        linear-gradient(to bottom, var(--borderColor), var(--borderColor)) right top no-repeat,
        linear-gradient(to left, var(--borderColor), var(--borderColor)) left bottom no-repeat,
        linear-gradient(to bottom, var(--borderColor), var(--borderColor)) left bottom no-repeat,
        linear-gradient(to left, var(--borderColor), var(--borderColor)) right bottom no-repeat,
        linear-gradient(to left, var(--borderColor), var(--borderColor)) right bottom no-repeat;
    background-size: 2px 20px, 20px 2px, 2px 20px, 20px 2px;


    .title {
        font-size: 1.3rem;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        justify-content: space-between;

        .star {
            color: #999;

            span {
                cursor: pointer;
                margin-right: 1rem;
            }
        }
    }

    h4:hover {
        text-decoration: underline;
    }

    .info {
        font-size: 1rem;
        margin-top: 1rem;
        font-size: 0.9rem;
        color: #666;

        span {
            margin-right: 2rem;
            color: var(--primary-color);
        }
    }

    .content {
        margin-top: 1rem;
        line-height: 1.8rem;
        white-space: pre-wrap;
        font-size: 1.1rem;
        letter-spacing: 1px;
        color: #000;
    }

    .category {
        margin-top: 1rem;
        color: #777;
        font-size: 0.9rem;

        span {
            color: var(--primary-color);
            margin-right: 1rem;
            font-weight: bold;
            cursor: pointer;
        }
    }

    .active {
        color: var(--primary-color);
    }
}
</style>