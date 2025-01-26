<template>
    <footer>
        <p>
            {{ poem.excerpt }} ——[{{ poem.dynasty }}]{{ poem.name }}《{{ poem.title }}》
        </p>
    </footer>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { random } from '@/api/poem'

const poem = ref({
    title: '',
    dynasty: '',
    name: '',
    excerpt: ''
})

random({ count: 1 }).then(res => {
    if (res.code === 200) {
        poem.value = { ...res.list[0] }
    }
})

</script>

<style scoped lang='less'>
footer {
    width: var(--center-width);
    margin: 0 auto;
    padding: 1rem 0;
    border-top: 1px solid #eee;

    p {
        text-align: center;
    }
}
</style>