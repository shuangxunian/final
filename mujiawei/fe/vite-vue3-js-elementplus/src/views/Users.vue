<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const flyList = ref([])
const addFlyFrom = ref({
  belong: '',
  id: '',
  power: '',
  maxWeight: '',
  workTime: '',
})
const addFlyDialogVisible = ref(false)
const editFlyDialogVisible = ref(false)

const refreshForm = () => {
  addFlyFrom.value = {
    belong: '',
    id: '',
    power: '',
    maxWeight: '',
    workTime: '',
  }
}
const addFly = async() => {
  if (addFlyFrom.value.belong === '' || addFlyFrom.value.id === '' || addFlyFrom.value.power === '' || addFlyFrom.value.maxWeight === '' || addFlyFrom.value.workTime === '') {
    ElMessage.error('请填写完整')
    return
  }
  const { data } = await axios.post('http://localhost:3000/fly/add', { ...addFlyFrom.value })
  if (data.code === 2) {
    ElMessage.success('添加成功')
    addFlyDialogVisible.value = false
    await getFlyData()
  }
}


const fixFly = async() => {
  if (addFlyFrom.value.belong === '' || addFlyFrom.value.id === '' || addFlyFrom.value.power === '' || addFlyFrom.value.maxWeight === '' || addFlyFrom.value.workTime === '') {
    ElMessage.error('请填写完整')
    return
  }
  const { data } = await axios.post('http://localhost:3000/fly/edit', { ...addFlyFrom.value })
  if (data.code === 2) {
    ElMessage.success('修改成功')
    editFlyDialogVisible.value = false
    await getFlyData()
  }
}

const editData = (row) => {
  addFlyFrom.value = row
  editFlyDialogVisible.value = true
}

const makeSureDel = async(row) => {
  const { data } = await axios.post('http://localhost:3000/fly/del', { id: row.id })
  if (data.code === 2) {
    ElMessage.success('删除成功')
    await getFlyData()
  }
}

const getFlyData = async() => {
  const { data } = await axios.post('http://localhost:3000/fly/alldata', {})
  if (data.code === 2) {
    flyList.value = data.body
    tableData.value = data.body
  }
}

onMounted(async() => {
  await getFlyData()
})

</script>

<template>
  <div class="user">
    <div class="header">
      <el-button style="margin-left: 10px;" type="primary" @click="addFlyDialogVisible = true">新建无人机</el-button>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="编号" />
        <el-table-column prop="belong" label="所属种类" width="180" />
        <el-table-column prop="power" label="电量/mA" />
        <el-table-column prop="maxWeight" label="最大承载重量/kg" />
        <el-table-column prop="workTime" label="工作次数" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="editData(scope.row)">编辑</el-button>
              <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
                <template #reference>
                  <el-button link type="danger" size="small">删除</el-button>
                </template>
              </el-popconfirm>
            
            <!-- <el-button link type="primary" size="small" @click="handleDelete(scope.$index, scope)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="addFlyDialogVisible" title="提示" width="30%" @close="refreshForm">
      <el-form :model="addFlyFrom" label-width="120px">
        <el-form-item label="编号">
          <el-input v-model="addFlyFrom.id" />
        </el-form-item>
        <el-form-item label="所属种类">
          <el-input v-model="addFlyFrom.belong" />
        </el-form-item>
        <el-form-item label="电量/mA">
          <el-input v-model="addFlyFrom.power" />
        </el-form-item>
        <el-form-item label="最大承载重量/kg">
          <el-input v-model="addFlyFrom.maxWeight" />
        </el-form-item>
        <el-form-item label="工作次数">
          <el-input v-model="addFlyFrom.workTime" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addFlyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addFly">确认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="editFlyDialogVisible" title="提示" width="30%" @close="refreshForm">
      <el-form :model="addFlyFrom" label-width="120px">
        <el-form-item label="编号">
          <el-input v-model="addFlyFrom.id" disabled/>
        </el-form-item>
        <el-form-item label="所属种类">
          <el-input v-model="addFlyFrom.belong" />
        </el-form-item>
        <el-form-item label="电量/mA">
          <el-input v-model="addFlyFrom.power" />
        </el-form-item>
        <el-form-item label="最大承载重量/kg">
          <el-input v-model="addFlyFrom.maxWeight" />
        </el-form-item>
        <el-form-item label="工作次数">
          <el-input v-model="addFlyFrom.workTime" disabled/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addFlyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="fixFly">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.user {
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
