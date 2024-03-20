<script setup>
import { ref, computed, onMounted } from 'vue'
const tableData = ref([
  {
    id: 0,
    name: '牛里脊',
    type: '荤',
    energy: '100',
    protein: '1',
    fat: '1',
    sugar: '1',
    na: '2',
    supplier: '沈阳正大',
    date: '2024-03-15',
    ddl: '2',
    img: 'https://p5.itc.cn/images01/20210517/eece82f12351426483538cb52f92d052.jpeg',
  },
  {
    id: 0,
    name: '猪肉',
    type: '荤',
    energy: '100',
    protein: '1',
    fat: '100',
    sugar: '1',
    na: '2',
    supplier: '沈阳正大',
    date: '2024-03-15',
    ddl: '2',
    img: 'https://p8.itc.cn/images01/20211114/e5a5eb7ed98543e0b92bb5639402021b.jpeg',
  },
])
const srcList = ref([
  'https://p5.itc.cn/images01/20210517/eece82f12351426483538cb52f92d052.jpeg',
  'https://p8.itc.cn/images01/20211114/e5a5eb7ed98543e0b92bb5639402021b.jpeg',
])

const lookBigImg = (scope) => {
  srcList.value = [tableData.value[scope.$index].img]

}

</script>

<template>
  <div class="food-list">
    <div class="header">
      <el-button style="margin-left: 10px" type="primary">添加食材</el-button>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="食材名称"/>
        <el-table-column prop="type" label="类别"/>
        <el-table-column label="营养成分/每100g">
          <el-table-column prop="energy" label="能量/kJ"/>
          <el-table-column prop="protein" label="蛋白质/g"/>
          <el-table-column prop="fat" label="脂肪/g"/>
          <el-table-column prop="sugar" label="糖/g"/>
          <el-table-column prop="na" label="钠/mg"/>
        </el-table-column>
        <el-table-column prop="supplier" label="供货商"/>
        <el-table-column prop="date" label="进货日期" width="150"/>
        <el-table-column prop="ddl" label="保质期/天"/>
        <el-table-column label="图片">
          <template #default="scope">
            <el-image style="width: 50px; height: 50px;" preview-teleported="true" :src="scope.row.img" fit="fill" @click="lookBigImg(scope)" :preview-src-list="srcList" :initial-index="0"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.food-list {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    width: 70px;
    line-height: 70px;
  }
  .body {
    width: calc(100% - 20px);
    height: 700px;
    padding: 10px;
  }
}
</style>
