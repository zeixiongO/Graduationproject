<template>
    <div class="mynote">
        <h4 style="margin-bottom: 2rem">我的评论</h4>
        <div class="table-area">
            <el-table :data="comment.list" class="table">
                <el-table-column type="index" label="序号" width="70" />
                <el-table-column prop="content" label="内容">
                </el-table-column>
                <el-table-column prop="title" label="笔记" width="150">
                    <template #default="scope">
                        <el-link type="primary" :underline="false" @click="handleDetail(scope.row.note_id)">{{
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
                            <el-button type="danger" text size="small"
                                @click="handleDelete(scope.row.id)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
                <el-pagination small v-model="comment.page" :page-size="comment.pageSize" layout="prev, pager, next"
                    :total="comment.total" @update:current-page="handleCurrentPage" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { commentListByUser, commentDel } from '@/api/note'
import { useUserStore } from '@/stores/useUserStore';
import dayjs from 'dayjs'
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';

const router = useRouter()
const userStore = useUserStore();

const comment = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    list: []
})

const getList = () => {
    commentListByUser({
        user_id: userStore.userinfo.id,
        page: comment.page,
        pageSize: comment.pageSize
    }).then(res => {
        comment.list = res.list
        comment.total = res.total
    })
}
getList()

const handleDetail = (id) => {
    router.push('/noteDetail/' + id)
}

const handleDelete = (id) => {
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        commentDel({ id }).then(res => {
            if (res.code == 200) {
                ElMessage.success('删除成功')
                getList()
            } else {
                ElMessage.error(res.message)
            }
        })
    }).catch()
}


const handleCurrentPage = (val) => {
    comment.page = val
    getList()
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