<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const userid = ref('')
const findData = ref('')
const tableData = ref([])
const productList = ref([])
const CRMList = ref([])
const dialogAddCRM = ref(false)
const recallDialog = ref(false)
const recallFormId = ref('')
const addForm = ref({
  productID: null,
  productLot: '',
  buildDate: '',
  endDate: '',
  optionNum: 0
})
const loading = ref(true)

const refreshAddForm = function () {
  addForm.value.productID = null
  addForm.value.productLot = ''
  addForm.value.buildDate = ''
  addForm.value.endDate = ''
  addForm.value.optionNum = 0
}

const doNotAddCRM = function () {
  refreshAddForm()
  dialogAddCRM.value = false
}

const addCRM = async function () {
  // console.log(addForm.value)
  if (addForm.value.productLot === '') return ElMessage.error('请输入产品批号')
  if (addForm.value.productID === null) return ElMessage.error('请选择药品')
  if (addForm.value.buildDate === '') return ElMessage.error('请选择生产日期')
  if (addForm.value.endDate === '') return ElMessage.error('请选择截止日期')
  if (addForm.value.optionNum === 0) return ElMessage.error('请选择入库数量')
  let product = {}
  for (let i = 0; i < productList.value.length; i++) {
    if (addForm.value.productID === productList.value[i].id) {
      product = productList.value[i]
      break
    }
    if (i === productList.value.length - 1) return ElMessage.error('此药品数据库不存在，请核实')
  }
  const { data } = await axios.post('http://localhost:3000/crm/add', {
    ...addForm.value,
    productbelong: product.belong,
    productid: product.id,
    productname: product.name,
    userid: userid.value
  })
  if (data.code === 4) return ElMessage.error(data.msg)
  ElMessage({
    message: '添加成功！',
    type: 'success',
  })
  doNotAddCRM()
  getTableData()
}

const getCRMList = async function () {
  const { data } = await axios.post('http://localhost:3000/crm/allData', {})
  if (data.code === 2) {
    CRMList.value = []
    const productMap = {}
    productList.value.forEach(item => {
      productMap[item.id] = item
    })
    data.info.forEach(item => {
      CRMList.value.push({
        ...item,
        name: productMap[item.productID].name,
        belong: productMap[item.productID].belong
      })
    })
    tableData.value = CRMList.value
  }
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
  // tableData.value = []
  // CRMList.value.forEach(item => {
  //   let name,belong
  //   productList.value.forEach(obj => {
  //     if (item.productID === obj.id) {
  //       name = obj.name
  //       belong = obj.belong
  //     }
  //   })
  //   tableData.value.push({
  //     ...item,
  //     name,
  //     belong
  //   })
  // })
  loading.value = false
}

const getCSV = async() => {
  const { data } = await axios.post('http://localhost:3000/sell/allData', {})
  const userList = [
    ['姓名', '电话']
  ]
  data.info.forEach(item => {
    console.log(item)
    if (item.productLot === recallFormId.value) {
      userList.push([
        item.patientName,
        item.phone
      ])
    }
  })
  // 构造数据字符，换行需要用\r\n
  let CsvString = userList.map(data => data.join(',')).join('\r\n');
  // 加上 CSV 文件头标识
  CsvString = 'data:application/vnd.ms-excel;charset=utf-8,\uFEFF' + encodeURIComponent(CsvString);
  // 通过创建a标签下载
  const link = document.createElement('a');
  link.href = CsvString;
  // 对下载的文件命名
  link.download = `紧急召回联系人.csv`;
  // 模拟点击下载
  link.click();
  // 移除a标签
  link.remove();
  await axios.post('http://localhost:3000/sell/del', {
    id: recallFormId.value
  })
}

const getTableData = async function () {
  await getProductList()
  await getCRMList()
}

const getList = async function () {}

const handleClick = async function () {}

const getDate = function (timestampStr) {
  console.log(timestampStr)
  const time = new Date(parseInt(timestampStr))
  return time.toLocaleString()
}

onMounted(async() => {
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
        <el-button type="primary" @click="dialogAddCRM = true">新建入库单</el-button>
        <el-button type="danger" @click="recallDialog = true">紧急召回</el-button>
      </div>
    </div>
    <div class="body">
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" max-height="600">
        <el-table-column prop="date" label="操作时间" width="200">
          <template #default="scope">
            {{ getDate(scope.row.id) }}
          </template>
        </el-table-column>
        <el-table-column prop="productLot" label="产品批号" width="100" />
        <el-table-column prop="name" label="药品名称" width="200" />
        <el-table-column prop="belong" label="所属厂家" width="200" />
        <el-table-column prop="buildDate" label="生产日期" width="200" />
        <el-table-column prop="endDate" label="截止日期" width="200" />
        <el-table-column prop="optionNum" label="数量新增" width="100"/>
      </el-table>
    </div>
    <el-dialog v-model="dialogAddCRM" title="新建入库单" width="500">
      <el-form :model="addForm">
        <el-form-item label="产品批号" label-width="100">
          <el-input v-model="addForm.productLot" placeholder="请输入产品批号"/>
        </el-form-item>
        <el-form-item label="入库药品" label-width="100">
          <el-select v-model="addForm.productID" filterable placeholder="请选择入库药品">
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.showName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生产日期" label-width="100">
          <el-date-picker
            v-model="addForm.buildDate"
            type="date"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            placeholder="请输入生产日期"
          />
        </el-form-item>
        <el-form-item label="截止日期" label-width="100">
          <el-date-picker
            v-model="addForm.endDate"
            type="date"
            format="YYYY/MM/DD"
            value-format="YYYY-MM-DD"
            placeholder="请输入截止日期"
          />
        </el-form-item>
        <el-form-item label="入库数量" label-width="100">
          <el-input-number v-model="addForm.optionNum" :min="0" placeholder="请输入入库数量"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="doNotAddCRM">取消</el-button>
          <el-button type="primary" @click="addCRM">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="recallDialog" title="紧急召回" width="500">
      <el-form>
        <el-form-item label="问题批次">
          <el-select v-model="recallFormId" placeholder="请选择产品批号">
            <el-option v-for="item in CRMList" :key="item.productLot" :label="item.productLot" :value="item.productLot" />
            <!-- <el-option label="Zone No.1" value="shanghai" />
            <el-option label="Zone No.2" value="beijing" /> -->
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="recallDialog = false">取消</el-button>
          <el-button type="primary" @click="getCSV">召回</el-button>
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
