<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const foodList = ref([])
const foodDetailDialog = ref(false)
const addRecipeDialog = ref(false)
const selectFoodDialog = ref(false)
const foodListDialog = ref(false)
const editRecipeDialog = ref(false)


const srcList = ref([])
const checkList = ref([])
const form = ref({
  name: '',
  needFood: [],
  ingredient: '',
  energy: 0,
  protein: 0,
  fat: 0,
  sugar: 0
})
const foodForm = ref({
  id: '',
  name: '',
  num: 0
})
const foodDetailForm = ref({})
const formLabelWidth = '140px'

const closeSelectFoodDialog = () => {
  foodForm.value = {
    id: '',
    name: '',
    num: 0
  }
}

const refreshForm = () => {
  checkList.value = []
  form.value = {
    name: '',
    needFood: [],
    ingredient: '',
    energy: 0,
    protein: 0,
    fat: 0,
    sugar: 0
  }
}

const lookBigImg = (scope) => {
  srcList.value = [tableData.value[scope.$index].img]
}

const addRecipe = async() => {
  if (form.value.name === '' || form.value.needFood.length === 0) {
    ElMessage.error('请填写完整')
    return
  }
  const { data } = await axios.post('http://localhost:3000/recipe/add', {
    ...form.value,
    ingredient: checkList.value.join(',')
  })
  if (data.code === 2) {
    addRecipeDialog.value = false
    ElMessage.success('添加成功')
    await getRecList()
  }
}

const editRecipe = async() => {
  if (form.value.name === '' || form.value.needFood.length === 0) {
    ElMessage.error('请填写完整')
    return
  }
  console.log(checkList.value)
  const { data } = await axios.post('http://localhost:3000/recipe/edit', {
    ...form.value,
    ingredient: checkList.value.join(',')
  })
  if (data.code === 2) {
    editRecipeDialog.value = false
    ElMessage.success('修改成功')
    await getRecList()
  }
}

const makeSureDel = async(row) => {
  const { data } = await axios.post('http://localhost:3000/recipe/del', {
    id: row.id
  })
  if (data.code === 2) {
    ElMessage.success('删除成功')
    await getRecList()
  }
}

const editData = async(row) => {
  form.value = row
  checkList.value = row.ingredient.split(',')
  console.log(checkList.value)
  editRecipeDialog.value = true
}

const getRecList = async() => {
  const { data } = await axios.post('http://localhost:3000/recipe/allData', {})
  if (data.code === 2) {
    tableData.value = data.body
  }
}

const addNeedFood = async() => {
  for(let i = 0; i < foodList.value.length; i++) {
    if (foodList.value[i].id === foodForm.value.id) {
      console.log(foodList.value[i])
      form.value.needFood.push({
        ...foodList.value[i],
        num: foodForm.value.num
      })
      form.value.energy = (Number(form.value.energy) + Number(foodList.value[i].energy) * foodForm.value.num / 100).toFixed(2)
      form.value.protein = (Number(form.value.protein) + Number(foodList.value[i].protein) * foodForm.value.num / 100).toFixed(2)
      form.value.fat = (Number(form.value.fat) + Number(foodList.value[i].fat) * foodForm.value.num / 100).toFixed(2)
      form.value.sugar = (Number(form.value.sugar) + Number(foodList.value[i].sugar) * foodForm.value.num / 100).toFixed(2)
    }
  }
  selectFoodDialog.value = false
}

const handleClose = (tag) => {
  form.value.needFood = form.value.needFood.filter(item => item.id !== tag.id)
}

const showDetail = (row) => {
  foodDetailForm.value = row
  // console.log(row)
  foodDetailDialog.value = true
}

const editFood = (tag) => {
  foodForm.value = {
    id: tag.id,
    name: tag.name,
    num: tag.num
  }
  selectFoodDialog.value = true
}

const getFoodList = async() => {
  const { data } = await axios.post('http://localhost:3000/food/allData', {})
  if (data.code === 2) {
    console.log(data.body)
    foodList.value = data.body
  }
}

onMounted(async() => {
  await getFoodList()
  await getRecList()
})
// 名称、工艺、所需食材、食材类型、所需重量、所含营养成分
</script>

