<script setup>
import { ref, computed, onMounted } from 'vue'

const tableData = ref([
  {
    id: 0,
    name: '糖醋里脊',
    type: '荤菜',
    option: '炒',
    needFood: '猪里脊400克，盐1勺，料酒适量，鸡蛋1个，淀粉+面粉适量，番茄酱60克，清水45克，白糖30克，白醋20克',
    energy: '100',
    protein: '1',
    fat: '1',
    sugar: '1',
    na: '2'
  }, 
  {
    id: 0,
    name: '糖醋排骨',
    type: '荤菜',
    option: '炒',
    needFood: '猪小排500克，料酒15毫升，盐3克，酱油30毫升，米醋45毫升，白糖60毫升，姜片少许',
    energy: '100',
    protein: '1',
    fat: '100',
    sugar: '1',
    na: '2',
  },
])
const srcList = ref([
  'https://p5.itc.cn/images01/20210517/eece82f12351426483538cb52f92d052.jpeg',
  'https://p8.itc.cn/images01/20211114/e5a5eb7ed98543e0b92bb5639402021b.jpeg',
])

const lookBigImg = (scope) => {
  srcList.value = [tableData.value[scope.$index].img]

}

// 名称、工艺、所需食材、食材类型、所需重量、所含营养成分
</script>

<template>
  <div class="food-list">
    <div class="header">
      <el-button style="margin-left: 10px" type="primary">添加食谱</el-button>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="食谱名称"/>
        <el-table-column prop="type" label="类别"/>
        <el-table-column prop="option" label="工艺"/>
        <el-table-column prop="needFood" label="所需食材" width="200"/>
        <el-table-column label="营养成分/每100g">
          <el-table-column prop="energy" label="能量/kJ"/>
          <el-table-column prop="protein" label="蛋白质/g"/>
          <el-table-column prop="fat" label="脂肪/g"/>
          <el-table-column prop="sugar" label="糖/g"/>
          <el-table-column prop="na" label="钠/mg"/>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="editData(scoped)">编辑</el-button>
            <el-button link type="danger" size="small" @click="delData(scoped)">删除</el-button>
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
