<template>
    <div class="member">
        <div class="table-area">
            <el-table :data="data" size="small" class="table" border stripe show-overflow-tooltip>
                <el-table-column prop="id" label="ID" width="50" />
                <el-table-column prop="title" label="笔记标题" width="200" />
                <el-table-column prop="content" label="内容" width="250" />
                <el-table-column prop="nickname" label="发布者" width="200" />
                <el-table-column prop="create_time" label="创建时间" width="150">
                    <template #default="scope">
                        {{ dayjs(scope.row.create_time).format('YYYY-MM-DD HH:mm') }}
                    </template>
                </el-table-column>
                <el-table-column props="status" label="状态" width="100">
                    <template #default="scope">
                        <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
                        <el-tag v-else type="danger">下架</el-tag>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template #default="scope">
                        <div class="table-btns">
                            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
            <el-form :model="form" label-width="120px" label-position="top">
                <el-form-item label="标题">
                    <el-input v-model="form.title" />
                </el-form-item>
                <el-form-item label="内容">
                    <el-input v-model="form.content" type="textarea" :autosize="{ minRows: 8, maxRows: 15 }" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="1">正常</el-radio>
                        <el-radio :label="2">下架</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div style="text-align: right">
                <el-button type="primary" @click="submit">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { list, del, edit, add } from '@/api/note'
import dayjs from 'dayjs'

const dialogVisible = ref(false)
const dialogTitle = ref('新增')

const form = ref({
    id: '',
    title: '',
    content: '',
    status: 1,
})


const useCategoryList = () => {
    const data = ref([])
    const total = ref(0)
    const page = ref(1)
    const pageSize = ref(15)

    const getList = () => {
        list({
            page: page.value,
            pageSize: pageSize.value
        }).then(res => {
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

const { page, pageSize, total, data, getList } = useCategoryList()


const handleEdit = (val) => {
    dialogTitle.value = '编辑'
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
            if (res.data.code == 200) {
                ElMessage.success('删除成功')
                getList()
            } else {
                ElMessage.error(res.data.message)
            }
        })
    }).catch()
}

//提交
const submit = () => {

    if (dialogTitle.value == '编辑') {
        edit({ ...form.value }).then(res => {
            if (res.data.code == 200) {
                ElMessage.success('编辑成功')
                getList()
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