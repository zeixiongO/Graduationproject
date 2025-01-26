<template>
    <div class="search">
        <div class="input">
            <el-input v-model="poem.keyword" @keyup.enter="searchPoem" placeholder="请输入关键词" class="input-with-select">
                <template #prepend>
                    <el-select v-model="poem.type" style="width: 120px" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </template>
                <template #append>
                    <el-button @click="searchPoem" style="width: 70px" :icon="Search" />
                </template>
            </el-input>
        </div>

        <div class="list">
            <PoemCard v-for="item in poem.list" :key="item.id" :poem="item"></PoemCard>
            <el-empty v-if="poem.total === 0" style="height: 70vh;" description="未搜索到诗词" />
        </div>

        <el-backtop :bottom="100">
            <el-icon>
                <Top />
            </el-icon>
        </el-backtop>
    </div>
    <div class="pagination">
        <el-pagination v-model="poem.page" :page-size="poem.pageSize" :pager-count="11" layout="prev, pager, next"
            :total="poem.total" hide-on-single-page="false" @update:current-page="handleCurrentPage" />
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import PoemCard from '@/components/Card/PoemCard.vue'
import { search, formList, dynastysList, authorList, list as poemList } from '@/api/poem'
import { list as categoryList } from '@/api/category'
import { Top } from '@element-plus/icons-vue'

const route = useRoute()

const options = ref([
    {
        value: 'title',
        label: '标题'
    },
    {
        value: 'form',
        label: '形式'
    },
    {
        value: 'author',
        label: '作者'
    },
    {
        value: 'dynasty',
        label: '朝代'
    },
    {
        value: 'category',
        label: '分类'
    }
])

const poem = reactive({
    page: 1,
    pageSize: 10,
    total: 0,
    keyword: '',
    realKeyword: '',
    type: 'title',
    list: [],
    categoris: [],
    forms: [],
    dynastys: [],
    authors: []
})

const initData = async () => {
    await categoryList().then(res => {
        poem.categoris = res.list
    })

    await formList().then(res => {
        poem.forms = res.list
    })

    await dynastysList().then(res => {
        poem.dynastys = res.list
    })

    await authorList().then(res => {
        poem.authors = res.list
    })

    if (route.query.keyword && route.query.type) {
        poem.keyword = route.query.keyword
        poem.type = route.query.type
        await searchPoem()
    }

}
initData()

// 搜索诗词
const searchPoem = async () => {

    if (poem.keyword === '') {
        getPoemList()
    }

    if (poem.type === 'category') {
        poem.realKeyword = poem.categoris.find(item => item.category === poem.keyword) ? poem.categoris.find(item => item.category === poem.keyword).id : ''
    } else if (poem.type === 'form') {
        poem.realKeyword = poem.forms.find(item => item.form === poem.keyword) ? poem.forms.find(item => item.form === poem.keyword).id : ''
    } else if (poem.type === 'dynasty') {
        poem.realKeyword = poem.dynastys.find(item => item.dynasty === poem.keyword) ? poem.dynastys.find(item => item.dynasty === poem.keyword).id : ''
    } else if (poem.type === 'author') {
        poem.realKeyword = poem.authors.find(item => item.name === poem.keyword) ? poem.authors.find(item => item.name === poem.keyword).id : ''
    } else {
        poem.realKeyword = poem.keyword
    }

    await search({
        keyword: poem.realKeyword,
        type: poem.type,
        page: poem.page,
        pageSize: poem.pageSize
    }).then(res => {
        poem.list = res.list
        poem.total = res.total
    })

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 获取全部诗词
const getPoemList = () => {
    poemList({
        page: poem.page,
        pageSize: poem.pageSize
    }).then(res => {
        if (res.code === 200) {
            poem.list = res.list
            poem.total = res.total
        }
    })
}
getPoemList()


const handleCurrentPage = (val) => {
    poem.page = val
    searchPoem()
}

watch(() => route.query.keyword, () => {
    poem.keyword = route.query.keyword
    poem.type = route.query.type
    poem.page = 1
    searchPoem()
})
</script>

<style scoped lang='less'>
.search {
    width: var(--center-width);
    margin: 2rem auto;

    .list {
        margin-top: 2rem;
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