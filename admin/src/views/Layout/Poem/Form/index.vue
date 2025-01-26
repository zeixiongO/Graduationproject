<template>
    <div class="member">
        <el-button type="primary" size="small" @click="handleAdd">新增形式</el-button>
        <div class="table-area">
            <el-table :data="data" size="small" class="table" border stripe show-overflow-tooltip>
                <el-table-column prop="id" label="ID" width="100" />
                <el-table-column prop="form" label="形式" width="300" />


                <el-table-column fixed="right" label="操作">
                    <template #default="scope">
                        <div class="table-btns">
                            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-button type="danger" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog v-model="dialogVisible" :title="dialogTitle">
            <el-form :model="form" label-width="120px" label-position="top">
                <el-form-item label="形式">
                    <el-input v-model="form.form" />
                </el-form-item>
            </el-form>
            <div style="text-align: right">
                <el-button type="primary" @click="submit">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { list, add, edit, del } from '@/api/form'

const dialogVisible = ref(false)
const dialogTitle = ref('新增')

const form = ref({
    id: '',
    form: ''
})


const useCategoryList = () => {
    const data = ref([])
    const total = ref(0)

    const getList = () => {
        list({}).then(res => {
            if (res.data.code === 200) {
                data.value = res.data.list
                total.value = res.data.total
            }
        })
    }

    getList()

    return {
        data,
        getList
    }
}

const { data, getList } = useCategoryList()


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

const handleAdd = () => {
    dialogTitle.value = '新增形式'
    dialogVisible.value = true
    form.value = {
        id: '',
        form: ''
    }
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
    } else {
        add({ ...form.value }).then(res => {
            if (res.data.code == 200) {
                ElMessage.success(res.data.message)
                getList()
                dialogVisible.value = false
            } else {
                ElMessage.error(res.data.message)
            }
        })
    }
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