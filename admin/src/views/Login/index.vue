<template>
    <div class="login">
        <div class="box">
            <div class="box-header">
                <img src="@/assets/images/logo.png" alt="logo">
                <h3>诗词文化平台 · 后台管理系统</h3>
            </div>
            <div class="form">
                <el-form :model="form">
                    <el-form-item prop="account">
                        <el-input v-model="form.account" placeholder="请输入账号" :prefix-icon="User"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="form.password" placeholder="请输入密码" :prefix-icon="Lock"
                            show-password></el-input>
                    </el-form-item>

                    <div>
                        <el-checkbox v-model="remember" @change="handleRemember">记住密码</el-checkbox>
                    </div>

                    <div class="btn">
                        <el-button type="primary" @click="loginHander">登录</el-button>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref } from 'vue'
import { adminLogin } from '@/api/admin'
import { useRouter } from 'vue-router'
import { Lock, User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/useUserStore'

const router = useRouter()
const userStore = useUserStore()
const remember = ref(false)

//登录表单
const form = ref({
    account: '',
    password: ''
})

//登录
const loginHander = async () => {
    if (!form.value.account || !form.value.password) {
        ElMessage.error('账号或密码不能为空')
        return
    }

    const res = await adminLogin({ userinfo: { ...form.value } })

    if (res.data.code == 200) {
        userStore.token = res.data.token
        userStore.userinfo = res.data.userinfo
        sessionStorage.setItem('token', res.data.token)
        ElMessage.success(res.data.message)
        router.push('/')
    } else {
        ElMessage.error(res.data.message)
    }
}

if (localStorage.getItem('remember')) {
    remember.value = true
    if (localStorage.getItem('form')) {
        form.value = JSON.parse(localStorage.getItem('form'))
    } else {
        remember.value = false
        localStorage.removeItem('remember')
    }
}

//记住密码
const handleRemember = () => {
    if (remember.value && form.value.account && form.value.password) {
        localStorage.setItem('remember', 'true')
        localStorage.setItem('form', JSON.stringify(form.value))
    } else {
        localStorage.removeItem('remember')
        localStorage.removeItem('form')
    }
}

</script>

<style scoped lang='less'>
.login {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #08103c;
    background: url('@/assets/images/bg.jpeg') no-repeat center center;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;

    .box {
        width: 90%;
        max-width: 400px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 2px 3px 8px #00000029;
        padding: 2rem 1rem;
        box-sizing: border-box;

        &-header {
            text-align: center;
            user-select: none;

            img {
                width: 4rem;
            }

            h3 {
                font-weight: 500;
                margin-top: 1rem;
            }
        }

        .form {
            width: 90%;
            margin: 2rem auto;

            .btn {
                margin-top: 2.5rem;
                width: 100%;

                button {
                    width: 100%;
                }
            }
        }
    }
}
</style>