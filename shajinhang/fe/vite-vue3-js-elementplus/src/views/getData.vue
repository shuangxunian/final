<script setup>
import { ref, computed, onMounted } from 'vue'

const findBV = ref('BV1CK421v7NL')
const talkList = ref([
  '这把队友全在配合，女警报过阿里回城，老头传送保兵，盲僧最后给扣了好几个正在路上让提莫去拆，自己义无反顾的冲进人堆留人。关键是剩下的这4个人，都很清楚的认识到了唯一一种赢法，也都在配合。果然只要4个人都想赢，还是有一线生机的',
  '看到派克玩家最后没有上线心里挺不爽的，但是想想他被抓到了还是很欣慰的，最后对面在4v5的情况下还输了让我今晚睡眠舒畅，虽然派克玩家收到了教训，但是对面也很难过呀，这波不亏',
  '说实话这种比摆烂的好多了，起码是真的有事离开',
])
const tableData = ref([
  {
    talk: '这把队友全在配合，女警报过阿里回城，老头传送保兵，盲僧最后给扣了好几个正在路上让提莫去拆，自己义无反顾的冲进人堆留人。关键是剩下的这4个人，都很清楚的认识到了唯一一种赢法，也都在配合。果然只要4个人都想赢，还是有一线生机的',
  },
  {
    talk: '看到派克玩家最后没有上线心里挺不爽的，但是想想他被抓到了还是很欣慰的，最后对面在4v5的情况下还输了让我今晚睡眠舒畅，虽然派克玩家收到了教训，但是对面也很难过呀，这波不亏',
  },
  {
    talk: '说实话这种比摆烂的好多了，起码是真的有事离开',
  },
])
// const talkList = ref([])

const handleSelectionChange = (val) => {
  console.log(val)
}

</script>

<template>
  <div class="get-data">
    <div class="header">
      <el-input v-model="findBV" style="width: 240px;margin-left: 10px;" placeholder="请输入想要爬取的BV号" />
      <el-button style="margin-left: 10px" type="primary">爬取</el-button>
    </div>
    <div class="body">
      <div v-if="talkList.length === 0" class="no-data">
        请输入BV号
      </div>
      <div v-else>
        <el-table
          ref="multipleTableRef"
          :data="tableData"
          style="width: calc(100% -20px);padding: 10px;"
          height="600"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="talk" label="评论"/>
        </el-table>
        <div class="bottom">
          <el-button style="margin-left: 10px" type="primary">添加到数据库</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.get-data {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
  }
  .body {
    .no-data {
      color: #ccc;
      font-size: 40px;
      text-align: center;
    }
    .bottom {
      margin-top: 10px;
    }
  }
}
</style>
