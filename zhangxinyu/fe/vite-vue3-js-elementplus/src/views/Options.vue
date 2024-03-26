<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'


const tableData = ref([
  {
    userid: '203401010101',
    username: 'xinyu zhang',
    optionTime: '2024/3/1 16:50:21',
    option: '查询',
    requireWord: '谁'
  },
  {
    userid: '203401010101',
    username: 'xinyu zhang',
    optionTime: '2024/3/1 16:50:21',
    option: '查询',
    requireWord: '我是'
  },
  {
    userid: '203401010101',
    username: 'xinyu zhang',
    optionTime: '2024/3/1 16:50:21',
    option: '查询',
    requireWord: '你好'
  },
  {
    userid: '203401010101',
    username: 'xinyu zhang',
    optionDate: '2024/3/1 16:50:21',
    option: '登录',
    requireWord: '--'
  },
])
const optionDialog = ref(false)
const optionFrom = ref({
  select: '',
  userid: '203401010101',
  username: 'xinyu zhang',
  optionDate: '2024/3/1 16:50:21',
  option: '登录',
  optionType: false,
  requireWord: '--'
})
const formLabelWidth = ref(100)
const options = ref([])
// const userList = ref([])

const getUserList = async() => {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    options.value = []
    data.info.forEach(item => {
      options.value.push({
        ...item,
        label: item.userid + '-' + item.username
      })
      // console.log(item)
    })
    // console.log(options)
    // userList.value = data.info
    // tableData.value = data.info
  }
}
const getOptionList = async() => {}

onMounted(async() => {
  await getUserList()
  await getOptionList()
})

</script>

<template>
  <div class="options">
    <div class="header">
      <div class="test-button">
        <el-button type="primary" @click="optionDialog = true">模拟访问</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: calc(100% - 20px);height: 600px;">
        <el-table-column prop="userid" label="用户ID" width="180" />
        <el-table-column prop="username" label="用户昵称" width="180" />
        <el-table-column prop="optionDate" label="请求时间" width="180" />
        <el-table-column prop="option" label="请求操作" width="180" />
        <el-table-column prop="requireWord" label="访问的单词" />
      </el-table>
    </div>
    
    <el-dialog v-model="optionDialog" title="模拟访问" width="500">
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
            v-model="optionFrom.optionType"
            active-text="登录"
            inactive-text="访问"
          />
          <!-- <el-input v-model="loginForm.userid" autocomplete="off" /> -->
        </el-form-item>
        <el-form-item v-if="!optionFrom.optionType" label="单词名" :label-width="formLabelWidth">
          <el-input v-model="optionFrom.requireWord" autocomplete="off" />
        </el-form-item>
        <!-- <el-form-item label="学号" :label-width="formLabelWidth">
          <el-input v-model="loginForm.userid" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="addUserForm.password" autocomplete="off" />
        </el-form-item> -->
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dontLogin">取消</el-button>
          <el-button type="primary" @click="goLogin">确认</el-button>
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
    padding: 0 10px;
    padding-top: 10px;
  }
}
</style>
