<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import * as echarts from "echarts";
import OSS from "ali-oss";
import { pinyin } from "pinyin-pro";

const tableData = ref([]);
const optionList = ref([]);
const userList = ref([]);
const optionDialog = ref(false);
const optionFrom = ref({
  select: "",
  userid: "",
  username: "",
  isLogin: true,
  optionType: "登录",
  requireWord: "",
  requireList: "",
});
const formLabelWidth = ref(100);
const options = ref([]);
const loading = ref(false);
const findType = ref("1");

const getUserList = async () => {
  const { data } = await axios.post("http://localhost:3000/user/allData", {});
  if (data.code === 2) {
    options.value = [];
    userList.value = data.info;
    data.info.forEach((item) => {
      options.value.push({
        ...item,
        label: item.userid + "-" + item.username,
      });
    });
  }
};
const clearForm = () => {
  optionFrom.value = {
    select: "",
    userid: "",
    username: "",
    isLogin: false,
    optionType: "登录",
    requireWord: "",
    requireList: ''
  };
  showText.value = {
    china: "",
    eng: "",
    info: "",
    text1: "",
    text2: "",
    text3: "",
    text4: "",
  };
  findType.value = "1";
};
const showText = ref({
  china: "",
  eng: "",
  info: "",
  text1: "",
  text2: "",
  text3: "",
  text4: "",
});

const goOption = async () => {
  if (optionFrom.value.select === "") return ElMessage.error("请选择模拟人");
  if (!optionFrom.value.isLogin && optionFrom.value.requireWord === "") {
    if (optionFrom.value.requireList === "") return ElMessage.error("请输入单词");
    else await getRes(optionFrom.value.requireList)
  }
  const user = options.value.find(
    (item) => item.userid === optionFrom.value.select.split("-")[0]
  );
  const param = {
    userid: user.userid,
    username: user.username,
    optionType: optionFrom.value.isLogin ? "登录" : "查询",
    requireWord: optionFrom.value.requireWord,
    wherefrom: user.belong,
  };
  if (param.optionType === "查询") {
    loading.value = true;
    const { data: data1 } = await axios.post(
      "http://localhost:3000/text1/find",
      param
    );
    const { data: data2 } = await axios.post(
      "http://localhost:3000/text2/find",
      param
    );
    const { data: data3 } = await axios.post(
      "http://localhost:3000/text3/find",
      param
    );
    const { data: data4 } = await axios.post(
      "http://localhost:3000/text4/find",
      param
    );
    showText.value = {
      text1: data1.info ? data1.info[0].pinyin : '',
      text2: data2.info ? data2.info[0].pinyin : '',
      text3: data3.info ? data3.info[0].pinyin : '',
      text4: data4.info ? data4.info[0].pinyin : '',
    };
    loading.value = false;
    if (data1.code === 4 && data2.code === 4 && data3.code === 4 && data4.code === 4) {
      ElMessage.error("没有找到相关信息！");
      return;
    } else {
      ElMessage({
        message: "模拟查询成功！",
        type: "success",
      });
    }
  } else {
    const { data } = await axios.post(
      "http://localhost:3000/user/login",
      param
    );
    if (data.code === 2) {
      ElMessage({
        message: "模拟登录成功！",
        type: "success",
      });
    }
  }
  await getOptionList();
};

const getTime = (time) => {
  const date = new Date(Number(time));

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return formattedDateTime;
};

const getRes = async (res) => {
  loading.value = true
  // let res = '一个绞丝旁加一个吉念什么'
  const str = res + '，这个字是什么，请只回复我这个字'
  const { data: aiRes } = await axios.post(
    "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=24.35bf865ef511d7d71142b5de5f488e07.2592000.1719449870.282335-75653575",
    {
      messages: [
        {
          role: "user",
          content: str,
        },
      ],
      temperature: 0.95,
      top_p: 0.8,
      penalty_score: 1,
      disable_search: false,
      enable_citation: false,
      response_format: "text",
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  let ansStr = ''
  for (let i = 0; i < aiRes.result.length; i++) {
    if (aiRes.result[i] === '“') {
      for (let j = i + 1; j < aiRes.result.length; j++) {
        if (aiRes.result[j] === '”') {
          break;
        }
        ansStr += aiRes.result[j];
      }
      break
    }
  }

  optionFrom.value.requireWord = ansStr
  optionFrom.value.requireList = ''
  goOption()
}

const fnUploadRequest = async (options) => {
  loading.value = true
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
      console.log(res.url)
      const { data } = await axios.post("https://asr.tencentcloudapi.com", {
        Action: "TextToVoice",
        Version: "2019-06-14",
        EngineModelType: '16k_zh',
        ChannelNum: 1,
        ResTextFormat: 0,
        SourceType: 1,
        Url: res.url,
      })
      console.log(data)
    }else {
      ElMessage.error('上传失败')
    }
  })
};

