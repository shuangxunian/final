<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const knowList = ref([])
const testList = ref([])
const userid = ref('')
const userList = ref([])
const formLabelWidth = ref(100)
const addMyTestDialog = ref(false)
const testForm = ref({
  userid: '',
  testid: '',
})
const sysTestType = ref(false)

const addUserTest = async () => {
  const { data } = await axios.post('http://localhost:3000/mytest/add',testForm.value)
  if (data.code === 2) {
    ElMessage.success('添加成功')
    await getAllTestList()
    addMyTestDialog.value = false
  }
}
const getUserList = async () => {
  const { data } = await axios.post('http://localhost:3000/user/allData',{})
  if (data.code === 2) {
    userList.value = []
    data.body.forEach(item => {
      if (item.master === userid.value) {
        userList.value.push(item)
      }
    })
  }
}

const getAllTestList = async () => {
  const { data } = await axios.post('http://localhost:3000/mytest/allData')
  if (data.code === 2) {
    tableData.value = []
    data.body.forEach(item => {
      for (let i = 0; i < userList.value.length; i++) {
        if (item.userid === userList.value[i].id) {
          item.username = userList.value[i].name
          break
        }
      }
      for (let i = 0; i < testList.value.length; i++) {
        if (item.testid === testList.value[i].id) {
          item.testname = testList.value[i].name
          item.know = testList.value[i].know
          item.questionList = testList.value[i].questionList
          break
        }
      }
      tableData.value.push(item)
    })
  }
}


const getKnowList = async () => {
  const { data } = await axios.post('http://localhost:3000/know/allData',{})
  if (data.code === 2) {
    knowList.value = data.body
  }
}


const getTestList = async () => {
  const { data } = await axios.post('http://localhost:3000/test/allData')
  if (data.code === 2) {
    testList.value = data.body
    const knowMap = {}
    for (let i = 0; i < knowList.value.length; i++) {
      knowMap[knowList.value[i].id] = knowList.value[i].name
    }
    for (let i = 0; i < testList.value.length; i++) {
      let knowArr = testList.value[i].knowStr.split(',')
      let str = ''
      knowArr.forEach(item => {
        str += knowMap[item] + ','
      })
      testList.value[i].know = str
      testList.value[i].questionList = testList.value[i].questionStr.split(',')

    }
    // tableData.value = testList.value
  }
}

onMounted(async() => {
  userid.value = window.sessionStorage.getItem('id')
  sysTestType.value = window.sessionStorage.getItem('sysTestType') === '1'
  await getUserList()
  await getKnowList()
  await getTestList()
  await getAllTestList()
})




</script>

<template>
  <div class="admin-test">
    <div class="header">
      <el-button :disabled="sysTestType" type="primary" @click="addMyTestDialog = true">新建考试</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="username" label="考试人" width="180" />
        <el-table-column prop="testname" label="考试名称" width="180" />
        <el-table-column prop="know" label="涉及到的知识点" />
        <el-table-column prop="course" label="成绩" width="100">
          <template #default="scope">
            <el-tag v-if="!scope.row.course" type="danger">未考试</el-tag>
            <el-tag v-else type="success">{{scope.row.course}} / {{scope.row.questionList.length}}</el-tag>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <el-dialog v-model="addMyTestDialog" title="新建考试" width="500">
      <el-form :model="testForm">
        <el-form-item label="考试人" :label-width="formLabelWidth" disabled>
          <el-select v-model="testForm.userid" placeholder="请选择" style="width: 240px">
            <el-option
              v-for="item in userList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <!-- <el-input v-model="addUserForm.id" disabled/> -->
        </el-form-item>
        <el-form-item label="试卷" :label-width="formLabelWidth">
          <el-select v-model="testForm.testid" placeholder="请选择" style="width: 240px">
            <el-option
              v-for="item in testList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editUserDialog = false">取消</el-button>
          <el-button type="primary" @click="addUserTest">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.admin-test {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
    width: calc(100% - 40px);
    padding: 0 20px;
  }
  .table {
    height: 600px;
    width: 100%;
  }
  .form {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, 0);
  }
}
</style>
