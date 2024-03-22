<script setup>
import { ref, computed } from 'vue'

const tableData = ref([
  {
    name: '长春航空局',
    email: '1776056253@qq.com'
  },
  {
    name: '沈阳航空局',
    email: '1776056253@qq.com'
  },
  {
    name: '大连航空局',
    email: '1776056253@qq.com'
  },
])

</script>

<template>
  <div class="user-info">
    <div class="header"></div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%" border max-height="600">
        <el-table-column prop="name" label="单位名称" />
        <el-table-column prop="email" label="联系邮箱" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="handleSuccess(scope.$index, scope)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.user-info {

}
</style>
