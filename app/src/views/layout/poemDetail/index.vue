<template>
    <div class="detail">
        <div class="card border">
            <header class="title">
                <h4>{{ poem.title }}</h4>
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
            </header>
            <div class="info">
                <span>[{{ poem.dynasty }}] <b style="cursor: pointer;" @click="toAuthor()">{{ poem.name }}</b></span>
                形式：<span><b style="cursor: pointer;">{{ poem.form }}</b></span>
            </div>
            <div class="content">
                {{ poem.content }}
            </div>
            <div class="category">
                类型：
                <span>{{ poem.category1 }}</span>
                <span>{{ poem.category2 }}</span>
                <span>{{ poem.category3 }}</span>
            </div>
        </div>

        <div class="card border" v-if="poem.translation">
            <header>译文</header>
            <div class="content">
                {{ poem.translation }}
            </div>
        </div>

        <div class="card border" v-if="poem.analyze">
            <header>赏析</header>
            <div class="content">
                {{ poem.analyze }}
            </div>
        </div>

        <el-backtop :bottom="100" :right="80">
            <el-icon>
                <Top />
            </el-icon>
        </el-backtop>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import { detail, views } from '@/api/poem'
import { Star, CopyDocument } from '@element-plus/icons-vue'
import { star, isStared, learn } from '@/api/poem'
import { ElMessage } from 'element-plus'
import { Top } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const poem = ref({})
const isStar = ref(false)

// 初始化数据
const initData = async () => {
    await detail({ id: route.params.id }).then(res => {
        if (res.code === 200) {
            poem.value = { ...res.data }
        }
    })

    if (userStore.token) {
        await isStared({
            poem_id: poem.value.id,
            user_id: userStore.userinfo.id
        }).then(res => {
            if (res.code === 200) {
                isStar.value = true
            }
        })
    }

    views({ id: route.params.id })
}

initData()

// 收藏诗词
const starPoem = () => {
    star({
        poem_id: poem.value.id,
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
    if (poem.value.author_id) {
        router.push(`/author/${poem.value.author_id}`)
    }
}

onMounted(() => {
    if (userStore.userinfo.id) {
        setTimeout(() => {
            learn({ poem_id: route.params.id, user_id: userStore.userinfo.id }).then(res => {
                if (res.code === 200) {
                    ElMessage.success(res.message)
                }
            })
        }, 10000)
    }
})
</script>

<style scoped lang='less'>
.detail {
    width: var(--center-width);
    margin: 2rem auto;

    .card {
        padding: 1.5rem;
        margin-top: 2rem;
        border: 1px solid var(--primary-color);
        box-sizing: border-box;
        background: linear-gradient(to left, var(--borderColor), var(--borderColor)) left top no-repeat,
            linear-gradient(to bottom, var(--borderColor), var(--borderColor)) left top no-repeat,
            linear-gradient(to left, var(--borderColor), var(--borderColor)) right top no-repeat,
            linear-gradient(to bottom, var(--borderColor), var(--borderColor)) right top no-repeat,
            linear-gradient(to left, var(--borderColor), var(--borderColor)) left bottom no-repeat,
            linear-gradient(to bottom, var(--borderColor), var(--borderColor)) left bottom no-repeat,
            linear-gradient(to left, var(--borderColor), var(--borderColor)) right bottom no-repeat,
            linear-gradient(to left, var(--borderColor), var(--borderColor)) right bottom no-repeat;
        background-size: 2px 20px, 20px 2px, 2px 20px, 20px 2px;

        header {
            font-size: 1.2rem;
            font-weight: bold;
            user-select: none;
        }

        .title {
            font-size: 1.4rem;
            user-select: text;
            display: flex;
            justify-content: space-between;

            .star {
                color: #999;

                span {
                    cursor: pointer;
                    margin-right: 1rem;
                }

                .active {
                    color: var(--primary-color);
                }
            }
        }

        .info {
            margin-top: 1.5rem;
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
    }
}
</style>