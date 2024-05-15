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
const addClassDialog = ref(false)
const editClassDialog = ref(false)
const userid = ref('')
const collegeid = ref('')
const findClass = ref('')
const findWord = ref('')

function refreshFrom() {
  form.value = {
    classname: '',
    needwordnum: 0
  }
}

function getList() {
  const list = wordList.value.filter(item => {
    return (
      item.classname.includes(findClass.value) &&
      item.wordname.includes(findWord.value)
    )
  })
  tableData.value = list
}

function editData(row) {
  editClassDialog.value = true
  form.value = row
  // console.log(scoped)
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
  const { data } = await axios.post('http://localhost:3000/class/del', { classid: row.classid })
  if (data.code === 2) {
    ElMessage.success('删除成功')
    getClassList()
  }
}

async function getWordList() {
  const { data } = await axios.post('http://localhost:3000/word/myData', {
    userid: userid.value
  })
  if (data.code === 2) {
    const classMap = {}
    classList.value.forEach(item => {
      classMap[item.classid] = item.classname
    })
    const needMap = {}
    needList.value.forEach(item => {
      needMap[item.needid] = item
    })
    console.log(classMap)
    data.body.forEach(item => {
      console.log(item)
      item.needname = needMap[item.needid].needname
      item.classname = classMap[needMap[item.needid].classid]
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


const download = async(row) => {
    let a = document.createElement('a'); 
    a.style = 'display: none'; // 创建一个隐藏的a标签
    a.download = row.wordname;
    a.href = row.url;
    document.body.appendChild(a);
    a.click(); // 触发a标签的click事件
    document.body.removeChild(a);
}


onMounted(async() => {
  userid.value = window.sessionStorage.getItem('id')
  collegeid.value = window.sessionStorage.getItem('collegeid')
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
          <el-col :span="4">文档名称：</el-col>
          <el-col :span="8">
            <el-input v-model="findWord" style="width: 240px" placeholder="请输入内容" />
          </el-col>
        </el-row>
        <!-- <el-input v-model="findData" style="width: 240px" placeholder="请输入内容" /> -->
      </div>
      <div class="right">
        <el-button @click="getList">筛选</el-button>
        <!-- <el-button type="primary" @click="addClassDialog = true">新建课程</el-button> -->
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" max-height="600">
        <el-table-column label="添加时间" width="300">
          <template #default="scoped">
            {{ new Date(Number(scoped.row.wordid)).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="classname" label="所属课程" width="300" />
        <el-table-column prop="needname" label="所属教学任务" width="300" />
        <el-table-column prop="wordname" label="文档名称" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scoped">
            <!-- <el-link size="small">下载文档</el-link> -->
            <el-button link type="primary" size="small" @click="download(scoped.row)">下载文档</el-button>
            <el-button link type="primary" size="small" @click="editData(scoped.row)">编辑</el-button>
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scoped.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
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
    height: 60px;
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
