<template>
    <div class="container">
        <el-empty description="404">
            <div>
                页面不存在，将在 <span> {{ second }}</span> 秒后返回
            </div>
        </el-empty>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()

const second = ref(4)

onMounted(() => {
    //改变second
    setInterval(() => {
        if (second.value === 0) {
            return
        }
        second.value--
    }, 1000)

    setTimeout(() => {
        router.back()
    }, 4000)
})

</script>

<style scoped lang='less'>
.container {
    height: 90vh;
    overflow: hidden;
}

div {
    font-size: 1rem;
    margin-top: 1rem;
    color: #383838;
    letter-spacing: 1px;
    user-select: none;

    span {
        color: var(--primary-color);
    }
}
</style>