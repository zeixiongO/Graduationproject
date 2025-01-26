<template>
    <div class="center">
        <div class="list">
            <PoemCard v-for="item in poem.list" :key="item.id" :poem="item"></PoemCard>
        </div>
        <div class="aside">
            <div class="aside-item">
                <div class="title">分类</div>
                <ul>
                    <li v-for="item in category.list" :key="item.id" @click="toSearch(item.category)">{{ item.category
                        }}
                    </li>
                </ul>
            </div>
            <div class="hot">
                <div class="title">热度排行</div>
                <ul>
                    <li v-for="item in hotPoem.list" :key="item.id" @click="toDetail(item.id)">{{ item.title
                        }}
                    </li>
                </ul>
            </div>
        </div>
        <el-backtop :bottom="100">
            <el-icon>
                <Top />
            </el-icon>
        </el-backtop>

    </div>
    <div class="pagination">
        <el-pagination v-model="poem.page" :page-size="poem.pageSize" :pager-count="11" layout="prev, pager, next"
            :total="poem.total" @update:current-page="handleCurrentPage" />
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import PoemCard from '@/components/Card/PoemCard.vue'
import { list as categoryList } from '@/api/category'
import { list as poemList } from '@/api/poem'
import { Top } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const category = reactive({
    list: []
})
// 获取分类列表 
categoryList().then(res => {
    category.list = res.list
})

const hotPoem = reactive({
    list: []
})

const poem = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    list: []
})

const getPoemList = () => {
    poemList({
        page: poem.page,
        pageSize: poem.pageSize
    }).then(res => {
        if (res.code === 200) {
            poem.list = { ...res.list }
            poem.total = res.total

            if (poem.page === 1) {
                hotPoem.list = res.list.splice(0, 5)
            }
        }
    })
}
getPoemList()

const handleCurrentPage = (val) => {
    poem.page = val
    getPoemList()
    // 返回顶部 smooth效果

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 跳转搜索页
const toSearch = (category) => {
    router.push({ path: '/search', query: { type: 'category', keyword: category } })
}

// 跳转到详情页
const toDetail = (id) => {
    router.push({ path: '/poemDetail/' + id })
}

</script>

<style scoped lang='less'>
.center {
    width: var(--center-width);
    margin: 2rem auto;
    display: flex;

    .list {
        flex: 1;
    }

    .aside {
        flex-shrink: 0;
        position: sticky;
        top: 2rem;
        width: 310px;
        margin-left: 2rem;
        align-self: flex-start;

        &>div {
            border: 1px solid var(--primary-color);
            padding: 1.5rem;
            box-sizing: border-box;
            background: linear-gradient(to left, var(--borderColor), var(--borderColor)) left top no-repeat,
                linear-gradient(to bottom, var(--borderColor), var(--borderColor)) left top no-repeat,
                linear-gradient(to left, var(--borderColor), var(--borderColor)) right top no-repeat,
                linear-gradient(to bottom, var(--borderColor), var(--borderColor)) right top no-repeat,
                linear-gradient(to left, var(--borderColor), var(--borderColor)) left bottom no-repeat,
                linear-gradient(to bottom, var(--borderColor), var(--borderColor)) left bottom no-repeat,
                linear-gradient(to left, var(--borderColor), var(--borderColor)) right bottom no-repeat,
                linear-gradient(to left, var(--borderColor), var(--borderColor)) right bottom no-repeat;
            background-size: 2px 10px, 10px 2px, 2px 10px, 10px 2px;

            .title {
                font-size: 1rem;
                font-weight: bold;
                border-left: 3px solid var(--primary-color);
                height: 10px;
                line-height: 10px;
                padding-left: 5px;
            }
        }

        .aside-item {
            ul {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-auto-flow: row;
                gap: 0.5rem;


                li {
                    width: 100%;
                    margin-top: 1rem;
                    border: 1px solid #ccc;
                    text-align: center;
                    padding: 2px 0;
                    cursor: pointer;
                }
            }
        }

        .hot {
            margin-top: 2rem;

            ul {
                margin-top: 2rem;

                li {
                    margin-top: 1rem;
                    cursor: pointer;
                }
            }

        }


    }

}

.pagination {
    width: var(--center-width);
    margin: 0 auto;
    display: flex;
    justify-content: center;
    padding: 1rem 0;
}
</style>