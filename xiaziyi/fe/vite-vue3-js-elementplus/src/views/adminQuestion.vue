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
const trueAddQuestion = () => {
  if (addQuestionForm.value.question === '') return ElMessage.error('请输入问题！')
  if (addQuestionForm.value.knowID === null) return ElMessage.error('请选择知识点！')
  if (addQuestionForm.value.answerAText === '') return ElMessage.error('请填写选项A！')
  if (addQuestionForm.value.answerBText === '') return ElMessage.error('请填写选项B！')
  if (addQuestionForm.value.answerCText === '') return ElMessage.error('请填写选项C！')
  if (addQuestionForm.value.answerDText === '') return ElMessage.error('请填写选项D！')
  if (addQuestionForm.value.selectList.length === 0) return ElMessage.error('请填选择答案！')
}
const editQuestion = () => {

}
const makeSureDel = () => {}

const getQuestionList = async () => {
  questionList.value = [
    {
      id: 0,
      question: '列关于企业的定义的表述中，错误的是',
      know: '企业的定义与功能',
      knowID: 0,
      answerList: [0,0,1,0],
      answerAText: "是依法设立的，以营利为目的",
      answerBText: "运用各种生产要素，向市场提供商品或服务",
      answerCText: "是法人",
      answerDText: "实行自主经营、自负盈亏、独立核算",
    },
    {
      id: 1,
      question: '以下关于企业功能的表述中，不正确的是',
      know: '企业的定义与功能',
      knowID: 0,
      answerList: [1,0,0,0],
      answerAText: "企业是市场经济活动的领航者",
      answerBText: "企业是社会生产和服务的主要承担者",
      answerCText: "企业是经济社会发展的重要推动力量",
      answerDText: "企业是市场经济活动的主要参与者",
    },
    {
      id: 2,
      question: '下列有关企业组织形式的表述中，错误的是',
      know: '个人独资/合伙企业',
      knowID: 1,
      answerList: [0,1,0,0],
      answerAText: "个人独资企业创立容易、经营管理灵活自由",
      answerBText: "个人独资企业损失超过业主对其投资时，其责任承担以业主的投资额为限",
      answerCText: "普通合伙企业各合伙人对企业债务承担无限连带责任",
      answerDText: "公司制企业存在代理问题",
    },
    {
      id: 3,
      question: '下列各项中，属于个人独资企业优点的有',
      know: '个人独资/合伙企业',
      knowID: 1,
      answerList: [1,1,0,1],
      answerAText: "创立容易",
      answerBText: "经营管理灵活自由",
      answerCText: "筹资容易",
      answerDText: "不需要缴纳企业所得税",
    }
  ]
  const knowMap = {}
  for (let i = 0; i <knowList.value.length; i++) {
    knowMap[knowList.value[i].id] = knowList.value[i].label
  }
  tableData.value = []
  questionList.value.forEach(item => {
    let answer = ''
    let num = 0
    const answerMap = {
      0: 'A',
      1: 'B',
      2: 'C',
      3: 'D',
    }
    item.answerList.forEach((key,index) => {
      if(key === 1) {
        answer+=answerMap[index]
        num++
      }
    })
    let type = num === 1 ? '单选' : '多选'
    tableData.value.push({
      ...item,
      answer,
      type
    })
  })
  // tableData
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
  await getQuestionList()
  // await getTestList()
  // await getClassList()
  // getTableData()
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
          <template #default>
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
              :label="item.label"
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
