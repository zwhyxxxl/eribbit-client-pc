<template>
  <!-- 首页入口(分类+广告) -->
  <div class="home-enter">
    <div class="container">
      <!-- 左侧分类 -->
      <HomeCategory></HomeCategory>
      <!-- 轮播图 -->
      <HomeBanner></HomeBanner>
    </div>
  </div>
  <!-- 新鲜好物 -->
  <home-new></home-new>
  <!-- 人气推荐 -->
  <home-hot></home-hot>
  <!-- 品牌组件 -->
  <HomeBrand></HomeBrand>
  <!-- 产品区块 -->
  <HomeProduct></HomeProduct>
  <!-- 最新专题 -->
  <HomeSpecial></HomeSpecial>
</template>

<script>
import HomeCategory from './components/home-category.vue'
import HomeBanner from './components/home-banner.vue'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'
import HomeBrand from './components/home-brand.vue'
import HomeProduct from './components/home-product.vue'
import HomeSpecial from './components/home-special.vue'

export default {
  name: 'HomePage',
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot,
    HomeBrand,
    HomeProduct,
    HomeSpecial
  }

}
</script>

<style scoped lang='less'>
</style>
