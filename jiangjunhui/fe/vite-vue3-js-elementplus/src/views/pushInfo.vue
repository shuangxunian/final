<script setup>
import { ref, computed,onMounted } from 'vue'
import AMapLoader from "@amap/amap-jsapi-loader"
import axios from 'axios'
import { ElMessage } from 'element-plus'


const textarea2 = ref('行动代号：猎鹰，执行时间：二四年三月三十日，机型：歼十，途经：长春、沈阳、大连、北京，需配合单位：长春航空局、沈阳航空局、大连航空局')
const name = ref('--')
const time = ref('--')
const warplane = ref('--')
const path = ref('--')
const unit = ref('--')
const markerList = ref([])
const locationList = ref([])
const unitList = ref([])

const getXY = (str) => {
  const arr = str.split(',')
  return [Number(arr[0]),Number(arr[1])]
}

const getMapPath = async () => {
  markerList.value = []
  unitList.value = unit.value.split('、')
  const pathList = []
  for (let i = 0; i < unitList.value.length; i++) {
    const { data } = await axios.get(`https://restapi.amap.com/v3/place/text?key=3f388fee9f84b98ebbfa46137f40926c&keywords=${unitList.value[i]}&types=&city=&children=1&offset=1&page=1&extensions=base`)
    const xy = getXY(data.pois[0].location)
    const position = new AmapObj.LngLat(xy[0],xy[1])
    pathList.push(position)
    const marker = new AmapObj.Marker({
      position: position,
      title: unitList.value[i]
    })
    markerList.value.push(marker)
  }
  map.add(markerList.value)
  const polyline = new AMap.Polyline({
    path: pathList,
    strokeWeight: 2, //线条宽度
    strokeColor: "blue", //线条颜色
    lineJoin: "round", //折线拐点连接处样式
  })
  map.add(polyline)
}

const getData = async() => {
  for (let i = 0; i < textarea2.value.length; i++) {
    if(textarea2.value[i] === '行' &&textarea2.value[i+1] === '动' &&textarea2.value[i+2] === '代' &&textarea2.value[i+3] === '号') {
      name.value = ''
      for(let j = i + 5; j < textarea2.value.length && textarea2.value[j] !== '，'; j++) {
        name.value += textarea2.value[j]
      }
    }
    if(textarea2.value[i] === '执' &&textarea2.value[i+1] === '行' &&textarea2.value[i+2] === '时' &&textarea2.value[i+3] === '间') {
      time.value = ''
      for(let j = i + 5; j < textarea2.value.length && textarea2.value[j] !== '，'; j++) {
        time.value += textarea2.value[j]
      }
    }
    if(textarea2.value[i] === '机' &&textarea2.value[i+1] === '型') {
      warplane.value = ''
      for(let j = i + 3; j < textarea2.value.length && textarea2.value[j] !== '，'; j++) {
        warplane.value += textarea2.value[j]
      }
    }
    if(textarea2.value[i] === '途' &&textarea2.value[i+1] === '经') {
      path.value = ''
      for(let j = i + 3; j < textarea2.value.length && textarea2.value[j] !== '，'; j++) {
        path.value += textarea2.value[j]
      }
    }
    if(textarea2.value[i] === '需' &&textarea2.value[i+1] === '配' &&textarea2.value[i+2] === '合' &&textarea2.value[i+3] === '单'&&textarea2.value[i+4] === '位') {
      unit.value = ''
      for(let j = i + 6; j < textarea2.value.length && textarea2.value[j] !== '，'; j++) {
        unit.value += textarea2.value[j]
      }
    }
  }
  getMapPath()
}

const sendEmail = async() => {
  if (unitList.value.length === 0) return ElMessage.error('当前无单位需通知！')
  const { data } = await axios.post('http://localhost:3000/option/send', {
    time: time.value,
    name: name.value,
    warplane: warplane.value,
    data: unitList.value
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
        <el-button type="primary" @click="getData">转换</el-button>
      </div>
      <div class="my-input">
        <el-row>
          <el-col :span="6">行动代号：</el-col>
          <el-col :span="18">{{name}}</el-col>
          <el-col :span="6">执行时间：</el-col>
          <el-col :span="18">{{time}}</el-col>
          <el-col :span="6">机型</el-col>
          <el-col :span="18">{{warplane}}</el-col>
          <el-col :span="6">途经：</el-col>
          <el-col :span="18">{{path}}</el-col>
          <el-col :span="6">需配合单位：</el-col>
          <el-col :span="18">{{unit}}</el-col>
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
