<template>
    <div class="layout">
        <!-- 移动端布局方式 -->
        <div class="mobile" v-if="asideStore.isDrawer">
            <el-drawer v-model="asideStore.isCollapse" title="菜单" direction="ltr" size="40%">
                <Aside></Aside>
            </el-drawer>
            <div class="content">
                <Header></Header>
                <router-view></router-view>
            </div>
        </div>

        <!-- PC端布局方式 -->
        <div class="pc" v-else>
            <div class="pc-side">
                <Aside></Aside>
            </div>

            <div class="down">
                <header>
                    <Header></Header>
                </header>

                <main>
                    <router-view></router-view>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import Aside from '../../components/common/Aside.vue';
import Header from '../../components/common/Header.vue';
import { useAsideStore } from '@/stores/useAsideStore'
import { useRoute } from 'vue-router';

const route = useRoute()

const asideStore = useAsideStore()

onMounted(() => {
    //检测屏幕宽度
    if (window.innerWidth < 768) {
        asideStore.isDrawer = true
    }

    watch(() => route.path, () => {
        if (asideStore.isDrawer) {
            asideStore.isCollapse = false
        }
    })
})



</script>

<style scoped lang='less'>
.layout {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;

    .pc {
        width: 100%;
        height: 100%;
        display: flex;

        .pc-side {
            width: 10rem;
            flex-shrink: 0;
        }

        .down {
            flex: 1;
            background-color: #f6f6f6;
            display: flex;
            flex-direction: column;

            header {
                margin: 0 1rem;
            }

            main {
                flex: 1;
                margin: 1rem;
                background-color: #fff;
            }
        }
    }


    :deep(.el-drawer) {
        max-width: 300px;
        background-color: #1c3361;
    }

    :deep(.el-drawer__header) {
        color: #c5d8ff;
    }

    :deep(.el-drawer__body) {
        padding: 0;

    }
}
</style>