<template>
  <div>
    <!-- 测试是否持久化 -->
    <button @click="$store.commit('user/setUser',{account:'zhou'})">设置用户信息</button>
    <span>{{$store.state.user.profile.account}}</span>
  </div>
</template>

<script>

export default {
  name: 'App',
  setup () {

  }
}
</script>

<style>
</style>
