<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import AMapLoader from "@amap/amap-jsapi-loader"

let AmapObj = null
let map = null


const getAMap = async () => {
  AMapLoader.load({
    key: "72fb17f4455270a5b7463474e7b8c134", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.ToolBar"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
    "Loca":{                // 是否加载 Loca， 缺省不加载
      "version": '2.0.0'  // Loca 版本，缺省 1.3.2
    },
  })
    .then(async (AMap) => {
      // AmapObj = AMap
      // map = new AMap.Map("container", {
      //   // 设置地图容器id
      //   viewMode: "2D", // 是否为3D地图模式
      //   zoom: 5, // 初始化地图级别
      //   center: [110,35],
      // })

        var map =  new AMap.Map('container', {
            zoom: 4.8,
            showLabel: false,
            viewMode: '3D',
            center: [105.601, 35.32],
            mapStyle: 'amap://styles/45311ae996a8bea0da10ad5151f72979',

        });

        var tool = new AMap.ToolBar();
        tool.addTo(map);

        var loca = new Loca.Container({
            map,
        });

        var pl = window.pl = new Loca.PointLayer({
            zIndex: 10,
            opacity: 1,
            blend: 'normal',
        });

        var geo = new Loca.GeoJSONSource({
            url: 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/gdp.json',
        });
        pl.setSource(geo);
        var colors = [
            'rgba(254,255,198,0.95)',
            'rgba(255,238,149,0.95)',
            'rgba(255,217,99,0.95)',
            'rgba(255,175,43,0.95)',
            'rgba(255,135,24,0.95)',
            'rgba(234,10,0,0.95)',
            'rgba(195,0,0,0.95)',
            'rgba(139,0,0,0.95)',
        ];

        var style = {
            unit: 'meter',
            radius: (index, f) => {
                var n = f.properties['人口'];
                return n * 100;
            },
            color: (index, f) => {
                var n = Math.min(7, ~~(f.properties['人均GDP'] / 10000));
                return colors[n];
            },
            borderWidth: 0,
            blurRadius: -1,
        }

        pl.setStyle(style)
        loca.add(pl);


        // 动画
        map.on('complete', function () {
          pl.addAnimate({
            key: 'radius',
            value: [0, 1],
            duration: 2000,
            easing: 'ElasticOut',
            // yoyo: false,
            // repeat: 1,
          });
          pl.show(600);
        });

        map.on('mousemove', (e) => {
            const feat = pl.queryFeature(e.pixel.toArray());

            if (feat) {
                pl.setStyle({
                    unit: 'meter',
                    radius: (index, f) => {
                        var n = f.properties['人口'] * 100;
                        if (f === feat) {
                            return n + 30000;
                        }
                        return n;
                    },
                    color: (index, f) => {
                        var n = Math.min(7, ~~(f.properties['人均GDP'] / 10000));
                        return colors[n];
                    },
                    borderWidth: (index, f) => {
                        return f === feat ? 20000 : 0;
                    },
                    blurWidth: -1,
                    label: {
                      show: true,
                      text: (index, f) => {
                        return f.properties['人口'] * 100;
                      },
                      fontSize: 20,
                      color: '#fff',
                      backgroundColor: '#000',
                      borderWidth: 2,
                      borderColor: '#000',
                      position: 'top',
                    },
                });
            }
        });
    })
    .catch((e) => {
      console.log(e);
    });
}

onMounted(async () => {
  await getAMap()
})


onUnmounted(() => {
  map?.destroy();
})


</script>

<template>
  <div class="user">
    <div class="body">
      <div class="echart">
        <div id="container" :style="{ width: '100%', height: '100%' }"></div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.user {
  width: 100%;
  height: 100%;
  background-color: #fff;
  .body {
    width: 100%;
    height: 100%;
    .echart {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
    }
  }
}
</style>
