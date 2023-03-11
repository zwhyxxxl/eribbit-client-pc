<template>
  <div>
    <!-- 使用A模块的state -->
    <p>{{$store.state.moduleA.username}}</p>
    <!-- 使用A模块的getters -->
    <p>{{$store.getters.newName}}</p>
    <hr>
    <!-- 使用B模块的state -->
    <p>{{$store.state.moduleB.username}}</p>
    <!-- 使用B模块的getters -->
    <p>{{$store.getters['moduleB/newName']}}</p>
    <button @click="mutationsFn">mutationsFn</button>
    <button @click="actionsFn">actionsFn</button>
  </div>
</template>

<script>
import { useStore } from 'vuex'

export default {
  name: 'App',
  setup () {
    const store = useStore()
    const mutationsFn = () => {
      // 提交B模块的修改
      store.commit('moduleB/update')
    }

    const actionsFn = () => {
      // 调用B模块的actions
      store.dispatch('moduleB/update')
    }

    return { mutationsFn, actionsFn }
  }
}
</script>

<style>
</style>
