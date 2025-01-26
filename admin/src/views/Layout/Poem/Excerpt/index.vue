<template>
    <div class="member">
        <el-button type="primary" size="small" @click="handleAdd">新增摘抄</el-button>
        <div class="table-area">
            <el-table :data="data" size="small" class="table" border stripe show-overflow-tooltip>
                <el-table-column prop="id" label="ID" width="50" />
                <el-table-column prop="title" label="标题" width="200" />
                <el-table-column prop="excerpt" label="摘抄句子" />


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
            <el-form :model="form" label-width="120px" label-position="top">
                <el-form-item label="诗词" v-if="dialogTitle !== '编辑'">
                    <el-select v-model="form.poem_id" placeholder="请选择" :remote-method="handlePoemSearch" filterable
                        remote reserve-keyword @change="handlePoemChange()">
                        <el-option v-for="item in poemList" :key="item.id" :label="item.title" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="原文" v-if="dialogTitle !== '编辑'">
                    <el-input type="textarea" v-model="form.content" :autosize="{ minRows: 5, maxRows: 15 }" />
                </el-form-item>
                <el-form-item label="摘抄">
                    <el-input v-model="form.excerpt" @change="handleExcerptChange" />
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
import { list, add, edit, del } from '@/api/excerpt'
import { search } from '@/api/poem'

const dialogVisible = ref(false)
const dialogTitle = ref('新增')

const form = ref({
    id: '',
    poem_id: '',
    content: '',
    excerpt: ''
})

const useList = () => {
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

const { page, pageSize, total, data, getList } = useList()


// 编辑
const handleEdit = (val) => {
    dialogTitle.value = '编辑'
    form.value = { ...val }
    dialogVisible.value = true
}

// 删除
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

// 新增
const handleAdd = () => {
    dialogTitle.value = '新增朝代'
    dialogVisible.value = true
    form.value = {
        id: '',
        poem_id: '',
        excerpt: ''
    }
}

const poemList = ref([])

// 远程搜索
const handlePoemSearch = (query) => {
    search({
        page: 1,
        pageSize: 10,
        keyword: query,
        type: 'title'
    }).then(res => {
        if (res.data.code === 200) {
            poemList.value = res.data.list
        }
    })
}

// 显示原文
const handlePoemChange = () => {
    form.value.content = poemList.value.find(item => item.id == form.value.poem_id).content
}

const handleExcerptChange = () => {
    // 去除句末句号
    form.value.excerpt = form.value.excerpt.replace(/。/g, '')
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