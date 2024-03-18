<script setup>
import { ref, computed, onMounted } from 'vue'

const tableData = ref([
  {
    id: 0,
    name: '第一次全知识点考试',
    questionList: [1,2,3],
    class: [1,2,3],
    know: '',
    knowList: [],
  }
])
</script>

<template>
  <div class="admin-test">
    <div class="header">
      <el-button type="primary" @click="addKnow">新建问题</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="考试名称" width="180" />
        <el-table-column prop="know" label="知识点" width="180" />
        <el-table-column label="所属课程数" width="180">
          <template #default="scope">
            <el-button link type="primary" @click="openClass">{{scope.row.class.length}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="所含题目数" width="180">
          <template #default="scope">
            <el-button link type="primary" @click="openQuestion">{{scope.row.questionList.length}}</el-button>
          </template>
        </el-table-column>
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
.admin-test {
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
