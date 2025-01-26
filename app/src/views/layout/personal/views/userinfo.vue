<template>
    <div class="userinfo">
        <h4 style="margin-bottom: 2rem">用户资料</h4>
        <el-form v-model="form" label-width="50px">
            <el-form-item label="账号">
                <el-input v-model="form.account" disabled></el-input>
            </el-form-item>
            <el-form-item label="昵称">
                <el-input v-model="form.nickname"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="头像">
                <el-upload class="avatar-uploader" :action="apiDomin + 'poem/upload'" :show-file-list="false"
                    :headers="headers" :accept="['image/*']" :on-success="handleSuccess" :before-upload="beforeUpload">
                    <img v-if="form.profile" :src="apiDomin + 'source/images/' + form.profile" class="avatar">
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>
        </el-form>
        <div class="btn">
            <el-button type="primary" @click="submit">提交</el-button>
        </div>

        <el-divider></el-divider>
        <h4 style="margin: 2rem 0">密码修改</h4>
        <el-form v-model="password" label-width="60px">
            <el-form-item label="原密码">
                <el-input v-model="password.oldPassword" type="password" show-password></el-input>
            </el-form-item>
            <el-form-item label="新密码">
                <el-input v-model="password.newPassword" type="password" show-password></el-input>
            </el-form-item>
        </el-form>
        <div class="btn">
            <el-button type="primary" @click="changePsd">修改密码</el-button>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { getUserInfo, changepassword, edit } from '@/api/user'
import { useUserStore } from '@/stores/useUserStore'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const apiDomin = import.meta.env.VITE_API_DOMAIN
const userStore = useUserStore();

const headers = reactive({
    'Authorization': localStorage.getItem('token')
})

const form = ref({
    id: '',
    account: '',
    nickname: '',
    phone: '',
    profile: ''
})

const password = ref({
    id: '',
    oldPassword: '',
    newPassword: ''
})

getUserInfo({ id: userStore.userinfo.id }).then(res => {
    if (res.code == 200) {
        form.value = res.user
    }
})

// 修改密码
const changePsd = () => {

    if (!password.value.oldPassword || !password.value.newPassword) {
        ElMessage.error('请输入密码')
        return
    }

    changepassword({
        id: userStore.userinfo.id,
        oldPassword: password.value.oldPassword,
        newPassword: password.value.newPassword
    }).then(res => {
        if (res.code == 200) {
            ElMessage.success(res.message)
            password.value = {
                oldPassword: '',
                newPassword: ''
            }
        } else {
            ElMessage.error(res.message)
        }
    })
}

// 提交信息
const submit = () => {

    if (form.nickname === '') {
        ElMessage.error('请输入昵称')
        return
    }

    edit({ ...form.value }).then(res => {
        if (res.code == 200) {
            ElMessage.success(res.message)
        } else {
            ElMessage.error(res.message)
        }
    })
}

const uploadLoading = ref(false)
//上传成功回调
const handleSuccess = (response, uploadFile) => {
    if (response.code == 200) {
        form.value.profile = response.file.filename
        ElMessage.success('上传成功')
    } else {
        ElMessage.error(response.message)
    }
    uploadLoading.value = false
}

//上传之前
const beforeUpload = (rawFile) => {
    uploadLoading.value = true
    if (rawFile.size / 1024 / 1024 > 200) {
        ElMessage.error('视频大小不能超过200M')
        uploadLoading.value = false
        return false
    }
    return true
}


</script>

<style scoped lang='less'>
.userinfo {

    .avatar-uploader {
        width: 150px;
        height: 150px;
        border: 1px dashed #d9d9d9;
        font-size: 2rem;
        color: #ccc;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .btn {
        text-align: end;
    }
}
</style>