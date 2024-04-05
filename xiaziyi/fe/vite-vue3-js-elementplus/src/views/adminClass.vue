<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const knowList = ref([])
const testList = ref([])
const classList = ref([])
const roleType = ref('')
const addClassDialog = ref(false)
const editClassDialog = ref(false)
const addClassForm = ref({
  name: '',
  knowID: null,
  url: '',
})
const formLabelWidth = ref(100)

const addClass = async () => {}
const editClass = async (row) => {
  addClassForm.value = row
  editClassDialog.value = true
}
const delClass = async () => {}
const makeSureDel = async (row) => {
  const { data } = await axios.post('http://localhost:3000/class/del',{id:row.id})
  if (data.code === 2) {
    ElMessage.success('删除成功！')
    getClassList()
  }
}
const clearForm = () => {
  addClassForm.value = {
    name: '',
    knowID: null,
    url: '',
  }
}
const dontAddClass = () => {
  addClassDialog.value = false
  editClassDialog.value = false
  clearForm()
}

const trueAddClass = async () => {
  if (addClassForm.value.name === '') return ElMessage.error('请输入课程名！')
  if (addClassForm.value.knowID === '') return ElMessage.error('请选择知识点！')
  if (addClassForm.value.url === '') return ElMessage.error('请输入课程关联文档！')
  const { data } = await axios.post('http://localhost:3000/class/add',{...addClassForm.value})
  if (data.code === 2) {
    ElMessage.success('添加成功！')
    addClassDialog.value = false
    clearForm()
    getClassList()
  }
}

const trueEditClass = async () => {
  if (addClassForm.value.name === '') return ElMessage.error('请输入课程名！')
  if (addClassForm.value.knowID === '') return ElMessage.error('请选择知识点！')
  if (addClassForm.value.url === '') return ElMessage.error('请输入课程关联文档！')
  const { data } = await axios.post('http://localhost:3000/class/edit',{...addClassForm.value})
  if (data.code === 2) {
    ElMessage.success('修改成功！')
    editClassDialog.value = false
    clearForm()
    getClassList()
  }
}

const getTableData = async () => {}
const getTestList = async () => {}

const getClassList = async () => {
  const { data } = await axios.post('http://localhost:3000/class/allData',{})
  if (data.code === 2) {
    classList.value = data.body
    const knowMap = {}
    for (let i = 0; i <knowList.value.length; i++) {
      knowMap[knowList.value[i].id] = knowList.value[i].name
    }
    for (let i = 0; i <classList.value.length; i++) {
      classList.value[i].know = knowMap[classList.value[i].knowID] || '--'
    }
    tableData.value = classList.value
  }
}

const getKnowList = async () => {
  const { data } = await axios.post('http://localhost:3000/know/allData',{})
  if (data.code === 2) {
    knowList.value = data.body
  }
}

onMounted(async() => {
  roleType.value = window.sessionStorage.getItem('roleType')
  await getKnowList()
  await getClassList()
})


</script>

<template>
  <div class="admin-class">
    <div v-if="roleType !== '2'" class="header">
      <el-button type="primary" @click="addClassDialog = true">新建课程</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="课程名称" width="180" />
        <el-table-column prop="know" label="知识点" width="240" />
        <el-table-column prop="url" label="学习文档" >
          <template #default="scope">
            <el-link :href="scope.row.url" type="primary" target="_blank">
              {{ scope.row.url }}
            </el-link>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="test" label="关联考试" width="180"/> -->
        <el-table-column  v-if="roleType !== '2'" fixed="right" label="操作" width="120">
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
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程文档" :label-width="formLabelWidth">
          <el-input v-model="addClassForm.url" />
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
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程文档" :label-width="formLabelWidth">
          <el-input v-model="addClassForm.url" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dontAddClass">取消</el-button>
          <el-button type="primary" @click="trueEditClass">确定</el-button>
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
