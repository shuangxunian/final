<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import Papa from 'papaparse'

const tableData = ref([])
const courseList = ref([])
const pptList = ref([])
const findString = ref('')
const nowSelectType = ref('0')
const userid = ref('')
const fileList = ref([])
const formLabelWidth= ref(100)
const addCourseDialog = ref(false)
const addPPTDialog = ref(false)
const form = ref({
  className: '',
  statusType: '1',
})
const pptForm = ref({
  name: 'PN结理解',
  docUrl: 'https://ldwd4y8oeh.feishu.cn/docx/DWstdkeRMooDKJxS0XAcR9ChnIe?from=from_copylink',
  courseid: '',
  coursename: '',
  know: 'PN结',
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

const handleSuccess = function(index, scope) {
  console.log(index, scope)
}

const refreshPwd = function(index, scope) {
  console.log(index, scope)
}

const handleDelete = function(index, scope) {
  console.log(index, scope)
}

const makeSureUpload = function() {}

const addPPT = function(row) {
  pptForm.value.courseid = row.id
  pptForm.value.coursename = row.className
  addPPTDialog.value = true
}

const toAddPPT = async function() {
  if (form.value.name === '') return ElMessage.error('请输入项目名')
  if (form.value.docUrl === '') return ElMessage.error('请输入课程链接')
  if (form.value.know === '') return ElMessage.error('请输入知识点')

  const { data } = await axios.post('http://localhost:3000/ppt/add', pptForm.value)
  if (data.code === 2) {
    ElMessage({
      message: '添加成功！',
      type: 'success',
    })
    addPPTDialog.value = false
    await getPPTList()
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

const addClass = async function() {
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
    let knowList = ''
    tableData.value[i].product.forEach(item => {
      knowList+=item.know + ','
    })
    tableData.value[i].know = knowList
  }
}


const getCourseList = async function() {
  const { data } = await axios.post('http://localhost:3000/course/allData', {})
  if (data.code === 2) {
    courseList.value = []
    tableData.value = []
    data.body.forEach(item => {
      if (item.teacherid === userid.value) {
        let status = item.statusType === '1' ? '审核中' : '正常'
        tableData.value.push({
          ...item,
          status,
          product: []
        })
      }
    })
    courseList.value = tableData.value
    await getPPTList()
  }
}

const gotoFind = function() {
  console.log(nowSelectType.value)
}


onMounted(async () => {
  userid.value = window.sessionStorage.getItem('userid')
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
          <el-button type="primary" @click="addCourseDialog = true">新建课程</el-button>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" border max-height="600">
          <el-table-column type="expand">
            <template #default="props">
              <div>
                <el-table :data="props.row.product" :border="true">
                  <el-table-column prop="name" label="项目名称" />
                  <el-table-column prop="know" label="知识点" />
                  <el-table-column prop="docUrl" label="关联内容链接">
                    <template #default="scope">
                      <el-link type="primary" :href="scope.row.docUrl" target="_blank">文档访问</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="200">
                    <template #default="scope">
                      <el-button link type="primary" size="small" @click="handleSuccess(scope.$index, scope)">编辑</el-button>
                      <el-button link type="primary" size="small" @click="handleDelete(scope.$index, scope)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="className" label="课程名称" />
          <el-table-column prop="know" label="知识点" />
          <el-table-column prop="status" label="状态" />
          <el-table-column prop="status" label="是否可见">
            <template #default="scope">
              <el-switch :disabled="scope.row.statusType === '1'" v-model="scope.row.switchShow" active-text="可见" inactive-text="不可见" />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="addPPT(scope.row)">添加项目</el-button>
              <el-button link type="primary" size="small" @click="handleSuccess(scope.$index, scope)">新建</el-button>
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

    <el-dialog v-model="addCourseDialog" title="新建课程" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="课程名" :label-width="formLabelWidth">
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

    <el-dialog v-model="addPPTDialog" title="新建项目" width="500" @close="refreshForm">
      <el-form :model="pptForm">
        <el-form-item label="项目名" :label-width="formLabelWidth">
          <el-input v-model="pptForm.name"/>
        </el-form-item>
        <el-form-item label="课件链接" :label-width="formLabelWidth">
          <el-input v-model="pptForm.docUrl"/>
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
