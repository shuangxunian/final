<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const findData = ref('')
const tableData = ref([])
const classList = ref([])
const form = ref({
  name: '',
  teacher: '',
  num: 0
})
const testForm = ref({
  name: '',
  type: "1",
  checkQuestionList: [
    // {
    //   key: 0,
    //   question: '',
    //   check1: '',
    //   check2: '',
    //   check3: '',
    //   check4: '',
    //   answer: ''
    // }
  ],
  textQuestionList: [
    // {
    //   key: 1,
    //   question: '',
    // }
  ],

})
const dialogFormVisible = ref(false)
const classDetailDialogVisible = ref(false)
const dialogAddTestVisible = ref(false)
const dialogAddStudentVisible = ref(false)
const testFindData = ref('')
const nowSelectClass = ref({})
const activeName = ref('0')
const className = ref('')
const testList = ref([])
const studentFindData = ref([])
const studentListHeader = ref([])
const studentList = ref([])
const userList = ref([])
const talkingList = ref([
  {
    user: '张三',
    text: '为啥这题选a啊'
  },
  {
    user: '王老师',
    text: '因为1+1=2'
  },
])
const talkText = ref('')
const userid = ref('')
const addStudentForm = ref({
  studentid: '',
  classid: ''
})


function refreshFrom() {
  form.value = {
    name: '',
    teacher: '',
    num: 0
  }
}

function endAddStudent() {
  addStudentForm.value = {
    studentid: '',
    classid: ''
  }
}

function getList() {}

function addClass() {
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
  // nowSelectClass.value = scoped.row
  // classDetailDialogVisible.value = true
  // console.log(scoped.row)
}

function delData(scoped) {
  console.log(scoped)
}

// id 试卷/作业 课程id 问题
function showHomework(scoped) {}
function showTest(scoped) {}
function showStudent(scoped) {}

function addNewCheck() {
  testForm.value.checkQuestionList.push({
    key: Date.now(),
    question: '',
    check1: '',
    check2: '',
    check3: '',
    check4: '',
  })
}

function addNewText() {
  testForm.value.textQuestionList.push({
    key: Date.now(),
    question: ''
  })
}

function removeCheck(item) {
  const index = testForm.value.checkQuestionList.indexOf(item)
  console.log(item, index)
  if (index !== -1) {
    testForm.value.checkQuestionList.splice(index, 1)
  }
}

function removeText(item) {
  const index = testForm.value.textQuestionList.indexOf(item)
  if (index !== -1) {
    testForm.value.textQuestionList.splice(index, 1)
  }
}

function refreshTestFrom() {
  testForm.value = {
    name: '',
    type: "1",
    checkQuestionList: [
      // {
      //   key: 0,
      //   question: '',
      //   check1: '',
      //   check2: '',
      //   check3: '',
      //   check4: '',
      //   answer: ''
      // }
    ],
    textQuestionList: [
      // {
      //   key: 1,
      //   question: '',
      // }
    ],
  }
}

function doNotAddTest() {
  refreshTestFrom()
  dialogAddTestVisible.value = false
}

async function getTestList() {
  const { data } = await axios.post('http://localhost:3000/test/allData', {
    classid: nowSelectClass.value.id
  })
  if (data.code === 2) {
    console.log(data.body)
    testList.value = data.body
  }
}

async function addTest() {
  if (testForm.value.name === '') return ElMessage.error('请输入考试/作业名称')
  if (testForm.value.checkQuestionList.length === 0 && testForm.value.textQuestionList.length === 0) return ElMessage.error('请保证至少存在一道题')
  const { data } = await axios.post('http://localhost:3000/test/add', {
    ...testForm.value,
    classid: nowSelectClass.value.id
  })
  if (data.code === 2) {
    ElMessage.success('添加成功')
    getTestList()
    dialogAddTestVisible.value = false
  }
}

async function getStudentList() {
  // studentListHeader.value = [
  //   {
  //     prop: 'name',
  //     label: '学生姓名'
  //   },{
  //     prop: 'work1',
  //     label: '作业1'
  //   },{
  //     prop: 'test1',
  //     label: '考试1'
  //   },
  // ]
}

function showDetail(row) {
  nowSelectClass.value = row
  console.log(nowSelectClass.value)
  classDetailDialogVisible.value = true
}

