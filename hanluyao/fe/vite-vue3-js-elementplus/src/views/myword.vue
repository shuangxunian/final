<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import OSS from 'ali-oss'
import * as echarts from 'echarts'

const findData = ref('')
const form = ref({
  classname: '',
  needwordnum: 0
})
const tableData = ref([])
const collegeList = ref([])
const wordList = ref([])
const classList = ref([])
const needList = ref([])
const addClassDialog = ref(false)
const editClassDialog = ref(false)
const userid = ref('')
const collegeid = ref('')
const findClass = ref('')
const findWord = ref('')
const wordStatus = ref('未更新')


function refreshFrom() {
  form.value = {
    classname: '',
    needwordnum: 0
  }
}

function getList() {
  const list = wordList.value.filter(item => {
    return (
      item.classname.includes(findClass.value) &&
      item.wordname.includes(findWord.value)
    )
  })
  tableData.value = list
}

function editData(row) {
  editClassDialog.value = true
  form.value = row
}

async function addClass() {
  if (form.value.classname === '') {
    ElMessage.error('课程名不能为空')
    return
  }
  if (form.value.needwordnum === '') {
    ElMessage.error('所需文档数量不能为空')
    return
  }
  if (form.value.needwordnum === 0) {
    ElMessage.error('所需文档数量不能为0')
    return
  }
  const { data } = await axios.post('http://localhost:3000/class/add', {
    ...form.value,
    collegeid: collegeid.value
  })
  if (data.code === 2) {
    addClassDialog.value = false
    ElMessage.success('添加成功')
    getClassList()
  } else {
    ElMessage.error(data.msg)
  }
}

async function editClass() {
  const { data } = await axios.post('http://localhost:3000/word/edit', {
    ...form.value,
    status: wordStatus.value
  })
  wordStatus.value = '未更新'
  if (data.code === 2) {
    editClassDialog.value = false
    ElMessage.success('编辑成功')
    getWordList()
  } else {
    ElMessage.error(data.msg)
  }
}


async function makeSureDel(row) {
  const { data } = await axios.post('http://localhost:3000/word/del', { wordid: row.wordid })
  if (data.code === 2) {
    ElMessage.success('删除成功')
    getClassList()
  }
}

async function getWordList() {
  const { data } = await axios.post('http://localhost:3000/word/myData', {
    userid: userid.value
  })
  if (data.code === 2) {
    const classMap = {}
    classList.value.forEach(item => {
      classMap[item.classid] = item.classname
    })
    const needMap = {}
    needList.value.forEach(item => {
      needMap[item.needid] = item
    })
    data.body.forEach(item => {
      item.needname = needMap[item.needid].needname
      item.classname = classMap[needMap[item.needid].classid]
    })
    wordList.value = data.body
    tableData.value = data.body
  }
}

async function getClassList() {
  const { data } = await axios.post('http://localhost:3000/class/allData', {})
  if (data.code === 2) {
    classList.value = data.body
  }
}

async function getNeedList() {
  const { data } = await axios.post('http://localhost:3000/need/allData', {})
  if (data.code === 2) {
    needList.value = data.body
  }
}


const download = async(row) => {
    let a = document.createElement('a'); 
    a.style = 'display: none'; // 创建一个隐藏的a标签
    a.download = row.wordname;
    a.href = row.url;
    document.body.appendChild(a);
    a.click(); // 触发a标签的click事件
    document.body.removeChild(a);
}

const fnUploadRequest = async function (options) {
  const client= new OSS({
    accessKeyId: import.meta.env.VITE_OSSId,  // 查看你自己的阿里云KEY
    accessKeySecret: import.meta.env.VITE_OSSSecret, // 查看自己的阿里云KEYSECRET
    bucket: 'sxntest', // 你的 OSS bucket 名称
    region: 'oss-cn-beijing', // bucket 所在地址，我的是 华北2 北京
  })

  let file = options.file; // 拿到 file
  let fileName = file.name
  let date = new Date().getTime()
  let fileNames = `${date}_${fileName}` // 拼接文件名，保证唯一，这里使用时间戳+原文件名
  // 上传文件,这里是上传到OSS的 uploads文件夹下
  client.put("uploads/"+fileNames, file).then(res=>{
    if (res.res.statusCode === 200) {
      wordStatus.value = '已更新'
      form.value.url = res.url
    }else {}
  })
}


