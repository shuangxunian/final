<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])

const formatDate = (row, column) => {
  let date = new Date(parseInt(row.id.split('-')));
  let Y = date.getFullYear() + '-';
  let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
  let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
  let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
  let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
  let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + M + D + h + m + s;
}

const getOptionList = async () => {
  const { data } = await axios.post('http://localhost:3000/option/allData', {})
  if (data.code === 2) {
    tableData.value = data.info
    console.log(data.info)
  }
}

onMounted(async () => {
  getOptionList()
})

</script>

<template>
  <div class="option-list">
    <div class="header"></div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%" border max-height="600">
        <el-table-column prop="name" label="单位名称" />
        <el-table-column prop="userOption" label="操作" />
        <el-table-column prop="time" label="触发时间" :formatter="formatDate"/>
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.option-list {

}
</style>
