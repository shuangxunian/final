<script setup>
import { ref, computed, onMounted, toRaw } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const knowList = ref([])
const addKnowDialog = ref(false)
const knowForm = ref({
  id: '',
  name: '',
  upstreamIDList: [],
  downstreamIDList: []
})
const formLabelWidth = ref(100)
const upstreamList = ref([])
const downstreamList = ref([])
const editKnowDialog = ref(false)

const editKnow = (row) => {
  // upstreamList.value = toRaw(row).upstreamIDList
  // downstreamList.value = toRaw(row).downstreamIDList
  knowForm.value = row
  upstreamList.value = row.upstreamIDList
  downstreamList.value = row.downstreamIDList
  editKnowDialog.value = true
}

const makeSureDel = async (row) => {
  if ((row.upstreamIDList && row.upstreamIDList.length !== 0) || (row.downstreamIDList && row.downstreamIDList?.length !== 0) ) return ElMessage.error('该知识点存在关联，无法删除')
  const { data } = await axios.post('http://localhost:3000/know/del', row)
  if (data.code === 2) {
    ElMessage.success('删除成功')
    await getTableData()
  } else {
    ElMessage.error('删除失败')
  }
}

const clearForm = () => {
  knowForm.value = {
    id: '',
    name: '',
    upstreamIDList: [],
    downstreamIDList: []
  }
  downstreamList.value = []
}

const dontAddKnow = () => {
  addKnowDialog.value = false
  clearForm()
}

const trueAddKnow = async () => {
  if (knowForm.value.name === '') return ElMessage.error('请输入知识点')
  // const id = knowList.value.length + 1
  // console.log(id)
  const { data } = await axios.post('http://localhost:3000/know/add', {
    id: knowList.value.length + 1,
    name: knowForm.value.name,
    downstreamList: downstreamList.value
  })
  if (data.code === 2) {
    ElMessage.success('添加成功')
    await getTableData()
    addKnowDialog.value = false
    clearForm()
  } else {
    ElMessage.error('添加失败')
  }
}

const trueEditKnow = async () => {
  if (knowForm.value.name === '') return ElMessage.error('请输入知识点')
  const { data } = await axios.post('http://localhost:3000/know/edit', {
    ...knowForm.value,
    downstreamList: downstreamList.value
  })
  if (data.code === 2) {
    ElMessage.success('添加成功')
    await getTableData()
    editKnowDialog.value = false
    clearForm()
  } else {
    ElMessage.error('添加失败')
  }
}


const getTableData = async () => {
  const { data } = await axios.post('http://localhost:3000/know/allData',{})
  if (data.code === 2) {
    knowList.value = data.body
    const nameMap = {}
    for(let i = 0; i < knowList.value.length; i++) {
      nameMap[knowList.value[i].id] = {
        name: knowList.value[i].name,
        index: i
      }
    }
    for(let i = 0; i < knowList.value.length; i++) {
      const downArr = knowList.value[i].downstreamIDListString ? knowList.value[i].downstreamIDListString.split(',') : []
      knowList.value[i].downstreamIDList = downArr
      downArr.forEach(item => {
        if (!knowList.value[nameMap[item].index].upstreamIDList) knowList.value[nameMap[item].index].upstreamIDList = []
        knowList.value[nameMap[item].index].upstreamIDList.push(knowList.value[i].id)
      })
      let downstream = ''
      knowList.value[i].downstreamIDList.forEach(item => {
        downstream += nameMap[item].name + ','
      })
      knowList.value[i].downstream = downstream || '--'
    }
    for(let i = 0; i < knowList.value.length; i++) {
      let upstream = ''
      knowList.value[i].upstreamIDList?.forEach(item => {
        upstream += nameMap[item].name + ','
      })
      knowList.value[i].upstream = upstream || '--'
    }
    tableData.value = knowList.value
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
      <el-table :data="tableData" border style="width: 100%" height="600px">
        <el-table-column prop="name" label="知识点名称" width="180" />
        <el-table-column prop="upstream" label="上游知识点" width="400" />
        <el-table-column prop="downstream" label="下游知识点" width="400"/>
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
        <el-table-column fixed="right" label="操作" width="120" >
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

    <el-dialog v-model="addKnowDialog" title="添加知识点" width="500" @close="clearForm">
      <el-form :model="knowForm">
        <el-form-item label="知识点名称" :label-width="formLabelWidth">
          <el-input v-model="knowForm.name" />
        </el-form-item>
        <el-form-item label="下游知识点" :label-width="formLabelWidth">
          <el-checkbox-group v-model="downstreamList">
            <el-checkbox v-for="item in tableData" :label="item.name" :value="item.id" :key="item.id" />
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
          <el-input v-model="knowForm.name" />
        </el-form-item>
        <el-form-item label="下游知识点" :label-width="formLabelWidth">
          <el-checkbox-group v-model="downstreamList">
            <el-checkbox v-for="item in tableData" :label="item.name" :value="item.id" :key="item.id" />
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dontAddKnow">取消</el-button>
          <el-button type="primary" @click="trueEditKnow">确定提交</el-button>
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
