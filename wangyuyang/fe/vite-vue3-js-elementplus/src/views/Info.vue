<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { ElMessage } from 'element-plus'

const axios = inject('$axios')
const tableData = ref([])
const dialogFormVisible = ref(false)
const nowSelect = ref(-1)
const dialogDelVisible = ref(false)
const dialogEditVisible = ref(false)
const form = ref({
  id: 0,
  productName: '',
  brand: '',
  kind: '',
  isOil: '',
  isAllergy: '',
  isPigmentation: '',
  isWrinkle: ''
})
const options = ref([
  {
    label: '卸妆',
  },
  {
    label: '洁面',
  },
  {
    label: '化妆水',
  },
  {
    label: '乳液',
  },
  {
    label: '面霜',
  },
  {
    label: '美容液',
  },
  {
    label: '防晒霜',
  },
  {
    label: 'ME',
  },
])

async function getAllProductList () {
  const { data } = await axios.post('/product/allData')
  tableData.value = data.body
}

function handleClick () {}

async function addProduct () {
  if(form.value.productName === '') {
    ElMessage.error('产品名称不能为空！')
  } else if(form.value.brand === '') {
    ElMessage.error('所属品牌不能为空！')
  } else if(form.value.kind === '') {
    ElMessage.error('所属种类不能为空！')
  } else if(form.value.isOil === '') {
    ElMessage.error('适合干皮油皮不能为空！')
  } else if(form.value.isAllergy === '') {
    ElMessage.error('是否易致敏不能为空！')
  } else if(form.value.isPigmentation === '') {
    ElMessage.error('是否能治疗色素沉着性皮肤不能为空！')
  } else if(form.value.isWrinkle === '') {
    ElMessage.error('适合皱纹性皮肤/紧致性皮肤不能为空！')
  } else {
    let flag = true
    tableData.value.forEach(item => {
      if (item.productName === form.value.productName && item.brand === form.value.brand) {
        flag = false
      }
    })
    if (flag) {
      const list = tableData.value
      form.value.id = list[list.length - 1].id + 1
      const { data } = await axios.post('/product/add', form.value)
      if (data.code === 2) {
        ElMessage({
          message: '产品添加成功',
          type: 'success',
        })
        form.value.productName = ''
        form.value.brand = ''
        form.value.kind = ''
        form.value.isOil = ''
        form.value.isAllergy = ''
        form.value.isPigmentation = ''
        form.value.isWrinkle = ''
        dialogFormVisible.value = false
        getAllProductList()
      }
    } else {
      ElMessage.error('此品牌下已有同名产品，请核实后再新建')
    }
  }
}

async function productOp (op, scope) {
  nowSelect.value = scope.$index
  if (op === 0) {
    dialogDelVisible.value = true
  } else if (op === 1) {
    form.value = JSON.parse(JSON.stringify(tableData.value[scope.$index]))
    dialogEditVisible.value = true
  }
}

async function editProduct () {
  await axios.post('/product/fix', form.value)
  ElMessage({
    message: '产品修改成功',
    type: 'success',
  })
  form.value.productName = ''
  form.value.brand = ''
  form.value.kind = ''
  form.value.isOil = ''
  form.value.isAllergy = ''
  form.value.isPigmentation = ''
  form.value.isWrinkle = ''
  dialogEditVisible.value = false
  getAllProductList()
}

function notEditProduct () {
  form.value.productName = ''
  form.value.brand = ''
  form.value.kind = ''
  form.value.isOil = ''
  form.value.isAllergy = ''
  form.value.isPigmentation = ''
  form.value.isWrinkle = ''
  dialogEditVisible.value = false
}

async function makeSure () {
  console.log(tableData.value[nowSelect.value])
  await axios.post('/product/del', tableData.value[nowSelect.value])
  ElMessage({
    message: '产品删除成功',
    type: 'success',
  })
  dialogDelVisible.value = false
  getAllProductList()
}

onMounted(() => {
  getAllProductList()
})

</script>

