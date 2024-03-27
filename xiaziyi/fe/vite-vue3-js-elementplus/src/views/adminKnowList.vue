<script setup>
import { ref, computed, onMounted, toRaw } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'


const tableData = ref([
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
])
const addKnowDialog = ref(false)
const knowForm = ref({
  label: '',
})
const formLabelWidth = ref(100)
const upstreamList = ref([])
const downstreamList = ref([])
const editKnowDialog = ref(false)

const editKnow = (row) => {
  // upstreamList.value = toRaw(row).upstreamIDList
  // downstreamList.value = toRaw(row).downstreamIDList
  upstreamList.value = row.upstreamIDList
  downstreamList.value = row.downstreamIDList
  editKnowDialog.value = true
}

const makeSureDel = (row) => {
  console.log(row)
}

const clearForm = () => {
  knowForm.value = {
    label: '',
    upstreamIDList: [],
    downstreamIDList: []
  }
}

const dontAddKnow = () => {
  addKnowDialog.value = false
  clearForm()
}

const trueAddKnow = async () => {
  if (knowForm.value.label === '') return ElMessage.error('请输入知识点')
  addKnowDialog.value = false
  clearForm()
}

const getTableData = async () => {
  const nameMap = {}
  for(let i = 0; i < tableData.value.length; i++) {
    nameMap[tableData.value[i].id] = tableData.value[i].label
  }
  for(let i = 0; i < tableData.value.length; i++) {
    let upstream = ''
    tableData.value[i].upstreamIDList.forEach(item => {
      upstream += nameMap[item] + ','
    })
    tableData.value[i].upstream = upstream || '--'
    let downstream = ''
    tableData.value[i].downstreamIDList.forEach(item => {
      downstream += nameMap[item] + ','
    })
    tableData.value[i].downstream = downstream || '--'
  }
}

onMounted(async () => {
  await getTableData()
})

</script>

<template>
  <div class="admin-know-list">
    <div class="header">
      <el-button type="primary" @click="addKnowDialog = true">新建知识点</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="label" label="知识点名称" width="180" />
        <el-table-column prop="upstream" label="上游知识点" width="400" />
        <el-table-column prop="downstream" label="下游知识点" width="400" />
        <el-table-column
          prop="tag"
          label="知识点状态"
          width="150"
        >
          <template #default="scope">
            <el-tag
              :type="scope.row.tag === '正常' ? 'primary' : 'danger'"
              disable-transitions
              >{{ scope.row.tag }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button v-if="scope.row.tag === '正常'" link type="primary" size="small" @click="editKnow(scope.row)">编辑</el-button>
            <el-popconfirm  v-if="scope.row.tag === '正常'" confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
            <el-button v-else link type="success" size="small">还原</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="addKnowDialog" title="添加知识点" width="500">
      <el-form :model="knowForm">
        <el-form-item label="知识点名称" :label-width="formLabelWidth">
          <el-input v-model="knowForm.label" />
        </el-form-item>
        <el-form-item label="上游知识点" :label-width="formLabelWidth">
          <el-checkbox-group v-model="upstreamList">
            <el-checkbox v-for="item in tableData" :label="item.label" :value="item.id" :key="item.id" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="下游知识点" :label-width="formLabelWidth">
          <el-checkbox-group v-model="downstreamList">
            <el-checkbox v-for="item in tableData" :label="item.label" :value="item.id" :key="item.id" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dontAddKnow">取消</el-button>
          <el-button type="primary" @click="trueAddKnow">确定提交</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editKnowDialog" title="编辑知识点" width="500">
      <el-form :model="knowForm">
        <el-form-item label="知识点名称" :label-width="formLabelWidth">
          <el-input v-model="knowForm.label" />
        </el-form-item>
        <el-form-item label="上游知识点" :label-width="formLabelWidth">
          <el-checkbox-group v-model="upstreamList">
            <el-checkbox v-for="item in tableData" :label="item.label" :value="item.id" :key="item.id" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="下游知识点" :label-width="formLabelWidth">
          <el-checkbox-group v-model="downstreamList">
            <el-checkbox v-for="item in tableData" :label="item.label" :value="item.id" :key="item.id" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dontAddKnow">取消</el-button>
          <el-button type="primary" @click="trueAddKnow">确定提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.admin-know-list {
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
    height: calc(100%-70px);
    width: 100%;
  }
}
</style>
