<template>
  <div class="top-category">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <Transition name="fade-right" mode="out-in">
          <XtxBreadItem v-if="topCategory" :key='topCategory.id'>{{topCategory.name}}</XtxBreadItem>
        </Transition>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :autoPlay='true' :sliders="sliders" style="height:500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="sub in topCategory.children" :key="sub.id">
            <router-link :to="`/category/sub/${sub.id}`">
              <img :src="sub.picture">
              <p>{{sub.name}}</p>
            </router-link>
          </li>
        </ul>
      </div>
      <!-- 不同分类商品 -->
      <div class="ref-goods" v-for="sub in subList" :key='sub.id'>
        <div class="head">
          <h3>- {{sub.name}} -</h3>
          <p class="tag">南水北调</p>
          <XtxMore :path='`/category/sub/${sub.id}`' />
        </div>
        <div class="body">
          <GoodsItem v-for="goods in sub.goods" :key="goods.id" :goods='goods' />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { findBanner } from '@/api/home'
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import GoodsItem from './components/goods-item.vue'
import { findTopCategory } from '@/api/category'
export default {
  name: 'TopCategory',
  components: {
    GoodsItem
  },
  setup() {
    // 轮播图
    const sliders = ref([])
    findBanner().then((data) => {
      sliders.value = data.result
    })
    // 面包屑+所有子分类 ===>vuex
    const store = useStore()
    const route = useRoute()
    const topCategory = computed(() => {
      // 当前顶级分类：根据路由上的ID去vuex中gategory的list中获取
      // console.log(route.params.id)
      // console.log(store.state.category.list)
      let cate = {}
      const item = store.state.category.list.find((item) => {
        return item.id === route.params.id
      })
      if (item) cate = item
      return cate
    })
    // 获取各个类目下的推荐商品
    const subList = ref([])
    const getSubList = () => {
      findTopCategory(route.params.id).then((data) => {
        subList.value = data.result.children
      })
    }
    watch(
      () => route.params.id,
      (newVal) => {
        if (newVal && `/category/${newVal}` === route.path) getSubList()
      },
      { immediate: true }
    )

    return { sliders, topCategory, subList }
  }
}
</script>
<style scoped lang="less">
.ref-goods {
  background-color: #fff;
  margin-top: 20px;
  position: relative;
  .head {
    .xtx-more {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .tag {
      text-align: center;
      color: #999;
      font-size: 20px;
      position: relative;
      top: -20px;
    }
  }
  .body {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 65px 30px;
  }
}
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
}
</style>
