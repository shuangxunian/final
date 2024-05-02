<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const userid = ref('')
const tableData = ref([])
const userList = ref([])
const talkList = ref([])
const formLabelWidth = ref(100)
const textDialog = ref(false)
const text = ref('')

const refreshForm = () => {
  text.value = ''
}

function formatDate(timestamp) {
  const date = new Date(Number(timestamp));
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const addTalk = async() => {
  if (text.value === '') {
    ElMessage.error('请输入回复内容')
    return
  }
  const { data } = await axios.post('http://localhost:3000/talk/add', {
    userid: userid.value,
    text: text.value
  })
  if (data.code === 2) {
    ElMessage.success('发表成功')
    text.value = ''
    textDialog.value = false
    await getTalkList()
  }
}

const getUserList = async() => {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    userList.value = data.body
  }
}

const getTalkList = async() => {
  const { data } = await axios.post('http://localhost:3000/talk/allData', {})
  if (data.code === 2) {
    talkList.value = data.body
    const userMap = {}
    userList.value.forEach(item => {
      userMap[item.id] = item.username
    })
    talkList.value.forEach(item => {
      item.name = userMap[item.userid]
    })
    // console.log(talkList.value)
    tableData.value = talkList.value
  }
}

onMounted(async() => {
  userid.value = window.sessionStorage.getItem('id')
  await getUserList()
  await getTalkList()
})

</script>

<template>
  <div class="admin-home">
    <!-- <div class="header">
      <el-button style="margin-left: 10px" type="primary" @click="addUserDialog = true">新建用户</el-button>
    </div> -->
    <div class="body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="userid" label="手机号"/>
        <el-table-column prop="name" label="用户名"/>
        <el-table-column prop="id" label="时间">
          <template #default="scope">
            {{ formatDate(scope.row.id) }}
          </template>
        </el-table-column>
        <el-table-column prop="text" label="评论内容"/>
        <el-table-column fixed="right" label="操作" width="180">
          <el-button link type="primary" size="small" @click="textDialog = true">回复</el-button>
          <!-- <template #default="scope">
            <el-button link type="primary" size="small" @click="textDialog">回复</el-button>
          </template> -->
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="textDialog" title="评论回复" width="500" @close="refreshForm">
      <el-form>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input v-model="text" placeholder="请输入回复内容"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="textDialog = false">取消</el-button>
          <el-button type="primary" @click="addTalk">回复</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.admin-home {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
  }
  .body {
    height: 700px;
    width: calc(100% - 20px);
    padding: 10px;
  }
}
</style>
