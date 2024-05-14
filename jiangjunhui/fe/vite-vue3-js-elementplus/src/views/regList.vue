<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const infoList = ref([])
const input = ref('')
const form = ref({
  id: '',
  name: '',
  reg: '',
  type: ''
})
const editUserDialog = ref(false)
const addUserDialog = ref(false)
const formLabelWidth = '140px'
const options = ref([
  {
    value: '0',
    label: '英文坐标正则'
  },
  {
    value: '1',
    label: '中文坐标正则'
  },
  {
    value: '2',
    label: '汉字正则'
  }
])

const refreshForm = () => {
  form.value = {
    id: '',
    name: '',
    reg: '',
    type: ''
  }
}

const getData = async () => {
  if (input.value === '') {
    tableData.value = infoList.value
  } else {
    tableData.value = []
    infoList.value.forEach(item => {
      if (item.name.includes(input.value) || item.id.includes(input.value)) {
        tableData.value.push(item)
      }
    })
  }
}


const addUser = async function() {
  const { data } = await axios.post('http://localhost:3000/reg/add', form.value)
  if (data.code === 2) {
    ElMessage.success('添加成功')
    addUserDialog.value = false
    await getInfoList()
  } else {
    ElMessage.error(data.msg)
  }
}

const getInfoList = async () => {
  const { data } = await axios.post('http://localhost:3000/reg/allData', {})
  if (data.code === 2) {
    infoList.value = data.body
    tableData.value = data.body
  }
}

const makeSureDel = async function(row) {
  const { data } = await axios.post('http://localhost:3000/reg/del', row)
  if (data.code === 2) {
    ElMessage({
      message: '删除成功！',
      type: 'success',
    })
    await getInfoList()
  }
}

const editUser = async function() {
  const { data } = await axios.post('http://localhost:3000/reg/edit', form.value)
  if (data.code === 2) {
    ElMessage.success('编辑成功')
    editUserDialog.value = false
    await getInfoList()
  }
}

const editData = async function(row) {
  form.value = row
  editUserDialog.value = true
}

const timestampToDateTime = (timestamp) => {
  if (!timestamp) {
    return ''
  }
  let date = new Date(Number(timestamp))
  let year = date.getFullYear()
  let month = String(date.getMonth() + 1).padStart(2, '0')
  let day = String(date.getDate()).padStart(2, '0')
  let hours = String(date.getHours()).padStart(2, '0')
  let minutes = String(date.getMinutes()).padStart(2, '0')
  let seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

onMounted(async () => {
  getInfoList()
})

</script>

<template>
  <div class="option-list">
    <div class="header">
      <div class="btn">
        <el-button style="margin-top:20px" type="primary" @click="addUserDialog = true">添加规则</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%" border height="500">
        <el-table-column prop="id" label="添加时间" width="240" >
          <template #default="scope">
            {{ timestampToDateTime(scope.row.id) }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="规则名称" width="160" />
        <el-table-column prop="reg" label="规则详情"  />
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="editData(scope.row)">编辑</el-button>
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <el-dialog v-model="addUserDialog" title="添加规则" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="规则名称" :label-width="formLabelWidth">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="规则详情" :label-width="formLabelWidth">
          <el-input v-model="form.reg"/>
        </el-form-item>
        <el-form-item label="所属类别" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addUserDialog = false">取消</el-button>
          <el-button type="primary" @click="addUser">添加</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editUserDialog" title="编辑规则" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="规则名称" :label-width="formLabelWidth">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="规则详情" :label-width="formLabelWidth">
          <el-input v-model="form.reg"/>
        </el-form-item>
        <el-form-item label="所属类别" :label-width="formLabelWidth">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addUserDialog = false">取消</el-button>
          <el-button type="primary" @click="editUser">编辑</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.option-list {

  background-color: #fff;
  height: 100%;
  width: 100%;
  .header {
    height: 70px;
    display: flex;
    .input {
      width: 300px;
      margin-left: 20px;
    }
    .btn {
      margin-left: 20px;
    }
  }
}
</style>
