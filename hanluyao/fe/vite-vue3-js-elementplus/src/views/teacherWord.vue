<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const findData = ref('')
const findCollege = ref('')
const findName = ref('')
const findClass = ref('')
const findWord = ref('')
const findNeedName = ref('')
const collegeid = ref('')
const form = ref({
  name: '',
  teacherid: '',
  num: 0
})
const tableData = ref([])
const dialogFormVisible = ref(false)
const userList = ref([])
const needList = ref([])
const classList = ref([])
const wordList = ref([])
const allWordList = ref([])
const allNeedList = ref([])
const finishAllList = ref([])
const addClassDialog = ref(false)
const editClassDialog = ref(false)

function refreshFrom() {
  form.value = {
    name: '',
    teacherid: '',
    num: 0
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

function getList() {
  console.log(finishAllList.value)
  const list = finishAllList.value.filter(item => {
    return (
      item.collegename.includes(findCollege.value) &&
      item.username.includes(findName.value) &&
      item.classname.includes(findClass.value)
    )
  })
  if (findWord.value !== '') {
    const tableArr = []
    for (let i = 0; i < list.length; i++) {
      const finishArr = [] 
      for (let j = 0; j < list[i].finish.length; j++) {
        if (list[i].finish[j].wordname.includes(findWord.value)) {
          finishArr.push(list[i].finish[j])
        }
      }
      if (finishArr.length > 0) {
        tableArr.push({
          ...list[i],
          finish: finishArr
        })
      }
    }
    if (tableArr.length === 0) {
      tableData.value = []
    } else {
      tableData.value = tableArr
    }
  } else {
    tableData.value = list
  }
}

function editData(row) {
  editClassDialog.value = true
  form.value = row
  // console.log(scoped)
}

async function addClass() {
  // console.log(form.value)
  const { data } = await axios.post('http://localhost:3000/class/add', form.value)
  if (data.code === 2) {
    addClassDialog.value = false
    ElMessage.success('添加成功')
    getClassList()
  } else {
    ElMessage.error(data.msg)
  }
}

async function editClass() {
  // console.log(form.value)
  const { data } = await axios.post('http://localhost:3000/class/edit', form.value)
  if (data.code === 2) {
    editClassDialog.value = false
    ElMessage.success('编辑成功')
    getClassList()
  } else {
    ElMessage.error(data.msg)
  }
}


async function makeSureDel(row) {
  const { data } = await axios.post('http://localhost:3000/class/del', { id: row.id })
  if (data.code === 2) {
    ElMessage.success('删除成功')
    getClassList()
  }
}


async function getUserList() {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    userList.value = data.body
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
    allNeedList.value = []
    needList.value.forEach(item => {
      for (let i = 0; i < classList.value.length; i++) {
        if (item.classid === classList.value[i].classid && classList.value[i].collegeid === collegeid.value) {
          // console.log(classList.value[i])
          allNeedList.value.push({
            ...item,
            ...classList.value[i]
          })
          break
        }
      }
    })
  }
}

async function getWordList() {
  const { data } = await axios.post('http://localhost:3000/word/allData', {})
  if (data.code === 2) {
    wordList.value = data.body
    const userMap = {}
    userList.value.forEach(item => {
      userMap[item.id] = item.name
    })
    const ans = []
    finishAllList.value = []
    data.body.forEach(item => {
      for (let i = 0; i < allNeedList.value.length; i++) {
        if (item.needid === allNeedList.value[i].needid) {
          if (ans.indexOf(item.userid) === -1) {
            ans.push(item.userid)
            finishAllList.value.push({
              ...item,
              ...allNeedList.value[i],
              username: userMap[item.userid],
              finish: [item]
            })
          } else {
            for (let j = 0; j < finishAllList.value.length; j++) {
              if (finishAllList.value[j].userid === item.userid) {
                finishAllList.value[j].finish.push(item)
                break
              }
            }
          }
          break
        }
      }
    })
    tableData.value = finishAllList.value
  }
}

onMounted(async() => {
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
          <el-col :span="4">学院名：</el-col>
          <el-col :span="8">
            <el-input v-model="findCollege" style="width: 240px" placeholder="请输入内容" />
          </el-col>
          <el-col :span="4">教师名：</el-col>
          <el-col :span="8">
            <el-input v-model="findName" style="width: 240px" placeholder="请输入内容" />
          </el-col>
          <el-col :span="4">所属课程名称：</el-col>
          <el-col :span="8">
            <el-input v-model="findClass" style="width: 240px" placeholder="请输入内容" />
          </el-col>
          <el-col :span="4">文档名称：</el-col>
          <el-col :span="8">
            <el-input v-model="findWord" style="width: 240px" placeholder="请输入内容" />
          </el-col>
          <el-col :span="4">教学任务：</el-col>
          <el-col :span="8">
            <el-input v-model="findNeedName" style="width: 240px" placeholder="请输入内容" />
          </el-col>
        </el-row>
      </div>
      <div class="right">
        <el-button @click="getList">筛选</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" max-height="600">
        <el-table-column type="expand">
          <template #default="props">
            <div style="padding: 10px;">
              <el-table :data="props.row.finish" border>
              <el-table-column label="添加时间" width="300">
                <template #default="scoped">
                  {{ new Date(Number(scoped.row.wordid)).toLocaleString() }}
                </template>
              </el-table-column>
              <el-table-column prop="wordname" label="文档名称" />
              <el-table-column fixed="right" label="操作" width="200">
                <template #default="scoped">
                  <el-button link type="primary" size="small" @click="download(scoped.row)">下载文档</el-button>
                </template>
              </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="collegename" label="学院名" width="300" />
        <el-table-column prop="username" label="教师名" />
        <el-table-column prop="classname" label="所属课程名称" />
        <el-table-column prop="needname" label="所属教学任务名称" />
        <el-table-column prop="percent" label="教学任务完成度">
          <template #default="scope">
            <el-progress :percentage="Math.round(scope.row.finish.length / scope.row.needwordnum * 10000) / 100" />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.admin-class {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .header {
    height: 20%;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    line-height: 60px;
    .left {
      width: 80%;
    }
  }
  .body {
    height: 80%;
    padding: 0 10px;
  }
}
</style>
