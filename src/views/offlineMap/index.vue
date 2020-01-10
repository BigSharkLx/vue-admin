<template>
 <div class="container" id="container"></div> 
</template>

<script>
import BMap from "BMap";
export default {
  data() {
    return {};
  },

  components: {},

  props: {},

  computed: {},

  created() {},

  mounted() {
    var map = new BMap.Map("container", { minZoom: 6, maxZoom: 16 });

    var point = new BMap.Point(114.315323, 30.599073); // 创建点坐标
    map.centerAndZoom(point, 15); // 初始化地图，设置中心点坐标和地图级别
    var marker = new BMap.Marker(point); // 创建标注
    map.addOverlay(marker); // 将标注添加到地图中
    map.panTo(point);
    map.enableScrollWheelZoom(true);

    // map.addControl(new BMap.MapTypeControl({
    // 	mapTypes:[
    //           BMAP_NORMAL_MAP,
    //           BMAP_SATELLITE_MAP,
    //           BMAP_HYBRID_MAP
    //       ]}));

    //单击获取点击的经纬度
    map.addEventListener("click", function(e) {
      alert(e.point.lng + "," + e.point.lat);
    });
  },

  methods: {}
};
</script>
<style  lang='scss' scoped>
.container {
  width: 100%;
  height: 600px;
}
</style>