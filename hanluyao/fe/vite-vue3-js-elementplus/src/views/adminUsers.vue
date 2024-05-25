<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const findData = ref('')
const userList = ref([])
const addUserDialog = ref(false)
const editUserDialog = ref(false)
const tableData = ref([])
const collegeList = ref([])
const findID = ref('')
const findName = ref('')
const findStanding = ref('')
const findCollege = ref('')
const findBelongClass = ref('')
const form = ref({
  id: '',
  name: '',
  roletype: ''
})
const dialogFormVisible = ref(false)
const standingList = ref([
  {
    label: '系主任',
    value: 1
  },
  {
    label: '老师',
    value: 2
  },
  {
    label: '督导',
    value: 3
  },
])
const uploadRef = ref(null)
const fileList = ref([])

function clearForm() {
  form.value = {
    id: '',
    name: '',
    roletype: ''
  }
}

function getList() {
  const list = userList.value.filter(item => {
    console.log(item)
    return (
      item.id.includes(findID.value) &&
      item.name.includes(findName.value) &&
      item.standing.includes(findStanding.value) &&
      item.belongClass?.includes(findBelongClass.value) &&
      item.collegename?.includes(findCollege.value)
    )
  })
  tableData.value = list
  init()
}

async function addUser() {
  if (form.value.id === '') return ElMessage.error('请输入工号')
  if (form.value.name === '') return ElMessage.error('请输入用户姓名')
  if (form.value.roletype === '') return ElMessage.error('请选择用户身份')
  if (form.value.collegeid === '' && form.value.roletype !== 3) return ElMessage.error('请选择用户所属学院')
  if (form.value.belongClass === '' && form.value.roletype === 2) return ElMessage.error('请选择用户所属班级')
  const { data } = await axios.post('http://localhost:3000/user/add', form.value)
  if (data.code === 2) {
    addUserDialog.value = false
    ElMessage.success('添加成功')
    getUserList()
  } else {
    ElMessage.error(data.msg)
  }
}

async function editUser() {
  if (form.value.id === '') return ElMessage.error('请输入工号')
  if (form.value.name === '') return ElMessage.error('请输入用户姓名')
  if (form.value.roletype === '') return ElMessage.error('请选择用户身份')
  if (form.value.collegeid === '') return ElMessage.error('请选择用户所属学院')
  const { data } = await axios.post('http://localhost:3000/user/edit', form.value)
  if (data.code === 2) {
    editUserDialog.value = false
    ElMessage.success('修改成功')
    getUserList()
  } else {
    ElMessage.error(data.msg)
  }
}

async function pushUser() {
  if (form.value.name === '') return ElMessage.error('请输入用户名')
  if (form.value.standing === '') return ElMessage.error('请选择用户身份')
  // const { data } = await axios.post('http://localhost:3000/user/add', {})
  refreshFrom()
  dialogFormVisible.value = false
}

function editData(row) {
  form.value = row
  editUserDialog.value = true
}

function delData(scoped) {
  console.log(scoped)
}

function fileChange(file, fileList) {
  console.log(file, fileList)
  // console.log(uploadRef.value)
}

async function makeSureDel(row) {
  const { data } = await axios.post('http://localhost:3000/user/del', { id: row.id })
  if (data.code === 2) {
    ElMessage.success('删除成功')
    getUserList()
  }
}

async function fixPassword() {
  const { data } = await axios.post('http://localhost:3000/user/fixPassword', { id: form.value.id })
  if (data.code === 2) {
    ElMessage.success('重置成功')
    getUserList()
    editUserDialog.value = false
  }
}

async function getUserList() {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    data.body.forEach(item => {
      item.standing = item.roletype === 0 ? '管理员' : item.roletype === 1 ? '系主任' : item.roletype === 2 ? '老师' : '督导'
    })
    userList.value = data.body
    tableData.value = data.body
  }
}

async function getCollegeList() {
  const { data } = await axios.post('http://localhost:3000/college/allData', {})
  if (data.code === 2) {
    collegeList.value = data.body
  }
}


const init = () => {
  // 基于准备好的dom，初始化echarts实例
  let Chart = echarts.init(document.getElementById("myEcharts"));
  console.log(tableData.value)
  const locationMap = {}
  tableData.value.forEach(item => {
    if (item.collegename !== undefined){
      if (locationMap[item.collegename]) {
        locationMap[item.collegename] += 1
      } else {
        locationMap[item.collegename] = 1
      }
    }
  })
  const seriesData = []
  for (const key in locationMap) {
    seriesData.push({
      name: key,
      value: locationMap[key]
    })
  }

  // 绘制图表
  let option = {
    title: {
      text: '各学院人数',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '8%',
      left: 'center'
    },
    series: [
      {
        name: '所在地',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 24,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: seriesData
      }
    ]
  };
  // 渲染图表
  Chart.setOption(option);
}

