<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread></SubBread>
      <!-- 筛选区 -->
      <SubFilter @filter-change='filterChange'></SubFilter>
      <!-- 商品面板 -->
      <div class="goods-list">
        <SubSort @sort-change='sortChange'></SubSort>
        <!-- 商品列表 -->
        <ul>
          <li
            v-for="item in goodsList"
            :key="item.id"
          >
            <GoodsItem :goods="item" />
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <XtxInfiniteLoading
          @infinite='getData'
          :loading='loading'
          :finished='finished'
        ></XtxInfiniteLoading>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
import { findSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'
export default {
  name: 'SubCategory',
  components: {
    SubBread,
    SubFilter,
    SubSort,
    GoodsItem
  },
  setup () {
    const route = useRoute()
    // 加载中
    const loading = ref(false)
    // 是否加载完毕
    const finished = ref(false)
    const goodsList = ref([])
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    const getData = () => {
      loading.value = true
      // 设置二级分类的ID
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(data => {
        if (data.result.items.length) {
          goodsList.value.push(...data.result.items)
          reqParams.page++
        } else {
          // 加载完毕
          finished.value = true
        }
        loading.value = false
        // console.log(goodsList.value)
      })
    }
    // 在更改了二级分类的时候需要重新加载数据
    watch(() => route.params.id, (newVal) => {
      if (newVal && route.path === `/category/sub/${newVal}`) {
        goodsList.value = []
        reqParams = {
          page: 1,
          pageSize: 20
        }
        finished.value = false
      }
    })
    // 1.更改排序，重新请求
    const sortChange = (sortParams) => {
      finished.value = false
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodsList.value = []
    }
    // 2.更改筛选组件的筛选数据，重新请求
    const filterChange = (filterParams) => {
      // console.log(filterParams)
      reqParams = { ...reqParams, ...filterParams }
      reqParams.page = 1
      goodsList.value = []
      finished.value = false
    }
    return { getData, loading, finished, goodsList, sortChange, filterChange }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
