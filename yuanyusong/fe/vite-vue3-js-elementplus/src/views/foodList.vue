<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const form = ref({
  id: '',
  name: '',
  energy: '',
  protein: '',
  fat: '',
  sugar: ''
})
const tableData = ref([])
const srcList = ref([])
const addFoodDialog = ref(false)
const editFoodDialog = ref(false)
const formLabelWidth = '140px'

const refreshForm = () => {
  form.value = {
    id: '',
    name: '',
    energy: '',
    protein: '',
    fat: '',
    sugar: ''
  } 
}

// const lookBigImg = (scope) => {
//   srcList.value = [tableData.value[scope.$index].img]
// }

const addFood = async() => {
  const { data } = await axios.post('http://localhost:3000/food/add', form.value)
  if (data.code === 2) {
    ElMessage.success('添加成功')
    addFoodDialog.value = false
    await getFoodList()
  } else {
    ElMessage.error('添加失败')
  }
}

const editData = (row) => {
  form.value = row
  editFoodDialog.value = true
}


const makeSureEditFood = async() => {
  const { data } = await axios.post('http://localhost:3000/food/edit', form.value)
  if (data.code === 2) {
    ElMessage.success('修改成功')
    editFoodDialog.value = false
    await getFoodList()
  } else {
    ElMessage.error('修改失败')
  }
}

const makeSureDel = async(row) => {
  const { data } = await axios.post('http://localhost:3000/food/del', {id: row.id})
  if (data.code === 2) {
    ElMessage.success('删除成功')
    await getFoodList()
  }
}

const getFoodList = async() => {
  const { data } = await axios.post('http://localhost:3000/food/allData', {})
  if (data.code === 2) {
    tableData.value = data.body
  }
}

onMounted(async() => {
  await getFoodList()
})

</script>

<template>
  <div class="food-list">
    <div class="header">
      <el-button style="margin-left: 10px" type="primary" @click="addFoodDialog = true">添加食材</el-button>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="食材名称"/>
        <el-table-column label="营养成分/每100g">
          <el-table-column prop="energy" label="热量/kJ"/>
          <el-table-column prop="protein" label="蛋白质/g"/>
          <el-table-column prop="fat" label="脂肪/g"/>
          <el-table-column prop="sugar" label="碳水化合物/g"/>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="editData(scope.row)">编辑</el-button>
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="addFoodDialog" title="添加食材" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="食材名称" :label-width="formLabelWidth">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="热量/kJ/100g" :label-width="formLabelWidth">
          <el-input v-model="form.energy"/>
        </el-form-item>
        <el-form-item label="蛋白质/g/100g" :label-width="formLabelWidth">
          <el-input v-model="form.protein"/>
        </el-form-item>
        <el-form-item label="脂肪/g/100g" :label-width="formLabelWidth">
          <el-input v-model="form.fat"/>
        </el-form-item>
        <el-form-item label="碳水化合物/g/100g" :label-width="formLabelWidth">
          <el-input v-model="form.sugar"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addFoodDialog = false">取消</el-button>
          <el-button type="primary" @click="addFood">添加</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editFoodDialog" title="编辑食材" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="食材名称" :label-width="formLabelWidth">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="热量/kJ/100g" :label-width="formLabelWidth">
          <el-input v-model="form.energy"/>
        </el-form-item>
        <el-form-item label="蛋白质/g/100g" :label-width="formLabelWidth">
          <el-input v-model="form.protein"/>
        </el-form-item>
        <el-form-item label="脂肪/g/100g" :label-width="formLabelWidth">
          <el-input v-model="form.fat"/>
        </el-form-item>
        <el-form-item label="碳水化合物/g/100g" :label-width="formLabelWidth">
          <el-input v-model="form.sugar"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addFoodDialog = false">取消</el-button>
          <el-button type="primary" @click="makeSureEditFood">修改</el-button>
        </div>
      </template>
    </el-dialog>
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
