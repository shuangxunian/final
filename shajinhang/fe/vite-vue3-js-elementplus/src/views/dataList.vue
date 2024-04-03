<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const addDataDialog = ref(false)
const trainDialog = ref(false)
const form = ref({
  talk: '',
  status: ''
})
const formLabelWidth = '100px'
const editDataDialog = ref(false)
const selectList = ref([])
const modelList = ref([])


const resetForm = () => {
  form.value.talk = ''
  form.value.status = ''
}

const addData = async () => {
  const { data } = await axios.post('http://localhost:3000/data/add', form.value)
  if (data.code === 2) {
    ElMessage.success('添加成功')
    await getAllData()
    addDataDialog.value = false
  }
}

const saveData = async () => {
  const { data } = await axios.post('http://localhost:3000/data/fix', form.value)
  if (data.code === 2) {
    ElMessage.success('修改成功')
    editDataDialog.value = false
    await getAllData()
  }
}

const getAllData = async () => {
  const { data } = await axios.post('http://localhost:3000/data/alldata', {})
  if (data.code === 2) {
    tableData.value = data.body
  }
  // const res = await axios.post('http://127.0.0.1:5000/airesult', {
  //   body: tableData.value[0].talk
  // })
  // console.log(res)
}

const editData = async (row) => {
  editDataDialog.value = true
  form.value = row
}

const makeSureDel = async (row) => {
  const { data } = await axios.post('http://localhost:3000/data/del', row)
  if (data.code === 2) {
    ElMessage.success('删除成功')
    await getAllData()
  }
}

const trainModel = ref('')

const toTrain = async () => {
  if(selectList.value.length === 0) {
    ElMessage.warning('请选择数据')
    return
  }
  const { data } = await axios.post('http://localhost:3000/model/allData', {})
  if (data.code === 2) {
    modelList.value = data.body
  }
  trainDialog.value = true
}

const makeSureTrain = async () => {
  let up = 0, down = 0
  modelList.value.forEach(item => {
    if(item.id === trainModel.value) {
      up = item.up
      down = item.down
    }
  })
  const { data } = await axios.post('http://localhost:3000/model/list', {
    body: selectList.value,
    up,
    down
  })
  if (data.code === 2) {
    ElMessage.success('训练成功')
    await getAllData()
    trainDialog.value = false
  }
}

const handleSelectionChange = async (val) => {
  selectList.value = val
}


onMounted(async() => {
  await getAllData()
  // await getData()
})

</script>

<template>
  <div class="data-list">
    <div class="header">
      <el-button style="margin-left: 10px" type="primary" @click="addDataDialog = true">新建</el-button>
      <el-button style="margin-left: 10px" type="primary" @click="toTrain">训练</el-button>
    </div>
    <div class="body">
      <div>
        <el-table
          ref="multipleTableRef"
          :data="tableData"
          height="600"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="talk" label="评论"/>
          <el-table-column prop="AIstatus" label="AI结果" width="100">
            <template #default="scoped">
              {{scoped.row.AIstatus === '0' ? '中性' : scoped.row.AIstatus === '1' ? '积极' : scoped.row.AIstatus === '2' ?'消极' : ''}}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="人为结果" width="100">
            <template #default="scoped">
              {{scoped.row.status === '0' ? '中性' : scoped.row.status === '1' ? '积极' : scoped.row.status === '2' ?'消极' : ''}}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
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

    <el-dialog v-model="addDataDialog" title="新建数据" width="500" @close="resetForm">
      <el-form :model="form">
        <el-form-item label="文本" :label-width="formLabelWidth">
          <el-input
            v-model="form.talk"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="态度" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option label="积极" value="1" />
            <el-option label="消极" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addDataDialog = false">取消</el-button>
          <el-button type="primary" @click="addData">添加</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editDataDialog" title="编辑数据" width="500" @close="resetForm">
      <el-form :model="form">
        <el-form-item label="文本" :label-width="formLabelWidth">
          <el-input
            v-model="form.talk"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="态度" :label-width="formLabelWidth">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option label="积极" value="1" />
            <el-option label="消极" value="2" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDataDialog = false">取消</el-button>
          <el-button type="primary" @click="saveData">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="trainDialog" title="训练数据" width="500">
      <el-select v-model="trainModel" placeholder="请选择模型">
        <el-option v-for="item in modelList" :label="item.name" :value="item.id" :key="item.id" />
        <!-- <el-option label="消极" value="2" /> -->
      </el-select>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editDataDialog = false">取消</el-button>
          <el-button type="primary" @click="makeSureTrain">训练</el-button>
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
