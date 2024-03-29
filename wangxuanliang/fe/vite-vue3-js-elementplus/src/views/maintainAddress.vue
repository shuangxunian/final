<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AMapLoader from "@amap/amap-jsapi-loader"
import axios from 'axios'
import { ElMessage } from 'element-plus'

const belong = ref('')
const tableData = ref([])
const locationList = ref([])
const nowSelectLocation = ref({
  title: '--',
  location: '--',
  serverList: '--',
})
const formLabelWidth = ref(100)
const addNewLocationDialog = ref(false)
const form = ref({
  name: '',
  server: '',
  location: '',
})

let map = null
let AmapObj = null

const showSelect = () => {}
const getLocationList = async () => {
  const { data } = await axios.post('http://localhost:3000/location/allData', {})
  if (data.code === 2) {
    tableData.value = []
    data.info.forEach(item => {
      if (item.server === belong.value) {
        tableData.value.push(item)
      }
    })
  }
}

const getLocation = async () => {
  if (form.value.name === '') return ElMessage.error('请先输入地点！')
  const { data } = await axios.get(`https://restapi.amap.com/v3/place/text?key=3f388fee9f84b98ebbfa46137f40926c&keywords=${form.value.name}&types=&city=&children=1&offset=1&page=1&extensions=base`)
  if (data.pois.length) {
    form.value.location = data.pois[0].location
    ElMessage({
      message: '获取坐标成功！',
      type: 'success',
    })
  }
}

const makeSureDel = async (row) => {
  const { data } = await axios.post('http://localhost:3000/location/del', row)
  if (data.code ===2 ) {
    ElMessage({
      message: '删除成功！',
      type: 'success',
    })
    await getLocationList()
    for (let i = 0; i < tableData.value.length; i++) {
      if (tableData.value[i].name === form.value.name) break
      else if (i === tableData.value.length - 1) {
        map?.destroy()
        getAMap()
      }
    }
  }
}

const addLocation = async () => {
  if (form.value.name === '') return ElMessage.error('请输入地点！')
  if (form.value.location === '') return ElMessage.error('请重新获取坐标！')
  form.value.server = belong.value
  const { data } = await axios.post('http://localhost:3000/location/add', {
    ...form.value
  })
  if (data.code === 2) {
    ElMessage({
      message: '添加成功！',
      type: 'success',
    })
    for (let i = 0; i < tableData.value.length; i++) {
      if (tableData.value[i].name === form.value.name) break
      else if (i === tableData.value.length - 1) addMarker(form.value.name,getXY(form.value.location))
    }
    await getLocationList()
    addNewLocationDialog.value = false
  } else {
    ElMessage.error(data.msg)
  }
}

const getMap = async () => {
  const { data } = await axios.get('https://restapi.amap.com/v3/place/text?key=3f388fee9f84b98ebbfa46137f40926c&keywords=沈阳师范大学&types=&city=&children=1&offset=1&page=1&extensions=base')
  console.log(data.pois.name)
  console.log(data.pois.location)
}

const getXY = (str) => {
  const arr = str.split(',')
  return [Number(arr[0]),Number(arr[1])]
}

const addMarker = (title, xy) => {
  const position = new AmapObj.LngLat(xy[0],xy[1])
  const marker = new AmapObj.Marker({
    position: position,
    title
  })
  marker.on("click", function (e) {
    const obj = e.target._originOpts
    nowSelectLocation.value.title = obj.title
    nowSelectLocation.value.location = obj.position.lng + ',' + obj.position.lat
    let serverList = ''
    tableData.value.forEach(item => {
      if (item.name === obj.title) serverList += item.server + '，'
    })
    nowSelectLocation.value.serverList = serverList
  })
  map.add(marker)
}

const getMarker = async () => {
  const markerMap = {}
  tableData.value.forEach(item => {
    markerMap[item.name]=item.location
  })
  for (let i in markerMap) {
    addMarker(i,getXY(markerMap[i]))
  }
}

const clearForm = () => {
  form.value = {
    name: '',
    server: '',
    location: '',
  }
}

const getNowLocation = async () => {
  AmapObj.plugin('AMap.Geolocation', function() {
    let geolocation = new AmapObj.Geolocation({
      enableHighAccuracy: true, // 是否使用高精度定位，默认：true
      timeout: 10000, // 设置定位超时时间，默认：无穷大
      offset: [10, 20],  // 定位按钮的停靠位置的偏移量
      zoomToAccuracy: true,  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      position: 'RB' //  定位按钮的排放位置,  RB表示右下
    })

    geolocation.getCurrentPosition(function(status,result){
      if(status=='complete'){
        onComplete(result)
      }else{
        onError(result)
      }
    })

    function onComplete (data) {
      form.value.location = data.position.lng + ',' + data.position.lat
    }

    function onError (data) {}
  })
}

const getAMap = async () => {
  AMapLoader.load({
    key: "72fb17f4455270a5b7463474e7b8c134", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
    .then(async (AMap) => {
      AmapObj = AMap
      map = new AMap.Map("container", {
        // 设置地图容器id
        viewMode: "2D", // 是否为3D地图模式
        zoom: 11, // 初始化地图级别
        center: [123.408243,41.927417],
      })
      getMarker()
      
      // const position = new AMap.LngLat(123.408243,41.927417); //Marker 经纬度
      // const marker = new AMap.Marker({
      //   position: position,
      //   title: '沈阳航空航天大学'
      // })
      // marker.on("click", function (e) {
      //   nowSelectLocation.value.title = e.title
      //   nowSelectLocation.value.location = e.location
      // })
      // map.add(marker);
      // const { data } = await axios.get('https://restapi.amap.com/v3/place/text?key=3f388fee9f84b98ebbfa46137f40926c&keywords=沈阳师范大学&types=&city=&children=1&offset=1&page=1&extensions=base')
      // console.log(data)

    })
    .catch((e) => {
      console.log(e);
    });
}

onMounted(async () => {
  belong.value = window.sessionStorage.getItem('belong')
  await getLocationList()
  await getAMap()
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
      <h4 align="center" @click="getMap">当前选择点</h4>
      <el-row>
        <el-col :span="6">
          名称：
        </el-col>
        <el-col :span="18">
          {{ nowSelectLocation.title }}
        </el-col>
        <el-col :span="6">
          坐标：
        </el-col>
        <el-col :span="18">
          {{ nowSelectLocation.location }}
        </el-col>
      </el-row>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" border height="600">
          <el-table-column prop="name" label="地点名"  width="200"/>
          <el-table-column prop="location" label="坐标"  min-width="200"/>
          <el-table-column fixed="right" label="操作" width="60">
            <template #default="scope">
              <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
                <template #reference>
                  <el-button link type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="option">
        <el-button @click="addNewLocationDialog = true">新建服务点</el-button>
      </div>
    </div>


    <el-dialog v-model="addNewLocationDialog" title="新建服务点" width="500" @close="clearForm">
      <el-form :model="form">
        <el-form-item label="地点名" :label-width="formLabelWidth">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="坐标" :label-width="formLabelWidth">
          <el-input v-model="form.location" disabled/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="getNowLocation">获取当前坐标</el-button>
          <el-button v-if="form.location === ''" type="primary" @click="getLocation">获取坐标</el-button>
          <el-button v-else type="primary" @click="addLocation">创建</el-button>
        </div>
      </template>
    </el-dialog>
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
    .option {
      height: 70px;
      margin-top: 10px;
      line-height: 70px;
    }
  }
}
.el-col {
  margin-bottom: 20px;
}
</style>
