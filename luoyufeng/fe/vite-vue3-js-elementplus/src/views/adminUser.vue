<script setup>
import { ref, computed, onMounted } from 'vue'

const tableData = ref([
  {
    name: 'admin',
  },
  {
    name: 'test1',
  },
])

</script>

<template>
  <div class="admin-user">
    <div class="header">
      <el-button style="margin-left: 10px" type="primary">新建用户</el-button>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="用户名" width="180" />
        <el-table-column fixed="right" label="操作" >
          <template #default>
            <el-button link type="danger" size="small" @click="deleteUser">删除用户</el-button>
            <el-button link type="primary" size="small" @click="resetPassWord">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- user -->
    <!-- /Users/shuangxunian/code/final/luoyufeng/fe/vite-vue3-js-elementplus/src/views/Users.vue -->
  </div>
</template>

<style lang="less" scoped>
.admin-user {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
  }
  .body {
    padding: 10px;
  }
}
</style>