const getBase64 = (file) => {
  return new Promise(function(resolve, reject) {
    let reader = new FileReader();
    let imgResult = "";
    reader.readAsDataURL(file);
    reader.onload = function() {
        imgResult = reader.result;
    };
    reader.onerror = function(error) {
        reject(error);
    };
    reader.onloadend = function() {
        resolve(imgResult);
    };
  });
}

const getFile = (file, fileList) => {
  // loading.value = true
  getBase64(file.raw).then(res => {
    console.log(res)
  })
}



const getOptionList = async () => {
  const { data } = await axios.post("http://localhost:3000/option/allData", {});
  if (data.code === 2) {
    optionList.value = data.info;
    tableData.value = [];
    data.info.forEach((item) => {
      tableData.value.push({
        userid: item.userid,
        username: item.username,
        optionDate: getTime(item.id),
        option: item.optionType,
        requireWord: item.requireWord,
      });
    });
  }
};

onMounted(async () => {
  await getUserList();
  await getOptionList();
});
</script>

<template>
  <div class="options">
    <div class="header">
      <div class="test-button">
        <el-button
          style="margin-left: 10px"
          type="primary"
          @click="optionDialog = true"
          >模拟访问</el-button
        >
      </div>
    </div>
    <div class="body">
      <el-table :data="tableData" border height="500">
        <el-table-column prop="userid" label="用户ID" width="180" />
        <el-table-column prop="username" label="用户昵称" width="180" />
        <el-table-column prop="optionDate" label="请求时间" width="180" />
        <el-table-column prop="option" label="请求操作" width="180" />
        <el-table-column prop="requireWord" label="访问的单词" />
      </el-table>
    </div>

    <el-dialog
      v-model="optionDialog"
      title="模拟访问"
      width="500"
      @close="clearForm"
    >
      <el-form :model="optionFrom">
        <el-form-item label="操作对象" :label-width="formLabelWidth">
          <el-select v-model="optionFrom.select" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.userid"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="操作" :label-width="formLabelWidth">
          <el-switch
            v-model="optionFrom.isLogin"
            active-text="登录"
            inactive-text="查询"
          />
        </el-form-item>
        <el-form-item
          v-if="!optionFrom.isLogin"
          label="问句"
          :label-width="formLabelWidth"
        >
          <el-input v-model="optionFrom.requireList" autocomplete="off" />
        </el-form-item>
        <el-form-item
          v-if="!optionFrom.isLogin"
          label="单词"
          :label-width="formLabelWidth"
        >
          <el-input v-model="optionFrom.requireWord" autocomplete="off" />
        </el-form-item>
        <!-- <el-form-item
          v-if="!optionFrom.isLogin"
          label="单词名"
          :label-width="formLabelWidth"
        >
          <el-upload
              :show-file-list="false"
              :http-request="fnUploadRequest">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item> -->
        <div v-loading="loading" v-if="!optionFrom.isLogin">
          <p>
            <span>拼音：</span>
            <span>{{ pinyin(optionFrom.requireWord) }}</span>
          </p>
          <p>
            <span>识字规则：</span>
            <span>{{ showText.text1 }}</span>
          </p>
          <p>
            <span>笔顺动画：</span>
            <el-link
              v-if="showText.text2 !== ''"
              :href="showText.text2"
              target="_blank"
              >点此观看</el-link
            >
          </p>
          <p>
            <span>组词造句：</span>
            <span>{{ showText.text3 }}</span>
          </p>
          <p>
            <span>演示视频：</span>
            <el-link
              v-if="showText.text4 !== ''"
              :href="showText.text4"
              target="_blank"
              >点此观看</el-link
            >
          </p>
        </div>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="optionDialog = false">取消</el-button>
          <el-button type="primary" @click="goOption">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="less" scoped>
.options {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    width: 100%;
    height: 60px;
    display: flex;
    .test-button {
      line-height: 60px;
    }
  }
  .body {
    width: 100%;
    // height: calc(100% - 70px);
    // height: calc(100% - 70px);
    margin-top: 10px;
    .echart {
      display: flex;
      justify-content: space-around;
      width: 100%;
      height: calc(100% - 500px);
    }
  }
}
</style>
