<script setup>
import { ref, computed } from 'vue'

const tableData = ref([
  {
    name: '系统',
    option: '发送邮寄至-长春航空局',
    time: '2024-03-30 15:00:00'
  },
  {
    name: '长春航空局',
    option: '发送回执',
    time: '2024-03-30 15:10:00'
  },
])

</script>

<template>
  <div class="option-list">
    <div class="header"></div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%" border max-height="600">
        <el-table-column prop="name" label="单位名称" />
        <el-table-column prop="option" label="操作" />
        <el-table-column prop="time" label="触发时间" />
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.option-list {

}
</style>
