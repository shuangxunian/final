<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])

const timestampToDateTime = (timestamp) => {
  if (!timestamp) {
    return ''
  }
  let date = new Date(Number(timestamp))
  let year = date.getFullYear()
  let month = String(date.getMonth() + 1).padStart(2, '0')
  let day = String(date.getDate()).padStart(2, '0')
  let hours = String(date.getHours()).padStart(2, '0')
  let minutes = String(date.getMinutes()).padStart(2, '0')
  let seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const getOptionData = async () => {
  const { data } = await axios.post('http://localhost:3000/option/allData', {})
  if (data.code === 2) {
    tableData.value = data.body
  }
}

onMounted(async() => {
  await getOptionData()
})

</script>

<template>
  <div class="user">
    <div class="body">
      <el-table :data="tableData" style="width: 100%" height="600px">
        <el-table-column prop="id" label="操作时间" width="200" >
          <template #default="scope">
            {{ timestampToDateTime(scope.row.id) }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="操作人"  width="300"/>
        <el-table-column prop="leftUrl" label="图片1"  width="300">
          <template #default="scope">
            <el-image :preview-teleported="true" :src="scope.row.leftUrl" :preview-src-list="[scope.row.leftUrl]" />
          </template>
        </el-table-column>
        <el-table-column prop="rightUrl" label="图片1"  width="300">
          <template #default="scope">
            <el-image :preview-teleported="true" :src="scope.row.rightUrl" :preview-src-list="[scope.row.rightUrl]" />
          </template>
        </el-table-column>
        <el-table-column prop="aiUrl" label="图片1"  width="300">
          <template #default="scope">
            <el-image :preview-teleported="true" :src="scope.row.aiUrl" :preview-src-list="[scope.row.aiUrl]" />
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
