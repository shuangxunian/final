<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const findData = ref('')
const dialogAddProduct = ref(false)
const tableData = ref([])
const addForm = ref({
  name: '',
  belong: ''
})


// {
//   name: '健胃消食片',
//   belong: '江中',
//   haveNum: 0
// },
// {
//   name: '健胃消食片',
//   belong: '顺势',
//   haveNum: 0
// },
// {
//   name: '感冒灵颗粒',
//   belong: '999',
//   haveNum: 0
// },
// {
//   name: '复方感冒灵颗粒',
//   belong: '新感林',
//   haveNum: 0
// },


const getList = function () {}

const refreshAddForm = function () {
  addForm.value.id = ''
  addForm.value.name = ''
  addForm.value.belong = ''
}

const addProduct = async function () {
  if (addForm.value.name === '') return ElMessage.error('请输入药品名称')
  if (addForm.value.belong === '') return ElMessage.error('请输入药品所属厂家')
  const { data } = await axios.post('http://localhost:3000/product/add', addForm.value)
  if (data.code === 4) return ElMessage.error(data.msg)
  ElMessage({
    message: '添加成功！',
    type: 'success',
  })
  refreshAddForm()
  dialogAddProduct.value = false
  getTableData()
}

const doNotAddProduct = function () {
  refreshAddForm()
  dialogAddProduct.value = false
}

const getTableData = async function () {
  const { data } = await axios.post('http://localhost:3000/product/allData', {})
  if (data.code === 2) {
    tableData.value = data.info
  }
}

const editClick = async function (scoped) {
  console.log(scoped.$index)
}
const delClick = async function (scoped) {
  console.log(scoped.$index)
}

onMounted(async() => {
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
        <el-button type="primary" @click="dialogAddProduct = true">添加产品</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" max-height="600" empty-text="暂无数据">
        <el-table-column prop="name" label="药品名称" width="300" />
        <el-table-column prop="belong" label="所属厂家" width="300" />
        <el-table-column prop="haveNum" label="当前库存" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scoped">
            <el-link :underline="false" type="primary" @click="editClick(scoped)">编辑</el-link>
            <el-link :underline="false" type="danger" @click="delClick(scoped)">编辑</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogAddProduct" title="添加/修改产品" width="500">
      <el-form :model="addForm">
        <el-form-item label="药品id" label-width="100">
          <el-input v-model="addForm.id" placeholder="系统自动生成" disabled/>
        </el-form-item>
        <el-form-item label="药品名称" label-width="100">
          <el-input v-model="addForm.name" placeholder="请输入药品名称"/>
        </el-form-item>
        <el-form-item label="所属厂家" label-width="100">
          <el-input v-model="addForm.belong" placeholder="请输入所属厂家"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="doNotAddProduct">取消</el-button>
          <el-button type="primary" @click="addProduct">
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
    .el-link {
      margin-right: 8px;
    }
  }
}
</style>
