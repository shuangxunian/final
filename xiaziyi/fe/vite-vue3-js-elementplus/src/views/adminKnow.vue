<script setup>
import { ref, computed, onMounted } from 'vue'
import G6 from '@antv/g6'

const chartData = {
  nodes: [
    {
      id: '0',
      label: '企业的功能与定义',
    },
    {
      id: '1',
      label: '个人独资/合伙企业',
    },
    {
      id: '2',
      label: '公司制企业',
    },
    {
      id: '3',
      label: '企业财务管理的内容',
    },
    {
      id: '4',
      label: '利润最大化',
    },
    {
      id: '5',
      label: '股东财富最大化',
    },
    {
      id: '6',
      label: '企业价值最大化',
    },
    {
      id: '7',
      label: '相关者利益最大化',
    },
    {
      id: '8',
      label: '各种财务管理目标之间的关系',
    },
    {
      id: '9',
      label: '所有者和经营者利益冲突与协调',
    },
    {
      id: '10',
      label: '大股东与中小股东利益冲突与协调',
    },
    {
      id: '11',
      label: '所有者和债权人的利益冲突与协调',
    },
  ],
  edges: [
    {
      source: '0',
      target: '4',
    },
    {
      source: '1',
      target: '4',
    },
    {
      source: '2',
      target: '4',
    },
    {
      source: '3',
      target: '4',
    },
    {
      source: '4',
      target: '5',
    },
    {
      source: '4',
      target: '6',
    },
    {
      source: '4',
      target: '7',
    },
    {
      source: '0',
      target: '8',
    },
    {
      source: '1',
      target: '8',
    },
    {
      source: '2',
      target: '8',
    },
    {
      source: '3',
      target: '8',
    },
    {
      source: '8',
      target: '9',
    },
    {
      source: '8',
      target: '10',
    },
    {
      source: '8',
      target: '11',
    },
  ],
}
let graph = {}
const animateCfg = { duration: 200, easing: 'easeCubic' }

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
  graph.data(chartData);
  graph.render();
}

onMounted(() => {
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
