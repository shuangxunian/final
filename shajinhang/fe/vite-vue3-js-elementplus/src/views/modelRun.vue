<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const modelDialog = ref(false)
const editModelDialog = ref(false)

const form = ref({
  name: '',
  up: 0,
  down: 0,
})
const formLabelWidth = '100px'

const addModel = async() => {
  const { data } = await axios.post('http://localhost:3000/model/add', {
    ...form.value
  })
  if (data.code === 2) {
    ElMessage.success('添加成功')
    modelDialog.value = false
    await getData()
  } else {
    ElMessage.error('添加失败')
  }
}

const fixModel = async() => {
  const { data } = await axios.post('http://localhost:3000/model/fix', {
    ...form.value
  })
  if (data.code === 2) {
    ElMessage.success('修改成功')
    editModelDialog.value = false
    await getData()
  } else {
    ElMessage.error('修改失败')
  }
}


const getData = async() => {
  const { data } = await axios.post('http://localhost:3000/model/allData', {})
  if (data.code === 2) {
    tableData.value = data.body
  } else {
    ElMessage.error('获取数据失败')
  }
}

const editData = async(row) => {
  editModelDialog.value = true
  form.value = { ...row }
}

const makeSureDel = async(row) => {
  const { data } = await axios.post('http://localhost:3000/model/del', {
    id: row.id
  })
  if (data.code === 2) {
    ElMessage.success('删除成功')
    await getData()
  }
}
const resetForm = () => {
  form.value = {
    name: '',
    up: 0,
    down: 0,
  }
}


onMounted(async() => {
  await getData()
})



</script>

<template>
  <div class="data-list">
    <div class="header">
      <el-button style="margin-left: 10px" type="primary" @click="modelDialog = true">新建</el-button>
    </div>
    <div class="body">
      <div>
        <el-table
          ref="multipleTableRef"
          :data="tableData"
          height="600"
        >
          <el-table-column prop="name" label="模型名称"/>
          <el-table-column prop="up" label="积极阈值"/>
          <el-table-column prop="down" label="消极阈值"/>
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scoped">
              <el-button link type="primary" size="small" @click="editData(scoped.row)">编辑</el-button>
              <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scoped.row)">
                <template #reference>
                  <el-button link type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    
    <el-dialog v-model="modelDialog" title="新建模型" width="500" @close="resetForm">
      <el-form :model="form">
        <el-form-item label="模型名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="积极阈值" :label-width="formLabelWidth">
          <el-input-number v-model="form.up" :precision="2" :step="0.01" :max="1" />
        </el-form-item>
        <el-form-item label="消极阈值" :label-width="formLabelWidth">
          <el-input-number v-model="form.down" :precision="2" :step="0.01" :max="1" />
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="modelDialog = false">取消</el-button>
          <el-button type="primary" @click="addModel">添加</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editModelDialog" title="编辑模型" width="500" @close="resetForm">
      <el-form :model="form">
        <el-form-item label="模型名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" placeholder="请输入"/>
        </el-form-item>
        <el-form-item label="积极阈值" :label-width="formLabelWidth">
          <el-input-number v-model="form.up" :precision="2" :step="0.01" :max="1" />
        </el-form-item>
        <el-form-item label="消极阈值" :label-width="formLabelWidth">
          <el-input-number v-model="form.down" :precision="2" :step="0.01" :max="1" />
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editModelDialog = false">取消</el-button>
          <el-button type="primary" @click="fixModel">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.data-list {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
  }
  .body {}
}
</style>
