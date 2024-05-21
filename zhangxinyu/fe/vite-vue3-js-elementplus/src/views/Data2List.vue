<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import Papa from 'papaparse'

const textData = ref([])
const fileList = ref([])
const uploadDialogVisible = ref(false)
const findString = ref('')
const tableData = ref([])
const formLabelWidth = ref(120)
const textList = ref(false)
const textDialog = ref(false)
const editTextDialog = ref(false)

const textForm = ref({
  china: '',
  pinyin: ''
})
const clearForm = () => {
  textForm.value = {
    china: '',
    pinyin: ''
  }
}

const gotoFind = function() {
  tableData.value = []
  if (findString.value === '') {
    tableData.value = textData.value
  } else {
    textData.value.forEach(item => {
      if (item.china.includes(findString.value) || item.pinyin.includes(findString.value)) {
        tableData.value.push(item)
      }
    })
  }
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
          for(let i = 0; i < textData.value.length; i++) {
            if (textData.value[i].china === arr[0]) break
            if (i === textData.value.length - 1) {
              fileList.value.push({
                china: arr[0],
                pinyin: arr[1],
              })
            }
          }
        })
        uploadDialogVisible.value = true
      }
    })
  }
}

const makeSureUpload = async function() {
  const { data } = await axios.post('http://localhost:3000/text2/addList', {
    list: fileList.value
  })
  if (data.code === 2) {
    ElMessage({
      message: '批量添加成功！',
      type: 'success',
    })
    uploadDialogVisible.value = false
    await getTextList()
  }
}

const goAddText = async () => {
  if (textForm.value.china === '') return ElMessage.error('请输入中文词语')
  if (textForm.value.pinyin === '') return ElMessage.error('请输入笔顺动画链接')
  const { data } = await axios.post('http://localhost:3000/text2/add', {
    ...textForm.value
  })
  if (data.code === 2) {
    ElMessage({
      message: '添加成功！',
      type: 'success',
    })
    textDialog.value = false
    getTextList()
  }
}

const getTextList = async () => {
  const { data } = await axios.post('http://localhost:3000/text2/allData', {})
  if (data.code === 2) {
    textData.value = data.info
    tableData.value = data.info
  }
}

const makeSureDel = async (row) => {
  const { data } = await axios.post('http://localhost:3000/text2/del', {
    id: row.id
  })
  if (data.code === 2) {
    ElMessage({
      message: '删除成功！',
      type: 'success',
    })
    getTextList()
  }
}

const editData = (row) => {
  textForm.value = {
    ...row
  }
  editTextDialog.value = true
}

const goEditText = async () => {
  if (textForm.value.china === '') return ElMessage.error('请输入中文词语')
  if (textForm.value.pinyin === '') return ElMessage.error('请输入笔顺动画链接')
  const { data } = await axios.post('http://localhost:3000/text2/edit', {
    ...textForm.value
  })
  if (data.code === 2) {
    ElMessage({
      message: '修改成功！',
      type: 'success',
    })
    editTextDialog.value = false
    getTextList()
  }
}

const formatDate = (timestamp) => {
  const date = new Date(Number(timestamp));
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

onMounted(async() => {
  getTextList()
})

</script>

<template>
  <div class="data-list">
    <div class="header">
      <div class="left">
        <div class="find-string">
          <el-input v-model="findString" placeholder="请输入筛选内容" style="width: 160px"/>
        </div>
        <div class="find-button">
          <el-button type="primary" @click="gotoFind">筛选</el-button>
          <el-button type="primary" @click="textDialog = true">新建数据</el-button>
        </div>
      </div>
      <div class="right">
        <el-upload
          class="upload-demo"
          :on-change="handleChange"
          :auto-upload="false"
          :show-file-list="false"
          :limit="1"
        >
          <el-button type="primary">导入笔顺动画</el-button>
        </el-upload>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border height="600">
        <el-table-column prop="china" label="添加时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.id) }}
          </template>
        </el-table-column>
        <el-table-column prop="china" label="中文词语" width="180" />
        <el-table-column prop="pinyin" label="笔画视频">
          <template #default="scope">
            <el-link :href="scope.row.pinyin" target="_blank">点此观看</el-link>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="editData(scope.row)">编辑</el-button>
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="textDialog" title="新建词语" width="500" @close="clearForm">
      <el-form :model="textForm">
        <el-form-item label="中文词语" :label-width="formLabelWidth">
          <el-input v-model="textForm.china"/>
        </el-form-item>
        <el-form-item label="笔顺动画链接" :label-width="formLabelWidth">
          <el-input v-model="textForm.pinyin"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="textForm = false">取消</el-button>
          <el-button type="primary" @click="goAddText">确认</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editTextDialog" title="词语编辑" width="500" @close="clearForm">
      <el-form :model="textForm">
        <el-form-item label="中文词语" :label-width="formLabelWidth">
          <el-input v-model="textForm.china"/>
        </el-form-item>
        <el-form-item label="笔顺动画链接" :label-width="formLabelWidth">
          <el-input v-model="textForm.pinyin"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editTextDialog = false">取消</el-button>
          <el-button type="primary" @click="goEditText">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="uploadDialogVisible"
      title="Tips"
      width="500"
    >
      <span>一共{{ fileList.length }}条有效数据，确定上传吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="uploadDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="makeSureUpload">
            确定
          </el-button>
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
    display: flex;
    justify-content: space-between;
    height: 40px;
    padding: 10px;
    width: calc(100% - 20px);
    .left {
      display: flex;
      width: 360px;
      .find-string {
        width: 200px;
      }
      .find-type {
        width: 200px;
      }
    }
  }
  .body {
    width: 100%;
    height: calc(100% - 70px);
    // padding: 0 10px;
    margin-top: 10px;
  }
}
</style>
