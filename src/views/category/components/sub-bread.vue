<template>
  <XtxBread>
    <XtxBreadItem to="/">首页</XtxBreadItem>
    <XtxBreadItem
      :to="`/category/${category.id}`"
      v-if="category.top"
    >{{category.top.name}}</XtxBreadItem>
    <Transition name="fade-right">
      <XtxBreadItem v-if="category.sub">{{category.sub.name}}</XtxBreadItem>
    </Transition>
  </XtxBread>
</template>
<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
  name: 'SubBread',
  setup () {
    const store = useStore()
    const route = useRoute()
    // 通过计算属性拿到一级类目和二级类目信息
    // 对象{top:{id,name},sub:{id,name}}
    const category = computed(() => {
      const cate = {}
      store.state.category.list.forEach(top => {
        if (top.children) {
          const sub = top.children.find(sub => {
            return sub.id === route.params.id
          })
          if (sub) {
            cate.top = { id: top.id, name: top.name }
            cate.sub = { id: sub.id, name: sub.name }
          }
        }
      })
      return cate
    })
    return { category }
  }
}
</script>
<style lang="less" scoped>
</style>
