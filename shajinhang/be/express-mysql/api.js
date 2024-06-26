// import axios from "axios";
const axios = require("axios");

const state = {
  AVId: "",
  BVId: "",
  title: "",
  fetching: false,
  pending: false,
  comments: [],
  // 排序模式 0按时间，2按热度
  mode: 2,
  // 调整评论样式圆角
  borderRadius: 10,
  displayTime: true,
  darkTheme: false,
  // 评论数
  count: 0,
  // 当前页
  currentPage: 1,
  // 页面尺寸
  perPage: 20,
  // 下载评论开关
  download: false,
  fetchingAnalysis: false,
  analysis: undefined,
};
const getId = async (bv) => {
  const rawBVID = bv;
  const regex = /BV[0-9A-Z]+/i;
  const matches = rawBVID.match(regex);
  const realBVID = matches ? matches[0].replace(/^BV/, "") : rawBVID;
  let url = `https://api.bilibili.com/x/web-interface/view?bvid=${realBVID}`;
  const response = await axios.get(url);
  const { data } = response;
  state.AVId = data.data.aid;
  state.title = data.data.title;
  const nextUrl = `https://api.bilibili.com/x/v2/reply?type=1&oid=${state.AVId}&sort=${state.mode}&pn=${state.currentPage}&ps=${state.perPage}&nohot=1`;
  const nextResponse = await axios.get(nextUrl);
  const { data: nextData } = nextResponse;
  return nextData;
};

module.exports = getId

