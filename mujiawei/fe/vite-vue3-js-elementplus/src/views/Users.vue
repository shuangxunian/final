<script setup>
import { ref, computed, onMounted } from 'vue'

const tableData = ref([
  {
    id: 0,
    corporationName: '小米',
    IDCard: 'MI-24030100',
    power: '3600',
    maxWeight: 10,
    workTime: 0,
  },
  {
    id: 1,
    corporationName: '大疆',
    IDCard: 'DJ-24030100',
    power: '4000',
    maxWeight: 10,
    workTime: 0,
  },
])

</script>

<template>
  <div class="user">
    <div class="header">
      <el-button style="margin-left: 10px;" type="primary">新建无人机</el-button>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="IDCard" label="编号" />
        <el-table-column prop="corporationName" label="所属公司" width="180" />
        <el-table-column prop="power" label="电量/mA" />
        <el-table-column prop="maxWeight" label="最大承载重量/kg" />
        <el-table-column prop="workTime" label="工作次数" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleSuccess(scope.$index, scope)">编辑</el-button>
            <el-button link type="primary" size="small" @click="handleDelete(scope.$index, scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.user {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
  }
  .body {}
}
</style>
