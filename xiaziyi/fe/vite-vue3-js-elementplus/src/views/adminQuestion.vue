<script setup>
import { ref, computed, onMounted, toRaw } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const knowList = ref([])
const questionList = ref([])
const formLabelWidth = ref(150)
const addQuestionDialog = ref(false)
const editQuestionDialog = ref(false)
 
const addQuestionForm = ref({
  question: '',
  knowID: null,
  answerAText: "",
  answerBText: "",
  answerCText: "",
  answerDText: "",
  selectList: [],
  answerList: [0,0,0,0],
})

const clearForm = () => {
  addQuestionForm.value = {
    question: '',
    knowID: null,
    answerAText: "",
    answerBText: "",
    answerCText: "",
    answerDText: "",
    selectList: [],
    answerList: [0,0,0,0],
  }
}
const dontAddQuestion = () => {}

const trueAddQuestion = async () => {
  if (addQuestionForm.value.question === '') return ElMessage.error('请输入问题！')
  if (addQuestionForm.value.knowID === null) return ElMessage.error('请选择知识点！')
  if (addQuestionForm.value.answerAText === '') return ElMessage.error('请填写选项A！')
  if (addQuestionForm.value.answerBText === '') return ElMessage.error('请填写选项B！')
  if (addQuestionForm.value.answerCText === '') return ElMessage.error('请填写选项C！')
  if (addQuestionForm.value.answerDText === '') return ElMessage.error('请填写选项D！')
  if (addQuestionForm.value.selectList.length === 0) return ElMessage.error('请填选择答案！')
  const { data } = await axios.post('http://localhost:3000/question/add',{
    ...addQuestionForm.value
  })
  if (data.code === 2) {
    ElMessage.success('添加成功！')
    clearForm()
    addQuestionDialog.value = false
    getQuestionList()
  } else {
    ElMessage.error(data.msg)
  }
}

const trueEditQuestion = async () => {
  if (addQuestionForm.value.question === '') return ElMessage.error('请输入问题！')
  if (addQuestionForm.value.knowID === null) return ElMessage.error('请选择知识点！')
  if (addQuestionForm.value.answerAText === '') return ElMessage.error('请填写选项A！')
  if (addQuestionForm.value.answerBText === '') return ElMessage.error('请填写选项B！')
  if (addQuestionForm.value.answerCText === '') return ElMessage.error('请填写选项C！')
  if (addQuestionForm.value.answerDText === '') return ElMessage.error('请填写选项D！')
  if (addQuestionForm.value.selectList.length === 0) return ElMessage.error('请填选择答案！')
  const { data } = await axios.post('http://localhost:3000/question/edit',{
    ...addQuestionForm.value
  })
  if (data.code === 2) {
    ElMessage.success('添加成功！')
    clearForm()
    addQuestionDialog.value = false
    getQuestionList()
  } else {
    ElMessage.error(data.msg)
  }
}


const editQuestion = async(row) => {
  addQuestionForm.value = row
  editQuestionDialog.value = true
}

const makeSureDel = async(row) => {
  const { data } = await axios.post('http://localhost:3000/question/del',{
    id: row.id
  })
  if (data.code === 2) {
    ElMessage.success('删除成功！')
    getQuestionList()
  }
}

const getQuestionList = async () => {
  const { data } = await axios.post('http://localhost:3000/question/allData',{})
  if (data.code === 2) {
    questionList.value = data.body
    const knowMap = {}
    const answerMap = {
      0: 'A',
      1: 'B',
      2: 'C',
      3: 'D',
    }
    for (let i = 0; i <knowList.value.length; i++) {
      knowMap[knowList.value[i].id] = knowList.value[i].name
    }
    for (let i = 0; i < questionList.value.length; i++) {
      let num = 0
      questionList.value[i].answer = ''
      questionList.value[i].know = knowMap[questionList.value[i].knowID]
      const arr = questionList.value[i].selectList.split(',')
      questionList.value[i].selectList = []
      for (let j = 0; j < arr.length; j++) {
        if (arr[j] === '1') {
          questionList.value[i].selectList.push(answerMap[j])
          num++
          questionList.value[i].answer += answerMap[j] + ','
        }
      }
      questionList.value[i].type = num === 1 ? '单选' : '多选'
    }
    
    tableData.value = data.body
  }
}

