<template>
  <!-- 顶部通栏 -->
  <AppNavbar></AppNavbar>
  <AppHeaderStick></AppHeaderStick>
  <!-- 头部组件 -->
  <AppHeader></AppHeader>
  <!-- 内容容器 -->
  <div class="app-body">
    <!-- 二级路由 -->
    <RouterView></RouterView>
  </div>
  <!-- 底部组件 -->
  <AppFooter></AppFooter>
</template>

<script>
import AppNavbar from '@/components/app-navbar.vue'
import AppHeader from '@/components/app-header.vue'
import AppHeaderStick from '@/components/app-header-stick.vue'
import AppFooter from '@/components/app-footer.vue'
import { useStore } from 'vuex'
export default {
  name: 'LayoutPage',
  components: {
    AppNavbar,
    AppHeader,
    AppFooter,
    AppHeaderStick
  },
  // 获取分类数据
  setup () {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style lang="less" scoped>
.app-body {
  min-height: 600px;
}
</style>>
