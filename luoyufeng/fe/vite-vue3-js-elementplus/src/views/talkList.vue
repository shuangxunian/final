<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const talkList = ref([])
const titleList = ref([])
const multipleSelection = ref([])
const trainList = ref([])
const addTalkDialog = ref(false)
const editTalkDialog = ref(false)
const trainDialog = ref(false)
const btnLoading = ref(false)

const formLabelWidth = ref(100)
const form = ref({
  talk: '',
  AIResult: '',
  UserResult: '',
})

const refreshForm = () => {
  form.value = {
    talk: '',
    AIResult: '',
    UserResult: '',
  }
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

const handleChange = function(uploadFile, uploadFiles) {
  var reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = evt => {
    Papa.parse(uploadFile.raw, {
      complete: res => {
        let data = res.data
        const result = Papa.unparse(data)
        const csvRecordsArray = result?.split(/\r\n|\n/).slice(1)
        fileList.value = []
        csvRecordsArray.forEach(item => {
          const arr = item.split(',')
          for(let i = 0; i < userList.value.length; i++) {
            if (userList.value[i].userid === arr[1]) break
            if (i === userList.value.length - 1) {
              fileList.value.push({
                talk: arr[0],
                AIResult: arr[1],
                UserResult: arr[2],
              })
            }
          }
        })
        uploadDialogVisible.value = true
      }
    })
  }
}

const getTalkList = async () => {
  const { data } = await axios.post('http://localhost:3000/talk/allData', {})
  console.log(data.info)
  if (data.code === 2) {
    const titleMap = {}
    titleList.value.forEach(item => {
      titleMap[item.id] = item.title
    })
    console.log(titleMap)
    talkList.value = data.info
    tableData.value = []
    data.info.forEach(item => {
      tableData.value.push({
        ...item,
        AIResultLabel: titleMap[item.AIResult],
        UserResultLabel: titleMap[item.UserResult]
      })
    })
  }
}

const getTitleList = async () => {
  const { data } = await axios.post('http://localhost:3000/title/allData', {})
  if (data.code === 2) {
    titleList.value = data.info
  }
}

const addTalk = async () => {
  if (!form.value.talk) return ElMessage.error('请输入评论')
  const { data } = await axios.post('http://localhost:3000/talk/add', {
    ...form.value
  })
  console.log(data)
  if (data.code === 2) {
    ElMessage.success('添加成功')
    addTalkDialog.value = false
    await getTalkList()
  }
}

const editTalk = async () => {
  if (!form.value.talk) return ElMessage.error('请输入评论')
  const { data } = await axios.post('http://localhost:3000/talk/edit', {
    ...form.value
  })
  console.log(data)
  if (data.code === 2) {
    ElMessage.success('添加成功')
    editTalkDialog.value = false
    await getTalkList()
  }
}

const makeSureDel = async (row) => {
  const { data } = await axios.post('http://localhost:3000/talk/del', row)
  if (data.code === 2) {
    ElMessage.success('删除成功')
    await getTalkList()
  }
}

const toModel = async (row) => {
  const { data } = await axios.post('http://localhost:3000/talk/model', row)
  if (data.code === 2) {
    ElMessage.success('设置成功')
    await getTalkList()
  }
}

const AIToUser = async (row) => {
  const obj = {
    ...row
  }
  obj.UserResult=obj.AIResult
  const { data } = await axios.post('http://localhost:3000/talk/edit', obj)
  if (data.code === 2) {
    ElMessage.success('同步成功')
    await getTalkList()
  }
}

const editData = async (row) => {
  form.value = {
    ...row
  }
  editTalkDialog.value = true
}

const beginTrain = async () => {
  trainDialog.value = true
  trainList.value = []
  multipleSelection.value.forEach(item => {
    if (item.isModel === 0) trainList.value.push(item)
  })
}

const toTrain = async () => {
  btnLoading.value = true
  const modelList = []
  tableData.value.forEach(item => {
    if (item.isModel === 1) modelList.push(item)
  })
  // const sendArr = []
  // for (let i = 0; i < modelList.length; i++) {
  //   for (let j = 0; j < trainList.value.length; j++) {
  //     sendArr.push([
  //       modelList[i].talk,
  //       trainList.value[j].talk,
  //     ])
  //   }
  // }

  const { data } = await axios.post('http://localhost:3000/talk/begin', {
    modelList,
    trainList: trainList.value
  })
  if (data.code === 2) {
    ElMessage.success('训练成功')
    trainDialog.value = false
    btnLoading.value = false
    await getTalkList()
  }
}

onMounted(async () => {
  await getTitleList()
  await getTalkList()
})



</script>

<template>
  <div class="talk-list">
    <div class="header">
      <div>
        <el-button :disabled="multipleSelection.length === 0" style="margin-left: 10px;line-height: 70px;" type="primary" @click="beginTrain">开始训练</el-button>
        <el-button style="margin-left: 10px;line-height: 70px;" type="primary" @click="addTalkDialog = true">添加评论</el-button>
      </div>
      <div>
        <el-upload
          class="upload-demo"
          :on-change="handleChange"
          :auto-upload="false"
          :show-file-list="false"
          :limit="1"
        >
          <el-button type="primary">导入评论</el-button>
        </el-upload>
      </div>

    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="talk" label="评论" />
        <el-table-column prop="AIResultLabel" label="AI结果" width="100" />
        <el-table-column prop="UserResultLabel" label="人工结果" width="100"/>
        <el-table-column label="是否为模板" width="100">
          <template #default="scoped">
            {{ scoped.row.isModel === 1 ? '是' : '否'}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="260">
          <template #default="scoped">
            <el-button link type="primary" size="small" :disabled="!(scoped.row.AIResult !== '' && scoped.row.UserResult === '')" @click="AIToUser(scoped.row)">同步结果</el-button>
            <el-button v-if="scoped.row.isModel === 0" :disabled="scoped.row.AIResult === '' && scoped.row.UserResult === ''" link type="primary" size="small" @click="toModel(scoped.row)">设为模板</el-button>
            <el-button v-else link type="primary" size="small" @click="toModel(scoped.row)">取消模板</el-button>
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

    <el-dialog v-model="addTalkDialog" title="添加评论" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="评论" :label-width="formLabelWidth">
          <el-input v-model="form.talk"/>
        </el-form-item>
        <el-form-item label="AI结果" :label-width="formLabelWidth">
          <el-input disabled v-model="form.AIResult"/>
        </el-form-item>
        <el-form-item label="人工结果" :label-width="formLabelWidth">
          <el-select v-model="form.UserResult" placeholder="请选择">
            <el-option
              v-for="item in titleList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addTalkDialog = false">取消</el-button>
          <el-button type="primary" @click="addTalk">添加</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editTalkDialog" title="编辑评论" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="评论" :label-width="formLabelWidth">
          <el-input v-model="form.talk"/>
        </el-form-item>
        <el-form-item label="AI结果" :label-width="formLabelWidth">
          <el-input disabled v-model="form.AIResult"/>
        </el-form-item>
        <el-form-item label="人工结果" :label-width="formLabelWidth">
          <el-select v-model="form.UserResult" placeholder="请选择">
            <el-option
              v-for="item in titleList"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editTalkDialog = false">取消</el-button>
          <el-button type="primary" @click="editTalk">修改</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="trainDialog" title="开始训练" width="500">
      <el-table v-loading="btnLoading" :data="trainList" style="width: 100%">
        <el-table-column prop="talk" label="评论" />
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="trainDialog = false">取消</el-button>
          <el-button :disabled="btnLoading" type="primary" @click="toTrain">训练</el-button>
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
    display: flex;
    height: 70px;
    line-height: 70px;
    .upload-demo {
      margin-left: 10px;
    }
  }
  .body {
    padding: 10px;
  }
}
</style>
