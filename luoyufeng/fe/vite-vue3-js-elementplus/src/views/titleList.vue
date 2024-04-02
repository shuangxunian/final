<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const titleList = ref([])
const addTitleDialog = ref(false)
const editTitleDialog = ref(false)
const formLabelWidth = '100px'
const form = ref({
  id: '',
  title: ''
})

const refreshForm = () => {
  form.value = {
    id: '',
    title: ''
  }
}

const editData = (row) => {
  form.value = row
  editTitleDialog.value = true
  // console.log(scoped.row.AIResult)
}

const getTitleList = async () => {
  const { data } = await axios.post('http://localhost:3000/title/allData', {})
  if (data.code === 2) {
    console.log(data.info)
    titleList.value = data.info
    tableData.value = data.info
  }
}

const addTitle = async () => {
  const { data } = await axios.post('http://localhost:3000/title/add', form.value)
  if (data.code === 2) {
    ElMessage.success('添加成功')
    addTitleDialog.value = false
    await getTitleList()
  } else {
    ElMessage.error(data.msg)
  }
}
const editTitle = async () => {
  const { data } = await axios.post('http://localhost:3000/title/edit', form.value)
  if (data.code === 2) {
    ElMessage.success('修改成功')
    editTitleDialog.value = false
    await getTitleList()
  } else {
    ElMessage.error(data.msg)
  }
}



onMounted(async () => {
  // await getTalkList()
  await getTitleList()
})



</script>

<template>
  <div class="talk-list">
    <div class="header">
      <el-button style="margin-left: 10px" type="primary" @click="addTitleDialog = true">添加标签</el-button>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="标签ID"/>
        <el-table-column prop="title" label="标签名称"/>
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="editData(scoped.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="addTitleDialog" title="添加标签" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="标签名" :label-width="formLabelWidth">
          <el-input v-model="form.title"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addTalkDialog = false">取消</el-button>
          <el-button type="primary" @click="addTitle">添加</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editTitleDialog" title="编辑标签" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input disabled v-model="form.id"/>
        </el-form-item>
        <el-form-item label="标签名" :label-width="formLabelWidth">
          <el-input v-model="form.title"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addTalkDialog = false">取消</el-button>
          <el-button type="primary" @click="editTitle">添加</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.talk-list {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
  }
  .body {
    padding: 10px;
  }
}
</style>
