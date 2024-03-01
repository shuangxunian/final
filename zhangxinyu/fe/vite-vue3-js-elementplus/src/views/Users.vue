<script setup>
import { ref } from 'vue'

const testValue = ref(true)
const tableData = ref([
  {
    userid: 'admin',
    username: 'xinyu zhang',
    useTime: 10
  },
  {
    userid: '203401010101',
    username: 'xinyu zhang',
    useTime: 11
  },
  {
    userid: '203401010102',
    username: 'xinyu zhang',
    useTime: 12
  },
  {
    userid: '203401010103',
    username: 'xinyu zhang',
    useTime: 13
  },
])

</script>

<template>
  <div class="user">
    <div class="header">
      <div class="is-test">
        启动模拟：<el-switch v-model="testValue" />
      </div>
      <div class="test-button" v-if="testValue">
        <el-button type="primary">用户注册</el-button>
        <el-button type="primary">用户登录</el-button>
        <el-button type="primary">用户密码修改</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: calc(100% - 20px);height: 600px;">
        <el-table-column prop="userid" label="用户ID"/>
        <el-table-column prop="username" label="用户昵称"/>
        <el-table-column prop="useTime" label="使用次数"/>
        <el-table-column fixed="right" label="操作">
          <template #default>
            <el-button link type="primary" size="small" @click="handleClick">删除</el-button>
            <el-button link type="primary" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="less" scoped>
.user {
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
      line-height: 60px;
    }
  }
  .body {
    width: 100%;
    height: calc(100% - 70px);
    padding: 0 10px;
    margin-top: 10px;
  }
}
</style>
