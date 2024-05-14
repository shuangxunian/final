<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const tableData = ref([])
const userList = ref([])
const optionList = ref([])

let chart1 = null
let chart2 = null
let chart3 = null
let chart4 = null


const getTime = (time) => {
  const date = new Date(Number(time));

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime

}

const getUserList = async() => {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    userList.value = data.info
  }
}

const getOptionList = async() => {
  const { data } = await axios.post('http://localhost:3000/option/allData', {})
  if (data.code === 2) {
    optionList.value = data.info
    tableData.value = []
    data.info.forEach(item => {
      tableData.value.push({
        ...item,
        option: item.optionType,
        optionDate: getTime(item.id),
      })
    })
  }
}

const init = async() => {
  await init1()
  await init2()
  await init3()
  await init4()
}

const init1 = () => {
  // 基于准备好的dom，初始化echarts实例
  chart1 = echarts.init(document.getElementById("myEcharts1"));
  let dataMap = {}
  userList.value.forEach(item => {
    let old = new Date().getFullYear() - (item.birthday).substring(0, 4)
    if (dataMap[old]) {
      dataMap[old]++
    } else {
      dataMap[old] = 1
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
      text: "年龄分布",
    },
    tooltip: {},
    xAxis: {
      data: xAxisData,
    },
    yAxis: {},
    series: [
      {
        name: "年龄",
        type: "bar",
        data: seriesData,
      },
    ],
  };

  // 渲染图表
  chart1.setOption(options);
}


const init2 = async() => {
  // 操作记录
  // 基于准备好的dom，初始化echarts实例
  // console.log(tableData.value)
  chart2 = echarts.init(document.getElementById("myEcharts2"));
  let dataMap = {}
  tableData.value.forEach(item => {
    if (dataMap[item.option]) {
      dataMap[item.option]++
    } else {
      dataMap[item.option] = 1
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
      text: "操作记录",
    },
    tooltip: {},
    xAxis: {
      data: xAxisData,
    },
    yAxis: {},
    series: [
      {
        name: "操作",
        type: "bar",
        data: seriesData,
      },
    ],
  };

  // 渲染图表
  chart2.setOption(options);
}

const init3 = async() => {
  // 基于准备好的dom，初始化echarts实例
  chart3 = echarts.init(document.getElementById("myEcharts3"));
  let dataMap = {}
  tableData.value.forEach(item => {
    let from = item.wherefrom ? item.wherefrom : 'web'
    if (dataMap[from]) {
      dataMap[from]++
    } else {
      dataMap[from] = 1
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
      text: "访问来源",
    },
    tooltip: {},
    xAxis: {
      data: xAxisData,
    },
    yAxis: {},
    series: [
      {
        name: "来源",
        type: "bar",
        data: seriesData,
      },
    ],
  };

  // 渲染图表
  chart3.setOption(options);
}

const init4 = async() => {
  // 基于准备好的dom，初始化echarts实例
  chart4 = echarts.init(document.getElementById("myEcharts4"));
  let dataMap = {}
  tableData.value.forEach(item => {
    if (dataMap[item.userid]) {
      dataMap[item.userid]++
    } else {
      dataMap[item.userid] = 1
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
      text: "成员访问记录",
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
        name: "访问次数",
        type: "bar",
        data: seriesData,
      },
    ],
  };

  // 渲染图表
  chart4.setOption(options);
}

onMounted(async () => {
  await getUserList()
  await getOptionList()
  await init()
})

onUnmounted(() => {
  chart1?.dispose()
  chart2?.dispose()
  chart3?.dispose()
  chart4?.dispose()
})



</script>

<template>
  <div class="user">
    <div class="body">
      <div class="echart">
        <div>
          <div id="myEcharts1" :style="{ width: '500px', height: '300px' }"></div>
        </div>
        <div>
          <div id="myEcharts2" :style="{ width: '500px', height: '300px' }"></div>
        </div>
        <div>
          <div id="myEcharts3" :style="{ width: '500px', height: '300px' }"></div>
        </div>
        <div>
          <div id="myEcharts4" :style="{ width: '500px', height: '300px' }"></div>
        </div>
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
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
  }
}
</style>
