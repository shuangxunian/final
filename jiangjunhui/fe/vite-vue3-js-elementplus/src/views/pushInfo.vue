<script setup>
import { ref, computed } from 'vue'

const textarea2 = ref('行动代号：猎鹰，执行时间：二四年三月三十日，机型：歼十，途经：长春、沈阳、大连，需配合单位：长春航空局、沈阳航空局、大连航空局')
const name = ref('--')
const time = ref('--')
const warplane = ref('--')
const path = ref('--')
const unit = ref('--')

const getData = () => {
  for (let i = 0; i < textarea2.value.length; i++) {
    if(textarea2.value[i] === '行' &&textarea2.value[i+1] === '动' &&textarea2.value[i+2] === '代' &&textarea2.value[i+3] === '号') {
      name.value = ''
      for(let j = i + 5; j < textarea2.value.length && textarea2.value[j] !== '，'; j++) {
        name.value += textarea2.value[j]
      }
    }
    if(textarea2.value[i] === '执' &&textarea2.value[i+1] === '行' &&textarea2.value[i+2] === '时' &&textarea2.value[i+3] === '间') {
      time.value = ''
      for(let j = i + 5; j < textarea2.value.length && textarea2.value[j] !== '，'; j++) {
        time.value += textarea2.value[j]
      }
    }
    if(textarea2.value[i] === '机' &&textarea2.value[i+1] === '型') {
      warplane.value = ''
      for(let j = i + 3; j < textarea2.value.length && textarea2.value[j] !== '，'; j++) {
        warplane.value += textarea2.value[j]
      }
    }
    if(textarea2.value[i] === '途' &&textarea2.value[i+1] === '经') {
      path.value = ''
      for(let j = i + 3; j < textarea2.value.length && textarea2.value[j] !== '，'; j++) {
        path.value += textarea2.value[j]
      }
    }
    if(textarea2.value[i] === '需' &&textarea2.value[i+1] === '配' &&textarea2.value[i+2] === '合' &&textarea2.value[i+3] === '单'&&textarea2.value[i+4] === '位') {
      unit.value = ''
      for(let j = i + 6; j < textarea2.value.length && textarea2.value[j] !== '，'; j++) {
        unit.value += textarea2.value[j]
      }
    }
  }
}

</script>

<template>
  <div class="push-info">
    <div class="header">
      <div class="my-input">
        <el-input
          v-model="textarea2"
          :autosize="{ minRows: 11, maxRows: 11 }"
          type="textarea"
          placeholder="请输入通信文本"
        />
      </div>
      <div class="my-btn">
        <el-button type="primary" @click="getData">转换</el-button>
      </div>
      <div class="my-input">
        <el-row>
          <el-col :span="6">行动代号：</el-col>
          <el-col :span="18">{{name}}</el-col>
          <el-col :span="6">执行时间：</el-col>
          <el-col :span="18">{{time}}</el-col>
          <el-col :span="6">机型</el-col>
          <el-col :span="18">{{warplane}}</el-col>
          <el-col :span="6">途经：</el-col>
          <el-col :span="18">{{path}}</el-col>
          <el-col :span="6">需配合单位：</el-col>
          <el-col :span="18">{{unit}}</el-col>
        </el-row>
      </div>
    </div>
    <div class="body">
      <el-button>发送通知</el-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.push-info {
  .header {
    display: flex;
    height: 250px;
    .my-input {
      width: 45%;
      .el-col {
        margin-top: 10px;
      }
    }
    .my-btn {
      width: 10%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .body {}
}
</style>
