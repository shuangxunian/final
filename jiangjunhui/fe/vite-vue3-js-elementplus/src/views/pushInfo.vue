<script setup>
import { ref, computed,onMounted } from 'vue'
import AMapLoader from "@amap/amap-jsapi-loader"
import axios from 'axios'
import { ElMessage } from 'element-plus'


const textarea2 = ref(`龙岩市71 BEUW G汉阳峰 ZYJBE 公主岭XUK E103'11N25'15 E101'93N24'57 天长市 E103'19N25'35 阳春市17 东经101'84北纬25'00`)
const newLocation = ref('--')
const newPath = ref('--')
const newUnit = ref('--')
const markerList = ref([])
const locationList = ref([])
const unitList = ref([])
const loading = ref(false)

const getXY = (str) => {
  const arr = str.split(',')
  return [Number(arr[0]),Number(arr[1])]
}

const getData = async() => {
  loading.value = true
  markerList.value = []
  const pathList = []
  newPath.value = ''
  newLocation.value = ''
  newUnit.value = ''
  const arr = textarea2.value.split(' ')
  const regex1 = /^E\d+'\d+N\d+'\d+$/
  const regex2 = /^东经\d+'\d+北纬\d+'\d+$/
  const regex3 = /[\u4e00-\u9fa5]+/g;
  for (let i = 0; i < arr.length; i++) {
    const match1 = arr[i].match(regex1)
    const match2 = arr[i].match(regex2)
    const match3 = arr[i].match(regex3)
    if (match1) {
      const location = (arr[i].split('E'))[1].split('N')
      const xy = []
      location.forEach(item => {
        const data = item.split(`'`)
        xy.push(Number(data[0] + '.' + data[1]))
      })
      newPath.value += `东经${xy[0]},北纬${xy[1]}；`
      const position = new AmapObj.LngLat(xy[0],xy[1])
      pathList.push(position)
      const marker = new AmapObj.Marker({
        position: position,
        title: unitList.value[i]
      })
      markerList.value.push(marker)
    } else if (match2) {
      const location = (arr[i].split('东经'))[1].split('北纬')
      const xy = []
      location.forEach(item => {
        const data = item.split(`'`)
        xy.push(Number(data[0] + '.' + data[1]))
      })
      newPath.value += `东经${xy[0]},北纬${xy[1]}；`
      const position = new AmapObj.LngLat(xy[0],xy[1])
      pathList.push(position)
      const marker = new AmapObj.Marker({
        position: position,
        title: unitList.value[i]
      })
      markerList.value.push(marker)
    } else if (match3) {
      const { data } = await axios.get(`https://restapi.amap.com/v3/place/text?key=3f388fee9f84b98ebbfa46137f40926c&keywords=${match3[0]}&types=&city=&children=1&offset=1&page=1&extensions=base`)
      const xy = getXY(data.pois[0].location)
      newPath.value += `东经${xy[0]},北纬${xy[1]}；`
      newLocation.value += `${match3[0]}；`
      const position = new AmapObj.LngLat(xy[0],xy[1])
      pathList.push(position)
      const marker = new AmapObj.Marker({
        position: position,
        title: unitList.value[i]
      })
      markerList.value.push(marker)
    } else {
      newUnit.value += arr[i] + '；'
    }
  }
  if (newPath.value === '') newPath.value = '--'
  if (newLocation.value === '') newLocation.value = '--'
  if (newUnit.value === '') newUnit.value = '--'

  map.add(markerList.value)

  const polyline = new AmapObj.Polyline({
    path: pathList,
    strokeWeight: 2, //线条宽度
    strokeColor: "blue", //线条颜色
    lineJoin: "round", //折线拐点连接处样式
  })
  map.add(polyline)

  loading.value = false

}

const sendEmail = async() => {
  if (newUnit.value.length === 0) return ElMessage.error('当前无单位需通知！')
  const { data } = await axios.post('http://localhost:3000/option/send', {
    data: newUnit.value.split('；')
  })
  if(data.code === 2) {
    ElMessage({
      message: `发送完成！`,
      type: 'success',
    })
  }
  // console.log(unitList.value)
}

let map = null
let AmapObj = null

const getAMap = async () => {
  AMapLoader.load({
    key: "72fb17f4455270a5b7463474e7b8c134", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then(async (AMap) => {
      AmapObj = AMap
      map = new AMap.Map("container", {
        viewMode: "2D", // 是否为3D地图模式
        zoom: 4, // 初始化地图级别
        center: [123.408243,41.927417],
      })
      // getMarker()

    })
    .catch((e) => {
      console.log(e);
    });
}


onMounted(async () => {
  await getAMap()
})


</script>

<template>
  <div class="push-info">
    <div class="header">
      <div class="my-input">
        <el-input
          v-model="textarea2"
          :autosize="{ minRows: 11, maxRows: 11 }"
          type="textarea"
          placeholder="请输入通信文本"
        />
      </div>
      <div class="my-btn">
        <el-button v-loading="loading" type="primary" @click="getData">转换</el-button>
      </div>
      <div class="my-input">
        <el-row>
          <!-- <el-col :span="6">行动代号：</el-col>
          <el-col :span="18">{{name}}</el-col>
          <el-col :span="6">执行时间：</el-col>
          <el-col :span="18">{{time}}</el-col>
          <el-col :span="6">机型</el-col>
          <el-col :span="18">{{warplane}}</el-col> -->
          <el-col :span="6">途经坐标：</el-col>
          <el-col :span="18">{{newPath}}</el-col>
          <el-col :span="6">涉及地点：</el-col>
          <el-col :span="18">{{newLocation}}</el-col>
          <el-col :span="6">需配合单位：</el-col>
          <el-col :span="18">{{newUnit}}</el-col>
        </el-row>
      </div>
    </div>
    <div class="body">
      <el-button @click="sendEmail">发送通知</el-button>
    </div>
    <div class="map">
      <div id="container"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.push-info {
  background-color: #fff;
  height: 100%;
  width: 100%;
  .header {
    display: flex;
    height: 250px;
    .my-input {
      width: 45%;
      .el-col {
        margin-top: 10px;
      }
    }
    .my-btn {
      width: 10%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .body {}
  .map {
    margin-top: 10px;
    height: 500px;
    width: 100%;
    // background-color: red;
    #container {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
