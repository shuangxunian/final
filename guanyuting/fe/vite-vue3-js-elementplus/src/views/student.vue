<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const talkingList = ref([
  {
    user: '张三',
    text: '为啥这题选a啊'
  },
  {
    user: '王老师',
    text: '因为1+1=2'
  },
])
const talkText = ref('')
const testFindData = ref('')
const testList = ref([])

</script>

<template>
  <div class="student">
    <div class="left">
      <div class="class-test">
        <div class="header">
          <el-input v-model="testFindData" style="width: 240px" placeholder="搜索" />
          <!-- <el-button type="primary" @click="dialogAddTestVisible = true">新建考试/作业</el-button> -->
        </div>
        <div class="body">
          <el-table :data="testList" style="width: 100%">
            <el-table-column prop="name" label="考试/作业名称" />
            <el-table-column prop="finishNum" label="完成人数" />
            <el-table-column fixed="right" label="操作">
              <template #default="scoped">
                <el-button link type="primary" size="small" @click="editData(scoped)">题目详情</el-button>
                <el-button link type="danger" size="small" @click="delData(scoped)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="talk-list">
        <div class="talk-item" v-for="(item, index) in talkingList" :key="index">
          <p>{{ item.user }}:</p>
          <p>{{ item.text}}</p>
        </div>
      </div>
      <div class="my-input">
        <el-input
          v-model="talkText"
          type="textarea"
          placeholder="请输入评论"
        />
        <el-button class="btn" type="primary">提交</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.student {
  height: 100%;
  width: 100%;
  display: flex;
  background-color: #fff;
  .left {
    width: 70%;
    height: 100%;
    .class-test {
      height: 700px;
      width: 100%;
      .header {
        margin: 10px 20px;
        width: calc(100% - 40px);
        height: 32px;
        display: flex;
        justify-content: space-between;
      }
      .body {
        width: 100%;
        height: 650px;
      }
    }
  }
  .right {
    height: 100%;
    width: 30%;
    padding: 10px;
    .talk-list {
      height: 80%;
      overflow: auto;
      .talk-item {
        border:1px solid #ccc;
        margin-top: 10px;
      }
    }
    .my-input {
      height: 20%;
      .btn {
        margin-top: 10px;
      }
    }
  }
}
</style>
