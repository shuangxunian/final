<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const userid = ref('')
const active = ref(1)
const text = ref('')
const todayList = ref([])
const buyList = ref([])
const foodList = ref([])
const recipeList = ref([])
const dateRecipeList = ref([])
const userList = ref([])
const talkList = ref([])
const todayTalkList = ref([])
const myTalkList = ref([])

const lunch = ref('')
const dinner = ref('')

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const addTalk = async() => {
  const { data } = await axios.post('http://localhost:3000/talk/add', {
    userid: userid.value,
    text: text.value
  })
  if (data.code === 2) {
    ElMessage.success('发表成功')
    text.value = ''
    await getTalkList()
  }
}

const getFoodList = async() => {
  const { data } = await axios.post('http://localhost:3000/food/allData', {})
  if (data.code === 2) {
    foodList.value = data.body
  }
}

const dateBuyList = async () => {
  const { data } = await axios.post('http://localhost:3000/dateBuy/allData', {})
  if (data.code === 2) {
    const foodMap = {}
    foodList.value.forEach(item => {
      foodMap[item.id] = item.name
    })
    buyList.value = data.body.map(item => {
      return {
        ...item,
        name: foodMap[item.foodid]
      }
    })
    const today = getToday()
    todayList.value = []
    buyList.value.forEach(item => {
      if (item.date === today) {
        todayList.value.push(item)
      }
    })
  }
}

const getRecipeList = async() => {
  const { data } = await axios.post('http://localhost:3000/recipe/allData', {})
  if (data.code === 2) {
    recipeList.value = data.body
  }
}

const getDateRecipeList = async() => {
  const { data } = await axios.post('http://localhost:3000/dateRecipe/allData', {})
  if (data.code === 2) {
    dateRecipeList.value = data.body
    const recipeMap = {}
    recipeList.value.forEach(item => {
      recipeMap[item.id] = item.name
    })
    dateRecipeList.value.forEach(item => {
      item.name = recipeMap[item.recipeid]
    })
    const today = getToday()
    lunch.value = ''
    dinner.value = ''
    dateRecipeList.value.forEach(item => {
      if (item.date === today) {
        if (item.type === '午餐') lunch.value += item.name + ','
        else dinner.value += item.name
      }
    })
  }
}

const getUserList = async() => {
  const { data } = await axios.post('http://localhost:3000/user/allData', {})
  if (data.code === 2) {
    userList.value = data.body
  }
}

function isToday(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();

  return date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();
}

function formatDate(timestamp) {
  const date = new Date(Number(timestamp));
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const getTalkList = async() => {
  const { data } = await axios.post('http://localhost:3000/talk/allData', {})
  if (data.code === 2) {
    talkList.value = data.body
    const userMap = {}
    userList.value.forEach(item => {
      userMap[item.id] = item.username
    })
    talkList.value.forEach(item => {
      item.name = userMap[item.userid]
    })
    todayTalkList.value = []
    myTalkList.value = []
    talkList.value.forEach(item => {
      if (item.userid === userid.value) {
        myTalkList.value.push(item)
      }
      if (isToday(Number(item.id))) {
        todayTalkList.value.push(item)
      }
    })
    console.log(myTalkList.value)
    console.log(todayTalkList.value)
  }
}

onMounted(async() => {
  userid.value = window.sessionStorage.getItem('id')
  await getFoodList()
  await dateBuyList()
  await getRecipeList()
  await getDateRecipeList()
  await getUserList()
  await getTalkList()
})

</script>


<template>
  <div class="about">
    <div class="header">
      <div class="title" :class="{ active: active === 1 }" @click="active = 1">今日食谱</div>
      <div class="title" :class="{ active: active === 2 }" @click="active = 2">全部食谱</div>
      <div class="title" :class="{ active: active === 3 }" @click="active = 3">我的评论</div>
    </div>
    <div class="show">
      <div class="today" v-if="active === 1">
        <div class="eat">
          <h3 align="center">食谱</h3>
          <p>午餐：{{lunch}}</p>
          <p>晚餐：{{dinner}}</p>
        </div>
        <div class="buy">
          <h3 align="center">采购记录</h3>
          <el-card style="margin-top:10px;" v-for="item in todayList" :key="item.id">
            <template #header>{{ item.name }}</template>
            <span>来源：{{ item.foodfrom }}</span>
            <img
              :src="item.imgUrl"
              style="width: 100%;margin-top: 10px;"
            />
          </el-card>
        </div>
        <div class="today-talk">
          <h3 align="center">讨论区</h3>
          <div class="today-talk-list">
            <div class="item" v-for="item in todayTalkList" :key="item.id">
              <div class="talk-header">
                {{ formatDate(item.id) }}
              </div>
              <div class="body">
                <span>{{ item.name }}</span>:
                <span style="margin-left: 10px;">{{ item.text }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="future" v-if="active === 2">
        <el-card style="margin-top:10px;" v-for="item in dateRecipeList" :key="item.id">
          <template #header>日期：{{ item.date }}</template>
          <span>{{ item.type }}：{{ item.name }}</span>
        </el-card>
      </div>
      <div class="myComment" v-if="active === 3">
        <div class="today-talk-list">
          <div class="item" v-for="item in todayTalkList" :key="item.id">
            <div class="talk-header">
              {{ formatDate(item.id) }}
            </div>
            <div class="body">
              <span>{{ item.name }}</span>
              <span style="margin-left: 10px;">{{ item.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="talk">
      <div class="left">
        <el-input v-model="text" placeholder="请输入内容" />
      </div>
      <div class="right">
        <el-button type="primary" @click="addTalk">发表</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.about {
  width: 100%;
  height: 100%;
  background-size: cover;
  position: relative;
  padding: 0;
  margin: 0;
  .header {
    display: flex;
    height: 30px;
    .title {
      width: 33%;
      height: 100%;
      text-align: center;
      font-size: 20px;
      // font-weight: 700;
      color: #666;
    }
    .active {
      font-weight: 700;
      color: #000;
    }
  }
  .show {
    height: calc(100% - 80px);
    width: 100%;
    // background-color: #333;
    padding: 10px;
    box-sizing: border-box;
    overflow-y: auto;
    .today {
      height: 100%;
      .today-talk {
        .today-talk-list {
          padding: 10px 0;
          .item {
            border: 1px solid #ccc;
            margin-bottom: 10px;
            .talk-header{
              font-size: 12px;
              color: #666;
              padding: 10px 0;
            }
            .body {
              font-size: 16px;
              padding-bottom: 10px;
              // display: flex;
              // justify-content: space-between;
            }
          }
        }
      }
      // padding: 10px 0;
      // width: 100%;
      // background-color: #000;
    }
    .future {
      height: 100%;
      width: 100%;
      // background-color: #000;
    }
    .myComment {
      height: 100%;
      width: 100%;
      .today-talk-list {
        padding: 10px 0;
        .item {
          border: 1px solid #ccc;
          margin-bottom: 10px;
          .talk-header{
            font-size: 12px;
            color: #666;
            padding: 10px 0;
          }
          .body {
            font-size: 16px;
            padding-bottom: 10px;
          }
        }
      }
    }
  }
  .talk {
    height: 49px;
    width: 100%;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-around;
    line-height: 45px;
    .left {
      width: 70%;
      height: 100%;
    }
    .right {
      // width: 20%;
      height: 100%;
    }
  }
}
</style>
