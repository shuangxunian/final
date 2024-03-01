<script setup>
import { ref } from 'vue'

const tableData = ref([
  {
    china: '你好',
    eng: 'hello',
    info: 'Used as a greeting or greeting'
  },
  {
    china: '你',
    eng: 'you',
    info: ''
  },
  {
    china: '我',
    eng: 'I',
    info: ''
  },
])

</script>

<template>
  <div class="data-list">
    <div class="header">
      <div class="test-button">
        <el-button type="primary">新建数据</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: calc(100% - 20px);height: 600px;">
        <el-table-column prop="china" label="中文词语" width="180" />
        <el-table-column prop="eng" label="英文单词" width="180" />
        <el-table-column prop="info" label="解释"/>
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.data-list {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    width: 100%;
    height: 60px;
    display: flex;
    .is-test {
      width: 140px;
      margin-left: 10px;
      line-height: 60px;
    }
    .test-button {
      margin-left: 10px;
      line-height: 60px;
    }
  }
  .body {
    width: 100%;
    height: calc(100% - 70px);
    padding: 0 10px;
    margin-top: 10px;
  }
}
</style>
