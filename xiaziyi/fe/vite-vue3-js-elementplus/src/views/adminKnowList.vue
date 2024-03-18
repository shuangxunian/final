<script setup>
import { ref, computed, onMounted } from 'vue'
const tableData = ref([
  {
    id: 0,
    label: '企业的功能与定义',
    tag: '正常',
    upstream : '企业的功能与定义',
    downstream: '企业的功能与定义',
    upstreamIDList: [],
    downstreamIDList: [],
  },
  {
    id: 0,
    label: '企业的功能与定义',
    tag: '删除中',
    upstream : '企业的功能与定义',
    downstream: '企业的功能与定义',
    upstreamIDList: [],
    downstreamIDList: [],
  },
])

</script>

<template>
  <div class="admin-know-list">
    <div class="header">
      <el-button type="primary" @click="addKnow">新建知识点</el-button>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="label" label="知识点名称" width="180" />
        <el-table-column prop="upstream" label="上游知识点" width="180" />
        <el-table-column prop="downstream" label="下游知识点" width="180" />
        <el-table-column
          prop="tag"
          label="知识点状态"
          width="100"
        >
          <template #default="scope">
            <el-tag
              :type="scope.row.tag === '正常' ? 'primary' : 'danger'"
              disable-transitions
              >{{ scope.row.tag }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button v-if="scope.row.tag === '正常'" link type="primary" size="small" @click="handleClick">编辑</el-button>
            <el-button v-if="scope.row.tag === '正常'" link type="danger" size="small">删除</el-button>
            <el-button v-else link type="success" size="small">还原</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="address" label="Address" /> -->
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.admin-know-list {
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
    height: calc(100%-70px);
    width: 100%;
  }
}
</style>
