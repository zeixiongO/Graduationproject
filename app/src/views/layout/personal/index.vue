<template>
    <div class="personal">
        <div class="aside">
            <el-menu :default-active="active" router>
                <el-menu-item index="/personal">
                    <span>数据统计</span>
                </el-menu-item>
                <el-menu-item index="/personal/userinfo">
                    <span>个人资料</span>
                </el-menu-item>
                <el-menu-item index="/personal/note">
                    <span>我的笔记</span>
                </el-menu-item>
                <el-menu-item index="/personal/star">
                    <span>我的收藏</span>
                </el-menu-item>
                <el-menu-item index="/personal/comment">
                    <span>我的评论</span>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="main-area">
            <router-view />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const active = ref('/personal')

active.value = route.path

</script>

<style scoped lang='less'>
.personal {
    width: var(--center-width);
    margin: 2rem auto;
    box-shadow: 1px 2px 2px 0px rgba(0, 0, 0, 0.1);
    border: 1px solid #eee;
    display: flex;

    .aside {
        width: 150px;
        flex-shrink: 0;
        border-right: 2px solid #eee;

        .el-menu {
            border: none !important;
        }

        .el-menu-item.is-active {
            font-weight: bold;
        }
    }

    .main-area {
        flex: 1;
        padding: 2rem;
        box-sizing: border-box;
        min-height: 90vh;
    }
}
</style>