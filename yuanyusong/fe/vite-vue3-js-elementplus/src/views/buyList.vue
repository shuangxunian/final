<script setup>
import { ref, computed, onMounted } from 'vue'

const activeName = ref('nowWeek')
const tableData = ref([
  {
    name: '糖醋里脊',
    date: '2024-03-20',
    type: '午餐',
  },
  {
    name: '糖醋里脊',
    date: '2024-03-20',
    type: '晚餐',
  },
])

const handleClick = (pane) => {
  console.log(pane.props.name)
}

</script>

<template>
  <div class="admin-home">
    <div class="header">
      <el-button style="margin-left: 10px" type="primary">生成下周食谱</el-button>
      <el-button type="primary">生成明日采购单</el-button>
    </div>
    <div class="body">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="本周食谱" name="nowWeek">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="name" label="食谱名称"/>
            <el-table-column prop="date" label="日期"/>
            <el-table-column prop="type" label="午餐/晚餐"/>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="下周食谱" name="nextWeek">下周</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="less" scoped>
.admin-home {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
  }
  .body {
    height: 700px;
    width: calc(100% - 20px);
    padding: 10px;
  }
}
</style>
