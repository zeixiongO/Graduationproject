<template>
    <div class="main-box">
        <div class="panel">
            <div style="width: 400px; margin-right: 1rem">
                <el-input v-model="keyword" @keyup.enter="searchPoem" placeholder="请输入关键词" class="input-with-select">
                    <template #prepend>
                        <el-select v-model="type" style="width: 80px" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </template>
                    <template #append>
                        <el-button @click="searchPoem" style="width: 70px" :icon="Search" />
                    </template>
                </el-input>
            </div>


            <el-button type="primary" @click="handleAdd">新增诗词</el-button>
        </div>

        <div class="table-area">
            <el-table :data="data" size="small" class="table" border stripe show-overflow-tooltip>
                <el-table-column prop="id" label="ID" width="50" />
                <el-table-column prop="title" label="标题" width="200" />
                <el-table-column prop="name" label="作者" width="120" />
                <el-table-column prop="content" label="原文" width="200" />
                <el-table-column prop="dynasty" label="朝代" width="100" />
                <el-table-column prop="form" label="形式" width="100" />
                <el-table-column label="分类" width="200">
                    <template #default="scope">
                        <el-tag type="warning" size="small" v-if="scope.row.category1">{{ scope.row.category1
                            }}</el-tag>
                        <el-tag type="warning" size="small" v-if="scope.row.category2">{{ scope.row.category2
                            }}</el-tag>
                        <el-tag type="warning" size="small" v-if="scope.row.category3">{{ scope.row.category3
                            }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="创建时间" width="150">
                    <template #default="scope">
                        {{ dayjs(scope.row.create_time).format('YYYY-MM-DD HH:mm') }}
                    </template>
                </el-table-column>

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

        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="70%">
            <el-descriptions direction="vertical" :column="4" :size="size" border>
                <el-descriptions-item label="标题" :span="2">
                    <el-input v-model="form.title" placeholder="请输入标题" />
                </el-descriptions-item>
                <el-descriptions-item label="作者" :span="1">
                    <el-select v-model="form.author_id" filterable remote reserve-keyword placeholder="请输入作者"
                        :remote-method="handleAuthorSearch">
                        <el-option v-for="item in authorOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-descriptions-item>
                <el-descriptions-item label="朝代" :span="1">
                    <el-select v-model="form.dynasty_id" placeholder="请选择朝代" filterable>
                        <el-option v-for="item in dynastyOptions" :key="item.id" :label="item.dynasty"
                            :value="item.id" />
                    </el-select>
                </el-descriptions-item>
                <el-descriptions-item label="原文" :span="4">
                    <el-input type="textarea" v-model="form.content" :autosize="{ minRows: 5, maxRows: 15 }"
                        placeholder="请输入原文" />
                </el-descriptions-item>
                <el-descriptions-item label="译文" :span="4">
                    <el-input type="textarea" v-model="form.translation" :autosize="{ minRows: 3, maxRows: 10 }"
                        placeholder="请输入译文" />
                </el-descriptions-item>
                <el-descriptions-item label="赏析" :span="4">
                    <el-input type="textarea" v-model="form.analyze" :autosize="{ minRows: 3, maxRows: 10 }"
                        placeholder="请输入赏析" />
                </el-descriptions-item>
                <el-descriptions-item label="形式" :span="1">
                    <el-select v-model="form.form_id" placeholder="请选择形式">
                        <el-option v-for="item in formOptions" :key="item.id" :label="item.form" :value="item.id" />
                    </el-select>
                </el-descriptions-item>
                <el-descriptions-item label="分类一（必填）" :span="1">
                    <el-select v-model="form.category1_id" placeholder="请选择分类1">
                        <el-option v-for="item in categoryOptions" :key="item.id" :label="item.category"
                            :value="item.id" />
                    </el-select>
                </el-descriptions-item>
                <el-descriptions-item label="分类二（选填）" :span="1">
                    <el-select v-model="form.category2_id" placeholder="请选择分类2">
                        <el-option v-for="item in categoryOptions" :key="item.id" :label="item.category"
                            :value="item.id" />
                    </el-select>
                </el-descriptions-item>
                <el-descriptions-item label="分类三（选填）" :span="1">
                    <el-select v-model="form.category3_id" placeholder="请选择分类3">
                        <el-option v-for="item in categoryOptions" :key="item.id" :label="item.category"
                            :value="item.id" />
                    </el-select>
                </el-descriptions-item>
            </el-descriptions>

            <div style="text-align: right; margin-top: 1rem;">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { list, add, edit, del, search } from '@/api/poem'
import { list as dynastyList } from '@/api/dynasty'
import { search as authorSearch, list as authorList } from '@/api/author'
import { list as formList } from '@/api/form'
import { list as categoryList } from '@/api/category'
import { Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const dialogVisible = ref(false)
const dialogTitle = ref('新增')

const form = ref({
    id: '',
    title: '',
    content: '',
    author_id: '',
    dynasty_id: '',
    form_id: '',
    analyze: '',
    translation: '',
    status: '',
    category1_id: '',
    category2_id: '',
    category3_id: ''
})

const options = ref([
    {
        value: 'title',
        label: '标题'
    },
    {
        value: 'form',
        label: '形式'
    },
    {
        value: 'author',
        label: '作者'
    },
    {
        value: 'dynasty',
        label: '朝代'
    },
    {
        value: 'category',
        label: '分类'
    }
])

const useList = () => {
    const data = ref([])
    const total = ref(0)
    const page = ref(1)
    const type = ref('title')
    const keyword = ref('')
    const realKeyword = ref('')
    const pageSize = ref(15)

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
        keyword,
        type,
        data,
        getList,
        realKeyword
    }
}

const { data, type, keyword, getList, page, pageSize, total, realKeyword } = useList()

const dynastyOptions = ref([])
const authorOptions = ref([])
const formOptions = ref([])
const categoryOptions = ref([])

// 初始化
const initData = () => {
    dynastyList().then(res => {
        if (res.data.code == 200) {
            dynastyOptions.value = [...res.data.list]
        }
    })

    formList().then(res => {
        if (res.data.code == 200) {
            formOptions.value = [...res.data.list]
        }
    })

    categoryList().then(res => {
        if (res.data.code == 200) {
            categoryOptions.value = [...res.data.list]
        }
    })

    authorList({
        page: 1,
        pageSize: 999
    }).then(res => {
        if (res.data.code == 200) {
            authorOptions.value = res.data.list.map(item => {
                return {
                    label: item.name,
                    value: item.id
                }
            })
        }
    })
}

initData()

// 远程搜索作者
const handleAuthorSearch = (query) => {
    if (!query) return
    authorSearch({ name: query }).then(res => {
        if (res.data.code == 200) {
            authorOptions.value = res.data.list.map(item => {
                return {
                    label: item.name,
                    value: item.id
                }
            })
        }
    })
}

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
    if (dialogTitle.value == '编辑') {
        resetForm()
    }
    dialogTitle.value = '新增诗词'
    dialogVisible.value = true
}

