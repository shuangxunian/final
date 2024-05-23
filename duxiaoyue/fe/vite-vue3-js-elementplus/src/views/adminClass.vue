<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const findString = ref('')
const nowSelectType = ref('0')
const addCourseDialog = ref(false)
const editCourseDialog = ref(false)
const userList = ref([])
const courseList = ref([])

const form = ref({
  className: '',
  teacherName: '',
  teacherid: '',
  statusType: '2'
})
const formLabelWidth = '140px'

const addClass = async function() {
  if (form.value.className === '') return element.message('请输入项目案例名称')
  if (form.value.teacherid === '') return element.message('请选择负责老师')
  const { data } = await axios.post('http://localhost:3000/course/add', {
    ...form.value,
  })
  if (data.code === 2) {
    ElMessage({
      message: '添加成功！',
      type: 'success',
    })
    addCourseDialog.value = false
    await getClassList()
  } else {
    ElMessage.error(data.msg)
  }
}

const refreshForm = function() {
  form.value = {
    className: '',
    teacherName: '',
    teacherid: '',
    statusType: '2'
  }
}

const handleSuccess = function(index, scope) {
  console.log(index, scope)
}

const handleDelete = function(index, scope) {
  console.log(index, scope)
}

const gotoFind = function() {
  if (findString.value === '') {
    getClassList()
    return
  }
  tableData.value = []
  courseList.value.forEach(item => {
    if (
      item.className?.includes(findString.value) ||
      item.teacherName?.includes(findString.value) ||
      item.status?.includes(findString.value)
    ) {
      tableData.value.push(item)
    }
  })
}

const makeSureDel = async function(row) {
  const { data } = await axios.post('http://localhost:3000/course/del', {
    ...row,
    statusType: '2'
  })
  if (data.code === 2) {
    ElMessage({
      message: '删除成功！',
      type: 'success',
    })
    await getClassList()
  }
}

const acceptClass = async function(row) {
  const { data } = await axios.post('http://localhost:3000/course/accept', {
    ...row,
  })
  if (data.code === 2) {
    await getClassList()
  }
}

const editClass = async function(row) {
  form.value = {
    ...row,
  }
  editCourseDialog.value = true
  // const { data } = await axios.post('http://localhost:3000/course/edit', {
  //   ...row,
  // })
  // if (data.code === 2) {
  //   await getClassList()
  // }
}

const toEditClass = async function() {
  if (form.value.className === '') return ElMessage.error('请输入项目案例名称')
  if (form.value.teacherid === '') return ElMessage.error('请选择负责老师')
  const { data } = await axios.post('http://localhost:3000/course/edit', {
    ...form.value,
  })
  if (data.code === 2) {
    editCourseDialog.value = false
    await getClassList()
  }
}

const getUserList = async function() {
  const { data } = await axios.post('http://localhost:3000/user/alldata',{})
  if (data.code === 2) {
    userList.value = data.body
    // data.body.forEach(item => {
    //   if (item.roleType ===  '1') {
    //     userList.value.push(item)
    //   }
    // })
    // console.log(userList.value)
  }
}

const getClassList = async function() {
  const { data } = await axios.post('http://localhost:3000/course/allData', {})
  if (data.code === 2) {
    const userMap = {}
    userList.value.forEach(item => {
      userMap[item.userid] = item.username
    })
    courseList.value = []
    tableData.value = []
    data.body.forEach(item => {
      let status = item.statusType === '1' ? '审核中' : '正常'
      tableData.value.push({
        ...item,
        belongTeacher: userMap[item.teacherid],
        status,
      })
    })
    courseList.value = tableData.value
  }
}

const sortTableSave = function() {
  const newData = tableData.value.sort((a, b) => {
    return b.studyNum - a.studyNum
  })
  tableData.value = newData
}

const sortTableCourse = function() {
  const newData = tableData.value.sort((a, b) => {
    return b.classCourse - a.classCourse
  })
  tableData.value = newData
}

onMounted(async() => {
  await getUserList()
  await getClassList()

})

</script>

<template>
  <div class="admin-users">
    <div class="body">
      <div class="header">
        <div class="left">
          <div class="find-string">
            <el-input v-model="findString" placeholder="请输入筛选内容" style="width: 160px"/>
          </div>
          <div class="find-button">
            <el-button type="primary" @click="gotoFind">筛选</el-button>
            <el-button type="primary" @click="sortTableSave">收藏最多</el-button>
            <el-button type="primary" @click="sortTableCourse">评分最高</el-button>
          </div>
        </div>
        <div class="right">
          <el-button type="primary" @click="addCourseDialog = true">新建课程</el-button>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" border max-height="600">
          <el-table-column prop="className" label="项目案例名称" />
          <el-table-column prop="belongTeacher" label="所属教师" />
          <el-table-column prop="studyNum" label="收藏人数" />
          <el-table-column prop="classCourse" label="评分" />
          <el-table-column prop="status" label="状态" />
          <el-table-column fixed="right" label="操作" width="160">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="editClass(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.statusType === '1'" link type="primary" size="small" @click="acceptClass(scope.row)">通过</el-button>
              <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
                <template #reference>
                  <el-button link type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
              <!-- <el-button link type="primary" size="small" @click="handleDelete(scope.$index, scope)">删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog v-model="addCourseDialog" title="新建项目案例" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="项目案例名称" :label-width="formLabelWidth">
          <el-input v-model="form.className" placeholder="请输入项目案例名称"/>
        </el-form-item>
        <el-form-item label="负责老师" :label-width="formLabelWidth">
          <el-select v-model="form.teacherid" placeholder="请选择教师">
            <el-option
              v-for="item in userList"
              :key="item.userid"
              :label="item.username"
              :value="item.userid"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addCourseDialog = false">取消</el-button>
          <el-button type="primary" @click="addClass">添加</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editCourseDialog" title="编辑项目案例" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="项目案例名称" :label-width="formLabelWidth">
          <el-input v-model="form.className" placeholder="请输入项目案例"/>
        </el-form-item>
        <el-form-item label="负责老师" :label-width="formLabelWidth">
          <el-select v-model="form.teacherid" placeholder="请选择教师">
            <el-option
              v-for="item in userList"
              :key="item.userid"
              :label="item.username"
              :value="item.userid"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editCourseDialog = false">取消</el-button>
          <el-button type="primary" @click="toEditClass">修改</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.admin-users {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .body {
    .header {
      display: flex;
      justify-content: space-between;
      height: 40px;
      padding: 10px;
      .left {
        display: flex;
        .find-string {
          width: 200px;
        }
        .find-type {
          width: 200px;
        }
      }
      .right {}

    }
    .table {
      margin: 0 10px;
    }
  }
}
</style>
