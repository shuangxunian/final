<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const belong = ref('')
const roleType = ref('')
const userid = ref('')
const userList = ref([])
const addMainDialog = ref(false)
const main = ref('')
const nowSelectServer = ref({})

const getServerList = async () => {
  const { data } = await axios.post('http://localhost:3000/workServer/alldata')
  if (data.code === 2) {
    tableData.value = []
    if (roleType.value === '1') {
      data.info.forEach(item => {
        if (item.server === belong.value) {
          let location = item.locationName + '-' + item.room
          tableData.value.push({
            ...item,
            location
          })
        }
      })
    } else {
      data.info.forEach(item => {
        if (item.server === belong.value && item.main === userid.value) {
          let location = item.locationName + '-' + item.room
          tableData.value.push({
            ...item,
            location
          })
        }
      })
    }

  }
}

const getUserList = async () => {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    userList.value = []
    data.info.forEach(item => {
      if (item.belong === belong.value && item.roleType === 2) {
        userList.value.push(item)
      }
    })
  }
}

const addMain = async (row) => {
  nowSelectServer.value = row
  main.value = row.main
  addMainDialog.value = true
}

const toAddMain = async () => {
  addMainDialog.value = false
  let name = ''
  userList.value.forEach(item => {
    if(item.userid === main.value) name = item.username
  })
  const { data } = await axios.post('http://localhost:3000/workServer/addMain', {
    id: nowSelectServer.value.id,
    main: main.value,
    mainname: name,
  })
  if (data.code === 2) {
    ElMessage({
      message: '修改成功！',
      type: 'success',
    })
    await getServerList()
  }

}

const clearForm = () => {
  main.value = ''
}


onMounted(async () => {
  belong.value = window.sessionStorage.getItem('belong')
  userid.value = window.sessionStorage.getItem('userid')
  roleType.value = window.sessionStorage.getItem('roleType')
  await getServerList()
  await getUserList()
})

</script>

<template>
  <div class="admin-user">
    <div class="header"></div>
    <div class="body">
      <el-table :data="tableData" style="width:100%" border max-height="600">
        <el-table-column prop="serverObj" label="需要服务人" />
        <el-table-column prop="phone" label="电话号" />
        <el-table-column prop="location" label="地点" />
        <el-table-column prop="mainname" label="负责人" />
        <el-table-column v-if="roleType === '1'" fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="addMain(scope.row)">添加负责人</el-button>
            <!-- <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm> -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="addMainDialog" title="添加负责人" width="500" @close="clearForm">
      <el-form>
        <el-form-item label="负责人" :label-width="100">
          <el-select v-model="main" placeholder="请选择负责人">
            <el-option
              v-for="item in userList"
              :key="item.userid"
              :label="item.username"
              :value="item.userid"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addMainDialog = false">取消</el-button>
          <el-button type="primary" @click="toAddMain">添加负责人</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.admin-user {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    // height: 70px;
    // line-height: 70px;
  }
}
</style>
