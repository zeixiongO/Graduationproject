<template>
    <div class="statistics">
        <div class="header">
            <el-row>
                <el-col :span="4">
                    <el-statistic title="诗词总量" :value="total.poemTotal" />
                </el-col>
                <el-col :span="4">
                    <el-statistic title="作者数量" :value="total.authorTotal" />
                </el-col>
                <el-col :span="4">
                    <el-statistic title="用户数量" :value="total.userTotal" />
                </el-col>
                <el-col :span="4">
                    <el-statistic title="笔记数量" :value="total.noteTotal" />
                </el-col>
                <el-col :span="4">
                    <el-statistic title="评论数量" :value="total.commentTotal" />
                </el-col>
                <el-col :span="4">
                    <el-statistic title="视频数量" :value="total.videoTotal" />
                </el-col>
            </el-row>
        </div>

        <div class="stat">
            <el-row gutter="20">
                <el-col :span="24">
                    <Chart :option="weekNoteCountOption" id="weekNoteCountChart" title="本周笔记发布情况" width="100%"
                        height="350px" />
                </el-col>
                <el-col :span="12">
                    <Chart :option="dynastyPoemCountOption" id="dynastyPoemCountChart" title="各朝代诗词数量分布" width="100%"
                        height="350px" />
                </el-col>
                <el-col :span="12">
                    <Chart :option="categoryCountOption" id="categoryCountChart" title="各分类下诗词数量分布" width="100%"
                        height="350px" />
                </el-col>

            </el-row>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { poemTotal, authorTotal, userTotal, noteTotal, videoTotal, commentTotal, dynastyPoemCount, categoryCount, weekNoteCount } from '@/api/stat'
import Chart from '@/components/Chart/index.vue'

// 各数据总量
const total = reactive({
    poemTotal: 0,
    authorTotal: 0,
    userTotal: 0,
    noteTotal: 0,
    videoTotal: 0,
    commentTotal: 0,
})

const dynastyPoemCountOption = ref({
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: [] // 这里应填充朝代名称
    },
    series: [
        {
            name: '各朝代诗词数量分布',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: [], // 这里应填充上述JSON数组
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
})

const categoryCountOption = ref({
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: [] // 这里应填充朝代名称
    },
    series: [
        {
            name: '各分类下诗词数量分布',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: [], // 这里应填充上述JSON数组
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
})

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

const initData = () => {
    poemTotal().then(res => {
        if (res.data.code === 200) {
            total.poemTotal = res.data.total
        }
    })
    authorTotal().then(res => {
        if (res.data.code === 200) {
            total.authorTotal = res.data.total
        }
    })
    userTotal().then(res => {
        if (res.data.code === 200) {
            total.userTotal = res.data.total
        }
    })
    noteTotal().then(res => {
        if (res.data.code === 200) {
            total.noteTotal = res.data.total
        }
    })

    videoTotal().then(res => {
        if (res.data.code === 200) {
            total.videoTotal = res.data.total
        }
    })

    commentTotal().then(res => {
        if (res.data.code === 200) {
            total.commentTotal = res.data.total
        }
    })

    dynastyPoemCount().then(res => {
        if (res.data.code === 200) {
            dynastyPoemCountOption.value.legend.data = res.data.data.map(item => item.dynasty);
            dynastyPoemCountOption.value.series[0].data = res.data.data.map(item => ({ name: item.dynasty, value: item.count }));
        }
    })

    categoryCount().then(res => {
        if (res.data.code === 200) {
            categoryCountOption.value.legend.data = res.data.data.map(item => item.category);
            categoryCountOption.value.series[0].data = res.data.data.map(item => ({ name: item.category, value: item.count }));
        }
    })

    weekNoteCount().then(res => {
        if (res.data.code === 200) {
            weekNoteCountOption.value.xAxis.data = res.data.data.map(item => item.date);
            weekNoteCountOption.value.series[0].data = res.data.data.map(item => item.count);
            weekNoteCountOption.value.series[1].data = res.data.data.map(item => item.count);
        }
    })
}
initData()

</script>

<style scoped lang='less'>
.statistics {
    padding: 1rem;
    height: calc(100vh - 100px);
    overflow-y: auto;
    box-sizing: border-box;

    .header {
        padding: 1rem;
        border: 1px solid #eee;
    }

    .stat {
        margin-top: 2rem;
    }
}
</style>