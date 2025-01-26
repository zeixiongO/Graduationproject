<template>
    <div class="author">
        <div class="card">
            <header class="title">
                <h4>{{ author.name }}</h4>
            </header>
            <div class="content">
                {{ author.intro }}
            </div>
        </div>

        <div class="card">
            <header class="title">
                <h4>{{ author.name }}作品</h4>
            </header>
            <div class="works">
                <ul>
                    <li v-for="item in author.list" :key="item.id" @click="toPoem(item.id)">
                        <span>{{ item.title }}</span>
                    </li>
                </ul>
                <div class="profile">
                    <img :src="apiDomin + 'source/images/' + author.profile" alt="">
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authorDetail, listByAuthor } from '@/api/poem';

const apiDomin = import.meta.env.VITE_API_DOMAIN
const route = useRoute()
const router = useRouter()

const author = reactive({
    title: '',
    intro: '',
    profile: '',
    list: []
})

// 初始化数据
const initData = async () => {
    if (route.params.id) {
        await authorDetail({
            id: route.params.id
        }).then(res => {
            if (res.code === 200) {
                author.name = res.data.name
                author.intro = res.data.intro
                author.profile = res.data.profile
            }
        })

        await listByAuthor({
            id: route.params.id
        }).then(res => {
            if (res.code === 200) {
                author.list = res.list
            }
        })
    }
}

initData()

// 跳转到作品详情页
const toPoem = (id) => {
    router.push('/poemDetail/' + id)
}

</script>

<style scoped lang='less'>
.author {
    width: var(--center-width);
    margin: 2rem auto;

    .card {
        padding: 1.5rem;
        margin-top: 2rem;
        border: 1px solid var(--primary-color);
        box-sizing: border-box;
        background: linear-gradient(to left, var(--borderColor), var(--borderColor)) left top no-repeat,
            linear-gradient(to bottom, var(--borderColor), var(--borderColor)) left top no-repeat,
            linear-gradient(to left, var(--borderColor), var(--borderColor)) right top no-repeat,
            linear-gradient(to bottom, var(--borderColor), var(--borderColor)) right top no-repeat,
            linear-gradient(to left, var(--borderColor), var(--borderColor)) left bottom no-repeat,
            linear-gradient(to bottom, var(--borderColor), var(--borderColor)) left bottom no-repeat,
            linear-gradient(to left, var(--borderColor), var(--borderColor)) right bottom no-repeat,
            linear-gradient(to left, var(--borderColor), var(--borderColor)) right bottom no-repeat;
        background-size: 2px 20px, 20px 2px, 2px 20px, 20px 2px;


        .title {
            font-size: 1.3rem;
            font-weight: bold;
            cursor: pointer;
            display: flex;
            justify-content: space-between;

        }

        .content {
            margin-top: 1rem;
            line-height: 1.8rem;
            white-space: pre-wrap;
            font-size: 1.1rem;
            letter-spacing: 1px;
            color: #000;
        }

        .works {
            display: flex;
            justify-content: space-between;

            .profile {
                width: 150px;
                height: 150px;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                }
            }

            ul {
                flex: 1;
                margin-top: 1rem;

                li {
                    margin: 1rem 0;
                    display: flex;
                    justify-content: space-between;
                    cursor: pointer;
                }
            }


        }

    }

}
</style>