<template>
    <div class="mynote">
        <h4 style="margin-bottom: 1rem">我的收藏</h4>

        <el-tabs>
            <el-tabs v-model="activeName">
                <el-tab-pane label="诗词" name="poem">
                    <div class="table-area">
                        <el-table :data="poem.list" class="table">
                            <el-table-column type="index" label="序号" width="70" />
                            <el-table-column prop="title" label="标题">
                                <template #default="scope">
                                    <el-link type="primary" :underline="false"
                                        @click="handleDetail(scope.row.poem_id)">{{
                scope.row.title }}</el-link>
                                </template>
                            </el-table-column>
                            <el-table-column prop="create_time" label="收藏时间" width="150">
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
                            <el-pagination small v-model="poem.page" :page-size="poem.pageSize"
                                layout="prev, pager, next" :total="poem.total"
                                @update:current-page="handleCurrentPage" />
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="视频" name="video">
                    <div class="table-area">
                        <el-table :data="video.list" class="table">
                            <el-table-column type="index" label="序号" width="70" />
                            <el-table-column prop="title" label="标题">
                                <template #default="scope">
                                    <el-link type="primary" :underline="false"
                                        @click="handleVideoDetail(scope.row.video_id)">{{
                scope.row.title }}</el-link>
                                </template>
                            </el-table-column>
                            <el-table-column prop="create_time" label="收藏时间" width="150">
                                <template #default="scope">
                                    {{ dayjs(scope.row.create_time).format('YYYY-MM-DD HH:mm') }}
                                </template>
                            </el-table-column>

                            <el-table-column fixed="right" label="操作" width="200">
                                <template #default="scope">
                                    <div class="table-btns">
                                        <el-button type="danger" text size="small"
                                            @click="handleVideoDelete(scope.row.id)">删除</el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>

                        <div class="pagination">
                            <el-pagination small v-model="video.page" :page-size="video.pageSize"
                                layout="prev, pager, next" :total="video.total"
                                @update:current-page="handleVideoCurrentPage" />
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-tabs>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { starListByUser, delStar } from '@/api/poem'
import { deleteStar, starList } from '@/api/video'
import { useUserStore } from '@/stores/useUserStore';
import dayjs from 'dayjs'
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useVideoStore } from '@/stores/useVideoStore';

const router = useRouter()
const userStore = useUserStore();
const activeName = ref('poem')

const poem = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    list: []
})

const video = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    list: []
})

// 获取收藏的诗词列表
const getPoemList = () => {
    starListByUser({
        user_id: userStore.userinfo.id,
        page: poem.page,
        pageSize: poem.pageSize
    }).then(res => {
        poem.list = res.list
        poem.total = res.total
    })
}
getPoemList()

// 获取收藏的视频列表
const getVideoList = () => {
    starList({
        user_id: userStore.userinfo.id,
        page: video.page,
        pageSize: video.pageSize,
        type: 2
    }).then(res => {
        video.list = res.list
        video.total = res.total
    })
}
getVideoList()

const handleDetail = (id) => {
    router.push('/poemDetail/' + id)
}

const handleVideoDetail = (id) => {
    router.push({ path: '/video', query: { id: id } })
}

const handleDelete = (id) => {
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        delStar({ id }).then(res => {
            if (res.code == 200) {
                ElMessage.success('删除成功')
                getList()
            } else {
                ElMessage.error(res.message)
            }
        })
    }).catch()
}

// 删除收藏
const handleVideoDelete = (id) => {
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        deleteStar({ id }).then(res => {
            if (res.code == 200) {
                ElMessage.success('删除成功')
                getVideoList()
            } else {
                ElMessage.error(res.message)
            }
        })
    }).catch()
}

// 分页
const handleVideoCurrentPage = (val) => {
    video.page = val
    getVideoList()
}

const handleCurrentPage = (val) => {
    poem.page = val
    getPoemList()
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