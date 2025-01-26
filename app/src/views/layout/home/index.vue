<template>
    <div class="home">
        <el-carousel height="400px" :interval="5000">
            <el-carousel-item v-for="item in banner" :key="item.id">
                <div class="banner" @click="toDetail(item.poem_id)">
                    <img :src="item.img" alt="">
                    <div class="text">{{ item.text }}</div>
                </div>

            </el-carousel-item>
        </el-carousel>
        <Divider>每日摘抄</Divider>
        <div class="excerpt">
            <ExcerptCard v-for="poem in poems.list" :key="poem.id" :poem="poem"></ExcerptCard>
        </div>

    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import ExcerptCard from './components/ExcerptCard.vue'
import { useRouter } from 'vue-router';
import { random } from '@/api/poem'
import Divider from '@/components/Divider/Divider.vue';
import banner2 from '@/assets/images/banner2.jpg'
import banner3 from '@/assets/images/banner3.png'
import banner4 from '@/assets/images/banner4.png'
import banner8 from '@/assets/images/banner8.png'
import banner6 from '@/assets/images/banner6.jpg'

const router = useRouter()

const banner = ref([
    {
        id: 4,
        img: banner4,
        text: '雨荒深院菊，霜倒半池莲',
        poem_id: 15
    },
    {
        id: 1,
        img: banner6,
        text: '此心安处是吾乡',
        poem_id: 16
    },
    {
        id: 2,
        img: banner2,
        text: '多谢月相怜，今宵不忍圆',
        poem_id: 17
    },
    {
        id: 3,
        img: banner3,
        text: '鱼行潭树下，猿挂岛藤间。',
        poem_id: 18

    },
    {
        id: 5,
        img: banner8,
        text: '醉后不知天在水，满船清梦压星河',
        poem_id: 19
    },
])

const poems = reactive({
    count: 6,
    list: []
})

const getList = async () => {
    random({ count: poems.count }).then(res => {
        if (res.code === 200) {

            poems.list = res.list.map(item => {
                return { ...item, lines: item.excerpt.split('，') }
            })
        }
    })
}
getList()

const toDetail = (id) => {
    router.push('/poemDetail/' + id)
}

</script>

<style scoped lang='less'>
.home {
    width: var(--center-width);
    margin: 2rem auto;

    .excerpt {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .banner {
        width: 100%;
        height: 100%;
        position: relative;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .text {
            position: absolute;
            bottom: 15%;
            right: 0;
            background-color: #00000089;
            color: #fff;
            padding: 6px 10px;
            box-sizing: border-box;
            font-size: 1.5rem;
            font-family: "song";
            cursor: pointer;
        }
    }

}
</style>