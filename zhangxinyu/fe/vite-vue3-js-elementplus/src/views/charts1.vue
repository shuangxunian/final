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

const timestampToDate = (timestamp) => {
  const date = new Date(Number(timestamp));
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const init1 = () => {
  // 基于准备好的dom，初始化echarts实例
  let Chart = echarts.init(document.getElementById("myEcharts5"));
  const belongMap = {}
  userList.value.forEach(item => {
    const dateString = timestampToDate(item.buildDate)
    // console.log(item)
    if (!belongMap[dateString]) {
      belongMap[dateString] = {
        web: 0,
        app: 0,
        小程序: 0
      }
      belongMap[dateString][item.belong]++
    } else {
      belongMap[dateString][item.belong]++
    }
  })
  const belongList = Object.keys(belongMap)
  const webList = []
  const appList = []
  const wxList = []
  belongList.forEach(item => {
    webList.push(belongMap[item].web)
    appList.push(belongMap[item].app)
    wxList.push(belongMap[item]['小程序'])
  })
  // const belongData = Object.values(belongMap)
  // console.log(wxList)
  
  // console.log(belongMap)
  // console.log(userList.value)
  // const belongMap = {}
  // userList.value.forEach(item => {
  //   if (!belongMap[item.belong]) {
  //     belongMap[item.belong] = 1
  //   } else {
  //     belongMap[item.belong]++
  //   }
  // })
  // const belongList = Object.keys(belongMap)
  // const belongData = Object.values(belongMap)
  // console.log(belongList, belongData)

  // 绘制图表
  let options = {
    title: {
      text: '用户增长量'
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
      data: belongList,
      axisLabel:{
        rotate:-45,//倾斜度 -90 至 90 默认为0
      }
    },
    yAxis: {
      type: 'value',
      name: '总增长数'
    },
    series: [
      {
        name: 'web',
        type: 'line',
        stack: 'Total',
        data: webList
      },
      {
        name: 'app',
        type: 'line',
        stack: 'Total',
        data: appList
      },
      {
        name: '小程序',
        type: 'line',
        stack: 'Total',
        data: wxList
      }
    ]
  };

  // 渲染图表
  Chart.setOption(options);
}

const getUserList = async () => {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    userList.value = data.info
  }
}

onMounted(async () => {
  await getUserList()
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
