<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const tableData = ref([
  {
    username: 'user',
    name: '用户1',
    role: '用户',
    belong: '',
  },
  {
    username: 'user1',
    name: '代理商1',
    role: '代理商',
    belong: '移动',
  },
  {
    username: 'user2',
    name: '信息员1',
    role: '信息员',
    belong: '移动',
  },
])

</script>

<template>
  <div class="admin-user">
    <div class="header"></div>
    <div class="body">
      <el-table :data="tableData" style="width: calc(100% - 20px);padding: 10px;" border max-height="600">
        <el-table-column prop="username" label="账号" />
        <el-table-column prop="name" label="用户名" />
        <el-table-column prop="role" label="身份" />
        <el-table-column prop="belong" label="所属平台" />
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.admin-user {
  width: 100%;
  height: 100%;
  background-color: #fff;
}
</style>
