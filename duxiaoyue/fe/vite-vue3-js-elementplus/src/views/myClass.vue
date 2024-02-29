<script setup>
import { ref, computed, onMounted } from 'vue'
import Papa from 'papaparse'

const tableData = ref([
  {
    className: "计算机组成原理",
    knowledgePoint: ['1', '2', '3'],
    status: "待审核",
    product: [
      {
        name: 'PN结理解',
        knowledgePoint: ['1'],
        docUrl: 'https://ldwd4y8oeh.feishu.cn/docx/DWstdkeRMooDKJxS0XAcR9ChnIe?from=from_copylink'
      },
      {
        name: '芯片理解',
        knowledgePoint: ['2'],
        docUrl: 'https://ldwd4y8oeh.feishu.cn/docx/DWstdkeRMooDKJxS0XAcR9ChnIe?from=from_copylink'
      },
      {
        name: '单片机理解',
        knowledgePoint: ['3'],
        docUrl: 'https://ldwd4y8oeh.feishu.cn/docx/DWstdkeRMooDKJxS0XAcR9ChnIe?from=from_copylink'
      },
      {
        name: '单片机组成',
        knowledgePoint: ['4'],
        docUrl: 'https://ldwd4y8oeh.feishu.cn/docx/DWstdkeRMooDKJxS0XAcR9ChnIe?from=from_copylink'
      },
    ]
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
          <div class="find-button">
            <el-button type="primary" @click="gotoFind">筛选</el-button>
          </div>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" border max-height="600">
          <el-table-column type="expand">
            <template #default="props">
              <div>
                <el-table :data="props.row.product" :border="true">
                  <el-table-column prop="name" label="项目名称" />
                  <el-table-column prop="knowledgePoint" label="知识点" />
                  <el-table-column prop="docUrl" label="关联内容链接">
                    <template #default="scope">
                      <el-link type="primary" :href="scope.row.docUrl" target="_blank">文档访问</el-link>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="className" label="课程名称" />
          <el-table-column prop="knowledgePoint" label="知识点" />
          <el-table-column prop="status" label="状态" />
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
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
