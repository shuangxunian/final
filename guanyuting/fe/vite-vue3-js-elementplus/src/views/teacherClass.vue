<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const findData = ref('')
const tableData = ref([
  {
    id: 0,
    name: '计算机科学',
    homeworkNum: 5,
    testNum: 5,
    num: 20
  },
])
const form = ref({
  name: '',
  teacher: '',
  num: 0
})
const dialogFormVisible = ref(false)
const classDetailDialogVisible = ref(false)
const nowSelectClass = ref({})
const activeName = ref('0')
const className = ref('')


function refreshFrom() {
  form.value = {
    name: '',
    teacher: '',
    num: 0
  }
}


function getList() {}

function addUser() {
  dialogFormVisible.value = true
}

function doNotPush() {
  refreshFrom()
  dialogFormVisible.value = false
}

async function pushUser() {
  if (form.value.name === '') return ElMessage.error('请输入课程名')
  if (form.value.teacher === '') return ElMessage.error('请输入教师名')
  // const { data } = await axios.post('http://localhost:3000/user/add', {})
  // 判断一下老师是否存在
  refreshFrom()
  dialogFormVisible.value = false
}

function editData(scoped) {
  nowSelectClass.value = scoped.row
  classDetailDialogVisible.value = true
  // console.log(scoped.row)
}

function delData(scoped) {
  console.log(scoped)
}

// id 试卷/作业 课程id 问题
function showHomework(scoped) {}
function showTest(scoped) {}
function showStudent(scoped) {}

async function getUserList() {
  // const { data } = await axios.post('http://localhost:3000/user/alldata', {})
}

async function getClassList() {
  // const { data } = await axios.post('http://localhost:3000/user/alldata', {})
}

onMounted(async() => {
  await getUserList()
  await getClassList()
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
        <el-button type="primary" @click="addUser">新建用户</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" max-height="600">
        <el-table-column prop="name" label="课程名" width="300" />
        <el-table-column prop="homeworkNum" label="作业次数"/>
        <el-table-column prop="testNum" label="考试次数"/>
        <el-table-column prop="num" label="选课人数"/>
        <!-- <el-table-column prop="homeWorkNum" label="作业次数">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="showHomework(scoped)">{{ scoped.row.homeworkNum }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="testNum" label="考试次数">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="showTest(scoped)">{{ scoped.row.testNum }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="num" label="选课人数">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="showStudent(scoped)">{{ scoped.row.num }}</el-button>
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="editData(scoped)">详情</el-button>
            <el-button link type="danger" size="small" @click="delData(scoped)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="dialogFormVisible" title="添加用户" width="500">
      <el-form :model="form">
        <el-form-item label="课程名" label-width="100">
          <el-input v-model="form.name" placeholder="请填写课程名"/>
        </el-form-item>
        <el-form-item label="教师名" label-width="100">
          <el-input v-model="form.teacher" placeholder="请填写教师名"/>
        </el-form-item>
        <el-form-item label="选课人数" label-width="100">
          <el-input v-model="form.num" disabled placeholder="请填写选课人数"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="doNotPush">取消</el-button>
          <el-button type="primary" @click="pushUser">
            新建
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="classDetailDialogVisible"
      title="课程详情"
      :fullscreen="true"
    >
      <div class="my-class">
        <div class="left">
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="课程信息" name="0">
              <div class="class-info">
                <el-row>
                  <el-col :span="6">课程名：</el-col>
                  <el-col :span="12" :offset="6">
                    <el-input v-model="className" placeholder="请输入课程名" />
                  </el-col>
                </el-row>
                <div class="options">
                  <el-button>修改</el-button>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="考试列表" name="1">Config</el-tab-pane>
            <el-tab-pane label="作业列表" name="2">Role</el-tab-pane>
            <el-tab-pane label="选课学生列表" name="3">Task</el-tab-pane>
          </el-tabs>
        </div>
        <div class="right"></div>
      </div>
      <!-- <span>This is a message</span> -->
      <!-- <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            Confirm
          </el-button>
        </div>
      </template> -->
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
  .my-class {
    width: 100%;
    height: 800px;
    display: flex;
    .left {
      height: 100%;
      width: 70%;
      .demo-tabs {
        .class-info {
          height: 600px;
          width: 400px;
          margin: 20px auto;
          line-height: 32px;
          .options {
            margin-top: 10px;
            // padding: auto;
          }
        }
      }
    }
    .right {
      height: 100%;
      width: 30%;
      background-color: green;
    }
  }
}
</style>
