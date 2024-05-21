<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import * as Qiniu from 'qiniu-js';
import OSS from 'ali-oss'

const tableData = ref([])
// const tableData = ref([
//   {
//     id: 0,
//     begin: '大连',
//     end: '沈阳',
//     IDCard: 'DJ-24030100',
//     beginTime: '2024-03-01 15:00:00',
//     endTime: '',
//     status: '运输中',
//   },
//   {
//     id: 1,
//     begin: '沈阳航空航天大学',
//     end: '沈阳师范大学',
//     IDCard: 'MI-24030100',
//     beginTime: '',
//     endTime: '',
//     status: '待放行',
//   },
// ])
const addOptionDialog = ref(false)
const form = ref({
  begin: '',
  end: '',
  item: '',
  weight: '',
  id: ''
})
const extraData = ref({
  token : '',
})
const flyList = ref([])
const canFlyList = ref([])

const refreshForm = () => {
  form.value = {
    begin: '',
    end: '',
    item: '',
    weight: '',
    id: ''
  }
}

// 待装货，待放行，运输中，已结束，已返航
const fnUploadRequest = async (options) => {
  console.log(import.meta.env.VUE_APP_OSSId)
  const client= new OSS({
    accessKeyId: import.meta.env.VITE_OSSId,  // 查看你自己的阿里云KEY
    accessKeySecret: import.meta.env.VITE_OSSSecret, // 查看自己的阿里云KEYSECRET
    bucket: 'sxntest', // 你的 OSS bucket 名称
    region: 'oss-cn-beijing', // bucket 所在地址，我的是 华北2 北京
  })

  let file = options.file; // 拿到 file
  let fileName = file.name.substr(0,file.name.lastIndexOf('.'))
  let date = new Date().getTime()
  let fileNames = `${date}_${fileName}` // 拼接文件名，保证唯一，这里使用时间戳+原文件名
  // 上传文件,这里是上传到OSS的 uploads文件夹下
  client.put("uploads/"+fileNames, file).then(async res=>{
    if (res.res.statusCode === 200) {
      const { data } = await axios.post('http://localhost:3000/option/getImgData', {
        url: res.url
      })
      if (data.code === 2) {
        const map = {
          '起点': 'begin',
          '终点': 'end',
          '物品': 'item',
          '重量': 'weight',
        }
        data.body.forEach(item => {
          const arr = item.split('：')
          form.value[map[arr[0]]] = arr[1]
        })
      }
      await getFlyData()


    }else {
      ElMessage.error('上传失败')
    }
  })
}

const addOption = async () => {
  const { data } = await axios.post('http://localhost:3000/option/add', {
    ...form.value,
  })
  if (data.code === 2) {
    ElMessage.success('添加成功')
    await getOptionData()
    addOptionDialog.value = false
  }
}

const fixStatus = async (row, status) => {
  const { data } = await axios.post('http://localhost:3000/option/fix', {
    id: row.id,
    IDCard: row.IDCard,
    status: status
  })
  if (data.code === 2) {
    ElMessage.success('操作成功')
    await getOptionData()
  }
}

const makeSureDel = async (row) => {
  const { data } = await axios.post('http://localhost:3000/option/del', {
    id: row.id,
    IDCard: row.IDCard,
  })
  if (data.code === 2) {
    ElMessage.success('删除成功')
    await getOptionData()
  }
}

const timestampToDateTime = (timestamp) => {
  if (!timestamp) {
    return ''
  }
  let date = new Date(Number(timestamp))
  let year = date.getFullYear()
  let month = String(date.getMonth() + 1).padStart(2, '0')
  let day = String(date.getDate()).padStart(2, '0')
  let hours = String(date.getHours()).padStart(2, '0')
  let minutes = String(date.getMinutes()).padStart(2, '0')
  let seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

const getOptionData = async () => {
  const { data } = await axios.post('http://localhost:3000/option/alldata', {})
  if (data.code === 2) {
    tableData.value = data.body
  }
}

const getFlyData = async() => {
  const { data } = await axios.post('http://localhost:3000/fly/alldata', {})
  if (data.code === 2) {
    flyList.value = []
    const needWeight = parseInt(form.value.weight.match(/\d+/)[0])
    data.body.forEach(item => {
      if (item.status === 0 && parseInt(item.maxWeight) > needWeight) {
        flyList.value.push(item)
      }
    })
  }
}

onMounted(async() => {
  await getOptionData()
})

</script>

<template>
  <div class="user">
    <div class="header">
      <el-button style="margin-left: 10px;" type="primary" @click="addOptionDialog = true">新建活动</el-button>
    </div>
    <div class="body">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="begin" label="起点"  width="300"/>
        <el-table-column prop="end" label="终点" width="300"/>
        <el-table-column prop="item" label="物品"/>
        <el-table-column prop="weight" label="重量"/>
        <el-table-column prop="IDCard" label="负责无人机"  width="150"/>
        <el-table-column prop="beginTime" label="开始运输时间" width="200" >
          <template #default="scope">
            {{ timestampToDateTime(scope.row.beginTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束运输时间" width="200" >
          <template #default="scope">
            {{ timestampToDateTime(scope.row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="当前状态" />
        <el-table-column fixed="right" label="操作"  width="200">
          <template #default="scope">
            <el-button v-if="scope.row.status === '待装货'" link type="primary" size="small" @click="fixStatus(scope.row, '待放行')">装货完成</el-button>
            <el-button v-if="scope.row.status === '待放行'" link type="primary" size="small" @click="fixStatus(scope.row, '运输中')">放行</el-button>
            <el-button v-if="scope.row.status === '运输中'" link type="primary" size="small" @click="fixStatus(scope.row, '已结束')">结束</el-button>
            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确认删除吗" @confirm="makeSureDel(scope.row)">
              <template #reference>
                <el-button link type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="addOptionDialog" title="新建活动" width="30%" @close="refreshForm">
      <el-form :model="form" label-width="100px">
        <el-form-item label="上传图片">
          <el-upload
              :show-file-list="false"
              :http-request="fnUploadRequest">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="起点">
          <el-input v-model="form.begin" />
        </el-form-item>
        <el-form-item label="终点">
          <el-input v-model="form.end" />
        </el-form-item>
        <el-form-item label="物品">
          <el-input v-model="form.item" />
        </el-form-item>
        <el-form-item label="重量">
          <el-input v-model="form.weight" />
        </el-form-item>
        <el-form-item label="无人机">
          <el-select :disabled="form.begin === '' || form.end === '' || form.item === '' || form.weight === ''" v-model="form.id" placeholder="请选择无人机">
            <el-option v-for="item in flyList" :key="item.id" :label="item.id" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addOptionDialog = false">取消</el-button>
          <el-button type="primary" @click="addOption">添加</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.user {
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
