<template>
    <div class="header">
        <div class="title">
            <div class="btn" @click="handleBack">
                <img src="@/assets/images/menu.png" alt="菜单">
            </div>
            <span> {{ route.meta.title }} </span>
        </div>
        <div class="logout" @click="logout">
            <img width="20px" height="20px" src="@/assets/images/exit.png" alt="">
            <span>退出登录</span>
        </div>
    </div>

</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAsideStore } from '@/stores/useAsideStore'
import { useUserStore } from '@/stores/useUserStore'
import { ElMessageBox } from 'element-plus'

const asideStore = useAsideStore()
const userStore = useUserStore()

const handleBack = () => {
    asideStore.isCollapse = !asideStore.isCollapse
}

const route = useRoute()
const router = useRouter()

//退出登录
const logout = () => {
    ElMessageBox.confirm('确认退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        router.push('/login')
        userStore.logout()
    }).catch()
}

</script>

<style scoped lang='less'>
.header {
    width: 100%;
    height: 3rem;
    box-sizing: border-box;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    user-select: none;

    .title {
        display: flex;
        align-items: center;

        .btn {
            height: 1.5rem;
            cursor: pointer;

            img {
                height: 100%;
            }
        }


        span {
            margin-left: 0.5rem;
            font-size: 1.1rem;
            margin-bottom: 1px;
        }

        :deep(.el-page-header__icon) {
            font-size: 1.5rem;
        }
    }

    .logout {
        cursor: pointer;
        display: flex;
        align-items: center;

        img {
            margin-right: 0.3rem;
        }
    }
}
</style>