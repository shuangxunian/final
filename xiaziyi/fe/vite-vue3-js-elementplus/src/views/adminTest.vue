<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const knowList = ref([])
const testList = ref([])
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
  // console.log(row)
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



const getTestList = async () => {
  testList.value = [
    {
      id: 0,
      name: '第一次全知识点考试',
      questionList: [1,2,3],
      knowList: [0,1],
    }
  ]
  const knowMap = {}
  for (let i = 0; i <knowList.value.length; i++) {
    knowMap[knowList.value[i].id] = knowList.value[i].label
  }
  tableData.value = []
  testList.value.forEach(item => {
    let know = ''
    item.knowList.forEach(key => {
      know += knowMap[key] + ','
    })
    tableData.value.push({
      ...item,
      know
    })
  })
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

onMounted(async() => {
  await getKnowList()
  await getTestList()
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
            <span  v-for="item in scope.row.questionList" :key="item">
              <el-link @click="watchQuestion(item)">{{item}}</el-link>
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
            <el-checkbox v-for="item in knowList" :label="item.label" :value="item.id" :key="item.id" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="addTestForm.questionList.length === 0" label="问题数量" :label-width="formLabelWidth">
          <el-input v-model="addTestForm.num" />
        </el-form-item>
        <el-form-item v-if="addTestForm.questionList.length !== 0" label="问题" :label-width="formLabelWidth">
          <span v-for="item in addTestForm.questionList" :key="item">
            <!-- <el-link @click="watchQuestion(item)">{{item}}</el-link> -->
            <el-tag @click.stop="watchQuestion(item)" closable @close="delQuestion(item)">
              问题{{ item }}
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
