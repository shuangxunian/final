<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'


const tableData = ref([])
const optionList = ref([])
const userList = ref([])
const optionDialog = ref(false)
const optionFrom = ref({
    select: '',
    userid: '',
    username: '',
    isLogin: true,
    optionType: '登录',
    requireWord: ''
})
const formLabelWidth = ref(100)
const options = ref([])

const getUserList = async() => {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    options.value = []
    userList.value = data.info
    data.info.forEach(item => {
      options.value.push({
        ...item,
        label: item.userid + '-' + item.username
      })
    })
  }
}
const clearForm = () => {
  optionFrom.value = {
    select: '',
    userid: '',
    username: '',
    isLogin: false,
    optionType: '登录',
    requireWord: ''
  }
  showText.value = {
    china: '',
    eng: '',
    info: '',
  }
}
const showText = ref({
  china: '',
  eng: '',
  info: '',
})

const goOption = async() => {
  if (optionFrom.value.select === '') return ElMessage.error('请选择模拟人')
  if (!optionFrom.value.isLogin && optionFrom.value.requireWord === '') return ElMessage.error('请输入单词')
  // `userid`, `username`, `optionType` select
  const param = {
    userid: optionFrom.value.select.split('-')[0],
    username: optionFrom.value.select.split('-')[1],
    optionType: optionFrom.value.isLogin ? '登录' : '查询',
    requireWord: optionFrom.value.requireWord
  }
  if (param.optionType === '查询') {
    const { data } = await axios.post('http://localhost:3000/text/find', param)
    if (data.code === 2) {
      ElMessage({
        message: '模拟访问成功！',
        type: 'success',
      })
      showText.value = {
        china: data.info[0].china,
        eng: data.info[0].eng,
        info: data.info[0].info,
      }
    } else {
      ElMessage.error(data.msg)
    }
  } else {
    const { data } = await axios.post('http://localhost:3000/user/login', param)
    if (data.code === 2) {
      ElMessage({
        message: '模拟登录成功！',
        type: 'success',
      })
    }
  }
  await getOptionList()
}

const getTime = (time) => {
  const date = new Date(Number(time));

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime

}

const getOptionList = async() => {
  const { data } = await axios.post('http://localhost:3000/option/allData', {})
  if (data.code === 2) {
    optionList.value = data.info
    tableData.value = []
    data.info.forEach(item => {
      tableData.value.push({
        userid: item.userid,
        username: item.username,
        optionDate: getTime(item.id),
        option: item.optionType,
        requireWord: item.requireWord,
      })
    })
  }
}

onMounted(async() => {
  await getUserList()
  await getOptionList()
})

</script>

<template>
  <div class="options">
    <div class="header">
      <div class="test-button">
        <el-button style="margin-left: 10px" type="primary" @click="optionDialog = true">模拟访问</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border height="500">
        <el-table-column prop="userid" label="用户ID" width="180" />
        <el-table-column prop="username" label="用户昵称" width="180" />
        <el-table-column prop="optionDate" label="请求时间" width="180" />
        <el-table-column prop="option" label="请求操作" width="180" />
        <el-table-column prop="requireWord" label="访问的单词" />
      </el-table>

    </div>
    
    <el-dialog v-model="optionDialog" title="模拟访问" width="500" @close="clearForm">
      <el-form :model="optionFrom">
        <el-form-item label="操作对象" :label-width="formLabelWidth">
          <el-select
            v-model="optionFrom.select"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.userid"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="操作" :label-width="formLabelWidth">
          <el-switch
            v-model="optionFrom.isLogin"
            active-text="登录"
            inactive-text="访问"
          />
        </el-form-item>
        <el-form-item v-if="!optionFrom.isLogin" label="单词名" :label-width="formLabelWidth">
          <el-input v-model="optionFrom.requireWord" autocomplete="off" />
        </el-form-item>
        <div v-if="showText.china !== ''">
          <p>
            <span>中文词语：</span>
            <span>{{ showText.china }}</span>
          </p>
          <p>
            <span>英文单词：</span>
            <span>{{ showText.eng }}</span>
          </p>
          <p>
            <span>英文词语解释：</span>
            <span>{{ showText.info }}</span>
          </p>
        </div>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="optionDialog = false">取消</el-button>
          <el-button type="primary" @click="goOption">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.options {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    width: 100%;
    height: 60px;
    display: flex;
    .test-button {
      line-height: 60px;
    }
  }
  .body {
    width: 100%;
    // height: calc(100% - 70px);
    // height: calc(100% - 70px);
    margin-top: 10px;
    .echart {
      display: flex;
      justify-content: space-around;
      width: 100%;
      height: calc(100% - 500px);
    }
  }
}
</style>
