<script setup>
import { ref, computed, onMounted } from 'vue'

const tableData = ref([
  {
    name: '默认模型',
    vigorous: '0.8',
    passive: '0.8'
  },
])

</script>

<template>
  <div class="data-list">
    <div class="header">
      <el-button style="margin-left: 10px" type="primary">新建</el-button>
    </div>
    <div class="body">
      <div>
        <el-table
          ref="multipleTableRef"
          :data="tableData"
          style="width: calc(100% -20px);padding: 10px;"
          height="600"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="模型名称"/>
          <el-table-column prop="vigorous" label="积极阈值"/>
          <el-table-column prop="passive" label="消极阈值"/>
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scoped">
              <el-button link type="primary" size="small" @click="editData(scoped)">编辑</el-button>
              <el-button link type="danger" size="small" @click="delData(scoped)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.data-list {
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
