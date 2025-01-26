<template>
    <div class="card">
        <div class="author" @click="toAuthor">
            <div class="pic">
                <div v-if="props.poem.profile">
                    <img :src="apiDomin + 'source/images/' + props.poem.profile" alt="" />
                </div>
                <div v-else>{{ props.poem.name.slice(0, 1) }}</div>
            </div>
            <div class="info">
                <div style="font-weight: bold;">{{ props.poem.name }}</div>
                <div class="tag">{{ props.poem.dynasty }}</div>
            </div>
        </div>
        <div class="excerpt">
            <div>
                <div class="author" @click="toAuthor">{{ props.poem.name }}</div>
            </div>
            <ul>
                <li v-for="line in props.poem.lines">{{ line }}</li>
            </ul>
        </div>
        <div class="poem">
            <span class="title" @click="toDetail">{{ props.poem.title }}</span>
            <p class="content">
                {{ cutContent(props.poem.content) }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps(['poem'])
const apiDomin = import.meta.env.VITE_API_DOMAIN

// 裁剪多出部分
const cutContent = (content) => {
    const len = content.length
    if (len > 100) {
        return content.slice(0, 60) + '...'
    } else {
        return content
    }
}

// 跳转至作者页
const toAuthor = () => {
    router.push('/author/' + props.poem.author_id)
}

// 跳转到详情页
const toDetail = () => {
    router.push('/poemDetail/' + props.poem.poem_id)
}

</script>

<style scoped lang='less'>
.card {
    width: 300px;
    margin-bottom: 3rem;
    display: flex;
    flex-direction: column;

    .author {
        display: flex;
        align-items: center;
        cursor: pointer;

        .pic {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            overflow: hidden;

            div {
                width: 100%;
                height: 100%;
                background-color: var(--primary-color);
                color: #fff;
                line-height: 2.5rem;
                text-align: center;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }
        }

        .info {
            margin-left: 0.8rem;

            .tag {
                margin-top: 5px;
                display: inline-block;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 0.7rem;
                color: var(--primary-color);
                background-color: #ededed;
            }
        }
    }

    .excerpt {
        margin-top: 1rem;
        border: 2px solid var(--primary-color);
        display: flex;
        min-height: 22rem;

        &>div {
            width: 60%;
            display: flex;
            align-items: end;
            padding: 0.5rem;

            div {
                writing-mode: vertical-lr;
                text-orientation: upright;
                background-color: var(--primary-color);
                color: #fff;
                padding: 0.2rem;
                border-radius: 5px;
                letter-spacing: 3px;
                font-size: 0.9rem;
            }
        }

        &>ul {
            width: 40%;
            writing-mode: vertical-rl;
            text-orientation: upright;

            li {
                padding: 1rem 0.5rem 5rem 0.5rem;
                letter-spacing: 0.5rem;
                color: #000;
                font-family: 'song';
                font-size: 1.5rem;
                border-left: 1px solid var(--primary-color);
            }
        }
    }

    .poem {
        flex: 1;
        border-left: 3px solid var(--primary-color);
        border-right: 1px solid var(--primary-color);
        border-bottom: 1px solid var(--primary-color);
        padding: 0.5rem;
        background-color: #f7f7f7;
        overflow: hidden;

        .title {
            background-color: var(--primary-color);
            color: #fff;
            padding: 0.2rem;
            border-radius: 5px;
            letter-spacing: 3px;
            font-size: 0.9rem;
            cursor: pointer;
        }

        .title:hover {
            text-decoration: underline;
        }

        p {
            margin-top: 0.5rem;
            font-size: 0.9rem;
            padding-left: 1px;
            line-height: 1.5rem;
            white-space: pre-wrap;
        }
    }
}
</style>