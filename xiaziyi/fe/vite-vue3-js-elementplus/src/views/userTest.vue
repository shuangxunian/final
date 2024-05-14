<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const knowList = ref([])
const testList = ref([])
const myClassList = ref([])
const formLabelWidth = ref(100)
const addTestDialog = ref(false)
const watchQuestionDialog = ref(false)
const testForm = ref({
  name: '',
  questionList: [],
  knowList: [],
  num: 0,
})
const questionForm = ref({
  question: '列关于企业的定义的表述中，错误的是',
  know: '企业的定义与功能',
  knowID: 0,
  type: '单选',
  answer: 'C',
  answerList: [0,0,1,0],
  answerAText: "是依法设立的，以营利为目的",
  answerBText: "运用各种生产要素，向市场提供商品或服务",
  answerCText: "是法人",
  answerDText: "实行自主经营、自负盈亏、独立核算",
})
const userid = ref('')
const myTestList = ref([])
const selectQuestionList = ref([])
const nowQuestionIndex = ref(0)
const needStudyList = ref([])
const errorStr = ref('')
const showErrorDialog = ref(false)
const rightAnswer = ref(0)
const selectObj = ref({})
const sysTestType = ref(false)

const clearForm = () => {
  addTestForm.value = {
    name: '',
    questionList: [],
    knowList: [],
    num: 0,
  }
}
const editTest = async (row) => {
  addTestForm.value = row
  addTestDialog.value = true
}
const makeSureDel = async (row) => {}
const dontAddQuestion = async (row) => {
  addTestDialog.value = false
  clearForm()
}
const trueAddQuestion = async (row) => {}
const addQuestionList = async (row) => {
  addTestForm.value.questionList = [1,2,3,4]
}
const watchQuestion = async (item) => {
  watchQuestionDialog.value = true
}
const delQuestion = (item) => {}

const beginTest = async (row) => {
  selectObj.value = row
  needStudyList.value = []
  nowQuestionIndex.value = 0
  rightAnswer.value = 0
  selectQuestionList.value = row.questionList
  const { data } = await axios.post('http://localhost:3000/question/find',{
    id: selectQuestionList.value[nowQuestionIndex.value]
  })
  if (data.code === 2) {
    questionForm.value = data.body[0]
    let answer = 0
    questionForm.value.selectList.split(',').forEach(item => {
      if (item === '1') {
        answer++
      }
    })
    questionForm.value.type = answer === 1 ? '单选' : '多选'
    watchQuestionDialog.value = true
  }
}

const getKnowList = async () => {
  const { data } = await axios.post('http://localhost:3000/know/allData',{})
  if (data.code === 2) {
    knowList.value = data.body
  }
}

const getTestList = async () => {
  const { data } = await axios.post('http://localhost:3000/test/allData')
  if (data.code === 2) {
    testList.value = data.body
    const knowMap = {}
    for (let i = 0; i < knowList.value.length; i++) {
      knowMap[knowList.value[i].id] = knowList.value[i].name
    }
    for (let i = 0; i < testList.value.length; i++) {
      let knowArr = testList.value[i].knowStr.split(',')
      let str = ''
      knowArr.forEach(item => {
        str += knowMap[item] + ','
      })
      testList.value[i].know = str
      testList.value[i].questionList = testList.value[i].questionStr.split(',')
      testList.value[i].isNew = testList.value[i].isNew === "true"
    }
    // tableData.value = testList.value
  }
}

const getMyTest = async () => {
  const { data } = await axios.post('http://localhost:3000/mytest/allData',{
    userid: userid.value
  })
  if (data.code === 2) {
    myTestList.value = data.body
    console.log(myTestList.value)
    const arr = []
    myTestList.value.forEach(item => {
      let obj = {}
      for (let i = 0; i < testList.value.length; i++) {
        if (item.testid === testList.value[i].id) {
          obj = {
            name: testList.value[i].name,
            know: testList.value[i].know,
            questionList: testList.value[i].questionList,
          }
          break
        }
      }
      if (item.course >= 0 && item.course !== null) {
        obj.course = item.course
      } else {
        obj.course = '--'
      }
      obj.myTestID = item.id
      arr.push(obj)
    })
    tableData.value = arr
  }
}

