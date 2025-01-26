<template>
    <div class="aside">

        <div class="user">
            <div class="pic">
                <img v-if="userStore.userinfo.profile" :src="apiDomain + userStore.userinfo.profile" alt="">
            </div>
            <div class="nickname">{{ userStore.userinfo.nickname }}</div>
        </div>
        <ul class="menu">
            <el-menu :default-active="active" router unique-opened="true" active-text-color="#fff"
                background-color="#1c3361" text-color="#c5d8ff">
                <el-menu-item index="/panel">
                    <el-icon>
                        <DataLine />
                    </el-icon>
                    <span>数据统计</span>
                </el-menu-item>
                <el-sub-menu index="/poem">
                    <template #title>
                        <el-icon>
                            <Reading />
                        </el-icon>
                        诗词管理
                    </template>
                    <el-menu-item index="/poem/poem">诗词管理</el-menu-item>
                    <el-menu-item index="/poem/excerpt">摘抄管理</el-menu-item>
                    <el-menu-item index="/poem/author">作者管理</el-menu-item>
                    <el-menu-item index="/poem/dynasty">朝代管理</el-menu-item>
                    <el-menu-item index="/poem/category">分类管理</el-menu-item>
                    <el-menu-item index="/poem/form">形式管理</el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="/community">
                    <template #title>
                        <el-icon>
                            <Connection />
                        </el-icon>
                        社区管理
                    </template>
                    <el-menu-item index="/community/note">笔记管理</el-menu-item>
                    <el-menu-item index="/community/comment">评论管理</el-menu-item>
                    <el-menu-item index="/community/keyword">关键词管理</el-menu-item>
                </el-sub-menu>
                <el-menu-item index="/video">
                    <el-icon>
                        <VideoCamera />
                    </el-icon>
                    <span>视频管理</span>
                </el-menu-item>
                <el-menu-item index="/user">
                    <el-icon>
                        <User />
                    </el-icon>
                    <span>用户管理</span>
                </el-menu-item>
            </el-menu>
        </ul>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { DataLine, Reading, VideoCamera, User, Connection } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore';
import { ElMessageBox } from 'element-plus';

const route = useRoute()
const userStore = useUserStore()

const active = ref('index')

//api域名
const apiDomain = import.meta.env.VITE_IMG_DOMAIN

const setActive = (path) => {
    active.value = path
}
setActive(route.path)

//监听路由变化
watch(() => route.path, (newVal) => {
    setActive(newVal)
})
</script>

<style scoped lang='less'>
.aside {
    max-width: 500px;
    height: 100%;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    overflow: hidden;
    background-color: #1c3361;
    padding: 1rem 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    position: relative;
    flex-shrink: 0;

    .user {
        color: #fff;
        font-size: 0.9rem;
        margin: 0 auto;
        margin-top: 1rem;
        margin-bottom: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        .nickname {
            margin-top: 1rem;
        }

        .pic {
            overflow: hidden;
            border-radius: 50%;
            width: 4rem;
            height: 4rem;
            background-color: #fff;

            img {
                width: 100%;
                height: 100%;
            }
        }
    }

    &>ul {
        height: calc(100% - 100px);
        overflow: auto;
    }

    .logout {
        color: #c5d8ff;
        font-size: 14px;
        position: absolute;
        left: 20px;
        bottom: 2rem;
        display: flex;
        align-items: center;
        cursor: pointer;

        span {
            margin-left: 10px;
        }
    }

    .logout:hover {
        color: #ededed;
        transition: 0.3s;
    }

    :deep(.el-menu) {
        border: none !important;
        border-right: none;
    }
}


/* 美化滚动条 */
::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}

::-webkit-scrollbar-thumb {
    background: #d2d2d2;
    border-radius: 10px;
}
</style>