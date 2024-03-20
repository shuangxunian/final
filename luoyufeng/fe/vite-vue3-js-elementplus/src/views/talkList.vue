<script setup>
import { ref, computed, onMounted } from 'vue'

const tableData = ref([
  {
    talk: '春天适合种什么花？',
    AIResult: '类别1',
    UserResult: '',
  },
  {
    talk: '春天适合种什么菜？',
    AIResult: '类别1',
    UserResult: '',
  },
  {
    talk: '小蝌蚪找妈妈怎么样',
    AIResult: '类别2',
    UserResult: '',
  },
  {
    talk: '小蝌蚪找妈妈是谁画的',
    AIResult: '类别2',
    UserResult: '',
  },
])

const edit = (scoped) => {
  console.log(scoped.row.AIResult)
}



</script>

<template>
  <div class="talk-list">
    <div class="header">
      <el-button style="margin-left: 10px" type="primary">添加评论</el-button>
      <el-button type="primary">导入评论</el-button>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="talk" label="评论" width="500" />
        <el-table-column prop="AIResult" label="AI结果" width="180" />
        <el-table-column prop="UserResult" label="人工结果" />
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scoped">
            <el-button link type="primary" size="small" :disabled="!(scoped.row.AIResult !== '' && scoped.row.UserResult === '')" @click="edit(scoped)">同步结果</el-button>
            <el-button link type="primary" size="small" @click="edit(scoped)">编辑</el-button>
            <el-button link type="danger" size="small" @click="deleteData(scoped)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- user -->
    <!-- /Users/shuangxunian/code/final/luoyufeng/fe/vite-vue3-js-elementplus/src/views/Users.vue -->
  </div>
</template>

<style lang="less" scoped>
.talk-list {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
  }
  .body {
    padding: 10px;
  }
}
</style>
