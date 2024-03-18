<script setup>
import { ref, computed, onMounted } from 'vue'

const tableData = ref([
  {
    id: 0,
    question: '企业的定义与功能',
    know: '',
    knowList: [],
    answerA: 0,
    answerAText: "A的文字",
    answerB: 0,
    answerBText: "B的文字",
    answerC: 1,
    answerCText: "C的文字",
    answerD: 1,
    answerDText: "D的文字",
  }
])



</script>

<template>
  <div class="admin-question">
    <div class="header">
      <el-button type="primary" @click="addKnow">新建问题</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="question" label="问题" width="180" />
        <el-table-column prop="know" label="知识点" width="180" />
        <el-table-column prop="answerAText" label="答案A" width="180" />
        <el-table-column prop="answerBText" label="答案B" width="180" />
        <el-table-column prop="answerCText" label="答案C" width="180" />
        <el-table-column prop="answerDText" label="答案D" width="180" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default>
            <el-button link type="primary" size="small" @click="handleClick">编辑</el-button>
            <el-button link type="primary" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.admin-question {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
    width: calc(100% - 40px);
    padding: 0 20px;
  }
  .table {
    height: 600px;
    width: 100%;
  }
}
</style>
