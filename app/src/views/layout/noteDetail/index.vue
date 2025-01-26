<template>
    <div class="detail">

        <NoteCard :note="note"></NoteCard>

        <Comment :id="route.params.id"></Comment>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Comment from './components/Comment.vue'
import NoteCard from '@/components/Card/NoteCard.vue';
import { useRoute } from 'vue-router';
import { detail, views } from '@/api/note';

const route = useRoute()

const note = ref({
    id: '',
    title: '',
    content: '',
    cover: '',
    nickname: '',
    profile: '',
    views: 0,
    create_time: ''
})

const initData = async () => {

    const res = await detail({ id: route.params.id })

    if (res.code === 200) {
        note.value = { ...res.data[0] }
    }

    views({ id: route.params.id })
}

initData()

</script>

<style scoped lang='less'>
.detail {
    width: var(--center-width);
    margin: 2rem auto;


}
</style>