async function makeSureDel(row) {
  const { data } = await axios.post('http://localhost:3000/class/del', { id: row.id })
  if (data.code === 2) {
    ElMessage.success('删除成功')
    getClassList()
  }
}

async function editClassName() {
  const { data } = await axios.post('http://localhost:3000/class/edit', {
    ...nowSelectClass.value
  })
  if (data.code === 2) {
    ElMessage.success('修改成功')
    // getClassList()
  }
}

async function addJoinClass() {
  const { data } = await axios.post('http://localhost:3000/select_class/add', {
    classid: nowSelectClass.value.id,
    studentid: addStudentForm.value.studentid
  })
  if (data.code === 2) {
    // ElMessage.success('添加成功')
    // getClassList()
    // endAddStudent()
  }
}

function tabClick(tab, event) {
  // console.log(tab, event)
  // console.log(tab.props.name)
  // const name = tab.props.name
  // if (name === '3') {
  //   getStudentList()
  // }
  if (tab.props.name === '1') {
    getTestList()
  }
}

async function getUserList() {
  const { data } = await axios.post('http://localhost:3000/user/alldata', {})
  if (data.code === 2) {
    studentList.value = []
    userList.value = data.body
    data.body.forEach(item => {
      if (item.roletype === '2') {
        studentList.value.push(item)
      }
    })
    // console.log(data.body)
    // console.log(studentList.value)
    // studentListHeader.value = [
    //   {
    //     prop: 'name',
    //     label: '学生姓名'
    //   },{
    //     prop: 'work1',
    //     label: '作业1'
    //   },{
    //     prop: 'test1',
    //     label: '考试1'
    //   },
    // ]
    // console.log(data.body)
  }
}

async function getClassList() {
  const { data } = await axios.post('http://localhost:3000/class/allData', {})
  if (data.code === 2) {
    classList.value = []
    data.body.forEach(item => {
      if (item.teacherid === userid.value) {
        classList.value.push(item)
      }
    })
    tableData.value = classList.value
  }
}