onMounted(async() => {
  await getUserList()
  await getCollegeList()
  init()
})

</script>

<template>
  <div class="admin-user">
    <div class="header">
      <div class="left">
        <el-row :gutter="20">
          <el-col :span="4">工号：</el-col>
          <el-col :span="8">
            <el-input v-model="findID" style="width: 240px" placeholder="请输入内容" />
          </el-col>
          <el-col :span="4">用户姓名：</el-col>
          <el-col :span="8">
            <el-input v-model="findName" style="width: 240px" placeholder="请输入内容" />
          </el-col>
          <el-col :span="4">身份：</el-col>
          <el-col :span="8">
            <el-input v-model="findStanding" style="width: 240px" placeholder="请输入内容" />
          </el-col>
          <el-col :span="4">所属学院：</el-col>
          <el-col :span="8">
            <el-input v-model="findCollege" style="width: 240px" placeholder="请输入内容" />
          </el-col>
          <el-col :span="4">所属班级：</el-col>
          <el-col :span="8">
            <el-input v-model="findBelongClass" style="width: 240px" placeholder="请输入内容" />
          </el-col>
        </el-row>
      </div>
      <div class="right">
        <el-button @click="getList">筛选</el-button>
        <el-button type="primary" @click="addUserDialog = true">新建用户</el-button>
      </div>
    </div>
    <div class="body">
      <div>
        <el-table :data="tableData" border style="width: 100%" height="400">
          <el-table-column prop="id" label="工号" width="300" />
          <el-table-column prop="name" label="用户昵称" width="300" />
          <el-table-column prop="standing" label="身份"/>
          <el-table-column prop="collegename" label="所属学院"/>
          <el-table-column prop="belongClass" label="所属班级"/>
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scoped">
              <el-button v-if="scoped.row.id !== 'admin'" link type="primary" size="small" @click="editData(scoped.row)">编辑</el-button>
              <el-popconfirm v-if="scoped.row.id !== 'admin'" confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scoped.row)">
                <template #reference>
                  <el-button link type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="chart">
        <div id="myEcharts" :style="{ width: '100%', height: '100%' }"></div>
      </div>
    </div>
    <el-dialog v-model="addUserDialog" title="添加用户" width="500" @close="clearForm">
      <el-form :model="form">
        <el-form-item label="工号" label-width="100">
          <el-input v-model="form.id" placeholder="请填写工号"/>
        </el-form-item>
        <el-form-item label="用户姓名" label-width="100">
          <el-input v-model="form.name" placeholder="请填写用户姓名"/>
        </el-form-item>
        <el-form-item label="身份" label-width="100">
          <el-select
            v-model="form.roletype"
            placeholder="请选择"
          >
            <el-option
              v-for="item in standingList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.roletype !== 3" label="所属学院" label-width="100">
          <el-select
            v-model="form.collegeid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in collegeList"
              :key="item.collegeid"
              :label="item.name"
              :value="item.collegeid"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.roletype === 2" label="所属班级" label-width="100">
          <el-input v-model="form.belongClass" placeholder="请填写用户姓名"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addUserDialog = false">取消</el-button>
          <el-button type="primary" @click="addUser">新建</el-button>
        </div>
      </template>
    </el-dialog>


    <el-dialog v-model="editUserDialog" title="编辑用户" width="500"  @close="clearForm">
      <el-form :model="form">
        <el-form-item label="工号" label-width="100">
          <el-input disabled v-model="form.id" />
        </el-form-item>
        <el-form-item label="用户姓名" label-width="100">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item v-if="form.roletype === 2" label="用户班级" label-width="100">
          <el-input v-model="form.belongClass" />
        </el-form-item>
        <el-form-item label="身份：" label-width="100">
          <span v-if="form.roletype === 0">管理员</span>
          <span v-if="form.roletype === 1">系主任</span>
          <span v-if="form.roletype === 2">老师</span>
          <span v-if="form.roletype === 3">督导</span>
        </el-form-item>
        <el-form-item v-if="form.roletype !== 3" label="所属学院" label-width="100">
          <el-select
            v-model="form.collegeid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in collegeList"
              :key="item.collegeid"
              :label="item.name"
              :value="item.collegeid"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="密码" label-width="100">
          <el-button link type="primary" size="small" @click="fixPassword">重置密码</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editUserDialog = false">取消</el-button>
          <el-button type="primary" @click="editUser">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.admin-user {
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
    .right {}
  }
  .body {
    height: 80%;
    padding: 0 10px;
    .chart {
      height: 300px;
    }
  }
}
</style>
