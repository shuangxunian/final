<script setup>
import { ref, computed, onMounted } from 'vue'


const tableData = ref([
  {
    id: 0,
    name: '企业的定义与功能',
    know: '企业的定义与功能',
    url: '',
    knowList: [],
    test: '',
    testList: []
  }
])






</script>

<template>
  <div class="admin-class">
    <div class="header">
      <el-button type="primary" @click="addKnow">新建课程</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="name" label="课程名称" width="180" />
        <el-table-column prop="know" label="知识点" width="180" />
        <el-table-column prop="url" label="学习链接" width="180" />
        <el-table-column prop="test" label="关联考试" width="180" />
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
.admin-class {
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
