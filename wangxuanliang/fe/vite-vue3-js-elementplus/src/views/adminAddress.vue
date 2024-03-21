<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AMapLoader from "@amap/amap-jsapi-loader"
import axios from 'axios'

const tableData = ref([
  {
    name: '沈阳航空航天大学',
    server: '移动',
    location: '123.408243,41.927417',
  },
  {
    name: '沈阳航空航天大学',
    server: '联通',
    location: '123.408243,41.927417',
  },
  {
    name: '沈阳航空航天大学',
    server: '电信',
    location: '123.408243,41.927417',
  },
  {
    name: '沈阳师范大学',
    server: '移动',
    location: '123.415582,41.908609',
  },
  {
    name: '沈阳师范大学',
    server: '电信',
    location: '123.415582,41.908609',
  },
])

let map = null

const showSelect = () => {}

onMounted(() => {
  AMapLoader.load({
    key: "72fb17f4455270a5b7463474e7b8c134", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then(async (AMap) => {
      map = new AMap.Map("container", {
        // 设置地图容器id
        viewMode: "2D", // 是否为3D地图模式
        zoom: 11, // 初始化地图级别
        center: [123.408243,41.927417],
      });
      const position = new AMap.LngLat(123.408243,41.927417); //Marker 经纬度
      const marker = new AMap.Marker({
        position: position,
        title: '沈阳航空航天大学'
      })
      marker.on("click", function (e) {
        console.log(e.target._originOpts)
        // alert("你点击了Marker")
      })
      map.add(marker);
      // const { data } = await axios.get('https://restapi.amap.com/v3/place/text?key=3f388fee9f84b98ebbfa46137f40926c&keywords=沈阳师范大学&types=&city=&children=1&offset=1&page=1&extensions=base')
      // console.log(data)

    })
    .catch((e) => {
      console.log(e);
    });
});

onUnmounted(() => {
  map?.destroy();
})


</script>

<template>
  <div class="admin-address">
    <div class="left">
      <div id="container"></div>
    </div>
    <div class="right">
      <el-row>
        <el-col :span="6">
          名称：
        </el-col>
        <el-col :span="18">
          沈阳航空航天大学
        </el-col>
        <el-col :span="6">
          坐标：
        </el-col>
        <el-col :span="18">
          123.408243,41.927417
        </el-col>
        <el-col :span="6">
          服务商：
        </el-col>
        <el-col :span="18">
          移动，联通，电信，
        </el-col>
      </el-row>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" border max-height="600">
          <el-table-column prop="name" label="地点名" />
          <el-table-column prop="server" label="服务商" />
          <el-table-column prop="location" label="坐标" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.admin-address {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  .left {
    width: 50%;
    height: 900px;
    #container {
      padding:0px;
      margin: 0px;
      width: 100%;
      height: 100%;
      // height: 800px;
    }
  }
  .right {
    padding: 10px;
    width: calc(50% - 20px);
    height: 900px;
  }
}
.el-col {
  margin-bottom: 20px;
}
</style>
