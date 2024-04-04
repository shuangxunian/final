<script setup>
import { ref, computed, onMounted, toRaw } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import G6 from '@antv/g6'

const chartData = ref({
  nodes: [],
  edges: [],
})
let graph = {}
const animateCfg = { duration: 200, easing: 'easeCubic' }
const tableData = ref([])
const knowList = ref([])

const addSize = () => {
  graph.zoom(1.2, undefined, true, animateCfg)
}
const subSize = () => {
  graph.zoom(0.8, undefined, true, animateCfg)
}
const toBegin = () => {
  graph.zoomTo(1, undefined, true, animateCfg)
}


const getChart = function() {
  const container = document.getElementById('container');
  const width = container.scrollWidth;
  const height = container.scrollHeight || 500;
  graph = new G6.Graph({
    container: 'container',
    width,
    height,
    fitView: true,
    modes: {
      default: ['drag-canvas', 'drag-node'],
    },
    layout: {
      type: 'dagre',
      rankdir: 'LR',
      align: 'UL',
      controlPoints: true,
      nodesepFunc: () => 1,
      ranksepFunc: () => 1,
    },
    defaultNode: {
      size: [180, 20],
      type: 'rect',
      style: {
        stroke: '#5B8FF9',
        fill: '#C6E5FF',
      },
    },
    defaultEdge: {
      type: 'polyline',
      size: 1,
      color: '#e2e2e2',
      style: {
        endArrow: {
          path: 'M 0,0 L 8,4 L 8,-4 Z',
          fill: '#e2e2e2',
        },
        radius: 20,
      },
    },
  });
  console.log(chartData.value)
  graph.data(chartData.value);
  graph.render();
}


const getTableData = async () => {
  const { data } = await axios.post('http://localhost:3000/know/allData',{})
  if (data.code === 2) {
    knowList.value = data.body
    console.log(knowList.value)
    knowList.value.forEach(item => {
      chartData.value.nodes.push({
        id: item.id,
        label: item.name,
      })
      const arr = item.downstreamIDListString.split(',')
      if(arr[0] !== '') {
        arr.forEach(end => {
          chartData.value.edges.push({
            source: item.id,
            target: end,
          })
        })
      }

    })
  }
}

onMounted(async() => {
  await getTableData()
  getChart()
})



</script>

<template>
  <div class="admin-know">
    <div class="header">
      <el-button @click="addSize">放大</el-button>
      <el-button @click="subSize">缩小</el-button>
      <el-button @click="toBegin">还原</el-button>
    </div>
    <div class="chart">
      <div id="container"></div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.admin-know {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .header {
    height: 70px;
    line-height: 70px;
    width: calc(100% - 40px);
    padding: 0 20px;
  }
  .chart {
    height: 600px;
    width: 100%;
  }
}
</style>
