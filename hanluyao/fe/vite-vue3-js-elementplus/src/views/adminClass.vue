<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const findData = ref('')
const findCollege = ref('')
const findClass = ref('')
const findNeedName = ref('')
const form = ref({
  classname: '',
  collegeid: '',
  needwordnum: 0
})
const tableData = ref([])
const dialogFormVisible = ref(false)
const userList = ref([])
const classList = ref([])
const needList = ref([])
const collegeList = ref([])
const addClassDialog = ref(false)
const editClassDialog = ref(false)

function refreshFrom() {
  form.value = {
    classname: '',
    collegeid: '',
    needwordnum: 0
  }
}

function getList() {
  const list = needList.value.filter(item => {
  // debugger
    return item.classname.includes(findClass.value) && item.collegename.includes(findCollege.value) && item.needname.includes(findNeedName.value) 
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
  if (form.value.collegeid === '') {
    ElMessage.error('学院名不能为空')
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
  const { data } = await axios.post('http://localhost:3000/class/del', { classid: row.classid })
  if (data.code === 2) {
    ElMessage.success('删除成功')
    getClassList()
  }
}


async function getCollegeList() {
  if (collegeList.value.length !== 0) {
    return
  }
  const { data } = await axios.post('http://localhost:3000/college/allData', {})
  if (data.code === 2) {
    collegeList.value = data.body
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
    const arr = []
    for (let i = 0; i < data.body.length; i++) {
      classList.value.find(item => {
        if (item.classid === data.body[i].classid) {
          arr.push({
            ...item,
            ...data.body[i],
          })
        }
      })
    }
    needList.value = arr
    tableData.value = arr
  }
}

onMounted(async() => {
  await getClassList()
  await getNeedList()
})

</script>

<template>
  <div class="admin-class">
    <div class="header">
      <div class="left">
        <el-row :gutter="20">
          <el-col :span="4">所属学院：</el-col>
          <el-col :span="8">
            <el-input v-model="findCollege" style="width: 240px" placeholder="请输入内容" />
          </el-col>
          <el-col :span="4">课程名称：</el-col>
          <el-col :span="8">
            <el-input v-model="findClass" style="width: 240px" placeholder="请输入内容" />
          </el-col>
          <el-col :span="4">教学计划</el-col>
          <el-col :span="8">
            <el-input v-model="findNeedName" style="width: 240px" placeholder="请输入内容" />
          </el-col>
        </el-row>
      </div>
      <div class="right">
        <el-button @click="getList">筛选</el-button>
        <!-- <el-button type="primary" @click="addClassDialog = true">新建课程</el-button> -->
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" max-height="600">
        <el-table-column prop="collegename" label="所属学院" />
        <el-table-column prop="classname" label="课程名" width="300" />
        <el-table-column prop="needname" label="教学计划" />
        <el-table-column prop="needwordnum" label="所需文档数量" />
        <!-- <el-table-column fixed="right" label="操作" width="200">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="editData(scoped.row)">编辑</el-button>
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scoped.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column> -->
      </el-table>
    </div>

    <el-dialog v-model="addClassDialog" title="添加课程" width="500" @close="refreshFrom">
      <el-form :model="form">
        <el-form-item label="课程名" label-width="100">
          <el-input v-model="form.classname" placeholder="请填写课程名"/>
        </el-form-item>
        <el-form-item label="所属学院" label-width="100">
          <el-select v-model="form.collegeid" filterable placeholder="请选择学院" @click="getCollegeList">
            <el-option v-for="item in collegeList" :key="item.collegeid" :label="item.name" :value="item.collegeid" />
          </el-select>
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
        <el-form-item label="所属学院" label-width="100">
          <el-select v-model="form.collegeid" filterable placeholder="请选择学院" @click="getCollegeList">
            <el-option v-for="item in collegeList" :key="item.collegeid" :label="item.name" :value="item.collegeid" />
          </el-select>
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
    height: 120px;
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
