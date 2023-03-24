<template>
  <div class="goods-image">
    <div
      class="large"
      v-if="show"
      :style="[{backgroundImage:`url(${images[currIndex]})`},largePosition]"
    ></div>
    <div
      class="middle"
      ref="target"
    >
      <img
        :src="images[currIndex]"
        alt=""
      >
      <div
        class="layer"
        v-if="show"
        :style="layerPosition"
      ></div>
    </div>
    <ul class="small">
      <li
        v-for="(img,i) in images"
        :key="img"
        :class="{active:i===currIndex}"
      >
        <img
          @mouseenter="currIndex=i"
          :src="img"
          alt=""
        >
      </li>
    </ul>
  </div>
</template>
<script>
import { reactive, ref, watch } from 'vue'
import { useMouseInElement } from '@vueuse/core'
export default {
  name: 'GoodsImage',
  props: {
    images: {
      type: Array,
      default: () => []
    }
  },
  setup () {
    const currIndex = ref(0)
    const target = ref()
    // 是否显示遮罩的大图
    const show = ref(false)
    // 遮罩层的坐标(样式)
    const layerPosition = reactive({
      left: 0,
      top: 0
    })
    // 大图的背景定位(样式)
    const largePosition = reactive({
      backgroundPositionX: 0,
      backgroundPositionY: 0
    })
    // 使用useMouseInElement得到基于元素左上角的左边和是否进入元素
    const { elementX, elementY, isOutside } = useMouseInElement(target)
    watch([elementX, elementY, isOutside], () => {
      //   console.log(elementX, elementY, isOutside)
      show.value = !isOutside.value
      if (elementX.value < 100) {
        layerPosition.left = 0
      } else if (elementX.value > 300) {
        layerPosition.left = 200
      } else {
        layerPosition.left = (elementX.value - 100)
      }
      if (elementY.value < 100) {
        layerPosition.top = 0
      } else if (elementY.value > 300) {
        layerPosition.top = 200
      } else {
        layerPosition.top = (elementY.value - 100)
      }
      //   layerPosition.left = elementX.value - 100 + 'px'
      //   layerPosition.top = elementY.value - 100 + 'px'
      largePosition.backgroundPositionX = -layerPosition.left * 2 + 'px'
      largePosition.backgroundPositionY = -layerPosition.top * 2 + 'px'
      layerPosition.left = layerPosition.left + 'px'
      layerPosition.top = layerPosition.top + 'px'
    })
    return { currIndex, target, layerPosition, show, largePosition }
  }
}
</script>
<style scoped lang="less">
.goods-image {
  width: 480px;
  height: 400px;
  position: relative;
  display: flex;
  z-index: 500;
  .large {
    position: absolute;
    top: 0;
    left: 412px;
    width: 400px;
    height: 400px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-repeat: no-repeat;
    background-size: 800px 800px;
    background-color: #f8f8f8;
  }
  .middle {
    width: 400px;
    height: 400px;
    background: #f5f5f5;
    position: relative;
    cursor: move;
    .layer {
      width: 200px;
      height: 200px;
      background: rgba(0, 0, 0, 0.2);
      left: 0;
      top: 0;
      position: absolute;
    }
  }
  .small {
    width: 80px;
    li {
      width: 68px;
      height: 68px;
      margin-left: 12px;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover,
      &.active {
        border: 2px solid @xtxColor;
      }
    }
  }
}
</style>
