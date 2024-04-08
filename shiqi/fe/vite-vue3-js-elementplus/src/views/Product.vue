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
const loading = ref(true)
const userid = ref('')

const getList = function () {}

const refreshAddForm = function () {
  addForm.value.id = ''
  addForm.value.name = ''
  addForm.value.belong = ''
}

const addProduct = async function () {
  if (addForm.value.name === '') return ElMessage.error('请输入药品名称')
  if (addForm.value.belong === '') return ElMessage.error('请输入药品所属厂家')
  const { data } = await axios.post('http://localhost:3000/product/add', {
    ...addForm.value,
    userid: userid.value
  })
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
  loading.value = false
}

const editClick = async function (scoped) {
  console.log(scoped.$index)
}
// const delClick = async function (scoped) {
//   console.log(scoped.$index)
// }
const makeSureDel = async function (row) {
  if (row.haveNum !== 0) return ElMessage.error('当前库存不为0，无法删除！')
  const { data } = await axios.post('http://localhost:3000/product/del', {
    ...row,
    userid: userid.value
  })
  if (data.code === 4) return ElMessage.error(data.msg)
  ElMessage({
    message: '删除成功！',
    type: 'success',
  })
  getTableData()
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
        <el-button type="primary" @click="dialogAddProduct = true">添加产品</el-button>
      </div>
    </div>
    <div class="body">
      <el-table v-loading="loading" :data="tableData" border style="width: 100%" max-height="600" empty-text="暂无数据">
        <el-table-column prop="name" label="药品名称" width="300" />
        <el-table-column prop="belong" label="所属厂家" width="300" />
        <el-table-column prop="haveNum" label="当前库存" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scoped">
            <el-link :underline="false" type="primary" @click="editClick(scoped.row)">编辑</el-link>
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scoped.row)">
              <template #reference>
                <el-button link type="danger" >删除</el-button>
              </template>
            </el-popconfirm>
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
