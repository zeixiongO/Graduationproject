<template>
    <div class="member">
        <el-button type="primary" size="small" @click="handleAdd">上传视频</el-button>
        <div class="table-area">
            <el-table :data="data" size="small" class="table" border stripe show-overflow-tooltip>
                <el-table-column prop="id" label="ID" width="50" />
                <el-table-column prop="video" label="视频">
                    <template #default="scope">
                        <div @click="handleEdit(scope.row)">
                            <video :src="videoDomin + scope.row.video"
                                style="width: auto;height:100px; cursor: pointer;" />
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="视频标题" />
                <el-table-column prop="views" label="浏览量" width="100" />

                <el-table-column fixed="right" label="操作">
                    <template #default="scope">
                        <div class="table-btns">
                            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination small v-model="page" :page-size="pageSize" layout="prev, pager, next" :total="total"
                    @update:current-page="handleCurrentPage" />
            </div>
        </div>

        <el-dialog v-model="dialogVisible" :title="dialogTitle">
            <el-upload class="upload-demo" drag v-loading="uploadLoading" :action="apiDomin + 'video/upload'"
                :headers="headers" :limit="1" :accept="['video/*']" :on-success="handleSuccess"
                :before-upload="beforeLogoUpload">
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">
                    拖拽视频到此 <em>点击上传</em>
                </div>
                <template #tip>
                    <div class="el-upload__tip">
                        仅上传视频文件，不大于200M
                    </div>
                </template>
            </el-upload>

            <el-form :model="form" style="margin: 2rem 0;">
                <el-form-item label="视频标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入视频标题" />
                </el-form-item>
            </el-form>


            <div style="text-align: right">
                <el-button type="primary" @click="submit">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog v-model="dialogVisible2" title="视频详情">
            <div class="video">
                <video :src="videoDomin + form.video" controls style="width: 100%;height:auto; cursor: pointer;" />
            </div>

            <el-form :model="form" style="margin: 2rem 0;">
                <el-form-item label="视频标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入视频标题" />
                </el-form-item>
            </el-form>


            <div style="text-align: right">
                <el-button type="primary" @click="submit">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { list, add, edit, del } from '@/api/video'
import { UploadFilled } from '@element-plus/icons-vue'

const dialogVisible = ref(false)
const dialogVisible2 = ref(false)
const dialogTitle = ref('新增')

const videoDomin = import.meta.env.VITE_VIDEO_DOMAIN
const apiDomin = import.meta.env.VITE_API_DOMAIN

const headers = reactive({
    'Authorization': sessionStorage.getItem('token')
})

const uploadLoading = ref(false)

const form = ref({
    id: '',
    video: '',
    title: ''
})


const useList = () => {
    const data = ref([])
    const total = ref(0)
    const page = ref(1)
    const pageSize = ref(5)

    const getList = () => {
        list({ page: page.value, pageSize: pageSize.value }).then(res => {
            if (res.data.code === 200) {
                data.value = res.data.list
                total.value = res.data.total
            }
        })
    }

    getList()

    return {
        page,
        pageSize,
        total,
        data,
        getList
    }
}

const { data, getList, page, pageSize, total } = useList()


const handleEdit = (val) => {
    dialogTitle.value = '编辑'
    form.value = { ...val }
    dialogVisible.value = false
    dialogVisible2.value = true
}

const handleDelete = (id) => {
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        del({ id }).then(res => {
            if (res.data.code == 200) {
                ElMessage.success('删除成功')
                getList()
            } else {
                ElMessage.error(res.data.message)
            }
        })
    }).catch()
}

const handleAdd = () => {
    dialogTitle.value = '新增作者'
    dialogVisible.value = true
}

const resetForm = () => {
    form.value = {
        id: '',
        video: '',
        title: ''
    }
}

//提交
const submit = () => {

    if (!form.value.video || !form.value.title) {
        ElMessage.error('视频和标题必填')
        return
    }

    if (dialogTitle.value == '编辑') {
        edit({ ...form.value }).then(res => {
            if (res.data.code == 200) {
                ElMessage.success('编辑成功')
                getList()
                resetForm()
                dialogVisible.value = false
            } else {
                ElMessage.error(res.data.message)
            }
        })
    } else {
        add({ ...form.value }).then(res => {
            if (res.data.code == 200) {
                ElMessage.success(res.data.message)
                getList()
                resetForm()
                dialogVisible.value = false
            } else {
                ElMessage.error(res.data.message)
            }
        })
    }
}

const handleCurrentPage = (val) => {
    page.value = val
    getList()
}

//上传成功回调
const handleSuccess = (response, uploadFile) => {
    if (response.code == 200) {
        form.value.video = response.file.filename
        ElMessage.success('上传成功')
    } else {
        ElMessage.error(response.message)
    }
    uploadLoading.value = false
}

//上传之前
const beforeLogoUpload = (rawFile) => {
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
.member {
    padding: 1rem;

    .panel {
        display: flex;

        .search {
            margin-right: 1rem;
        }
    }

    .tips {
        margin-top: 3px;
        color: #ff4040;
        font-size: 12px;
    }

    .table-area {
        margin-top: 1rem;
        width: 100%;
        overflow-y: auto;

        .table {
            width: calc(100vw - 14rem);
            height: calc(100vh - 12rem);

            button {
                margin: 3px 5px;
            }
        }

        .pagination {
            display: flex;
            justify-content: center;

            margin-top: 1rem;
        }
    }

    .deposit {
        width: 100%;
        display: flex;

        .el-input {
            width: 50% !important;
        }

        .el-select {
            flex: 1;
            margin-left: 1rem;
        }
    }
}

@media screen and (max-width: 500px) {
    .member {
        .panel {
            width: calc(100vw - 2rem);
        }

        .table-area {
            .table {
                width: calc(100vw - 2rem);
            }
        }

        :deep(.el-dialog) {
            width: 90% !important;
        }
    }
}
</style>