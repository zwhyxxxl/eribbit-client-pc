<template>
  <div
    class="xtx-city"
    ref="target"
  >
    <div
      class="select"
      @click="toggle"
      :class="{active:visible}"
    >
      <span
        class="placeholder"
        v-if="!fullLocation"
      >{{placeholder}}</span>
      <span
        v-else
        class="value"
      >{{fullLocation}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div
      class="option"
      v-if="visible"
    >
      <div
        v-if="loading"
        class="loading"
      ></div>
      <template v-else>
        <span
          @click="changeItem(item)"
          class="ellipsis"
          v-for="item in currList"
          :key="item.code"
        >{{item.name}}</span>
      </template>

    </div>
  </div>
</template>
<script>
import { computed, reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择配送地址'
    }
  },
  setup (props, { emit }) {
    // 显示隐藏数据
    const visible = ref(false)
    const allCityData = ref(null)
    // 正在加载数据
    const loading = ref(false)
    // 定义打开收起的方法
    const open = () => {
      loading.value = true
      visible.value = true
      getCityData().then(data => {
        allCityData.value = data
        loading.value = false
      })
      // 清空之前选择
      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }
    const close = () => {
      visible.value = false
    }
    // 提供一个切换函数给select使用
    const toggle = () => {
      visible.value ? close() : open()
    }
    // 点击元素外关闭弹窗
    const target = ref(null)
    onClickOutside(target, () => {
      close()
    })
    // 定义选择的省市区数据
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    // 当点击按钮时记录
    const changeItem = (item) => {
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      } else if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      } else if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        // 关闭对话框，通知父组件
        close()
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        emit('change', changeResult)
      }
    }
    // 实现计算属性获取当前显示的地区列表
    const currList = computed(() => {
      // 默认显示省级
      let list = allCityData.value
      // 市级
      if (changeResult.provinceCode && changeResult.provinceName) {
        list = list.find(p => {
          return (p.code === changeResult.provinceCode)
        }).areaList
      }
      // 县区级
      if (changeResult.cityCode && changeResult.cityName) {
        list = list.find(p => {
          return (p.code === changeResult.cityCode)
        }).areaList
      }
      return list
    })
    return { visible, toggle, target, loading, currList, changeItem }
  }
}
// 获取城市数据的函数
const getCityData = () => {
  // 数据在https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
  // 本地有缓存，去除本地数据
  // 本地没有缓存 发送请求数据
  // 返回promise在then获取数据，这里可能是异步 可能是同步 所以统一封装在promise异步操作中
  return new Promise((resolve, reject) => {
    // 数据存储在winodw上的cityData字段
    if (window.cityData) {
      resolve(window.cityData)
    } else {
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        window.cityData = res.data
        resolve(res.data)
      })
    }
  })
}
</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      .loading {
        height: 290px;
        width: 100%;
        background: url(../../assets/images/loading.gif) no-repeat center;
      }
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
