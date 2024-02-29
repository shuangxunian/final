<script setup>
import { ref, computed, onMounted } from 'vue'

const tableData = ref([
  {
    name: "张三",
    role: "教师",
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

const handleSuccess = function(index, scope) {
  console.log(index, scope)
}

const handleDelete = function(index, scope) {
  console.log(index, scope)
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
      <div class="table">
        <el-table :data="tableData" style="width: 100%" border max-height="600">
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="role" label="身份" />
          <el-table-column prop="status" label="状态" />
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button link type="primary" size="small" @click="handleSuccess(scope.$index, scope)">通过</el-button>
              <el-button link type="primary" size="small" @click="handleDelete(scope.$index, scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>
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
      height: 40px;
      padding: 10px;
      .find-string {
        width: 200px;
      }
      .find-type {
        width: 200px;
      }
      // margin-top: 20px;
    }
    .table {
      margin: 0 10px;
    }
  }
}
</style>