const nextQuestion = async () => {
  let str = ''
  if (questionForm.value.checkList.includes('A')) {
    str += '1,'
  } else {
    str += '0,'
  }
  if (questionForm.value.checkList.includes('B')) {
    str += '1,'
  } else {
    str += '0,'
  }
  if (questionForm.value.checkList.includes('C')) {
    str += '1,'
  } else {
    str += '0,'
  }
  if (questionForm.value.checkList.includes('D')) {
    str += '1'
  } else {
    str += '0'
  }
  if (questionForm.value.selectList !== str) {
    if (!needStudyList.value.includes(questionForm.value.knowID)) {
      needStudyList.value.push(questionForm.value.knowID)
    }
  } else {
    rightAnswer.value++
  }

  nowQuestionIndex.value++
  const { data } = await axios.post('http://localhost:3000/question/find',{
    id: selectQuestionList.value[nowQuestionIndex.value]
  })
  if (data.code === 2) {
    questionForm.value = data.body[0]
    let answer = 0
    questionForm.value.selectList.split(',').forEach(item => {
      if (item === '1') {
        answer++
      }
    })
    questionForm.value.type = answer === 1 ? '单选' : '多选'
  }
}

const finishQuestion = async () => {
  let str = ''
  if (questionForm.value.checkList.includes('A')) {
    str += '1,'
  } else {
    str += '0,'
  }
  if (questionForm.value.checkList.includes('B')) {
    str += '1,'
  } else {
    str += '0,'
  }
  if (questionForm.value.checkList.includes('C')) {
    str += '1,'
  } else {
    str += '0,'
  }
  if (questionForm.value.checkList.includes('D')) {
    str += '1'
  } else {
    str += '0'
  }
  if (questionForm.value.selectList !== str) {
    if (!needStudyList.value.includes(questionForm.value.knowID)) {
      needStudyList.value.push(questionForm.value.knowID)
    }
  } else {
    rightAnswer.value++
  }

  errorStr.value = ''
  for (let i = 0; i < needStudyList.value.length; i++) {
    let obj = {}
    for(let j = 0; j < knowList.value.length; j++) {
      if (knowList.value[j].id === needStudyList.value[i]) {
        obj = knowList.value[j]
        break
      }
    }
    errorStr.value += obj.name + ','
  }


  await axios.post('http://localhost:3000/mytest/edit',{
    id: selectObj.value.myTestID,
    course: rightAnswer.value
  })

  await axios.post('http://localhost:3000/myclass/add',{
    userid: userid.value,
    knowid: needStudyList.value
  })

  showErrorDialog.value = true
}

const finishAll = async () => {
  watchQuestionDialog.value = false
  showErrorDialog.value = false
  await getMyTest()

}



onMounted(async() => {
  userid.value = window.sessionStorage.getItem('id')
  sysTestType.value = window.sessionStorage.getItem('sysTestType') === '1'
  await getKnowList()
  await getTestList()
  await getMyTest()
  // await getMyClass()
})




</script>

<template>
  <div class="admin-test">
    <div class="header"></div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="考试名称" width="180" />
        <el-table-column prop="know" label="涉及到的知识点" />
        <el-table-column prop="course" label="成绩" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.course === '--'" type="danger">未考试</el-tag>
            <el-tag v-else type="success">{{scope.row.course}} / {{scope.row.questionList.length}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button :disabled="scope.row.course !== '--'" link type="primary" size="small" @click="beginTest(scope.row)">开始考试</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="watchQuestionDialog" title="问题详情" width="500" :fullscreen="true">
      <div class="form">
        <p>({{ questionForm.type }}){{ questionForm.question }}</p>
        <el-checkbox-group v-model="questionForm.checkList">
          <p>
            <el-checkbox :label="questionForm.answerAText" value="A" />
          </p>
          <p>
            <el-checkbox :label="questionForm.answerBText" value="B" />
          </p>
          <p>
            <el-checkbox :label="questionForm.answerCText" value="C" />
          </p>
          <p>
            <el-checkbox :label="questionForm.answerDText" value="D" />
          </p>
        </el-checkbox-group>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <!-- <el-button @click="backQuestion">上一题</el-button> -->
          <el-button v-if="nowQuestionIndex === selectQuestionList.length - 1" @click="finishQuestion">提交试卷</el-button>
          <el-button v-else @click="nextQuestion">下一题</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="showErrorDialog" title="薄弱知识点" width="500">
      <div>
        <p v-if="errorStr !== ''">经测试，您对于{{errorStr}}掌握薄弱，已为您自动添加对应课程！</p>
        <p v-else>恭喜您，您所有答案均正确，并无需要提升的课程</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="finishAll">好的</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.admin-test {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    height: 20px;
    line-height: 20px;
    width: calc(100% - 40px);
  }
  .table {
    height: 600px;
    width: 100%;
  }
  .form {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, 0);
  }
}
</style>
