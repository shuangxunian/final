<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const userid = ref('')
const findData = ref('')
const tableData = ref([])
const allData = ref([])
const productList = ref([])
const CRMList = ref([])
const sellList = ref([])
const dialogAddSell = ref(false)
const addForm = ref ({
  productID: null,
  patientName: '',
  phone: '',
  optionNum: 0
})
const loading = ref(true)

// const recall = async function () {
//   const { data } = await axios.post('http://localhost:3000/sell/recall', {})
//   if (data.code === 4) return ElMessage.error(data.msg)
//   ElMessage({
    
//   })
// }

const getList = function () {
  tableData.value = []
  allData.value.forEach(item => {
    if (item.productLot.indexOf(findData.value) !== -1
    || item.name.indexOf(findData.value) !== -1
    || item.belong.indexOf(findData.value) !== -1
    || item.patientName.indexOf(findData.value) !== -1
    || item.phone.indexOf(findData.value) !== -1) {
      tableData.value.push(item)
    }
  })
}

const clearFrom = function () {
  addForm.value = {
    productID: null,
    patientName: '',
    phone: '',
    optionNum: 0
  }
}

const doNotAddSell = function () {
  clearFrom()
  dialogAddSell.value = false
}
const addSell = async function () {
  if (addForm.value.productID === null) return ElMessage.error('请选择药品')
  if (addForm.value.patientName === '') return ElMessage.error('请输入病人姓名')
  if (addForm.value.phone === '') return ElMessage.error('请输入病人手机号')
  if (addForm.value.optionNum === 0) return ElMessage.error('请输入出库数量')
  let product = {}
  for (let i = 0; i < productList.value.length; i++) {
    if (addForm.value.productID === productList.value[i].id) {
      product = productList.value[i]
      break
    }
    if (i === productList.value.length - 1) return ElMessage.error('此药品数据库不存在，请核实')
  }
  const { data } = await axios.post('http://localhost:3000/sell/add', {
    ...addForm.value,
    productid: product.id,
    productname: product.name,
    productbelong: product.belong,
    userID: userid.value
  })
  if (data.code === 4) return ElMessage.error(data.msg)
  ElMessage({
    message: '添加成功！',
    type: 'success',
  })
  doNotAddSell()
  getTableData()
}


const getProductList = async function () {
  const { data } = await axios.post('http://localhost:3000/product/allData', {})
  if (data.code === 2) {
    productList.value = []
    data.info.forEach(item => {
      productList.value.push({
        ...item,
        showName: item.name + '-' + item.belong
      })
    })
  }
  tableData.value = []
  sellList.value.forEach(item => {
    let name,belong
    productList.value.forEach(obj => {
      console.log(obj.id, item)
      if (item.productID === obj.id) {
        name = obj.name
        belong = obj.belong
      }
    })
    tableData.value.push({
      ...item,
      name,
      belong
    })
    allData.value = tableData.value
  })
  loading.value = false
}

const getSellList = async function () {
  const { data } = await axios.post('http://localhost:3000/sell/allData', {})
  if (data.code === 2) {
    sellList.value = data.info
  }
}

const getTableData = async function () {
  await getSellList()
  await getProductList()
}

onMounted(() => {
  userid.value = window.sessionStorage.getItem('id')
  getTableData()
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
        <el-button type="primary" @click="dialogAddSell = true">新建出库单</el-button>
      </div>
    </div>
    <div class="body">
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" max-height="600">
        <el-table-column prop="productLot" label="产品批号" width="300" />
        <el-table-column prop="name" label="药品名称" width="300">
          <template #default="scope">
            <span>{{ scope.row.name || '已删除' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="belong" label="所属厂家" width="300">
          <template #default="scope">
            <span>{{ scope.row.belong || '已删除' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="patientName" label="病人姓名" width="200" />
        <el-table-column prop="phone" label="病人电话" width="200" />
        <el-table-column prop="optionNum" label="出库量" />
      </el-table>
    </div>
    <el-dialog v-model="dialogAddSell" title="新建出库单" width="500">
      <el-form :model="addForm">
        <el-form-item label="出库药品" label-width="100">
          <el-select v-model="addForm.productID" filterable placeholder="请选择出库药品">
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.showName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="病人姓名" label-width="100">
          <el-input v-model="addForm.patientName" placeholder="请输入病人姓名"/>
        </el-form-item>
        <el-form-item label="病人电话" label-width="100">
          <el-input v-model="addForm.phone" placeholder="请输入病人电话"/>
        </el-form-item>
        <el-form-item label="出库数量" label-width="100">
          <el-input-number v-model="addForm.optionNum" :min="0" placeholder="请输入出库数量"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="doNotAddSell">取消</el-button>
          <el-button type="primary" @click="addSell">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

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
