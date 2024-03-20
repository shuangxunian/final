<script setup>
import { ref, computed, onMounted } from 'vue'

const tableData = ref([
  {
    titleID: 0,
    name: '类别1',
  },
  {
    titleID: 1,
    name: '类别2',
  }
])

const edit = (scoped) => {
  console.log(scoped.row.AIResult)
}



</script>

<template>
  <div class="talk-list">
    <div class="header">
      <el-button style="margin-left: 10px" type="primary">添加标签</el-button>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="titleID" label="标签ID"/>
        <el-table-column prop="name" label="标签名称"/>
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="edit(scoped)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.talk-list {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
  }
  .body {
    padding: 10px;
  }
}
</style>
