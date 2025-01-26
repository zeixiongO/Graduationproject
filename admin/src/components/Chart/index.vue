<template>
    <div class="echarts-box">
        <h5 style="margin-bottom: 1rem">{{ props.title }}</h5>
        <div class="e" :id="props.id" :style="{ width: props.width, height: props.height }"></div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import * as echarts from "echarts";

const props = defineProps(['title', 'option', 'width', 'height', 'id'])

let echart = echarts;

onMounted(() => {
    initChart();

    watch(props.option, (newVal) => {
        initChart();
    });
});


// 基础配置一下Echarts
function initChart() {
    let chart = echart.init(document.getElementById(props.id), "light");
    // 把配置和数据放这里
    chart.setOption({ ...props.option });
    window.onresize = function () {
        //自适应大小
        chart.resize();
    };
}

</script>

<style scoped lang='less'>
.echarts-box {
    margin-bottom: 2rem;
}

#myEcharts {
    margin-top: 1rem;
}

.e {
    border: 1px solid #eee;
    padding: 1rem;
    box-sizing: border-box;
}
</style>