const init = () => {
  // 基于准备好的dom，初始化echarts实例
  let Chart = echarts.init(document.getElementById("myEcharts"));
  console.log(tableData.value)
  const locationMap = {}
  tableData.value.forEach(item => {
    if (item.classname !== undefined){
      if (locationMap[item.classname]) {
        locationMap[item.classname] += 1
      } else {
        locationMap[item.classname] = 1
      }
    }
  })
  const seriesData = []
  for (const key in locationMap) {
    seriesData.push({
      name: key,
      value: locationMap[key]
    })
  }

  // 绘制图表
  let option = {
    title: {
      text: '各课程提交数',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '8%',
      left: 'center'
    },
    series: [
      {
        name: '课程',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 24,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: seriesData
      }
    ]
  };
  // 渲染图表
  Chart.setOption(option);
}

onMounted(async() => {
  userid.value = window.sessionStorage.getItem('id')
  collegeid.value = window.sessionStorage.getItem('collegeid')
  await getClassList()
  await getNeedList()
  await getWordList()
  init()
})

</script>

<template>
  <div class="admin-class">
    <div class="header">
      <div class="left">
        <el-row :gutter="20">
          <el-col :span="4">所属课程名称：</el-col>
          <el-col :span="8">
            <el-input v-model="findClass" style="width: 240px" placeholder="请输入内容" />
          </el-col>
          <el-col :span="4">文档名称：</el-col>
          <el-col :span="8">
            <el-input v-model="findWord" style="width: 240px" placeholder="请输入内容" />
          </el-col>
        </el-row>
      </div>
      <div class="right">
        <el-button @click="getList">筛选</el-button>
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border style="width: 100%" max-height="600">
        <el-table-column label="添加时间" width="300">
          <template #default="scoped">
            {{ new Date(Number(scoped.row.wordid)).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column prop="classname" label="所属课程" width="300" />
        <el-table-column prop="needname" label="所属教学任务" width="300" />
        <el-table-column prop="wordname" label="文档名称"  width="400"/>
        <el-table-column prop="talking" label="督导评论"  width="400"/>
        <el-table-column prop="status" label="是否更新"  width="200"/>
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="scoped">
            <el-button link type="primary" size="small" @click="download(scoped.row)">下载文档</el-button>
            <el-button link type="primary" size="small" @click="editData(scoped.row)">编辑</el-button>
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scoped.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="chart">
        <div id="myEcharts" :style="{ width: '100%', height: '100%' }"></div>
      </div>
    </div>

    <el-dialog v-model="editClassDialog" title="编辑课程" width="500" @close="refreshFrom">
      <el-form :model="form">
        <el-form-item label="所属课程" label-width="100">
          <span>{{ form.classname }}</span>
        </el-form-item>
        <el-form-item label="所属教学任务" label-width="100">
          <span>{{ form.needname }}</span>
        </el-form-item>
        <el-form-item label="文档名称" label-width="100">
          <el-input v-model="form.wordname" placeholder="请填写课程名"/>
        </el-form-item>
        <el-form-item label="" label-width="100">
          <el-upload
              class=""
              action=""
              :show-file-list="false"
              :http-request="fnUploadRequest">
            <el-button type="primary">重新上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="editClassDialog = false">取消</el-button>
          <el-button type="primary" @click="editClass">保存</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<style lang="less" scoped>
.admin-class {
  height: 100%;
  width: 100%;
  background-color: #fff;
  .header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    line-height: 60px;
    .left {
      width: 80%;
    }
  }
  .body {
    padding: 0 10px;
    .chart {
      height: 300px;
    }
  }
}
</style>
