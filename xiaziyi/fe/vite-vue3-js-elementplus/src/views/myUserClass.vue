<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const knowList = ref([])
const myClassList = ref([])
const userList = ref([])
const classList = ref([])
const addClassDialog = ref(false)
const editClassDialog = ref(false)
const addClassForm = ref({
  name: '',
  knowID: null,
  url: '',
  testID: null
})
const formLabelWidth = ref(100)
const userid = ref('')

const addClass = async () => {}
const editClass = async (row) => {
  // console.log(row)
  addClassForm.value.name = row.name
  addClassForm.value.knowID = row.knowID
  addClassForm.value.url = row.url
  addClassForm.value.testID = row.testID
  editClassDialog.value = true
}
const delClass = async () => {}
const makeSureDel = async () => {}
const clearForm = () => {
  addClassForm.value = {
    name: '',
    knowID: null,
    url: '',
    testID: null
  }
}
const dontAddClass = () => {
  addClassDialog.value = false
  clearForm()
}
const trueAddClass = async () => {
  if (addClassForm.value.name === '') return ElMessage.error('请输入课程名！')
  if (addClassForm.value.knowID === '') return ElMessage.error('请选择知识点！')
  if (addClassForm.value.url === '') return ElMessage.error('请输入课程关联文档！')
  // if (addClassForm.value.testID === '') return ElMessage.error('请选择考试！')
  editClassDialog.value = false
  clearForm()
}

const beginStudy = async (row) => {
  const { data } = await axios.post('http://localhost:3000/myclass/edit',{
    id: row.id,
    status: '在学'
  })
  if (data.code === 2) {
    getMyClass()
  }
}

const endStudy = async (row) => {
  const { data } = await axios.post('http://localhost:3000/myclass/edit',{
    id: row.id,
    status: '学完'
  })
  if (data.code === 2) {
    getMyClass()
  }
  // for(let i = 0; i < tableData.value.length; i++) {
  //   if (tableData.value[i].id === row.id) {
  //     tableData.value[i].type = 2
  //     tableData.value[i].typeText = '学完'
  //   }
  // }
}


const getTableData = async () => {}

const getKnowList = async () => {
  const { data } = await axios.post('http://localhost:3000/know/allData',{})
  if (data.code === 2) {
    knowList.value = data.body
  }
}

const getClassList = async () => {
  const { data } = await axios.post('http://localhost:3000/class/allData',{})
  if (data.code === 2) {
    classList.value = data.body
    const knowMap = {}
    for (let i = 0; i <knowList.value.length; i++) {
      knowMap[knowList.value[i].id] = knowList.value[i].name
    }
    for (let i = 0; i <classList.value.length; i++) {
      classList.value[i].know = knowMap[classList.value[i].knowID] || '--'
    }
  }
}

const getMyClass = async () => {
  const { data } = await axios.post('http://localhost:3000/myclass/allData',{})

  if (data.code === 2) {
    const myUserMap = {}
    userList.value.forEach(user => {
      if (user.master === userid.value) {
        myUserMap[user.id] = user
      }
    })
    console.log(myUserMap)
    myClassList.value = data.body
    tableData.value = []
    for (let i = 0; i <myClassList.value.length; i++) {
      if (myUserMap[myClassList.value[i].userid]) {
        myClassList.value[i].username = myUserMap[myClassList.value[i].userid].name
        for (let j = 0; j <classList.value.length; j++) {
          if (myClassList.value[i].classid === classList.value[j].id) {
            console.log(classList.value[j])
            myClassList.value[i].name = classList.value[j].name
            myClassList.value[i].url = classList.value[j].url
            myClassList.value[i].knowID = classList.value[j].knowID
            myClassList.value[i].know = classList.value[j].know
          }
        }
      }
    }
    tableData.value = myClassList.value
  }
}

const getUserList = async () => {
  const { data } = await axios.post('http://localhost:3000/user/allData',{})
  if (data.code === 2) {
    userList.value = data.body
  }
}

onMounted(async() => {
  userid.value = window.sessionStorage.getItem('id')
  await getKnowList()
  await getClassList()
  await getUserList()
  await getMyClass()
  // getTableData()
})


</script>

<template>
  <div class="admin-class">
    <div class="header"></div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%" height="800">
        <el-table-column prop="username" label="员工姓名" width="180" />
        <el-table-column prop="name" label="课程名称" />
        <el-table-column prop="status" label="当前状态" width="100" />
        <el-table-column prop="know" label="知识点" width="180" />
      </el-table>
    </div>

    <el-dialog v-model="addClassDialog" title="添加课程" width="500">
      <el-form :model="addClassForm">
        <el-form-item label="课程名称" :label-width="formLabelWidth">
          <el-input v-model="addClassForm.name" />
        </el-form-item>
        <el-form-item label="所关联知识点" :label-width="formLabelWidth">
          <el-select v-model="addClassForm.knowID" placeholder="请选择">
            <el-option
              v-for="item in knowList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程文档" :label-width="formLabelWidth">
          <el-input v-model="addClassForm.url" />
        </el-form-item>
        <el-form-item label="关联考试" :label-width="formLabelWidth">
          <el-select v-model="addClassForm.knowID" placeholder="请选择">
            <el-option
              v-for="item in knowList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dontAddClass">取消</el-button>
          <el-button type="primary" @click="trueAddClass">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editClassDialog" title="编辑课程" width="500" @close="clearForm">
      <el-form :model="addClassForm">
        <el-form-item label="课程名称" :label-width="formLabelWidth">
          <el-input v-model="addClassForm.name" />
        </el-form-item>
        <el-form-item label="所关联知识点" :label-width="formLabelWidth">
          <el-select v-model="addClassForm.knowID" placeholder="请选择">
            <el-option
              v-for="item in knowList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程文档" :label-width="formLabelWidth">
          <el-input v-model="addClassForm.url" />
        </el-form-item>
        <el-form-item label="关联考试" :label-width="formLabelWidth">
          <el-select v-model="addClassForm.knowID" placeholder="请选择">
            <el-option
              v-for="item in knowList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dontAddClass">取消</el-button>
          <el-button type="primary" @click="trueAddClass">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.admin-class {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    height: 20px;
    line-height: 20px;
    width: calc(100% - 40px);
  }
  .table {
    height: 600px;
    width: 100%;
  }
}
</style>