// 重置form
const resetForm = () => {
    form.value = {
        id: '',
        title: '',
        content: '',
        author_id: '',
        dynasty_id: '',
        form_id: '',
        analyze: '',
        translation: '',
        status: '',
        category1_id: '',
        category2_id: '',
        category3_id: ''
    }
}

//搜索
const searchPoem = async () => {

    if (keyword.value === '') {
        getList()
    }

    if (type.value === 'category') {
        realKeyword.value = categoryOptions.value.find(item => item.category === keyword.value) ? categoryOptions.value.find(item => item.category === keyword.value).id : ''
    } else if (type.value === 'form') {
        realKeyword.value = formOptions.value.find(item => item.form === keyword.value) ? formOptions.value.find(item => item.form === keyword.value).id : ''
    } else if (type.value === 'dynasty') {
        realKeyword.value = dynastyOptions.value.find(item => item.dynasty === keyword.value) ? dynastyOptions.value.find(item => item.dynasty === keyword.value).id : ''
    } else if (type.value === 'author') {
        realKeyword.value = authorOptions.value.find(item => item.label === keyword.value) ? authorOptions.value.find(item => item.label === keyword.value).value : ''
    } else {
        realKeyword.value = keyword.value
    }

    await search({
        keyword: realKeyword.value,
        type: type.value,
        page: page.value,
        pageSize: pageSize.value
    }).then(res => {
        data.value = res.data.list
        total.value = res.data.total
    })
}

//提交
const submit = () => {

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
    searchPoem()
}

</script>

<style scoped lang='less'>
.main-box {
    padding: 1rem;

    .panel {
        display: flex;
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

            .el-tag {
                margin: 0 5px;
            }

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