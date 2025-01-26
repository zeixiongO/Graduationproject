<template>
    <header>
        <div class="center">
            <div class="left">
                <div class="logo" @click="toHome">
                    <img src="@/assets/images/logo.png" alt="logo" />
                    词文化
                </div>

                <nav>
                    <ul>
                        <li v-for="item in menu.list" :key="item.id" :class="{ 'active': menu.active === item.id }">
                            <router-link :to="item.path">{{ item.name }}</router-link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="right">
                <el-input style="width: 200px" v-model="keyword" @keyup.enter="handleSearch" placeholder="请输入关键词">
                    <template #prefix>
                        <el-icon @click="handleSearch">
                            <Search />
                        </el-icon>
                    </template>
                </el-input>

                <div class="login" v-if="!userStore.userinfo.id">
                    <router-link to="/login">登录/注册</router-link>
                </div>
                <el-dropdown v-else trigger="click" @command="handleCommand">
                    <div class="user-info">
                        <span>{{ userStore.userinfo.nickname }}</span>
                    </div>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                            <el-dropdown-item command="logout">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore';

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const menu = reactive({
    active: 0,
    list: [
        {
            id: 0,
            name: '首页',
            path: '/'
        },
        {
            id: 1,
            name: '诗文',
            path: '/poem'
        },
        {
            id: 2,
            name: '社区',
            path: '/note'
        },
        {
            id: 3,
            name: '视频',
            path: '/video'
        }
    ]
})

// 搜索框关键词
const keyword = ref('')

//匹配当前激活菜单
const matchMenu = () => {
    let index = menu.list.findIndex(item => item.path === route.path)

    if (index === -1) {
        menu.active = ''
    } else {
        menu.active = menu.list[index].id
    }
}
matchMenu()

const handleCommand = (command) => {
    if (command === 'logout') {
        userStore.logout()
    }
    if (command === 'personal') {
        router.push('/personal')
    }
}

// 搜索
const handleSearch = () => {
    router.push({ path: '/search', query: { keyword: keyword.value, type: 'title' } })
}

//监听路由变化
watch(() => route.path, () => {
    matchMenu()
})

const toHome = () => {
    router.push('/')
}

</script>

<style scoped lang='less'>
header {
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e5e5e5;

    .center {
        margin: 0 auto;
        width: var(--center-width);
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: '宋体';
        font-size: 1.1rem;
        color: #80849e;

        .left {
            display: flex;
            align-items: center;

            .logo {
                display: flex;
                align-items: center;
                flex-shrink: 0;
                font-size: 1.4rem;
                user-select: none;
                letter-spacing: 3px;
                font-weight: bold;
                color: var(--primary-color);
                cursor: pointer;

                img {
                    height: 38px;
                    margin-right: 2px;
                }
            }

            nav {
                margin-left: 3rem;
                margin-right: 4rem;

                ul {
                    display: flex;
                    align-items: center;
                    justify-content: space-around;
                    list-style: none;
                    margin: 0;
                    padding: 0;

                    li {
                        padding: 0 1rem;
                        font-family: '宋体';
                        letter-spacing: 1px;

                        a {
                            color: #80849e;
                        }
                    }

                    .active {
                        a {
                            font-weight: bold;
                            color: var(--primary-color);
                        }
                    }
                }
            }
        }

        .right {
            display: flex;
            align-items: center;
            justify-content: flex-end;

            .login {
                margin-left: 2rem;

                a {
                    color: #80849e;
                }
            }

            .user-info {
                margin-left: 2rem;
                cursor: pointer;
                font-weight: bold;
                color: var(--primary-color);
                padding: 0 0.5rem;
                box-sizing: border-box;
            }
        }
    }
}
</style>