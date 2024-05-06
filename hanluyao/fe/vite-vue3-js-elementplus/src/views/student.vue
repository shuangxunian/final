<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const userid = ref('')
const talkingList = ref([])
const talkText = ref('')
const testFindData = ref('')
const testList = ref([])
const myTestList = ref([])
const myAnswerList = ref([])
const classList=ref({})
const myClassList=ref({})
const nowSelectClass = ref({})
const testForm = ref({})
const userList = ref([])
const loading = ref(false)
const dialogEditTestVisible = ref(false)
const dialogShowTestVisible = ref(false)


function getDate(timestamp) {
  const date = new Date(Number(timestamp))
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function refreshTestFrom() {
  testForm.value = {}
  getAllData()
}

async function getTestList() {
  const { data } = await axios.post('http://localhost:3000/test/allData', {
    classid: nowSelectClass.value.classid
  })
  if (data.code === 2) {
    testList.value = data.body
    const myTestMap = {}
    myTestList.value.forEach(item => {
      myTestMap[item.testid] = item
    })
    testList.value.map(item => {
      if (myTestMap[item.id]) {
        item.status = myTestMap[item.id].status
        item.grade = myTestMap[item.id].grade
      } else {
        item.status = '未开始'
        item.grade = '-'
      }
      return item
    })
    // testList.value.forEach(item => {
    //   if (myTestMap[item.id]) {
    //     item.status = myTestMap[item.id].status
    //     item.grade = myTestMap[item.id].grade
    //   }
    // })
  }
}

async function getMyTestList() {
  const { data } = await axios.post('http://localhost:3000/myTest/allData', {
    studentid: userid.value
  })
  if (data.code === 2) {
    myTestList.value = data.body
  }
}


async function getTalkingList() {
  const { data } = await axios.post('http://localhost:3000/talking/allData', {
    classid: nowSelectClass.value.classid
  })
  if (data.code === 2) {
    talkingList.value = data.body
    const nameMap = {}
    userList.value.forEach(item => {
      nameMap[item.id] = item.name
    })
    talkingList.value.forEach(item => {
      item.name = nameMap[item.userid]
    })
  }
}

async function addTalking() {
  const { data } = await axios.post('http://localhost:3000/talking/add', {
    userid: userid.value,
    classid: nowSelectClass.value.classid,
    text: talkText.value
  })
  if (data.code === 2) {
    talkText.value = ''
    await getTalkingList()
  }
}

async function getClassList() {
  const { data } = await axios.post('http://localhost:3000/class/allData', {})
  if (data.code === 2) {
    classList.value = data.body
  }
}

const getStudentList = async () => {
  const { data } = await axios.post('http://localhost:3000/select_class/mySelect', {
    studentid: userid.value
  })
  if (data.code === 2) {
    myClassList.value = []
    const classMap = {}
    classList.value.forEach(item => {
      classMap[item.id] = item.name
    })
    data.body.forEach(item => {
      myClassList.value.push({
        ...item,
        name: classMap[item.classid]
      })
    })
    nowSelectClass.value = nowSelectClass.value.id ? nowSelectClass.value : myClassList.value[0]
  }
}

async function getUserList() {
  const { data } = await axios.post('http://localhost:3000/user/alldata', {})
  if (data.code === 2) {
    userList.value = data.body
  }
}

function beginTest(row) {
  testForm.value = row
  dialogEditTestVisible.value = true
}

async function finishQuestion() {
  const answerList = []
  const answerMap = {}
  for (let i = 0; i < testForm.value.checkQuestionList.length; i++) {
    const item = testForm.value.checkQuestionList[i]
    if (!item.selectAnswer) {
      ElMessage.error('请选择答案')
      return
    }
    answerMap[item.key] = item.selectAnswer
  }
  for (let i = 0; i < testForm.value.textQuestionList.length; i++) {
    const item = testForm.value.textQuestionList[i]
    if (!item.textAnswer) {
      ElMessage.error('请输入答案')
      return
    }
    answerMap[item.key] = item.textAnswer
  }

  const { data } = await axios.post('http://localhost:3000/myTest/add', {
    studentid: userid.value,
    testid: testForm.value.id,
    answer: answerMap
  })
  if (data.code === 2) {
    ElMessage.success('提交成功')
    dialogEditTestVisible.value = false
    await getAllData()
    // await getMyTestList()
  }
}

function detailTest(row) {
  let answerMap = {}
  for (let i = 0; i < myTestList.value.length; i++) {
    if (myTestList.value[i].testid === row.id) {
      answerMap = myTestList.value[i].answer
      break
    }
  }
  testForm.value = row
  testForm.value.checkQuestionList.map(item => {
    item.selectAnswer = answerMap[item.key]
    return item
  })
  testForm.value.textQuestionList.map(item => {
    item.textAnswer = answerMap[item.key]
    return item
  })
  // testForm.value.grade = answerMap.grade
  // console.log(testForm)
  dialogShowTestVisible.value = true
}

async function getAllData() {
  loading.value = true
  await getUserList()
  await getClassList()
  await getStudentList()
  await getTalkingList()
  await getMyTestList()
  await getTestList()
  loading.value = false
}

function classChange(item) {
  nowSelectClass.value = item
  getAllData()
}

onMounted(async() => {
  userid.value = sessionStorage.getItem('id')
  getAllData()
})


</script>

<template>
  <div class="student">
    <div class="my-class">
      <div class="class-item" :class="nowSelectClass?.id === item?.id ? 'active' : ''" @click="classChange(item)" v-for="(item, index) in myClassList" :key="index">
         <!-- :class="nowSelectClass.id === item.id ? 'active' : ''" -->
        <!-- {{ nowSelectClass }} -->
        <!-- {{ item }} -->
        {{ item.name }}
      </div>
    </div>
    <div class="left">
      <div class="class-test">
        <!-- <div class="header">
          <el-input v-model="testFindData" style="width: 240px" placeholder="搜索" />
        </div> -->
        <div class="body">
          <el-table v-loading="loading" :data="testList" style="width: 100%">
            <el-table-column prop="name" label="考试/作业名称" />
            <el-table-column prop="status" label="当前状态" />
            <el-table-column prop="grade" label="分数" />
            <el-table-column fixed="right" label="操作">
              <template #default="scoped">
                <el-button v-if="scoped.row.status === '未开始'" link type="primary" size="small" @click="beginTest(scoped.row)">开始答题</el-button>
                <el-button v-else link type="primary" size="small" @click="detailTest(scoped.row)">查看试卷</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div v-loading="loading" class="right">
      <div v-if="talkingList.length" class="talk-list">
        <div class="talk-item" v-for="(item, index) in talkingList" :key="index">
          <div class="talk-header">
            <div class="talk-name">{{ item.name }}:</div>
            <div class="talk-time">{{ getDate(item.id) }}</div>
          </div>
          <div class="talk-body">
            <div class="text">{{ item.text }}</div>
          </div>
        </div>
      </div>
      <div v-else class="talk-list">
        暂无讨论！
      </div>
      <div class="my-input">
        <el-input
          v-model="talkText"
          type="textarea"
          placeholder="请输入评论"
        />
        <el-button class="btn" type="primary" @click="addTalking">提交</el-button>
      </div>
    </div>

    <el-dialog fullscreen v-model="dialogEditTestVisible" title="提交" @close="refreshTestFrom">
      <div class="add-question-form">
        <h2>{{testForm.type === '1' ? '作业' : '考试'}}名称：{{ testForm.name }}</h2>
        <div v-for="(domain, index) in testForm.checkQuestionList" :key="domain.key" class="select-question">
          <div class="question-title">
            <span>{{ index + 1 }}.</span>
            <span>{{ domain.question }}</span>
          </div>
          <div class="question-options">
            <el-radio-group v-model="domain.selectAnswer">
              <el-radio value="1">{{ domain.check1 }}</el-radio>
              <el-radio value="2">{{ domain.check2 }}</el-radio>
              <el-radio value="3">{{ domain.check3 }}</el-radio>
              <el-radio value="4">{{ domain.check4 }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div v-for="(domain, index) in testForm.textQuestionList" :key="domain.key" class="select-question">
          <div class="question-title">
            <span>{{ index + 1 }}.</span>
            <span>{{ domain.value }}</span>
          </div>
          <div class="question-options">
            <el-input v-model="domain.textAnswer" type="textarea" />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="finishQuestion">提交</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog fullscreen v-model="dialogShowTestVisible" title="查看" @close="refreshTestFrom">
      <div class="add-question-form">
        <h2>{{testForm.type === '1' ? '作业' : '考试'}}名称：{{ testForm.name }}</h2>
        <h3>分数：{{testForm.grade}}</h3>
        <div v-for="(domain, index) in testForm.checkQuestionList" :key="domain.key" class="select-question">
          <div class="question-title">
            <span>{{ index + 1 }}.</span>
            <span>{{ domain.question }}</span>
          </div>
          <div class="question-options">
            <el-radio-group disabled v-model="domain.selectAnswer">
              <el-radio value="1">{{ domain.check1 }}</el-radio>
              <el-radio value="2">{{ domain.check2 }}</el-radio>
              <el-radio value="3">{{ domain.check3 }}</el-radio>
              <el-radio value="4">{{ domain.check4 }}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div v-for="(domain, index) in testForm.textQuestionList" :key="domain.key" class="select-question">
          <div class="question-title">
            <span>{{ index + 1 }}.</span>
            <span>{{ domain.value }}</span>
          </div>
          <div class="question-options">
            <el-input disabled v-model="domain.textAnswer" type="textarea" />
          </div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<style lang="less" scoped>
.student {
  height: 100%;
  width: 100%;
  display: flex;
  background-color: #fff;
  .my-class {
    width: 10%;
    height: 100%;
    padding: 10px;
    .class-item {
      height: 30px;
      line-height: 30px;
      border: 1px solid #ccc;
      margin-top: 10px;
      padding: 0 10px;
    }
    .active {
      background: #409EFF;
    }
  }
  .left {
    width: 70%;
    height: 100%;
    .class-test {
      height: 700px;
      width: 100%;
      .header {
        margin: 10px 20px;
        width: calc(100% - 40px);
        height: 32px;
        display: flex;
        justify-content: space-between;
      }
      .body {
        width: 100%;
        height: 650px;
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
        padding: 8px;
        .talk-header {
          display: flex;
          justify-content: space-between;
          .talk-name {
            font-size: 16px;
            font-weight: 600;
          }
          .talk-time {
            font-size: 14px;
            color: #999;
          }
        }
        .talk-body {
          margin-top: 10px;
        }
        .talk-body {

        }
      }
    }
    .my-input {
      height: 20%;
      .btn {
        margin-top: 10px;
      }
    }
  }
  .add-question-form {
    margin: 0 auto;
    width: 50%;
    .question-title {
      font-size: 24px;
    }
  }
  .dialog-footer {
    margin: 0 auto;
    width: 50%;
  }
}
</style>
