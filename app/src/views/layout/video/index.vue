<template>
    <div class="video-area">
        <div class="video-player">
            <Player></Player>
        </div>
        <div class="video-list">
            <List></List>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import List from './components/List.vue'
import Player from './components/Player.vue'

</script>

<style scoped lang='less'>
.video-area {
    width: var(--center-width);
    margin: 2rem auto;
    display: flex;
    flex-direction: column;


    .video-player {
        width: 100%;
    }

}
</style>