<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const addNewServerDialog = ref(false)
const form = ref({
  userid: window.sessionStorage.getItem('userid'),
  name: '',
  room: '',
  server: '',
  serverObj: '',
  phone: '',
})
const formLabelWidth = ref(100)
const options = ref([])

const clearForm = () => {
  form.value = {
    userid: window.sessionStorage.getItem('userid'),
    name: '',
    room: '',
    server: '',
    serverObj: '',
    phone: '',
  }
}

const findServer = () => {
  options.value = []
  tableData.value.forEach(item => {
    if (item.name === form.value.name) {
      options.value.push({
        label: item.server
      })
    }
  })
}

const getLocationList = async () => {
  const { data } = await axios.post('http://localhost:3000/location/allData', {})
  if (data.code === 2) {
    tableData.value = data.info
  }
}

const addServer = async() => {
  if (form.value.name === '') return ElMessage.error('请输入地点！')
  if (form.value.room === '') return ElMessage.error('请输入具体楼层！')
  if (form.value.server === '') {
    if (options.value.length) return ElMessage.error('请选择服务商！')
    else return ElMessage.error('此地暂无服务商提供服务！')
  }
  if (form.value.serverObj === '') return ElMessage.error('请填写联系人！')
  if (form.value.phone === '') return ElMessage.error('请输入联系人手机号！')
  const { data } = await axios.post('http://localhost:3000/workServer/add', form.value)
  if (data.code === 2) {
    ElMessage({
      message: '新建成功，稍后会员处理人员联系您！',
      type: 'success',
    })
    addNewServerDialog.value = false
  }
}


onMounted(async () => {
  await getLocationList()
})


</script>

<template>
  <div class="user-build">
    <div class="header">
      <el-button style="margin-left: 10px" @click="addNewServerDialog = true">申请服务</el-button>
    </div>
    <div class="body">
      <h4 align="center">地点与服务商</h4>
      <el-table :data="tableData" style="width: 100%" border height="600">
        <el-table-column prop="name" label="地点名"  width="200"/>
        <el-table-column prop="server" label="服务商" min-width="100" />
        <el-table-column prop="location" label="坐标"  width="200"/>
      </el-table>
    </div>

    <el-dialog v-model="addNewServerDialog" title="申请服务" width="500" @close="clearForm">
      <el-form :model="form">
        <el-form-item label="地点名" :label-width="formLabelWidth">
          <el-input @change="findServer" v-model="form.name"/>
        </el-form-item>
        <el-form-item label="具体楼层" :label-width="formLabelWidth">
          <el-input v-model="form.room"/>
        </el-form-item>
        <el-form-item label="服务商" :label-width="formLabelWidth">
          <el-select v-model="form.server" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" :label-width="formLabelWidth">
          <el-input v-model="form.serverObj"/>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth">
          <el-input v-model="form.phone"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addNewServerDialog = false">取消</el-button>
          <el-button type="primary" @click="addServer">创建</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.user-build {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
  }
  .body {
    height: 600px;
  }
}
</style>
