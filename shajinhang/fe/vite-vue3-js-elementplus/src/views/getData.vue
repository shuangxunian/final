<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const findBV = ref('BV1CK421v7NL')
const talkList = ref([])
const tableData = ref([])
const selectList = ref([])
const getDataDialog = ref(false)
const getTalkList = ref([])
const textarea = ref('')
const form = ref({
  textarea: '',
  status: '',
})
const formLabelWidth = '100px'
const nowTextarea = ref(0)

const getData = async () => {
  const { data } = await axios.post('http://localhost:3000/data/get', {
    bv: findBV.value
  })
  if(data.code === 2) {
    getTalkList.value = data.body.comments
    tableData.value = []
    data.body.comments.forEach(item => {
      tableData.value.push({
        talk: item.content.message,
        status: ''
      })
    })
  }
}

const handleSelectionChange = (val) => {
  selectList.value = val
}

const getAllData = async () => {
  // const { data } = await axios.post('http://localhost:3000/data/alldata', {})
}
const saveText = async () => {}
const nextText = async () => {}
const finishAdd = async () => {}
const addDataList = async () => {
  if (selectList.value.length === 0) {
    return ElMessage({
      message: '请选择要添加的数据',
      type: 'warning'
    })
  }
  let successNum = 0
  for (let i = 0; i < selectList.value.length; i++) {
    const { data } = await axios.post('http://localhost:3000/data/add', {
      ...selectList.value[i]
    })
    if(data.code === 2) {
      successNum++
    }
  }
  ElMessage({
    message: `成功添加${successNum}条数据`,
    type: 'success'
  })
  selectList.value = []
  tableData.value = []
}

onMounted(async() => {
  await getAllData()
  // await getData()
})

</script>

<template>
  <div class="get-data">
    <div class="header">
      <el-input v-model="findBV" style="width: 240px;margin-left: 10px;" placeholder="请输入想要爬取的BV号" />
      <el-button style="margin-left: 10px" type="primary" @click="getData">爬取</el-button>
    </div>
    <div class="body">
      <div v-if="tableData.length === 0" class="no-data">
        请输入BV号
      </div>
      <div v-else>
        <el-table
          ref="multipleTableRef"
          :data="tableData"
          height="600"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="talk" label="评论" width="800"/>
          <el-table-column prop="status" label="态度">
            <template #default="scope">
              <el-select v-model="scope.row.status" placeholder="请选择">
                <el-option label="积极" value="1" />
                <el-option label="消极" value="2" />
                <el-option label="中性" value="0" />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
        <div class="bottom">
          <el-button style="margin-left: 10px" type="primary" @click="addDataList">添加到数据库</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.get-data {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
  }
  .body {
    .no-data {
      color: #ccc;
      font-size: 40px;
      text-align: center;
    }
    .bottom {
      margin-top: 10px;
    }
  }
}
</style>
