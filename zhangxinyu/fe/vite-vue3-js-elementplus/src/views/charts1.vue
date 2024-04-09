<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const tableData = ref([])
const userList = ref([])
const optionList = ref([])

const init = async() => {
  await init1()
}

const init1 = () => {
  // 基于准备好的dom，初始化echarts实例
  let Chart = echarts.init(document.getElementById("myEcharts5"));

  // 绘制图表
  let options = {
    title: {
      text: '用户增长率'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['web', 'app', '小程序']
    },
    grid: {},
    toolbox: {},
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['2024-04-03', '2024-04-04', '2024-04-05', '2024-04-06', '2024-04-07', '2024-04-08', '2024-04-09'],
      axisLabel:{
        rotate:-45,//倾斜度 -90 至 90 默认为0
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'web',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: 'app',
        type: 'line',
        stack: 'Total',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: '小程序',
        type: 'line',
        stack: 'Total',
        data: [150, 232, 201, 154, 190, 330, 410]
      }
    ]
  };

  // 渲染图表
  Chart.setOption(options);
}

onMounted(async () => {
  await init()
})

</script>

<template>
  <div class="user">
    <div class="body">
      <div class="echart">
        <div id="myEcharts5" :style="{ width: '100%', height: '100%' }"></div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.user {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .body {
    width: 100%;
    height: 100%;
    .echart {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
  }
}
</style>
