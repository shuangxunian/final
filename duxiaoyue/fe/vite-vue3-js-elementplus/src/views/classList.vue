<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import Papa from 'papaparse'

const tableData = ref([])
const userList = ref([])
const courseList = ref([])
const pptList = ref([])
const findString = ref('')
const nowSelectType = ref('0')
const userid = ref('')
const fileList = ref([])
const formLabelWidth= ref(100)
const addCourseDialog = ref(false)
const addPPTDialog = ref(false)
const editPPTDialog = ref(false)

const detailPPTDialog = ref(false)
const detailPPTList = ref([])
const nowSelectRow = ({})
const form = ref({
  className: '',
  statusType: '1',
})
const pptForm = ref({
  name: '',
  docUrl: '',
  mp4Url: '',
  courseid: '',
  coursename: '',
  know: '',
})

const refreshForm = function() {
  form.value = {
    className: '',
    statusType: '1',
  }
  pptForm.value = {
    name: '',
    docUrl: '',
    courseid: '',
    coursename: '',
    know: '',
  }
}

const handleEdit = function(row) {
  pptForm.value = {
    ...row
  }
  pptForm.value.coursename = row.className || nowSelectRow.value.className
  editPPTDialog.value = true
  // console.log(index, scope)
}

const refreshPwd = function(index, scope) {
  console.log(index, scope)
}

const handleDelete = function(index, scope) {
  console.log(index, scope)
}

const makeSureUpload = function() {}

const getDetail = async function(row) {
  const { data } = await axios.post('http://localhost:3000/ppt/detail', {
    courseid: row.id
  })
  if (data.code === 2) {
    detailPPTDialog.value = true
    nowSelectRow.value = row
    detailPPTList.value = data.body
  }
}

const addPPT = function(row = {}) {
  pptForm.value.courseid = row.id || nowSelectRow.value.id
  pptForm.value.coursename = row.className || nowSelectRow.value.className
  addPPTDialog.value = true
}

const toAddPPT = async function() {
  if (pptForm.value.name === '') return ElMessage.error('请输入项目名')
  if (pptForm.value.docUrl === '') return ElMessage.error('请输入课程链接')
  if (pptForm.value.mp4Url === '') return ElMessage.error('请输入视频链接')
  if (pptForm.value.coursename === '') return ElMessage.error('请输入关联课程')
  if (pptForm.value.know === '') return ElMessage.error('请输入知识点')

  const { data } = await axios.post('http://localhost:3000/ppt/add', pptForm.value)
  if (data.code === 2) {
    ElMessage({
      message: '添加成功！',
      type: 'success',
    })
    addPPTDialog.value = false
    await getPPTList()
    if(detailPPTDialog.value) getDetail(nowSelectRow.value)
  } else {
    ElMessage.error(data.msg)
  }
}

const toEditPPT = async function() {
  if (pptForm.value.name === '') return ElMessage.error('请输入项目名')
  if (pptForm.value.docUrl === '') return ElMessage.error('请输入课程链接')
  if (pptForm.value.mp4Url === '') return ElMessage.error('请输入视频链接')
  if (pptForm.value.coursename === '') return ElMessage.error('请输入关联课程')
  if (pptForm.value.know === '') return ElMessage.error('请输入知识点')

  const { data } = await axios.post('http://localhost:3000/ppt/edit', pptForm.value)
  if (data.code === 2) {
    ElMessage({
      message: '修改成功！',
      type: 'success',
    })
    editPPTDialog.value = false
    await getPPTList()
    if(detailPPTDialog.value) getDetail(nowSelectRow.value)
  }
}

const makeSureDel = async function(row) {
  const { data } = await axios.post('http://localhost:3000/course/del', row)
  if (data.code === 2) {
    ElMessage({
      message: '删除成功！',
      type: 'success',
    })
    await getCourseList()
  }
}

const makeSureDelDetail = async function(row) {
  const { data } = await axios.post('http://localhost:3000/ppt/del', row)
  if (data.code === 2) {
    ElMessage({
      message: '删除成功！',
      type: 'success',
    })
    await getDetail(nowSelectRow.value)
    // await getCourseList()
  }
}

const addClass = async function() {
  if (form.value.className === '') return ElMessage.error('请输入案例名称')
  const { data } = await axios.post('http://localhost:3000/course/add', {
    ...form.value,
    switchShow: 'false',
    teacherid: userid.value
  })
  if (data.code === 2) {
    ElMessage({
      message: '添加成功！',
      type: 'success',
    })
    addCourseDialog.value = false
    await getCourseList()
  } else {
    ElMessage.error(data.msg)
  }
}

const getPPTList = async function() {
  const { data } = await axios.post('http://localhost:3000/ppt/allData', {})
  if (data.code === 2) {
    pptList.value = data.body
  }
  for(let i = 0;i < tableData.value.length; i++) {
    const id = tableData.value[i].id
    tableData.value[i].product = []
    pptList.value.forEach(item => {
      if(item.courseid === id) {
        tableData.value[i].product.push(item)
      }
    })
  }
  for(let i = 0;i < tableData.value.length; i++) {
    const knowSet = new Set()
    tableData.value[i].product.forEach(item => {
      knowSet.add(item.know)
    })
    tableData.value[i].know = Array.from(knowSet).join(',')
  }
}


