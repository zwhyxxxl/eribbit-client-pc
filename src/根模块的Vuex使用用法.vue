<template>
  <div>
    App
    <!-- 使用根模块的state -->
    <p>{{$store.state.username}}</p>
    <!-- 使用根模块的getters数据 -->
    <p>{{$store.getters.newName}}</p>
    <button @click="change">改变</button>
  </div>
</template>
<script>
import { useStore } from 'vuex'
// import { useRouter } from 'vue-router'
export default {
  name: 'App',
  setup () {
    // 拿到vuex的仓库
    const store = useStore()
    // 使用state的数据
    console.log(store.state.username)
    // 使用根模块的getters数据
    console.log(store.getters.newName)
    // 使用根模块的mutations方法
    const change = () => {
      // console.log('1')
      // store.commit('update')
      // 4.使用根模块的actions方法
      store.dispatch('update')
    }
    return { change }
  }
}
</script>
