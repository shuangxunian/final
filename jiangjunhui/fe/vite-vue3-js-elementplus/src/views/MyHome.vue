<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import pushInfo from './pushInfo.vue'
import userInfo from './userInfo.vue'
import optionList from './optionList.vue'
import emailModel from './emailModel.vue'


const route = useRoute()
const router = useRouter()

const activeName = ref('model')


</script>

<template>
  <div class="home-container">
    <div class="header">
      <div class="title">
        <span>军航转场飞行计划要素自动识别系统</span>
      </div>
    </div>
    <div class="body">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="发送通知" name="model">
          <push-info></push-info>
        </el-tab-pane>
        <el-tab-pane label="单位信息" name="info">
          <user-info></user-info>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="option">
          <option-list></option-list>
        </el-tab-pane>
        <el-tab-pane label="邮件模版" name="email">
          <email-model></email-model>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="less" scoped>
.home-container {
  height: 100%;
  background-color: #eee;
  .header {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    background-color: #fff;
    .title {
      margin-left: 20px;
      line-height: 40px;
    }
    .options {
      margin-right: 20px;
      margin-top: 4px;
    }
  }
  .body {
    width: 100%;
    height: calc(100% - 50px);
    margin-top: 10px;
    background-color: #fff;
    .demo-tabs {
      padding: 10px;
      width: calc(100% - 20px);
    }
  }
}
</style>
