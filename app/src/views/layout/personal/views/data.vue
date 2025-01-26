<template>
    <div class="data">
        <Chart id="learnChart" :title="周学习数据" :option="weekLearnCountOption" width="100%" height="300px"></Chart>
        <Chart id="noteChart" :title="周发布数据" :option="weekNoteCountOption" width="100%" height="300px"></Chart>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { weekLearnCount } from '@/api/poem'
import { weekNoteCount } from '@/api/note'
import Chart from '@/components/Chart/index.vue'
import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()

// 周学习数据集合
const weekLearnCountOption = ref({
    tooltip: {},
    legend: {
        data: ['本周学习情况（折线图）', '本周学习情况（柱状图）']
    },
    xAxis: {
        data: []
    },
    yAxis: {},
    series: [
        {
            name: '本周学习情况（折线图）',
            type: 'line',
            data: [],
            lineStyle: {
                color: '#ff6b81' // 为折线图设置颜色
            },
            symbol: 'circle', // 可选，设置标记点形状及颜色
            symbolSize: 8,
            itemStyle: {
                color: '#ff6b81' // 可选，设置标记点颜色
            }
        },
        {
            name: '本周学习情况（柱状图）',
            type: 'bar',
            data: [],
            barGap: 0, // 可选，设置柱间距离
            color: '#4559cb' // 为柱状图设置颜色
        }
    ]
});

// 周发布笔记数据集合
const weekNoteCountOption = ref({
    tooltip: {},
    legend: {
        data: ['本周笔记发布情况（折线图）', '本周笔记发布情况（柱状图）']
    },
    xAxis: {
        data: []
    },
    yAxis: {},
    series: [
        {
            name: '本周笔记发布情况（折线图）',
            type: 'line',
            data: [],
            lineStyle: {
                color: '#ff6b81' // 为折线图设置颜色
            },
            symbol: 'circle', // 可选，设置标记点形状及颜色
            symbolSize: 8,
            itemStyle: {
                color: '#ff6b81' // 可选，设置标记点颜色
            }
        },
        {
            name: '本周笔记发布情况（柱状图）',
            type: 'bar',
            data: [],
            barGap: 0, // 可选，设置柱间距离
            color: 'skyblue' // 为柱状图设置颜色
        }
    ]
})

const initData = async () => {
    const weekLearnCountData = await weekLearnCount({ user_id: userStore.userinfo.id })
    const weekNoteCountData = await weekNoteCount({ user_id: userStore.userinfo.id })

    weekLearnCountOption.value.xAxis.data = weekLearnCountData.data.map(item => item.date)
    weekLearnCountOption.value.series[0].data = weekLearnCountData.data.map(item => item.count)
    weekLearnCountOption.value.series[1].data = weekLearnCountData.data.map(item => item.count)
    weekNoteCountOption.value.xAxis.data = weekNoteCountData.data.map(item => item.date)
    weekNoteCountOption.value.series[0].data = weekNoteCountData.data.map(item => item.count)
    weekNoteCountOption.value.series[1].data = weekNoteCountData.data.map(item => item.count)
}

initData()

</script>

<style scoped lang='less'></style>