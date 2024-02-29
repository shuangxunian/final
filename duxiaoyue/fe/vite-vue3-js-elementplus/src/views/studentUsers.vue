<script setup>
import { ref, computed, onMounted } from 'vue'
import Papa from 'papaparse'

const tableData = ref([
  {
    name: "张三",
    userName: '173401010101',
    status: "待审核",
  }
])
const allType = ref([
  {
    value: "0",
    label: "全部"
  },{
    value: "1",
    label: "未审核"
  },{
    value: "2",
    label: "已审核"
  }
])
const findString = ref('')
const nowSelectType = ref('0')
const fileList = ref([])
const uploadDialogVisible = ref(false)

const handleSuccess = function(index, scope) {
  console.log(index, scope)
}

const refreshPwd = function(index, scope) {
  console.log(index, scope)
}

const handleDelete = function(index, scope) {
  console.log(index, scope)
}

const handleChange = function(uploadFile, uploadFiles) {
  var reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = evt => {
    Papa.parse(uploadFile.raw, {
      complete: res => {
        let data = res.data
        const result = Papa.unparse(data)
        const csvRecordsArray = result?.split(/\r\n|\n/)
        fileList.value = csvRecordsArray.slice(1)
        console.log(fileList.value)
      }
    })
  }
}

const makeSureUpload = function() {

}

const gotoFind = function() {
  console.log(nowSelectType.value)
}


onMounted(() => {})

</script>

<template>
  <div class="admin-users">
    <div class="body">
      <div class="header">
        <div class="left">
          <div class="find-string">
            <el-input v-model="findString" placeholder="请输入筛选内容" style="width: 160px"/>
          </div>
          <div class="find-type">
            <el-select
              v-model="nowSelectType"
              class="m-2"
              placeholder="请选择类别"
              style="width: 160px"
            >
              <el-option
                v-for="item in allType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="find-button">
            <el-button type="primary" @click="gotoFind">筛选</el-button>
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
            <el-button type="primary">导入学生</el-button>
          </el-upload>
            <!-- <el-button type="primary" @click="gotoFind">导入学生</el-button> -->
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" border max-height="600">
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="userName" label="学号" />
          <el-table-column prop="status" label="状态" />
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleSuccess(scope.$index, scope)">通过</el-button>
              <el-button link type="primary" size="small" @click="refreshPwd(scope.$index, scope)">重置密码</el-button>
              <el-button link type="primary" size="small" @click="handleDelete(scope.$index, scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      v-model="uploadDialogVisible"
      title="Tips"
      width="500"
    >
      <span>一共{{ fileList.length }}条数据，确定上传吗？</span>
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
.admin-users {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .body {
    .header {
      display: flex;
      justify-content: space-between;
      height: 40px;
      padding: 10px;
      .left {
        display: flex;
        .find-string {
          width: 200px;
        }
        .find-type {
          width: 200px;
        }
      }
      .right {}

    }
    .table {
      margin: 0 10px;
    }
  }
}
</style>
