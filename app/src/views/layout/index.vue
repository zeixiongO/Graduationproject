<template>
    <Header></Header>
    <main>
        <router-view></router-view>
    </main>
    <Footer></Footer>
</template>

<script setup>
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import { ref, reactive } from 'vue'

</script>

<style scoped lang='less'>
main {
    min-height: calc(100vh - 100px);
}
</style>