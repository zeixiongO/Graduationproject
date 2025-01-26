<template>
    <div class="login">

        <div class="back" @click="back">
            <el-icon size="30">
                <Back></Back>
            </el-icon>
        </div>

        <div class="left">
            <div class="poem">
                <div class="line">凉风起天末，君子意如何</div>
                <div class="author">——杜甫《天末怀李白》</div>
            </div>
        </div>

        <div class="right">
            <div class="box">
                <div class="box-header">
                    <img src="@/assets/images/logo.png" alt="logo">
                    <h3>诗词文化平台</h3>
                </div>
                <el-tabs v-model="activeName">
                    <el-tab-pane label="登录" name="login">
                        <el-form>
                            <el-form-item>
                                <el-input v-model="form.account" placeholder="请输入账号">
                                    <template #prepend>
                                        <el-icon size="14">
                                            <User />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-input v-model="form.password" type="password" show-password placeholder="请输入密码">
                                    <template #prepend>
                                        <el-icon size="14">
                                            <Lock />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </el-form-item>
                            <div class="btns">
                                <div class="tips" @click="activeName = 'register'">没有账号?去注册</div>
                                <el-button type="primary" @click="handleLogin">登录</el-button>
                            </div>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="注册" name="register">
                        <el-form-item>
                            <el-input v-model="form.account" placeholder="请输入账号">
                                <template #prepend>
                                    <el-icon size="14">
                                        <User />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="form.password" type="password" show-password placeholder="请输入密码">
                                <template #prepend>
                                    <el-icon size="14">
                                        <Lock />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="form.nickname" placeholder="请输入昵称">
                                <template #prepend>
                                    <el-icon size="14">
                                        <Postcard />
                                    </el-icon>
                                </template>
                            </el-input>
                        </el-form-item>
                        <div class="btns">
                            <el-button type="primary" @click="handleRegister">注册</el-button>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { User, Lock, Postcard, Back } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/useUserStore';
import { login, register } from '@/api/user';
import { ElMessage } from 'element-plus';

const router = useRouter();
const userStore = useUserStore()
// 当前激活tab名称
const activeName = ref('login')

//用户登录表单信息
const form = ref({
    account: '',
    password: '',
    nickname: ''
})

//登录处理逻辑
const handleLogin = async () => {

    if (!form.value.account || !form.value.password) {
        ElMessage.error('账号或密码不能为空')
        return
    }

    const res = await login({ userinfo: { ...form.value } })
    if (res.code === 200) {
        localStorage.setItem('token', res.token) //存储token
        userStore.userinfo = res.userinfo
        userStore.token = res.token
        ElMessage.success(res.message)
        router.back()
    } else {
        ElMessage.error(res.message)
    }
}

//注册处理逻辑
const handleRegister = async () => {
    if (!form.value.account || !form.value.password || !form.value.nickname) {
        ElMessage.error('账号、密码、昵称不能为空')
        return
    }

    const res = await register({ userinfo: { ...form.value } })
    if (res.code === 200) {
        ElMessage.success(res.message)
        //切换登录表单
        activeName.value = 'login'
        //密码置空，让用户重新输入
        form.value.password = ''
    } else {
        ElMessage.error(res.message)
    }
}

const back = () => {
    router.back()
}

</script>

<style scoped lang='less'>
.login {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: url('@/assets/images/login_bg.jpeg') no-repeat;
    background-size: cover;
    display: flex;

    .back {
        position: absolute;
        top: 1rem;
        left: 1rem;
        cursor: pointer;
        z-index: 999;
    }

    .left {
        width: 50%;
        position: relative;
        letter-spacing: 2px;

        .poem {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'song';
            font-size: 2rem;

            .author {
                width: 100%;
                margin-top: 2rem;
                margin-left: 5rem;
                font-size: 1rem;
                text-align: end;
            }
        }
    }

    .right {
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;

        .box {
            width: 350px;
            height: 400px;
            padding: 2rem;
            background-color: #fff;
            border-radius: 5px;
            box-shadow: 2px 3px 5px 0px #d4d4d4;

            &-header {
                text-align: center;
                user-select: none;
                margin-bottom: 2rem;

                img {
                    width: 3rem;
                }

                h3 {
                    font-weight: 500;
                    margin-top: 1rem;
                }
            }

            .btns {
                width: 100%;
                margin-top: 2rem;

                .tips {
                    margin-bottom: 1rem;
                    font-size: 0.9rem;
                    cursor: pointer;
                }

                button {
                    width: 100%;
                }
            }
        }
    }

    :deep(.el-form-item) {
        margin-bottom: 1rem;
        margin-top: 1rem;
    }
}
</style>