const getCourseList = async function() {
  const { data } = await axios.post('http://localhost:3000/course/allData', {})
  if (data.code === 2) {
    courseList.value = []
    tableData.value = []
    // console.log(userList.value)
    const userMap = {}
    userList.value.forEach(item => {
      userMap[item.userid] = item.username
    })
    data.body.forEach(item => {
      // console.log(item)
      let status = item.statusType === '1' ? '审核中' : '正常'
      let belongUser = userMap[item.teacherid]
      tableData.value.push({
        ...item,
        status,
        belongUser,
        product: []
      })
    })
    courseList.value = tableData.value
    await getPPTList()
  }
}

const gotoFind = function() {
  if (findString.value === '') {
    getCourseList()
    return
  }
  tableData.value = []
  courseList.value.forEach(item => {
    if (
      item.className?.includes(findString.value) ||
      item.belongUser?.includes(findString.value) ||
      item.status?.includes(findString.value)
    ) {
      tableData.value.push(item)
    }
  })
}


const getUserList = async function() {
  const { data } = await axios.post('http://localhost:3000/user/alldata',{})
  if (data.code === 2) {
    userList.value = data.body
  }
}
onMounted(async () => {
  userid.value = window.sessionStorage.getItem('userid')
  await getUserList()
  await getCourseList()
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
          </div>
        </div>
        <div class="right">
          <el-button type="primary" @click="addCourseDialog = true">新建项目案例</el-button>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" border max-height="600">
          <el-table-column prop="className" label="项目案例名称" />
          <el-table-column prop="belongUser" label="负责人" />
          <el-table-column prop="know" label="知识点" />
          <el-table-column prop="status" label="状态" />
          <!-- <el-table-column prop="status" label="是否可见">
            <template #default="scope">
              <el-switch :disabled="scope.row.statusType === '1'" v-model="scope.row.switchShow" active-text="可见" inactive-text="不可见" />
            </template>
          </el-table-column> -->
          <el-table-column fixed="right" label="操作" width="240">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="getDetail(scope.row)">查看详情</el-button>
              <!-- <el-button link type="primary" size="small" @click="addPPT(scope.row)">添加项目</el-button> -->
              <el-button link type="primary" size="small" @click="addPPT(scope.row)">新建关联课程</el-button>
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
          <el-input v-model="form.className"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addCourseDialog = false">取消</el-button>
          <el-button type="primary" @click="addClass">添加</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="addPPTDialog" title="新建课程" width="500" @close="refreshForm">
      <el-form :model="pptForm">
        <el-form-item label="课程名" :label-width="formLabelWidth">
          <el-input v-model="pptForm.name"/>
        </el-form-item>
        <el-form-item label="课件链接" :label-width="formLabelWidth">
          <el-input v-model="pptForm.docUrl"/>
        </el-form-item>
        <el-form-item label="视频链接" :label-width="formLabelWidth">
          <el-input v-model="pptForm.mp4Url"/>
        </el-form-item>
        <el-form-item label="关联课程名称" :label-width="formLabelWidth">
          <el-input disabled v-model="pptForm.coursename"/>
        </el-form-item>
        <el-form-item label="知识点" :label-width="formLabelWidth">
          <el-input v-model="pptForm.know"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addPPTDialog = false">取消</el-button>
          <el-button type="primary" @click="toAddPPT">添加</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editPPTDialog" title="编辑课程" width="500" @close="refreshForm">
      <el-form :model="pptForm">
        <el-form-item label="课程名" :label-width="formLabelWidth">
          <el-input v-model="pptForm.name"/>
        </el-form-item>
        <el-form-item label="课件链接" :label-width="formLabelWidth">
          <el-input v-model="pptForm.docUrl"/>
        </el-form-item>
        <el-form-item label="视频链接" :label-width="formLabelWidth">
          <el-input v-model="pptForm.mp4Url"/>
        </el-form-item>
        <el-form-item label="关联课程名称" :label-width="formLabelWidth">
          <el-input disabled v-model="pptForm.coursename"/>
        </el-form-item>
        <el-form-item label="知识点" :label-width="formLabelWidth">
          <el-input v-model="pptForm.know"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editPPTDialog = false">取消</el-button>
          <el-button type="primary" @click="toEditPPT">修改</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="detailPPTDialog" title="案例详情" fullscreen @close="refreshForm">
      <div class="detail-header">
        <el-button type="primary" @click="addPPT">添加课程</el-button>
      </div>
      <el-table :data="detailPPTList" :border="true">
        <el-table-column prop="name" label="课程名称" />
        <el-table-column prop="know" label="知识点" />
        <el-table-column prop="docUrl" label="关联内容链接" width="160">
          <template #default="scope">
            <el-link type="primary" :href="scope.row.docUrl" target="_blank">文档访问</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="mp4Url" label="关联视频">
          <template #default="scope">
            <el-link v-if="scope.row.mp4Url !== ''" type="primary" :href="scope.row.mp4Url" target="_blank">点此观看视频</el-link>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDelDetail(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
            <!-- <el-button link type="primary" size="small" @click="handleDelete(scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
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
  .detail-header {
    height: 60px;
  }
}
</style>
