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
  console.log(item)
  watchQuestionDialog.value = true
}
const delQuestion = (item) => {
  console.log(item)
}

const beginTest = async () => {
  watchQuestionDialog.value = true
  // testForm
}

const getTestList = async () => {
  testList.value = [
    {
      id: 0,
      name: '第一次全知识点考试',
      questionList: [1,2,3],
      knowList: [0,1],
    }
  ]
}

const getKnowList = async () => {
  knowList.value = [
    {
      id: 0,
      label: '企业的功能与定义',
      tag: '正常',
      upstream: '',
      upstreamIDList: [],
      downstream: '',
      downstreamIDList: [4,8],
    },
    {
      id: 1,
      label: '个人独资/合伙企业',
      tag: '正常',
      upstream: '',
      upstreamIDList: [],
      downstream: '',
      downstreamIDList: [4,8],
    },
    {
      id: 2,
      label: '公司制企业',
      tag: '正常',
      upstream: '',
      upstreamIDList: [],
      downstream: '',
      downstreamIDList: [4,8],
    },
    {
      id: 3,
      label: '企业财务管理的内容',
      tag: '正常',
      upstream: '',
      upstreamIDList: [],
      downstream: '',
      downstreamIDList: [4,8],
    },
    {
      id: 4,
      label: '利润最大化',
      tag: '正常',
      upstream: '',
      upstreamIDList: [0,1,2,3],
      downstream: '',
      downstreamIDList: [5,6,7],
    },
    {
      id: 5,
      label: '股东财富最大化',
      tag: '正常',
      upstream: '',
      upstreamIDList: [4],
      downstream: '',
      downstreamIDList: [],
    },
    {
      id: 6,
      label: '企业价值最大化',
      tag: '正常',
      upstream: '',
      upstreamIDList: [4],
      downstream: '',
      downstreamIDList: [],
    },
    {
      id: 7,
      label: '相关者利益最大化',
      tag: '正常',
      upstream: '',
      upstreamIDList: [4],
      downstream: '',
      downstreamIDList: [],
    },
    {
      id: 8,
      label: '各种财务管理目标之间的关系',
      tag: '正常',
      upstream: '',
      upstreamIDList: [0,1,2,3],
      downstream: '',
      downstreamIDList: [9,10,11],
    },
    {
      id: 9,
      label: '所有者和经营者利益冲突与协调',
      tag: '正常',
      upstream: '',
      upstreamIDList: [8],
      downstream: '',
      downstreamIDList: [],
    },
    {
      id: 10,
      label: '大股东与中小股东利益冲突与协调',
      tag: '正常',
      upstream: '',
      upstreamIDList: [8],
      downstream: '',
      downstreamIDList: [],
    },
    {
      id: 11,
      label: '所有者和债权人的利益冲突与协调',
      tag: '正常',
      upstream: '',
      upstreamIDList: [8],
      downstream: '',
      downstreamIDList: [],
    },
  ]
}

const getMyClass = async () => {
  myClassList.value = [
    {
      userid: '2001',
      classid: 0,
      type: 0,
    },
    {
      userid: '2001',
      classid: 1,
      type: 1,
    },
    {
      userid: '2001',
      type: 0,
      testid: 0,
      score: null
    },
  ]
  const knowMap = {}
  for (let i = 0; i <knowList.value.length; i++) {
    knowMap[knowList.value[i].id] = knowList.value[i].label
  }
  tableData.value = []
  myClassList.value.forEach(obj => {
    if (obj.testid !== undefined) {
      testList.value.forEach(item => {
        let know = ''
        item.knowList.forEach(key => {
          know += knowMap[key] + ','
        })
        tableData.value.push({
          ...item,
          score: obj.score || '--',
          know
        })
      })
    }
  })

}

onMounted(async() => {
  await getKnowList()
  await getTestList()
  await getMyClass()
})




</script>

<template>
  <div class="admin-test">
    <div class="header"></div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="考试名称" width="180" />
        <el-table-column prop="know" label="涉及到的知识点" />
        <el-table-column prop="score" label="成绩" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button :disabled="scope.row.score !== '--'" link type="primary" size="small" @click="beginTest(scope.row)">开始考试</el-button>
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
          <el-button @click="backQuestion">上一题</el-button>
          <el-button @click="nextQuestion">下一题</el-button>
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