const getKnowList = async () => {
  const { data } = await axios.post('http://localhost:3000/know/allData',{})
  if (data.code === 2) {
    knowList.value = data.body
  }
}

onMounted(async() => {
  await getKnowList()
  await getQuestionList()
})

</script>

<template>
  <div class="admin-question">
    <div class="header">
      <el-button type="primary" @click="addQuestionDialog = true">新建问题</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="question" label="问题" width="180" />
        <el-table-column prop="know" label="知识点" width="180" />
        <el-table-column prop="type" label="类别" width="180" />
        <el-table-column prop="answer" label="答案" width="180" />
        <el-table-column prop="answerAText" label="答案A" width="180" />
        <el-table-column prop="answerBText" label="答案B" width="180" />
        <el-table-column prop="answerCText" label="答案C" width="180" />
        <el-table-column prop="answerDText" label="答案D" width="180" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="editQuestion(scope.row)">编辑</el-button>
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="addQuestionDialog" title="新建试卷" width="500" @close="clearForm">
      <el-form :model="addQuestionForm">
        <el-form-item label="问题" :label-width="formLabelWidth">
          <el-input v-model="addQuestionForm.question" />
        </el-form-item>
        <el-form-item label="所关联知识点" :label-width="formLabelWidth">
          <el-select v-model="addQuestionForm.knowID" placeholder="请选择">
            <el-option
              v-for="item in knowList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="答案A" :label-width="formLabelWidth">
          <el-input v-model="addQuestionForm.answerAText" />
        </el-form-item>
        <el-form-item label="答案B" :label-width="formLabelWidth">
          <el-input v-model="addQuestionForm.answerBText" />
        </el-form-item>
        <el-form-item label="答案C" :label-width="formLabelWidth">
          <el-input v-model="addQuestionForm.answerCText" />
        </el-form-item>
        <el-form-item label="答案D" :label-width="formLabelWidth">
          <el-input v-model="addQuestionForm.answerDText" />
        </el-form-item>
        <el-form-item label="答案" :label-width="formLabelWidth">
          <el-checkbox-group v-model="addQuestionForm.selectList">
            <el-checkbox label="A" value="A" />
            <el-checkbox label="B" value="B" />
            <el-checkbox label="C" value="C" />
            <el-checkbox label="D" value="D" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dontAddQuestion">取消</el-button>
          <el-button type="primary" @click="trueAddQuestion">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editQuestionDialog" title="编辑试卷" width="500" @close="clearForm">
      <el-form :model="addQuestionForm">
        <el-form-item label="问题" :label-width="formLabelWidth">
          <el-input v-model="addQuestionForm.question" />
        </el-form-item>
        <el-form-item label="所关联知识点" :label-width="formLabelWidth">
          <el-select v-model="addQuestionForm.knowID" placeholder="请选择">
            <el-option
              v-for="item in knowList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="答案A" :label-width="formLabelWidth">
          <el-input v-model="addQuestionForm.answerAText" />
        </el-form-item>
        <el-form-item label="答案B" :label-width="formLabelWidth">
          <el-input v-model="addQuestionForm.answerBText" />
        </el-form-item>
        <el-form-item label="答案C" :label-width="formLabelWidth">
          <el-input v-model="addQuestionForm.answerCText" />
        </el-form-item>
        <el-form-item label="答案D" :label-width="formLabelWidth">
          <el-input v-model="addQuestionForm.answerDText" />
        </el-form-item>
        <el-form-item label="答案" :label-width="formLabelWidth">
          <el-checkbox-group v-model="addQuestionForm.selectList">
            <el-checkbox label="A" value="A" />
            <el-checkbox label="B" value="B" />
            <el-checkbox label="C" value="C" />
            <el-checkbox label="D" value="D" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dontAddQuestion">取消</el-button>
          <el-button type="primary" @click="trueEditQuestion">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.admin-question {
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
