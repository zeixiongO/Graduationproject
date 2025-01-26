<template>
    <div class="member">
        <el-button type="primary" size="small" @click="handleAdd">新增用户</el-button>
        <div class="table-area">
            <el-table :data="data" size="small" class="table" border stripe show-overflow-tooltip>
                <el-table-column prop="index" label="序号" width="60">
                    <template #default="scope">
                        {{ (page - 1) * pageSize + scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID" width="50" />
                <el-table-column prop="nickname" label="昵称" width="150" />
                <el-table-column prop="account" label="账号" width="180"></el-table-column>
                <el-table-column prop="email" label="手机" width="150" />
                <el-table-column prop="email" label="邮箱" width="150" />
                <el-table-column prop="gender" label="性别" width="80">
                    <template #default="scope">
                        <span v-if="scope.row.gender === 0">未知</span>
                        <span v-if="scope.row.gender === 1">男</span>
                        <span v-if="scope.row.gender === 2">女</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="80">
                    <template #default="scope">
                        <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
                        <el-tag v-if="scope.row.status === 0" type="danger">禁用</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="create_time" label="注册时间" width="150">
                    <template #default="scope">
                        {{ dayjs(scope.row.create_time).format('YYYY-MM-DD HH:mm') }}
                    </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作">
                    <template #default="scope">
                        <div class="table-btns">
                            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                            <el-button size="small" type="warning" @click="changePsd(scope.row.id)">修改密码</el-button>
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

        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%">
            <el-form :model="form" label-width="60px" label-position="left">
                <el-form-item label="昵称">
                    <el-input v-model="form.nickname" placeholder="请输入昵称" />
                </el-form-item>
                <el-form-item label="账号">
                    <el-input v-model="form.account" placeholder="请输入账号" />
                </el-form-item>
                <el-form-item label="密码" v-if="dialogTitle === '新增'">
                    <el-input v-model="form.password" placeholder="请输入密码" />
                </el-form-item>
                <el-form-item label="手机">
                    <el-input v-model="form.phone" placeholder="请输入手机" />
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="form.gender">
                        <el-radio :label="0">未知</el-radio>
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="form.status">
                        <el-radio :label="1">正常</el-radio>
                        <el-radio :label="0">禁用</el-radio>
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
import { ref, reactive } from 'vue'
import dayjs from 'dayjs';
import { ElMessage, ElMessageBox } from 'element-plus';
import { all, edit, del, changePassword, add } from '@/api/user'

const dialogVisible = ref(false)
const dialogTitle = ref('新增会员')

const form = ref({
    id: '',
    nickname: '',
    account: '',
    password: '',
    email: '',
    gender: 0,
    phone: '',
    status: 1
})
const keyword = ref('')


const useList = () => {
    const data = ref([])
    const page = ref(1)
    const pageSize = ref(10)
    const total = ref(0)

    const getList = () => {
        all({
            page: page.value,
            pageSize: pageSize.value
        }).then(res => {
            if (res.data.code === 200) {
                data.value = res.data.users
                total.value = res.data.total
            }
        })
    }

    getList()

    return {
        data,
        page,
        pageSize,
        total,
        getList
    }
}
const { data, page, pageSize, total, getList } = useList()


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
    dialogTitle.value = '新增'
    dialogVisible.value = true
    form.value = {
        _id: '',
        nickname: '',
        account: '',
        email: '',
        password: '',
        gender: 0,
        status: 1
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
                ElMessage.success('新增成功')
                getList()
                dialogVisible.value = false
            } else {
                ElMessage.error(res.data.message)
            }
        })
    }
}

//修改密码
const changePsd = (id) => {
    ElMessageBox.prompt('请输入新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^.{6,16}$/,
        inputErrorMessage: '密码长度为6-16位'
    }).then(({ value }) => {
        changePassword({ id: id, password: value }).then(res => {
            if (res.data.code == 200) {
                ElMessage.success('修改成功')
                getList()
            } else {
                ElMessage.error(res.data.message)
            }
        })
    }).catch()
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