<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const knowList = ref([])
const testList = ref([])
const classList = ref([])
const addClassDialog = ref(false)
const editClassDialog = ref(false)
const addClassForm = ref({
  name: '',
  knowID: null,
  url: '',
  testID: null
})
const formLabelWidth = ref(100)

const addClass = async () => {}
const editClass = async (row) => {
  // console.log(row)
  addClassForm.value.name = row.name
  addClassForm.value.knowID = row.knowID
  addClassForm.value.url = row.url
  addClassForm.value.testID = row.testID
  editClassDialog.value = true
}
const delClass = async () => {}
const makeSureDel = async () => {}
const clearForm = () => {
  addClassForm.value = {
    name: '',
    knowID: null,
    url: '',
    testID: null
  }
}
const dontAddClass = () => {
  addClassDialog.value = false
  clearForm()
}
const trueAddClass = async () => {
  if (addClassForm.value.name === '') return ElMessage.error('请输入课程名！')
  if (addClassForm.value.knowID === '') return ElMessage.error('请选择知识点！')
  if (addClassForm.value.url === '') return ElMessage.error('请输入课程关联文档！')
  // if (addClassForm.value.testID === '') return ElMessage.error('请选择考试！')
  editClassDialog.value = false
  clearForm()
}

const getTableData = async () => {}

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

const getTestList = async () => {}

const getClassList = async () => {
  classList.value = [
    {
      id: 0,
      name: '企业的定义与功能课程',
      know: '',
      knowID: 0,
      url: 'https://ldwd4y8oeh.feishu.cn/docx/SPUFdKDNQoDchlx7VVWcH59Gnsd',
      test: '',
      testID: 0,
    },{
      id: 1,
      name: '个人独资企业，合伙企业课程',
      know: '',
      knowID: 1,
      url: 'https://ldwd4y8oeh.feishu.cn/docx/SPUFdKDNQoDchlx7VVWcH59Gnsd',
      test: '',
      testID: 0,
    },{
      id: 2,
      name: '公司制企业课程',
      know: '',
      knowID: 2,
      url: 'https://ldwd4y8oeh.feishu.cn/docx/SPUFdKDNQoDchlx7VVWcH59Gnsd',
      test: '',
      testID: 0,
    },
  ]
  const knowMap = {}
  for (let i = 0; i <knowList.value.length; i++) {
    knowMap[knowList.value[i].id] = knowList.value[i].label
  }
  const testMap = {}
  for (let i = 0; i <testList.value.length; i++) {
    testMap[testList.value[i].id] = testList.value[i].label
  }
  tableData.value = []
  classList.value.forEach(item => {
    const know = knowMap[item.knowID] || '--'
    const test = testMap[item.testID] || '--'
    tableData.value.push({
      ...item,
      know,
      test
    })
  })
}


onMounted(async() => {
  await getKnowList()
  await getTestList()
  await getClassList()
  // getTableData()
})


</script>

<template>
  <div class="admin-class">
    <div class="header">
      <el-button type="primary" @click="addClassDialog = true">新建课程</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="课程名称" width="180" />
        <el-table-column prop="know" label="知识点" width="180" />
        <el-table-column prop="url" label="学习文档" width="700" >
          <template #default="scope">
            <el-link :href="scope.row.url" type="primary" target="_blank">
              {{ scope.row.url }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="test" label="关联考试" width="180">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="editClass(scope.row)">编辑</el-button>
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="addClassDialog" title="添加课程" width="500">
      <el-form :model="addClassForm">
        <el-form-item label="课程名称" :label-width="formLabelWidth">
          <el-input v-model="addClassForm.name" />
        </el-form-item>
        <el-form-item label="所关联知识点" :label-width="formLabelWidth">
          <el-select v-model="addClassForm.knowID" placeholder="请选择">
            <el-option
              v-for="item in knowList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程文档" :label-width="formLabelWidth">
          <el-input v-model="addClassForm.url" />
        </el-form-item>
        <el-form-item label="关联考试" :label-width="formLabelWidth">
          <el-select v-model="addClassForm.knowID" placeholder="请选择">
            <el-option
              v-for="item in knowList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dontAddClass">取消</el-button>
          <el-button type="primary" @click="trueAddClass">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editClassDialog" title="编辑课程" width="500" @close="clearForm">
      <el-form :model="addClassForm">
        <el-form-item label="课程名称" :label-width="formLabelWidth">
          <el-input v-model="addClassForm.name" />
        </el-form-item>
        <el-form-item label="所关联知识点" :label-width="formLabelWidth">
          <el-select v-model="addClassForm.knowID" placeholder="请选择">
            <el-option
              v-for="item in knowList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程文档" :label-width="formLabelWidth">
          <el-input v-model="addClassForm.url" />
        </el-form-item>
        <el-form-item label="关联考试" :label-width="formLabelWidth">
          <el-select v-model="addClassForm.knowID" placeholder="请选择">
            <el-option
              v-for="item in knowList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dontAddClass">取消</el-button>
          <el-button type="primary" @click="trueAddClass">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.admin-class {
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