<template>
  <div class="user">
    <div class="header">
      <div class="options">
        <div class="btn">
          <el-button type="success" @click="dialogFormVisible = true">新建化妆品</el-button>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="table">
        <el-table :data="tableData" style="width: 100%" height="600">
          <el-table-column prop="productName" label="产品名称" width="100" />
          <el-table-column prop="brand" label="所属品牌" width="100" />
          <el-table-column prop="kind" label="所属种类" width="100" />
          <el-table-column prop="isOil" label="适合干皮油皮" width="120" />
          <el-table-column prop="isAllergy" label="是否易致敏" width="120" />
          <el-table-column prop="isPigmentation" label="是否能治疗色素沉着性皮肤" width="220" />
          <el-table-column prop="isWrinkle" label="适合皱纹性皮肤/紧致性皮肤" width="200" />
          <!-- 卸妆 洁面 化妆水 乳液 面霜 美容液 防晒霜 ME -->
          <el-table-column fixed="right" label="操作" >
            <template #default="scope">
              <el-button link type="danger" @click="productOp(0, scope)"
                >删除</el-button
              >
              <el-button link type="primary" @click="productOp(1, scope)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog v-model="dialogFormVisible" title="新建化妆品" width="500">
      <el-form :model="form" label-width="150px" label-position="top">
        <el-form-item label="产品名称">
          <el-input placeholder="请输入产品名称" v-model="form.productName"/>
        </el-form-item>
        <el-form-item label="所属品牌">
          <el-input placeholder="请输入所属品牌" v-model="form.brand"/>
        </el-form-item>
        <el-form-item label="所属种类">
          <el-select
            v-model="form.kind"
            placeholder="所属种类"
            style="width: 240px"
          >
            <el-option
              v-for="item in options"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="适合干皮油皮">
          <el-radio-group v-model="form.isOil">
            <el-radio label="干皮" />
            <el-radio label="油皮" />
            <el-radio label="全部" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否易致敏">
          <el-radio-group v-model="form.isAllergy">
            <el-radio label="易致敏" />
            <el-radio label="不易致敏" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否能治疗色素沉着性皮肤">
          <el-radio-group v-model="form.isPigmentation">
            <el-radio label="能" />
            <el-radio label="不能" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适合皱纹性皮肤/紧致性皮肤">
          <el-radio-group v-model="form.isWrinkle">
            <el-radio label="皱纹皮肤" />
            <el-radio label="紧致皮肤" />
            <el-radio label="全部" />
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addProduct">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogEditVisible" title="修改化妆品" width="500">
      <el-form :model="form" label-width="150px" label-position="top">
        <el-form-item label="产品名称">
          <el-input v-model="form.productName"/>
        </el-form-item>
        <el-form-item label="所属品牌">
          <el-input v-model="form.brand"/>
        </el-form-item>
        <el-form-item label="所属种类">
          <el-select
            v-model="form.kind"
            placeholder="所属种类"
            style="width: 240px"
          >
            <el-option
              v-for="item in options"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="适合干皮油皮">
          <el-radio-group v-model="form.isOil">
            <el-radio label="干皮" />
            <el-radio label="油皮" />
            <el-radio label="全部" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否易致敏">
          <el-radio-group v-model="form.isAllergy">
            <el-radio label="易致敏" />
            <el-radio label="不易致敏" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否能治疗色素沉着性皮肤">
          <el-radio-group v-model="form.isPigmentation">
            <el-radio label="能" />
            <el-radio label="不能" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适合皱纹性皮肤/紧致性皮肤">
          <el-radio-group v-model="form.isWrinkle">
            <el-radio label="皱纹皮肤" />
            <el-radio label="紧致皮肤" />
            <el-radio label="全部" />
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="notEditProduct">取消</el-button>
          <el-button type="primary" @click="editProduct">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogDelVisible" title="删除" width="500">
      <div>
        <p>
          您确定删除此条产品信息吗？
        </p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogDelVisible = false">取消</el-button>
          <el-button type="primary" @click="makeSure">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.user {
  height: calc(100% - 10px);
  margin-top: 10px;
  .header {
    height: 40px;
    .options {
      margin: 0 10px;
      height: 40px;
      background-color: #fff;
      display: flex;
      .btn {
        margin-top: 4px;
        margin-left: 10px;
      }
    }
  }
  .body {
    .table {
      max-height: calc(100% - 60px);
      margin: 10px;
      background-color: #fff;
    }
  }
}
</style>
