<script setup>
import { ref, computed, onMounted } from 'vue'

const tableData = ref([
  {
    id: 0,
    begin: '大连',
    end: '沈阳',
    IDCard: 'DJ-24030100',
    beginTime: '2024-03-01 15:00:00',
    endTime: '',
    status: '运输中',
  },
  {
    id: 1,
    begin: '沈阳航空航天大学',
    end: '沈阳师范大学',
    IDCard: 'MI-24030100',
    beginTime: '',
    endTime: '',
    status: '待放行',
  },
])
// 待装货，待放行，运输中，已结束，已返航

</script>

<template>
  <div class="user">
    <div class="header">
      <el-button style="margin-left: 10px;" type="primary">新建活动</el-button>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="begin" label="起点" />
        <el-table-column prop="end" label="终点"/>
        <el-table-column prop="IDCard" label="负责无人机" />
        <el-table-column prop="beginTime" label="开始运输时间" width="200" />
        <el-table-column prop="endTime" label="结束运输时间" width="200" />
        <el-table-column prop="status" label="当前状态" />
        <el-table-column fixed="right" label="操作" >
          <template #default="scope">
            <el-button v-if="scope.row.status === '待装货'" link type="primary" size="small" @click="option(scope.$index, scope)">装货完成</el-button>
            <el-button v-if="scope.row.status === '待放行'" link type="primary" size="small" @click="option(scope.$index, scope)">放行</el-button>
            <el-button v-if="scope.row.status === '运输中'" link type="primary" size="small" @click="option(scope.$index, scope)">结束</el-button>
            <el-button v-if="scope.row.status === '已结束'" link type="primary" size="small" @click="option(scope.$index, scope)">返航放行</el-button>
            <!-- <el-button link type="primary" size="small" @click="handleSuccess(scope.$index, scope)">编辑</el-button>
            <el-button link type="primary" size="small" @click="handleDelete(scope.$index, scope)">删除</el-button> -->
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
