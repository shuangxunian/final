<script setup>
import { ref, computed } from 'vue'

const findData = ref('')
const tableData = ref([
  {
    username: 'zhangsan',
    date: '2024-3-2 12:06:00',
    option: '入库',
    optionid: '11001',
    productLot: "20231201AA",
    name: '健胃消食片',
    belong: '江中',
    optionNum: 10
  },
])

const getList = function () {}

</script>

<template>
  <div class="product">
    <div class="header">
      <div class="left">
        <el-input v-model="findData" style="width: 240px" placeholder="请输入内容" />
        <el-button @click="getList">筛选</el-button>
      </div>
      <div class="right">
        <el-button type="danger" @click="addProduct">紧急召回</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" max-height="600">
        <el-table-column prop="optionid" label="操作id" width="120" />
        <el-table-column prop="username" label="用户" width="180" />
        <el-table-column prop="date" label="操作时间" width="180" />
        <el-table-column prop="option" label="出入库" width="100" />
        <el-table-column prop="productLot" label="产品批号" width="300" />
        <el-table-column prop="name" label="药品名称" width="300" />
        <el-table-column prop="belong" label="所属厂家" width="300" />
        <el-table-column prop="optionNum" label="操作数量"/>
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="handleClick">编辑</el-button>
            <el-button link type="primary" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.product {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    line-height: 60px;
  }
  .body {
    padding: 0 10px;
  }
}
</style>
