<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const findData = ref('')
const tableData = ref([
  {
    username: 'zhangsan',
    date: '2024-3-2 12:06:00',
    option: '入库',
    optionid: '11001',
    productLot: "20231201AA",
    name: '健胃消食片',
    belong: '江中',
    optionNum: 10
  },
])
const productList = ref([])
const userList = ref([])
const optionList = ref([])


const getProductList = async function () {
  const { data } = await axios.post('http://localhost:3000/product/allData', {})
  if (data.code === 2) {
    productList.value = data.info
  }
}
const getUserList = async function () {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    userList.value = data.info
  }
}
const getOptionList = async function () {
  const { data } = await axios.post('http://localhost:3000/myOption/allData', {})
  if (data.code === 2) {
    optionList.value = []
    const userMap = {}
    const productMap = {}
    userList.value.forEach(item => {
      userMap[item.id] = item
    })
    productList.value.forEach(item => {
      productMap[item.id] = item
    })
    data.info.forEach(item => {
      console.log(item.productid)
      optionList.value.push({
        optionid: item.id,
        username: userMap[item.userid].name,
        date: getDate(item.id),
        option: item.optionType,
        name: item.productname || (item.productid ? productMap[item.productid].name : ''),
        belong: item.productbelong || (item.productid ? productMap[item.productid].belong : ''),
        ...item,
      })
    })
    tableData.value = optionList.value
  }
}
const getDate = function (timestampStr) {
  const time = new Date(parseInt(timestampStr))
  return time.toLocaleString()
}

onMounted(async() => {
  await getProductList()
  await getUserList()
  await getOptionList()
})

</script>

<template>
  <div class="product">
    <div class="header">
      <div class="left">
        <el-input v-model="findData" style="width: 240px" placeholder="请输入内容" />
        <el-button @click="getList">筛选</el-button>
      </div>
      <div class="right">
        <el-button type="danger" @click="addProduct">紧急召回</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" max-height="600">
        <el-table-column prop="optionid" label="操作id" width="150" />
        <el-table-column prop="username" label="用户" width="180" />
        <el-table-column prop="date" label="操作时间" width="180" />
        <el-table-column prop="option" label="出入库" width="100" />
        <el-table-column prop="productLot" label="产品批号" width="200" />
        <el-table-column prop="name" label="药品名称" />
        <el-table-column prop="belong" label="所属厂家" width="100" />
        <el-table-column prop="optionNum" label="操作数量"/>
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.product {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    line-height: 60px;
  }
  .body {
    padding: 0 10px;
  }
}
</style>
