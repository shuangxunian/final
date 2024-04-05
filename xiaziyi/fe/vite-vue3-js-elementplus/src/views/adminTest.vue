<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const knowList = ref([])
const testList = ref([])
const questionList = ref([])
const formLabelWidth = ref(100)
const addTestDialog = ref(false)
const watchQuestionDialog = ref(false)
const addTestForm = ref({
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
const editTestDialog = ref(false)

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
  editTestDialog.value = true
  // console.log(row)
}

const toEditTest = async () => {
  const { data } = await axios.post('http://localhost:3000/test/edit', addTestForm.value)
  if (data.code === 2) {
    ElMessage.success('修改成功')
    getTestList()
    editTestDialog.value = false
  }
}

const makeSureDel = async (row) => {
  const { data } = await axios.post('http://localhost:3000/test/del',{id: row.id})
  if (data.code === 2) {
    ElMessage.success('删除成功')
    getTestList()
  }
}
const dontAddQuestion = async (row) => {
  getTestList()
  addTestDialog.value = false
  clearForm()
}
const trueAddQuestion = async () => {
  // console.log(addTestForm.value)
  const { data } = await axios.post('http://localhost:3000/test/add', addTestForm.value)
  if (data.code === 2) {
    ElMessage.success('添加成功')
    addTestDialog.value = false
    getTestList()
    clearForm()
  }
}

const addQuestionList = async () => {
  if (addTestForm.value.name === '') return ElMessage.error('请输入考试名称')
  if (addTestForm.value.knowList.length === 0) return ElMessage.error('请选择知识点')
  if (addTestForm.value.num === 0) return ElMessage.error('请输入问题数量')
  const { data } = await axios.post('http://localhost:3000/question/allData',{})
  let nowQuesList = []
  let num = Number(addTestForm.value.num)
  if (data.code === 2) {
    questionList.value = data.body
    let nowLen = 0
    while(1) {
      for (let i = 0; i < addTestForm.value.knowList.length; i++) {
        let knowID = addTestForm.value.knowList[i]
        for (let j = 0; j < questionList.value.length; j++) {
          if (questionList.value[j].knowID === knowID && !nowQuesList.includes(questionList.value[j].id)){
            nowQuesList.push(questionList.value[j].id)
            break
          }
        }
        if (nowQuesList.length === num) {
          break
        }
      }
      if (nowQuesList.length === num) {
        break
      }
      if (nowLen === nowQuesList.length) {
        return ElMessage.error('题目数量不足')
      } else {
        nowLen = nowQuesList.length
      }
    }
    addTestForm.value.questionList = nowQuesList
  }
}
const watchQuestion = async (item) => {
  // console.log(questionList.value)
  for (let i = 0; i < questionList.value.length; i++) {
    console.log(questionList.value[i])
    if (questionList.value[i].id === item) {
      questionForm.value = questionList.value[i]
      for (let j = 0; j < knowList.value.length; j++) {
        if (knowList.value[j].id === questionList.value[i].knowID) {
          questionForm.value.know = knowList.value[j].name
        }
      }
      let num = 0, str = ''
      let arr = questionList.value[i].selectList.split(',')
      arr.forEach(ans => {
        if (ans === '1') num++
      })
      str = arr[0] === '1' ? 'A,' : '' + arr[1] === '1' ? 'B,' : '' + arr[2] === '1' ? 'C,' : '' + arr[3] === '1' ? 'D' : ''
      questionForm.value.type = num === 1 ? '单选' : '多选'
      questionForm.value.answer = str
      break
    }
  }
  watchQuestionDialog.value = true
}
const delQuestion = (item) => {
  addTestForm.value.questionList = addTestForm.value.questionList.filter(obj => obj !== item)
}



const getTestList = async () => {
  const { data } = await axios.post('http://localhost:3000/test/allData')
  if (data.code === 2) {
    testList.value = data.body
    const knowMap = {}
    for (let i = 0; i < knowList.value.length; i++) {
      knowMap[knowList.value[i].id] = knowList.value[i].name
    }
    console.log(testList.value)
    for (let i = 0; i < testList.value.length; i++) {
      let knowArr = testList.value[i].knowStr.split(',')
      let str = ''
      knowArr.forEach(item => {
        str += knowMap[item] + ','
      })
      testList.value[i].know = str
      testList.value[i].questionList = testList.value[i].questionStr.split(',')

    }
    tableData.value = testList.value
  }
}

const getKnowList = async () => {
  const { data } = await axios.post('http://localhost:3000/know/allData',{})
  if (data.code === 2) {
    knowList.value = data.body
  }
}

const getQuestList = async () => {
  const { data } = await axios.post('http://localhost:3000/question/allData',{})
  if (data.code === 2) {
    questionList.value = data.body
  }
}

onMounted(async() => {
  await getKnowList()
  await getTestList()
  await getQuestList()
})




</script>

<template>
  <div class="admin-test">
    <div class="header">
      <el-button type="primary" @click="addTestDialog = true">新建试卷</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="考试名称" width="180" />
        <el-table-column prop="know" label="知识点" />
        <el-table-column label="所含题目" width="180">
          <template #default="scope">
            <span  v-for="(item, index) in scope.row.questionList" :key="item">
              <el-link @click="watchQuestion(item)">{{index + 1}}</el-link>
              <span>，</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="editTest(scope.row)">编辑</el-button>
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="addTestDialog" title="添加考试" width="500"  @close="clearForm">
      <el-form :model="addTestForm">
        <el-form-item label="考试名称" :label-width="formLabelWidth">
          <el-input v-model="addTestForm.name" />
        </el-form-item>
        <el-form-item label="所关联知识点" :label-width="formLabelWidth">
          <el-checkbox-group v-model="addTestForm.knowList">
            <el-checkbox v-for="item in knowList" :label="item.name" :value="item.id" :key="item.id" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="addTestForm.questionList.length === 0" label="问题数量" :label-width="formLabelWidth">
          <el-input v-model="addTestForm.num" />
        </el-form-item>
        <el-form-item v-if="addTestForm.questionList.length !== 0" label="问题" :label-width="formLabelWidth">
          <span v-for="(item, index) in addTestForm.questionList" :key="item">
            <!-- <el-link @click="watchQuestion(item)">{{item}}</el-link> -->
            <el-tag @click.stop="watchQuestion(item)" closable @close="delQuestion(item)">
              问题{{ index + 1 }}
            </el-tag>
            <span>，</span>
          </span>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dontAddQuestion">取消</el-button>
          <el-button v-if="addTestForm.questionList.length !== 0" type="primary" @click="trueAddQuestion">确定</el-button>
          <el-button v-else @click="addQuestionList">生成问题</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editTestDialog" title="编辑考试" width="500"  @close="clearForm">
      <el-form :model="addTestForm">
        <el-form-item label="考试名称" :label-width="formLabelWidth">
          <el-input v-model="addTestForm.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dontAddQuestion">取消</el-button>
          <el-button @click="toEditTest">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="watchQuestionDialog" title="问题详情" width="500">
      <el-form :model="questionForm">
        <el-form-item label="问题" :label-width="formLabelWidth">
          <span>{{ questionForm.question }}</span>
        </el-form-item>
        <el-form-item label="知识点" :label-width="formLabelWidth">
          <span>{{ questionForm.know }}</span>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <span>{{ questionForm.type }}</span>
        </el-form-item>
        <el-form-item label="答案A" :label-width="formLabelWidth">
          <span>{{ questionForm.answerAText }}</span>
        </el-form-item>
        <el-form-item label="答案B" :label-width="formLabelWidth">
          <span>{{ questionForm.answerBText }}</span>
        </el-form-item>
        <el-form-item label="答案C" :label-width="formLabelWidth">
          <span>{{ questionForm.answerCText }}</span>
        </el-form-item>
        <el-form-item label="答案D" :label-width="formLabelWidth">
          <span>{{ questionForm.answerDText }}</span>
        </el-form-item>
        <el-form-item label="答案" :label-width="formLabelWidth">
          <span>{{ questionForm.answer }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="watchQuestionDialog = false">关闭</el-button>
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
    height: 70px;
    line-height: 70px;
    width: calc(100% - 40px);
    padding: 0 20px;
  }
  .table {
    height: 600px;
    width: 100%;
  }
}
</style>
