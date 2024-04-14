<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { ElMessage } from 'element-plus'
const axios = inject('$axios')

const input = ref('')
const tableData = ref([])
const showData = ref([])
const blackList = ref([])
const allProductList = ref([])
const userList = ref([])

async function getAllBlackList () {
  const { data } = await axios.post('/black/adminAll', {})
  if (data.code === 2) {
    blackList.value = data.body
    tableData.value = data.body
  }
}

async function getAllProductList () {
  const { data } = await axios.post('/product/allData')
  allProductList.value = data.body
}

async function getUserList () {
  const { data } = await axios.post('/user/allData')
  userList.value = data.body
  tableData.value.forEach(item => {
    const user = userList.value.find(user => user.id === item.userid)
    item.username = user.username
    const product = allProductList.value.find(product => product.id === item.productid)
    item.productName = product.productName
    item.brand = product.brand
  })
  showData.value = tableData.value
}

function findData() {
  if(input.value === '') {
    showData.value = tableData.value
  } else {
    showData.value = tableData.value.filter(item => item.username.includes(input.value) || item.productName.includes(input.value))
  }
}

async function getTableList () {
  await getAllBlackList()
  await getAllProductList()
  await getUserList()
}



onMounted(async() => {
  await getTableList()
})

</script>

<template>
  <div class="user">
    <div class="header">
      <div class="options">
        <el-input v-model="input" style="width: 240px;height: 32px;" placeholder="请输入筛选内容" />
        <el-button type="success" @click="findData">查找</el-button>
      </div>
    </div>
    <div class="body">
      <div class="table">
        <el-table :data="showData" style="width: 100%" height="600">
          <el-table-column prop="userid" label="用户id"/>
          <el-table-column prop="username" label="用户名"/>
          <el-table-column prop="productid" label="产品id"/>
          <el-table-column prop="productName" label="产品名"/>
          <el-table-column prop="brand" label="所属品牌"/>
        </el-table>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.user {
  height: calc(100% - 10px);
  margin-top: 10px;
  .header {
    height: 40px;
    .options {
      width: calc(100% - 20px);
      margin-left: 10px;
      line-height: 40px;
      height: 40px;
      background-color: #fff;
      display: flex;
      align-items: center;
    }
  }
  .body {
    .table {
      max-height: calc(100% - 60px);
      margin: 10px;
      background-color: #fff;
    }
  }
}
</style>
