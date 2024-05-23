<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const findData = ref('')
const form = ref({
  classname: '',
  needwordnum: 0
})
const tableData = ref([])
const collegeList = ref([])
const wordList = ref([])
const classList = ref([])
const needList = ref([])
const userList = ref([])
const addClassDialog = ref(false)
const editClassDialog = ref(false)
const userid = ref('')
const collegeid = ref('')
const findClass = ref('')
const findName = ref('')
const findBelongClass = ref('')
const findNeedname = ref('')
const findWord = ref('')
const talking = ref('')
const selectWord = ref({})

function refreshFrom() {
  talking.value = ''
}

function getList() {
  const list = wordList.value.filter(item => {
    return (
      item.classname.includes(findClass.value) &&
      item.name.includes(findName.value) &&
      item.belongClass.includes(findBelongClass.value) &&
      item.needname.includes(findNeedname.value) &&
      item.wordname.includes(findWord.value)
    )
  })
  tableData.value = list
}

function editData(row) {
  editClassDialog.value = true
  selectWord.value = row
}

async function addClass() {
  if (form.value.classname === '') {
    ElMessage.error('课程名不能为空')
    return
  }
  if (form.value.needwordnum === '') {
    ElMessage.error('所需文档数量不能为空')
    return
  }
  if (form.value.needwordnum === 0) {
    ElMessage.error('所需文档数量不能为0')
    return
  }
  // console.log(form.value)
  const { data } = await axios.post('http://localhost:3000/class/add', {
    ...form.value,
    collegeid: collegeid.value
  })
  if (data.code === 2) {
    addClassDialog.value = false
    ElMessage.success('添加成功')
    getClassList()
  } else {
    ElMessage.error(data.msg)
  }
}

async function editClass() {
  if (talking.value === '') return ElMessage.error('请填写评论')
  console.log(selectWord.value)
  console.log(talking.value)
  const { data } = await axios.post('http://localhost:3000/word/addtalk', {
    wordid: selectWord.value.wordid,
    talking: talking.value
  })
  if (data.code === 2) {
    editClassDialog.value = false
    ElMessage.success('编辑成功')
    getWordList()
  } else {
    ElMessage.error(data.msg)
  }
}


async function makeSureDel(row) {
  const { data } = await axios.post('http://localhost:3000/word/del', { wordid: row.wordid })
  if (data.code === 2) {
    ElMessage.success('删除成功')
    getClassList()
  }
}

async function getWordList() {
  const { data } = await axios.post('http://localhost:3000/word/allData', {})
  if (data.code === 2) {
    const classMap = {}
    classList.value.forEach(item => {
      classMap[item.classid] = item.classname
    })
    const needMap = {}
    needList.value.forEach(item => {
      needMap[item.needid] = item
    })
    data.body.forEach(item => {
      item.needname = needMap[item.needid].needname
      item.classname = classMap[needMap[item.needid].classid]
    })
    const userMap = {}
    userList.value.forEach(item => {
      userMap[item.id] = item
    })
    data.body.forEach(item => {
      item.name = userMap[item.userid]?.name
      item.belongClass = userMap[item.userid]?.belongClass
    })
    wordList.value = data.body
    tableData.value = data.body
  }
}

async function getClassList() {
  const { data } = await axios.post('http://localhost:3000/class/allData', {})
  if (data.code === 2) {
    classList.value = data.body
  }
}

async function getNeedList() {
  const { data } = await axios.post('http://localhost:3000/need/allData', {})
  if (data.code === 2) {
    needList.value = data.body
  }
}

async function getUserList() {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    data.body.forEach(item => {
      item.standing = item.roletype === 0 ? '管理员' : item.roletype === 1 ? '系主任' : item.roletype === 2 ? '老师' : '督导'
    })
    userList.value = data.body
  }
}

const download = async(row) => {
    let a = document.createElement('a'); 
    a.style = 'display: none'; // 创建一个隐藏的a标签
    a.download = row.wordname;
    a.href = row.url;
    document.body.appendChild(a);
    a.click(); // 触发a标签的click事件
    document.body.removeChild(a);
}

const toTalking = async(row) => {
  console.log(row)
  selectWord.value = row
  editClassDialog.value = true
}



onMounted(async() => {
  userid.value = window.sessionStorage.getItem('id')
  collegeid.value = window.sessionStorage.getItem('collegeid')
  await getUserList()
  await getClassList()
  await getNeedList()
  await getWordList()
})

</script>

<template>
  <div class="admin-class">
    <div class="header">
      <div class="left">
        <el-row :gutter="20">
          <el-col :span="4">所属课程名称：</el-col>
          <el-col :span="8">
            <el-input v-model="findClass" style="width: 240px" placeholder="请输入内容" />
          </el-col>
          <el-col :span="4">教师名：</el-col>
          <el-col :span="8">
            <el-input v-model="findName" style="width: 240px" placeholder="请输入内容" />
          </el-col>
          <el-col :span="4">所属班级：</el-col>
          <el-col :span="8">
            <el-input v-model="findBelongClass" style="width: 240px" placeholder="请输入内容" />
          </el-col>
          <el-col :span="4">所属教学任务：</el-col>
          <el-col :span="8">
            <el-input v-model="findNeedname" style="width: 240px" placeholder="请输入内容" />
          </el-col>
          <el-col :span="4">文档名称：</el-col>
          <el-col :span="8">
            <el-input v-model="findWord" style="width: 240px" placeholder="请输入内容" />
          </el-col>
        </el-row>
      </div>
      <div class="right">
        <el-button @click="getList">筛选</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" height="500">
        <el-table-column label="添加时间" width="300">
          <template #default="scoped">
            {{ new Date(Number(scoped.row.wordid)).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="classname" label="所属课程" width="300" />
        <el-table-column prop="name" label="教师名"  width="400"/>
        <el-table-column prop="belongClass" label="所属班级"  width="400"/>
        <el-table-column prop="needname" label="所属教学任务" width="300" />
        <el-table-column prop="wordname" label="文档名称"  width="400"/>
        <el-table-column prop="talking" label="评论"  width="400"/>
        <el-table-column prop="status" label="是否更新"  width="200"/>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="download(scoped.row)">下载文档</el-button>
            <el-button link type="primary" size="small" @click="toTalking(scoped.row)">发表评论</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="editClassDialog" title="发表意见" width="500" @close="refreshFrom">
      <el-form :model="form">
        <el-form-item label="发表意见" label-width="100">
          <el-input v-model="talking" placeholder="请填写意见"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editClassDialog = false">取消</el-button>
          <el-button type="primary" @click="editClass">保存</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<style lang="less" scoped>
.admin-class {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .header {
    // height: 60px;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    line-height: 60px;
    .left {
      width: 80%;
    }
  }
  .body {
    padding: 0 10px;
  }
}
</style>
