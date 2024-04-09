<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const formLabelWidth = ref(120)
const textList = ref(false)
const textDialog = ref(false)
const textForm = ref({
  china: '',
  eng: '',
  info: '',
})
const clearForm = () => {
  textForm.value = {
    china: '',
    eng: '',
    info: '',
  }
}

const goAddText = async () => {
  if (textForm.value.china === '') return ElMessage.error('请输入中文词语')
  if (textForm.value.eng === '') return ElMessage.error('请输入英文单词')
  if (textForm.value.info === '') return ElMessage.error('请输入英文词语解释')
  const { data } = await axios.post('http://localhost:3000/text/add', {
    ...textForm.value
  })
  if (data.code === 2) {
    ElMessage({
      message: '添加成功！',
      type: 'success',
    })
    textDialog.value = false
    getTextList()
  }
}

const getTextList = async () => {
  const { data } = await axios.post('http://localhost:3000/text/allData', {})
  if (data.code === 2) {
    tableData.value = data.info
  }
}

onMounted(async() => {
  getTextList()
})

</script>

<template>
  <div class="data-list">
    <div class="header">
      <div class="test-button">
        <el-button type="primary" @click="textDialog = true">新建数据</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border height="600">
        <el-table-column prop="china" label="中文词语" width="180" />
        <el-table-column prop="pinyin" label="识字规则" width="100" />
        <el-table-column prop="wordsAndPhrases" label="组词造句" width="300" />
        <el-table-column prop="showStrokesMp4" label="笔画视频" width="450">
          <template #default="scope">
            <el-link :href="scope.row.showStrokesMp4" target="_blank">{{ scope.row.showStrokesMp4 }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="eng" label="英文单词" width="180" />
        <el-table-column prop="info" label="解释" width="400"/>
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

    <el-dialog v-model="textDialog" title="新建词语" width="500" @close="clearForm">
      <el-form :model="textForm">
        <el-form-item label="中文词语" :label-width="formLabelWidth">
          <el-input v-model="textForm.china"/>
        </el-form-item>
        <el-form-item label="识字规则" :label-width="formLabelWidth">
          <el-input v-model="textForm.pinyin"/>
        </el-form-item>
        <el-form-item label="组词造句" :label-width="formLabelWidth">
          <el-input v-model="textForm.wordsAndPhrases"/>
        </el-form-item>
        <el-form-item label="笔画视频" :label-width="formLabelWidth">
          <el-input v-model="textForm.showStrokesMp4"/>
        </el-form-item>
        <el-form-item label="英文单词" :label-width="formLabelWidth">
          <el-input v-model="textForm.eng"/>
        </el-form-item>
        <el-form-item label="英文词语解释" :label-width="formLabelWidth">
          <el-input v-model="textForm.info"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="textForm = false">取消</el-button>
          <el-button type="primary" @click="goAddText">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.data-list {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    width: 100%;
    height: 60px;
    display: flex;
    .is-test {
      width: 140px;
      margin-left: 10px;
      line-height: 60px;
    }
    .test-button {
      margin-left: 10px;
      line-height: 60px;
    }
  }
  .body {
    width: 100%;
    height: calc(100% - 70px);
    // padding: 0 10px;
    margin-top: 10px;
  }
}
</style>
