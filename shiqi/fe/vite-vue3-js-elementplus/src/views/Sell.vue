<script setup>
import { ref, computed } from 'vue'

const findData = ref('')
const tableData = ref([
  {
    productLot: "20231201AA",
    name: '健胃消食片',
    belong: '江中',
    patientName: '张三',
    phone: '13012345678',
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
        <el-button type="primary" @click="addProduct">新建出库单</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" max-height="600">
        <el-table-column prop="productLot" label="产品批号" width="300" />
        <el-table-column prop="name" label="药品名称" width="300" />
        <el-table-column prop="belong" label="所属厂家" width="300" />
        <el-table-column prop="patientName" label="病人姓名" width="200" />
        <el-table-column prop="phone" label="病人电话" width="200" />
        <el-table-column prop="optionNum" label="出库量" />
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
