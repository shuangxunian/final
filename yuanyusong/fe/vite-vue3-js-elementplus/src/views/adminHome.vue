<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const recipeList = ref([])
const dateRecipeList = ref([])
const addRecipeDialog = ref(false)
const addRecipeForm = ref({})
const peopleNum = ref(0)
const recipeForm = ref({
  recipeid: '',
  dateObj: '',
  type: '',
})
const formLabelWidth = '140px'
const peopleNumDialog = ref(false)

const closeDialog = () => {

}

const getSelectDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const addRecipe = async() => {
  if (recipeForm.value.recipeid === '') {
    ElMessage.error('请选择食谱')
    return
  }
  if (recipeForm.value.dateObj === '') {
    ElMessage.error('请选择日期')
    return
  }
  if (recipeForm.value.type === '') {
    ElMessage.error('请选择类别')
    return
  }
  const date = getSelectDate(recipeForm.value.dateObj)
  const { data } = await axios.post('http://localhost:3000/dateRecipe/add', {
    ...recipeForm.value,
    date
  })
  if (data.code === 2) {
    ElMessage.success('添加成功')
    addRecipeDialog.value = false
    await getDateRecipeList()
  }
}

const buildNeed = async() => {
  if (peopleNum.value <= 0) {
    ElMessage.error('人数有误')
    return
  }
  const nextDay = getSelectDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))
  const needList = []
  const needFoodList = []
  dateRecipeList.value.forEach(item => {
    if (item.date === nextDay) {
      needList.push(item)
    }
  })
  const recipeMap = {}
  recipeList.value.forEach(item => {
    recipeMap[item.id] = item
  })
  needList.forEach(item => {
    recipeMap[item.recipeid].needFood.forEach(food => {
      let flag = false
      for (let i = 0; i < needFoodList.length; i++) {
        if (needFoodList[i][0] === food.name) {
          flag = true
          needFoodList[i][1] += food.num
          break
        }
      }
      if (!flag) {
        needFoodList.push([food.name, food.num])
      }
    })
  })
  needFoodList.map(item => {
    item[1] = item[1] * peopleNum.value
  })
  needFoodList.unshift(['名称', '数量/g'])
  let csv = ''
  needFoodList.forEach(item => {
    csv += `${item[0]},${item[1]}\n`
  })
  const link = document.createElement('a')
  link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
  link.download = 'need.csv'
  link.click()
}

const getRecipeList = async() => {
  const { data } = await axios.post('http://localhost:3000/recipe/allData', {})
  if (data.code === 2) {
    recipeList.value = data.body
  }
}

const getDateRecipeList = async() => {
  const { data } = await axios.post('http://localhost:3000/dateRecipe/allData', {})
  if (data.code === 2) {
    dateRecipeList.value = data.body
    const recipeMap = {}
    recipeList.value.forEach(item => {
      recipeMap[item.id] = item.name
    })
    dateRecipeList.value.forEach(item => {
      item.name = recipeMap[item.recipeid]
    })
    tableData.value = dateRecipeList.value
  }
}

onMounted(async() => {
  await getRecipeList()
  await getDateRecipeList()
})

</script>

<template>
  <div class="admin-home">
    <div class="header">
      <!-- <el-button style="margin-left: 10px" type="primary" @click="addRecipe">生成未来七天食谱</el-button> -->
      <el-button style="margin-left: 10px" type="primary" @click="addRecipeDialog = true">生成食谱</el-button>
      <el-button type="primary" @click="peopleNumDialog = true">生成明日采购单</el-button>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="食谱名称"/>
        <el-table-column prop="date" label="日期"/>
        <el-table-column prop="type" label="午餐/晚餐"/>
      </el-table>
    </div>

    <el-dialog v-model="addRecipeDialog" title="选择食谱" width="500" @close="closeDialog">
      <el-form :model="recipeForm">
        <el-form-item label="食谱名称" :label-width="formLabelWidth">
          <el-select v-model="recipeForm.recipeid" placeholder="请选择食谱" >
            <el-option
              v-for="item in recipeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="recipeForm.dateObj"
            type="date"
            placeholder="选择日期"
          />
          <!-- <el-input-number v-model="recipeForm.date" /> -->
        </el-form-item>
        <el-form-item label="类别" :label-width="formLabelWidth">
          <el-radio-group v-model="recipeForm.type" class="ml-4">
            <el-radio value="午餐">午餐</el-radio>
            <el-radio value="晚餐">晚餐</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addRecipeDialog = false">取消</el-button>
          <el-button type="primary" @click="addRecipe">添加</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="peopleNumDialog" title="所需人数" width="500" @close="closeDialog">
      <el-form>
        <el-form-item label="人数" :label-width="formLabelWidth">
          <el-input-number v-model="peopleNum" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="peopleNumDialog = false">取消</el-button>
          <el-button type="primary" @click="buildNeed">添加</el-button>
        </div>
      </template>
    </el-dialog>
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
