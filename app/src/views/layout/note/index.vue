<template>
    <div class="note">
        <div v-masonry transition-duration="0.3s" item-selector=".item" class="list" v-infinite-scroll="loadMore">
            <div v-masonry-tile class="item" v-for="item in note.list" :key="item.id">
                <NoteCard :note="item" :isCut="true"></NoteCard>
            </div>
        </div>

        <el-tooltip effect="light" content="发布笔记" placement="top-start">
            <div class="write" @click="openPublish">
                <img src="@/assets/images/write.png" alt="">
            </div>
        </el-tooltip>
        <el-backtop :bottom="100" :right="80">
            <el-icon>
                <Top />
            </el-icon>
        </el-backtop>

        <el-dialog v-model="dialogVisible" title="发布笔记" width="60%" :append-to-body="true" :lock-scroll="true"
            fullscreen>
            <el-form :model="newNote" label-width="120px" label-position="top">
                <el-form-item label="标题">
                    <el-input v-model="newNote.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item label="笔记">
                    <el-input type="textarea" v-model="newNote.content" :autosize="{ minRows: 10, maxRows: 20 }"
                        placeholder="请输入笔记内容" />
                </el-form-item>
                <el-form-item label="封面（可选）">
                    <el-upload class="avatar-uploader" :action="apiDomin + 'poem/upload'" :show-file-list="false"
                        :headers="headers" :accept="['image/*']" :on-success="handleSuccess"
                        :before-upload="beforeUpload">
                        <img v-if="newNote.cover" :src="apiDomin + 'source/images/' + newNote.cover" class="avatar">
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
                        发布
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import NoteCard from '@/components/Card/NoteCard.vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { add, list } from '@/api/note'
import { Top } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/useUserStore';

const apiDomin = import.meta.env.VITE_API_DOMAIN
const userStore = useUserStore();

const headers = reactive({
    'Authorization': localStorage.getItem('token')
})

const note = reactive({
    page: 1,
    pageSize: 6,
    total: 0,
    list: []
})

const getList = () => {
    list({
        page: note.page,
        pageSize: note.pageSize
    }).then(res => {
        if (res.code == 200) {
            note.list = res.list
            note.total = res.total
        }
    })
}
getList()

const loadMore = () => {
    note.page++
    list({
        page: note.page,
        pageSize: note.pageSize
    }).then(res => {
        if (res.code == 200) {
            note.list.push(...res.list)
        }
    })
}

const dialogVisible = ref(false)
const newNote = ref({
    title: '',
    content: '',
    cover: ''
})

const openPublish = () => {
    if (!userStore.userinfo.id) {
        ElMessage.warning('请先登录')
    } else {
        dialogVisible.value = true
    }
}

// 提交
const submit = () => {

    if (!newNote.value.title || !newNote.value.content) {
        ElMessage.warning('请填写标题和内容')
        return
    }

    add({
        title: newNote.value.title,
        content: newNote.value.content,
        cover: newNote.value.cover,
        user_id: userStore.userinfo.id
    }).then(res => {
        if (res.code == 200) {
            ElMessage.success('发布成功')
            dialogVisible.value = false
            note.page = 1
            getList()
            newNote.value = {
                title: '',
                content: '',
                cover: ''
            }
        } else {
            ElMessage.error(res.message)
        }
    })
}

const uploadLoading = ref(false)
//上传成功回调
const handleSuccess = (response, uploadFile) => {
    if (response.code == 200) {
        newNote.value.cover = response.file.filename
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
.note {
    width: var(--center-width);
    margin: 1rem auto;

    .list {
        display: flex;
        justify-content: space-between;

        .item {
            width: calc(50% - 1rem);
            margin-left: 1rem;
            margin-top: 1rem;
        }
    }

    .write {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        position: fixed;
        bottom: 10rem;
        right: 5rem;
        box-shadow: 1px 1px 2px 1px #0000001a;
        transition: 0.3s;
        cursor: pointer;

        img {
            width: 60%;
            height: 60%;
        }
    }

    .write:hover {
        box-shadow: 1px 1px 2px 1px #00000037;
    }
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