<template>
  <div class="food-list">
    <div class="header">
      <el-button style="margin-left: 10px" type="primary" @click="addRecipeDialog = true">添加食谱</el-button>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="食谱名称" width="200"/>
        <el-table-column prop="needFood" label="所需食材" width="400">
          <template #default="scope">
            <span v-for="(item, index) in scope.row.needFood" :key="index">
              <el-button type="primary" link @click="showDetail(item)">{{ item.name }}</el-button>
              : {{ item.num }}g，
            </span>
            <!-- <div v-for="(item, index) in scope.row.needFood" :key="index">
              <span>{{ item.name }}: {{ item.num }}g，</span>
            </div> -->
          </template>
        </el-table-column>
        <el-table-column prop="ingredient" label="配料" width="100"/>
        <el-table-column label="营养成分/每100g">
          <el-table-column prop="energy" label="能量/kJ"/>
          <el-table-column prop="protein" label="蛋白质/g"/>
          <el-table-column prop="fat" label="脂肪/g"/>
          <el-table-column prop="sugar" label="糖/g"/>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="editData(scoped.row)">编辑</el-button>
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scoped.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <el-dialog v-model="foodDetailDialog" title="食材详情" width="500">
      <el-form>
        <el-form-item label="食材名称" :label-width="formLabelWidth">
          {{foodDetailForm.name}}
        </el-form-item>
        <el-form-item label="热量/kJ" :label-width="formLabelWidth">
          {{foodDetailForm.energy}}
        </el-form-item>
        <el-form-item label="蛋白质/g" :label-width="formLabelWidth">
          {{foodDetailForm.protein}}
        </el-form-item>
        <el-form-item label="脂肪/g" :label-width="formLabelWidth">
          {{foodDetailForm.fat}}
        </el-form-item>
        <el-form-item label="碳水化合物/g" :label-width="formLabelWidth">
          {{foodDetailForm.sugar}}
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="foodDetailDialog = false">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="addRecipeDialog" title="添加食谱" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="食谱名称" :label-width="formLabelWidth">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="食材列表" :label-width="formLabelWidth">
          <el-button link @click="selectFoodDialog = true">选择食材</el-button>
          <div>
            <el-tag v-for="tag in form.needFood" :key="tag.id" closable type="primary" style="margin: 10px 10px 0 0;" @click="editFood(tag)" @close="handleClose(tag)">
              {{ tag.name }}：{{ tag.num }}g
            </el-tag>
          </div>

        </el-form-item>
        <el-form-item label="配料列表" :label-width="formLabelWidth">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="盐" value="盐" />
            <el-checkbox label="生抽" value="生抽" />
            <el-checkbox label="白醋" value="白醋" />
            <el-checkbox label="料酒" value="料酒" />
            <el-checkbox label="白糖" value="白糖" />
            <el-checkbox label="辣椒" value="辣椒" />
            <el-checkbox label="花椒" value="花椒" />
            <el-checkbox label="葱" value="葱" />
            <el-checkbox label="姜" value="姜" />
            <el-checkbox label="蒜" value="蒜" />
            <el-checkbox label="香菜" value="香菜" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="热量/kJ/100g" :label-width="formLabelWidth">
          <el-input disabled v-model="form.energy" placeholder="系统自动生成"/>
        </el-form-item>
        <el-form-item label="蛋白质/g/100g" :label-width="formLabelWidth">
          <el-input disabled v-model="form.protein" placeholder="系统自动生成"/>
        </el-form-item>
        <el-form-item label="脂肪/g/100g" :label-width="formLabelWidth">
          <el-input disabled v-model="form.fat" placeholder="系统自动生成"/>
        </el-form-item>
        <el-form-item label="碳水化合物/g/100g" :label-width="formLabelWidth">
          <el-input disabled v-model="form.sugar" placeholder="系统自动生成"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addRecipeDialog = false">取消</el-button>
          <el-button type="primary" @click="addRecipe">添加</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="editRecipeDialog" title="编辑食谱" width="500" @close="refreshForm">
      <el-form :model="form">
        <el-form-item label="食谱名称" :label-width="formLabelWidth">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="食材列表" :label-width="formLabelWidth">
          <el-button link @click="selectFoodDialog = true">选择食材</el-button>
          <div>
            <el-tag v-for="tag in form.needFood" :key="tag.id" closable type="primary" style="margin: 10px 10px 0 0;" @click="editFood(tag)" @close="handleClose(tag)">
              {{ tag.name }}：{{ tag.num }}g
            </el-tag>
          </div>

        </el-form-item>
        <el-form-item label="配料列表" :label-width="formLabelWidth">
          <el-checkbox-group v-model="checkList">
            <el-checkbox label="盐" value="盐" />
            <el-checkbox label="生抽" value="生抽" />
            <el-checkbox label="白醋" value="白醋" />
            <el-checkbox label="料酒" value="料酒" />
            <el-checkbox label="白糖" value="白糖" />
            <el-checkbox label="辣椒" value="辣椒" />
            <el-checkbox label="花椒" value="花椒" />
            <el-checkbox label="葱" value="葱" />
            <el-checkbox label="姜" value="姜" />
            <el-checkbox label="蒜" value="蒜" />
            <el-checkbox label="香菜" value="香菜" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="热量/kJ/100g" :label-width="formLabelWidth">
          <el-input disabled v-model="form.energy"/>
        </el-form-item>
        <el-form-item label="蛋白质/g/100g" :label-width="formLabelWidth">
          <el-input disabled v-model="form.protein"/>
        </el-form-item>
        <el-form-item label="脂肪/g/100g" :label-width="formLabelWidth">
          <el-input disabled v-model="form.fat"/>
        </el-form-item>
        <el-form-item label="碳水化合物/g/100g" :label-width="formLabelWidth">
          <el-input disabled v-model="form.sugar"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editRecipeDialog = false">取消</el-button>
          <el-button type="primary" @click="editRecipe">确定修改</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="selectFoodDialog" title="选择食材" width="500" @close="closeSelectFoodDialog">
      <el-form :model="foodForm">
        <el-form-item label="食材名称" :label-width="formLabelWidth">
          <el-select v-model="foodForm.id" placeholder="请选择食材" >
            <el-option
              v-for="item in foodList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="食材重量" :label-width="formLabelWidth">
          <el-input-number v-model="foodForm.num" />&nbsp;g
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="selectFoodDialog = false">取消</el-button>
          <el-button type="primary" @click="addNeedFood">添加</el-button>
        </div>
      </template>
    </el-dialog>


    <el-dialog v-model="foodListDialog" title="食材列表" width="500" @close="refreshForm">
      <el-form :model="foodForm">
        <el-form-item label="食谱名称" :label-width="formLabelWidth">
          <el-input v-model="form.name"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addRecipeDialog = false">取消</el-button>
          <el-button type="primary" @click="addRecipe">添加</el-button>
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
