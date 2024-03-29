<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const roleType = ref('')
const userid = ref('')
const username = ref('')

const tableData = ref([])

const makeSureDel = async (row) => {
  const { data } = await axios.post('http://localhost:3000/workServer/del', row)
  if (data.code === 2) {
    ElMessage({
      message: '取消成功！',
      type: 'success',
    })
    getServerWork()
  }
}

const fixPassWord = async () => {
  const { data } = await axios.post('http://localhost:3000/user/fixpassword', {
    userid: userid.value,
  })
  if (data.code === 2) {
    ElMessage({
      message: '重置成功！',
      type: 'success',
    })
  }

}

const fixName = async () => {
  if (username.value === window.sessionStorage.getItem('username')) return ElMessage.error('名字无变化！')
  const { data } = await axios.post('http://localhost:3000/user/fixname', {
    userid: userid.value,
    username: username.value
  })
  if (data.code === 2) {
    ElMessage({
      message: '修改成功！',
      type: 'success',
    })
  }

}

const getServerWork = async () => {
  const { data } = await axios.post('http://localhost:3000/workServer/get', {
    userid:userid.value
  })
  if (data.code === 2) {
    tableData.value = []
    data.info.forEach(item => {
      let location = item.locationName + '-' + item.room
      tableData.value.push({
        ...item,
        location
      })
    })
  }

}

onMounted(async() => {
  roleType.value = window.sessionStorage.getItem('roleType')
  userid.value = window.sessionStorage.getItem('userid')
  username.value = window.sessionStorage.getItem('username')
  await getServerWork()
})


</script>

<template>
  <div class="info">
    <div class="left">
      <div class="every-row">
        <span>工号/手机号：</span>
        <span>{{ userid }}</span>
      </div>
      <div class="every-row">
        <span>姓名：</span>
        <el-input v-model="username" style="width: 240px" placeholder="请输入姓名" />
        <el-button @click="fixName">修改</el-button>
      </div>
      <div class="every-row">
        <span>密码：</span>
        <el-button link type="primary" size="small" @click="fixPassWord">重置密码</el-button>
      </div>
    </div>
    <div v-if="roleType === '3'" class="right">
      <h3 align="center"> 我的服务单 </h3>
      <el-table :data="tableData" style="width: 100%" border height="600">
        <el-table-column prop="server" label="服务商" width="80" />
        <el-table-column prop="location" label="地点" />
        <el-table-column prop="main" label="负责人" width="80" />
        <el-table-column fixed="right" label="操作" width="70">
          <template #default="scope">
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认取消吗" @confirm="makeSureDel(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">取消</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.info {
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    padding: 10px;
    width: calc(40% - 20px);
    height: 300px;
    background-color: #fff;
    .every-row {
      margin-top: 10px;
      display: flex;
      span {
        display: inline-block;
        line-height: 32px;
        width: 110px;
      }
    }
  }
  .right {
    margin-left: 10px;
    width: calc(60% - 10px);
    height: 300px;
    background-color: #fff;

  }
}
</style>
