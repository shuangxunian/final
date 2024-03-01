<script setup>
import { ref } from 'vue'

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
    optionTime: '2024/3/1 16:50:21',
    option: '登录',
    requireWord: '--'
  },
])
</script>

<template>
  <div class="options">
    <div class="header"></div>
    <div class="body">
      <el-table :data="tableData" border style="width: calc(100% - 20px);height: 600px;">
        <el-table-column prop="userid" label="用户ID" width="180" />
        <el-table-column prop="username" label="用户昵称" width="180" />
        <el-table-column prop="optionTime" label="请求时间" width="180" />
        <el-table-column prop="option" label="请求操作" width="180" />
        <el-table-column prop="requireWord" label="访问的单词" />
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.options {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .body {
    width: 100%;
    // height: calc(100% - 70px);
    padding: 0 10px;
    padding-top: 10px;
  }
}
</style>