onMounted(async() => {
  userid.value = sessionStorage.getItem('id')
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
        <el-button type="primary" @click="addClass">新建课程</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" max-height="600">
        <el-table-column prop="name" label="课程名" width="300" />
        <el-table-column prop="homeworkNum" label="作业次数"/>
        <el-table-column prop="testNum" label="考试次数"/>
        <el-table-column prop="num" label="选课人数"/>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="showDetail(scope.row)">详情</el-button>
            <!-- <el-button link type="danger" size="small" @click="delData(scoped)">删除</el-button> -->
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
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
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="tabClick">
            <el-tab-pane label="课程信息" name="0">
              <div class="class-info">
                <el-row>
                  <el-col :span="6">课程名：</el-col>
                  <el-col :span="12" :offset="6">
                    <el-input v-model="nowSelectClass.name" placeholder="请输入课程名" />
                  </el-col>
                </el-row>
                <div class="options">
                  <el-button @click="editClassName">修改</el-button>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="考试/作业列表" name="1">
              <div class="class-test">
                <div class="header">
                  <el-input v-model="testFindData" style="width: 240px" placeholder="搜索" />
                  <el-button type="primary" @click="dialogAddTestVisible = true">新建考试/作业</el-button>
                </div>
                <div class="body">
                  <el-table :data="testList" style="width: 100%">
                    <el-table-column prop="name" label="考试/作业名称" />
                    <el-table-column prop="finishNum" label="完成人数" />
                    <el-table-column label="类别">
                      <template #default="scope">
                        <span v-if="scope.row.type === '1'">作业</span>
                        <span v-else>考试</span>
                      </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作">
                      <template #default="scoped">
                        <el-button link type="primary" size="small" @click="editData(scoped)">题目详情</el-button>
                        <el-button link type="danger" size="small" @click="delData(scoped)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="作业列表" name="2">Role</el-tab-pane> -->
            <el-tab-pane label="选课学生列表" name="3">
              <div class="student-list">
                <div class="header">
                  <el-input v-model="studentFindData" style="width: 240px" placeholder="搜索" />
                  <el-button type="primary" @click="dialogAddStudentVisible = true">添加学生</el-button>
                </div>
                <div class="body">
                  <el-table :data="studentList" style="width: 100%">
                    <el-table-column v-for="(item,index) in studentListHeader" 
                      :key="index" 
                      :label="item.label" 
                      :prop="item.prop" 
                      :index="item.index" 
                    ></el-table-column>
                    <el-table-column fixed="right" label="操作">
                      <template #default="scoped">
                        <el-button link type="primary" size="small" @click="editData(scoped)">编辑</el-button>
                        <el-button link type="danger" size="small" @click="delData(scoped)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="right">
          <div class="talk-list">
            <div class="talk-item" v-for="(item, index) in talkingList" :key="index">
              <p>{{ item.user }}:</p>
              <p>{{ item.text}}</p>
            </div>
          </div>
          <div class="my-input">
            <el-input
              v-model="talkText"
              type="textarea"
              placeholder="请输入评论"
            />
            <el-button class="btn" type="primary">提交</el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="dialogAddTestVisible" title="新建考试/作业" width="600" height="900" @close="refreshTestFrom">
      <div class="add-question-form">
        <el-form :model="form">
          <el-form-item label="类别" label-width="62">
            <el-radio-group v-model="testForm.type" class="ml-4">
              <el-radio value="1" size="large">作业</el-radio>
              <el-radio value="2" size="large">考试</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="名称" label-width="62">
            <el-input v-model="testForm.name" />
          </el-form-item>
          <el-form-item
            v-for="(domain, index) in testForm.checkQuestionList"
            :key="domain.key"
            :label="'单选题' + index"
            :prop="'domains.' + index + '.value'"
          >
            <el-input v-model="domain.question" placeholder="请输入选择题题目" />
            <el-row>
              <el-col :span="10">
                <el-input v-model="domain.check1" placeholder="请输入选项1的题面" />
              </el-col>
              <el-col :span="10" :offset="2">
                <el-input v-model="domain.check2" placeholder="请输入选项2的题面" />
              </el-col>
              <el-col :span="10">
                <el-input v-model="domain.check3" placeholder="请输入选项3的题面" />
              </el-col>
              <el-col :span="10" :offset="2">
                <el-input v-model="domain.check4" placeholder="请输入选项4的题面" />
              </el-col>
            </el-row>
            <el-button class="mt-2" @click.prevent="removeCheck(domain)"
              >删除</el-button
            >
          </el-form-item>
          <el-form-item
            v-for="(domain, index) in testForm.textQuestionList"
            :key="domain.key"
            :label="'简答题' + index"
            :prop="'domains.' + index + '.value'"
          >
            <el-input v-model="domain.value" />
            <el-button class="mt-2" @click.prevent="removeText(domain)"
              >删除</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addNewCheck">添加单选题</el-button>
          <el-button @click="addNewText">添加简答题</el-button>
          <el-button @click="doNotAddTest">取消新建</el-button>
          <el-button type="primary" @click="addTest">
            确定新建
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogAddStudentVisible" title="添加学生" width="500" @close="endAddStudent">
      <el-form :model="addStudentForm">
        <el-form-item label="学生" :label-width="formLabelWidth">
          <el-select v-model="addStudentForm.studentid" placeholder="请选择学生">
            <el-option
              v-for="item in studentList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogAddStudentVisible = false">取消</el-button>
          <el-button type="primary" @click="addJoinClass">
            添加选课学生
          </el-button>
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
        .class-test {
          height: 700px;
          width: 100%;
          // display: flex;
          .header {
            width: 95%;
            height: 32px;
            display: flex;
          }
          .body {
            width: 100%;
            height: 650px;
          }
        }
        .student-list {
          height: 700px;
          width: 100%;
          .header {
            width: 95%;
            height: 32px;
            display: flex;
          }
          .body {
            width: 100%;
            height: 650px;
          }
        }
      }
    }
    .right {
      height: 100%;
      width: 30%;
      padding: 10px;
      .talk-list {
        height: 80%;
        overflow: auto;
        .talk-item {
          border:1px solid #ccc;
          margin-top: 10px;
        }
      }
      .my-input {
        height: 20%;
        .btn {
          margin-top: 10px;
        }
      }
    }
  }
  .add-question-form {
    height: 700px;
    overflow: auto;
  }
}
</style>
