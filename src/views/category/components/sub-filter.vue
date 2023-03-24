<template>
  <!-- 筛选区 -->
  <div
    class="sub-filter"
    v-if="filterData&&loading===false"
  >
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          @click="changeBrand(item.id)"
          href="javascript:;"
          :class="{active:item.id===filterData.selectedBrand}"
          v-for="item in filterData.brands"
          :key='item.id'
        >{{item.name}}</a>
      </div>
    </div>
    <div
      class="item"
      v-for="item in filterData.saleProperties"
      :key="item.id"
    >
      <div class="head">{{item.name}}:</div>
      <div class="body">
        <a
          @click="changeProp(item,prop.id)"
          :class="{active:prop.id===item.selectedProp}"
          href="javascript:;"
          v-for="prop in item.properties"
          :key='prop.id'
        >{{prop.name}}</a>

      </div>
    </div>
  </div>
  <div
    v-else
    class="sub-filter"
  >
    <XtxSkeleton
      class="item"
      width="800px"
      height="40px"
    />
    <XtxSkeleton
      class="item"
      width="800px"
      height="40px"
    />
    <XtxSkeleton
      class="item"
      width="600px"
      height="40px"
    />
    <XtxSkeleton
      class="item"
      width="600px"
      height="40px"
    />
    <XtxSkeleton
      class="item"
      width="600px"
      height="40px"
    />
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',
  setup (props, { emit }) {
    const route = useRoute()
    // 监听二级类目ID的变化，获取筛选数据
    const filterData = ref({})
    const loading = ref(false)
    watch(() => route.params.id, (newVal) => {
      loading.value = true
      // 变化后ID有值且处于二级类目
      if (newVal && route.path === (`/category/sub/${newVal}`)) {
        // 发请求，获取数据
        findSubCategoryFilter(newVal).then(data => {
          // 每一组可选的筛选条件缺失一个全部的条件 处理数据加上全部
          // 给每一组数据加上选中的ID
          // 1.品牌
          data.result.selectedBrand = null
          data.result.brands.unshift({ name: '全部', id: null })
          // 属性
          data.result.saleProperties.forEach(item => {
            item.selectedProp = null
            item.properties.unshift({ name: '全部', id: null })
          })
          // console.log(data.result)
          // 设置修改的数据
          filterData.value = data.result
          loading.value = false
        })
      }
    }, { immediate: true })

    // 获取筛选参数的函数
    // 获取筛选参数
    const getFilterParams = () => {
      const filterParams = {}
      const attrs = []
      filterParams.brandId = filterData.value.selectedBrand
      filterData.value.saleProperties.forEach(p => {
        const attr = p.properties.find(attr => attr.id === p.selectedProp)
        if (attr && attr.id !== undefined) {
          attrs.push({ groupName: p.name, propertyName: attr.name })
        }
      })
      if (attrs.length) filterParams.attrs = attrs
      return filterParams
    }
    // 1.记录当前选择的品牌
    const changeBrand = (brandId) => {
      if (brandId === filterData.value.selectedBrand) return
      filterData.value.selectedBrand = brandId
      emit('filter-change', getFilterParams())
    }
    // 2.记录当前选择的属性
    const changeProp = (item, propId) => {
      if (propId === item.selectedProp) return
      item.selectedProp = propId
      emit('filter-change', getFilterParams())
    }
    return { filterData, loading, changeBrand, changeProp }
  }
}
</script>
<style scoped lang='less'>
.xtx-skeleton {
  padding: 10px 0;
}
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
