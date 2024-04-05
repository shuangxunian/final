<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const tableData = ref([])
const optionList = ref([])
const input = ref('')

const getData = async () => {
  if (input.value === '') {
    tableData.value = optionList.value
  } else {
    tableData.value = []
    optionList.value.forEach(item => {
      if (item.name.includes(input.value) || item.userOption.includes(input.value)) {
        tableData.value.push(item)
      }
    })
  }
}

const formatDate = (row, column) => {
  let date = new Date(parseInt(row.id.split('-')));
  let Y = date.getFullYear() + '-';
  let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
  let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
  let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}

const formatDayDate = (row, column) => {
  let date = new Date(parseInt(row.id.split('-')));
  let Y = date.getFullYear() + '-';
  let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
  let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
  return Y + M + D;
}

const init = async () => {
  init1()
  init2()
}

const init1 = async () => {
  // 基于准备好的dom，初始化echarts实例
  let Chart = echarts.init(document.getElementById("myEcharts1"));
  let dataMap = {
    '成功': 0,
    '失败': 0,
  }
  tableData.value.forEach(item => {
    const arr = item.userOption.split('-')
    if (arr[2] === '发送成功') {
      dataMap['成功']++
    } else {
      dataMap['失败']++
    }
  })
  let xAxisData = []
  let seriesData = []

  for (let key in dataMap) {
    xAxisData.push(key)
    seriesData.push(dataMap[key])
  }
  // 绘制图表
  let options = {
    title: {
      text: "邮件发送记录",
    },
    tooltip: {},
    xAxis: {
      data: xAxisData,
      axisLabel:{
        rotate:-45,//倾斜度 -90 至 90 默认为0
      }
    },
    yAxis: {},
    series: [
      {
        name: "结果",
        type: "bar",
        data: seriesData,
      },
    ],
  };

  // 渲染图表
  Chart.setOption(options);
}


const init2 = async () => {
  // 基于准备好的dom，初始化echarts实例
  let Chart = echarts.init(document.getElementById("myEcharts2"));
  let dataMap = {}
  tableData.value.forEach(item => {
    const date = formatDayDate(item, '')
    if (dataMap[date]) {
      dataMap[date]++
    } else {
      dataMap[date] = 1
    }
  })
  let xAxisData = []
  let seriesData = []

  for (let key in dataMap) {
    xAxisData.push(key)
    seriesData.push(dataMap[key])
  }
  // 绘制图表
  let options = {
    title: {
      text: "邮件发送次数",
    },
    tooltip: {},
    xAxis: {
      data: xAxisData,
      axisLabel:{
        rotate:-45,//倾斜度 -90 至 90 默认为0
      }
    },
    yAxis: {},
    series: [
      {
        type: "line",
        data: seriesData,
      },
    ],
  };

  // 渲染图表
  Chart.setOption(options);
}
const getOptionList = async () => {
  const { data } = await axios.post('http://localhost:3000/option/allData', {})
  if (data.code === 2) {
    optionList.value = data.info
    tableData.value = data.info
    await init()
  }
}

onMounted(async () => {
  getOptionList()
})

</script>

<template>
  <div class="option-list">
    <div class="header">
      <div class="input">
        <el-input style="margin-top:20px" v-model="input" placeholder="请输入内容" />
      </div>
      <div class="btn">
        <el-button style="margin-top:20px" type="primary" @click="getData">搜索</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%" border height="500">
        <el-table-column prop="name" label="单位名称" />
        <el-table-column prop="userOption" label="操作" />
        <el-table-column prop="time" label="触发时间" :formatter="formatDate"/>
      </el-table>
    </div>
    <div class="echart">
      <div id="myEcharts1" :style="{ width: '400px', height: '300px'}"></div>
      <div id="myEcharts2" :style="{ width: '400px', height: '300px'}"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.option-list {

  background-color: #fff;
  height: 100%;
  width: 100%;
  .header {
    height: 70px;
    display: flex;
    .input {
      width: 300px;
      margin-left: 20px;
    }
    .btn {
      margin-left: 20px;
    }
  }
  .body {
    width: 100%;
  }
  .echart {
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: calc(100% - 570px);
  }
}
</style>
