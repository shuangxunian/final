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
const addClassDialog = ref(false)
const editClassDialog = ref(false)
const userid = ref('')
const collegeid = ref('')

function refreshFrom() {
  form.value = {
    classname: '',
    needwordnum: 0
  }
}

function getList() {
  if (findData.value === '') {
    getClassList()
    return
  }
  const list = classList.value.filter(item => {
    return item.name.includes(findData.value) || item.teacher.includes(findData.value)
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
    // classList.value = data.body
    console.log(data.body)
    tableData.value = data.body
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
  await getWordList()
})

</script>

<template>
  <div class="admin-class">
    <div class="header">
      <div class="left">
        <el-input v-model="findData" style="width: 240px" placeholder="请输入内容" />
        <el-button @click="getList">筛选</el-button>
      </div>
      <div class="right">
        <el-button type="primary" @click="addClassDialog = true">新建课程</el-button>
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

    <el-dialog v-model="addClassDialog" title="添加课程" width="500" @close="refreshFrom">
      <el-form :model="form">
        <el-form-item label="课程名" label-width="100">
          <el-input v-model="form.classname" placeholder="请填写课程名"/>
        </el-form-item>
        <el-form-item label="所需文档数量" label-width="100">
          <el-input-number v-model="form.needwordnum" placeholder="请填写所需文档数量"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editClassDialog = false">取消</el-button>
          <el-button type="primary" @click="addClass">新建</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editClassDialog" title="编辑课程" width="500" @close="refreshFrom">
      <el-form :model="form">
        <el-form-item label="课程名" label-width="100">
          <el-input v-model="form.classname" placeholder="请填写课程名"/>
        </el-form-item>
        <el-form-item label="所需文档数量" label-width="100">
          <el-input-number v-model="form.needwordnum" placeholder="请填写所需文档数量"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editClassDialog = false">取消</el-button>
          <el-button type="primary" @click="editClass">编辑</el-button>
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
    height: 60px;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    line-height: 60px;
  }
  .body {
    padding: 0 10px;
  }
}
</style>
