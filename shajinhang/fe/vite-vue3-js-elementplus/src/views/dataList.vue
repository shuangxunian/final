<script setup>
import { ref, computed, onMounted } from 'vue'

const tableData = ref([
  {
    talk: '这把队友全在配合，女警报过阿里回城，老头传送保兵，盲僧最后给扣了好几个正在路上让提莫去拆，自己义无反顾的冲进人堆留人。关键是剩下的这4个人，都很清楚的认识到了唯一一种赢法，也都在配合。果然只要4个人都想赢，还是有一线生机的',
    AIResult: '积极',
    userResult: ''
  },
  {
    talk: '看到派克玩家最后没有上线心里挺不爽的，但是想想他被抓到了还是很欣慰的，最后对面在4v5的情况下还输了让我今晚睡眠舒畅，虽然派克玩家收到了教训，但是对面也很难过呀，这波不亏',
    AIResult: '积极',
    userResult: ''
  },
  {
    talk: '说实话这种比摆烂的好多了，起码是真的有事离开',
    AIResult: '积极',
    userResult: ''
  },
  {
    talk: '什么傻逼东西',
    AIResult: '消极',
    userResult: ''
  },
])

</script>

<template>
  <div class="data-list">
    <div class="header">
      <el-button style="margin-left: 10px" type="primary">新建</el-button>
    </div>
    <div class="body">
      <div>
        <el-table
          ref="multipleTableRef"
          :data="tableData"
          style="width: calc(100% -20px);padding: 10px;"
          height="600"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="talk" label="评论" width="800"/>
          <el-table-column prop="AIResult" label="AI结果" width="100"/>
          <el-table-column prop="userResult" label="人为结果" width="100"/>
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scoped">
              <el-button link type="primary" size="small" @click="editData(scoped)">编辑</el-button>
              <el-button link type="danger" size="small" @click="delData(scoped)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.data-list {
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
