<template>
    <div class="mynote">
        <h4 style="margin-bottom: 2rem">我的笔记</h4>
        <div class="table-area">
            <el-table :data="note.list" class="table">
                <el-table-column type="index" label="序号" width="70" />
                <el-table-column prop="title" label="标题">
                    <template #default="scope">
                        <el-link type="primary" :underline="false" @click="handleDetail(scope.row.id)">{{
                scope.row.title }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="发布时间" width="150">
                    <template #default="scope">
                        {{ dayjs(scope.row.create_time).format('YYYY-MM-DD HH:mm') }}
                    </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="200">
                    <template #default="scope">
                        <div class="table-btns">
                            <el-button size="small" text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-button type="danger" text size="small"
                                @click="handleDelete(scope.row.id)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination small v-model="note.page" :page-size="note.pageSize" layout="prev, pager, next"
                    :total="note.total" @update:current-page="handleCurrentPage" />
            </div>
        </div>

        <el-dialog v-model="dialogVisible" title="编辑" width="60%" :append-to-body="true" :lock-scroll="true">
            <el-form :model="form" label-width="120px" label-position="top">
                <el-form-item label="标题">
                    <el-input v-model="form.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item label="笔记">
                    <el-input type="textarea" v-model="form.content" :autosize="{ minRows: 10, maxRows: 20 }"
                        placeholder="请输入笔记内容" />
                </el-form-item>
                <el-form-item label="封面（可选）">
                    <el-upload class="avatar-uploader" :action="apiDomin + 'poem/upload'" :show-file-list="false"
                        :headers="headers" :accept="['image/*']" :on-success="handleSuccess"
                        :before-upload="beforeUpload">
                        <img v-if="form.cover" :src="apiDomin + 'source/images/' + form.cover" class="avatar">
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submit">
                        保存
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { listByUser, edit, del } from '@/api/note'
import { useUserStore } from '@/stores/useUserStore';
import dayjs from 'dayjs'
import { useRouter } from 'vue-router';
import { Plus } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus';

const router = useRouter()
const userStore = useUserStore();

const apiDomin = import.meta.env.VITE_API_DOMAIN
const headers = reactive({
    'Authorization': localStorage.getItem('token')
})

const note = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    list: []
})

const form = ref({
    id: '',
    title: '',
    content: '',
    cover: ''
})

const getList = () => {
    listByUser({
        user_id: userStore.userinfo.id,
        page: note.page,
        pageSize: note.pageSize
    }).then(res => {
        note.list = res.list
        note.total = res.total
    })
}
getList()

const handleDetail = (id) => {
    router.push('/noteDetail/' + id)
}


const dialogVisible = ref(false)

const handleEdit = (val) => {
    form.value = { ...val }
    dialogVisible.value = true
}

const handleDelete = (id) => {
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        del({ id }).then(res => {
            if (res.code == 200) {
                ElMessage.success('删除成功')
                getList()
            } else {
                ElMessage.error(res.message)
            }
        })
    }).catch()
}

const submit = () => {

    edit({
        id: form.value.id,
        title: form.value.title,
        content: form.value.content,
        cover: form.value.cover
    }).then(res => {
        if (res.code == 200) {
            ElMessage.success('操作成功')
            dialogVisible.value = false
            note.page = 1
            getList()
            form.value = {
                title: '',
                content: '',
                cover: ''
            }
        } else {
            ElMessage.error(res.message)
        }
    })

}

const handleCurrentPage = (val) => {
    page.value = val
    getList()
}

const uploadLoading = ref(false)
//上传成功回调
const handleSuccess = (response, uploadFile) => {
    if (response.code == 200) {
        form.value.cover = response.file.filename
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
.pagination {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
}

.avatar-uploader {
    width: 200px;
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
</style>