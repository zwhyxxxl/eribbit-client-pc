import { createStore } from 'vuex'
// 默认的模块，state 区分模块，其他 getters mutations actions 都在全局。
// 带命名空间 namespaced: true 的模块，所有功能区分模块，更高封装度和复用。
// A模块
const moduleA = {
  state: {
    username: 'moduleA'
  },
  mutations: {
    updteName (state) {
      state.username = 'moduleAAAA'
    }
  },
  getters: {
    newName (state) {
      return state.username + '!!!'
    }
  }
}
// B模块
const moduleB = {
  namespaced: true,
  state: {
    username: 'moduleB'
  },
  getters: {
    newName (state) {
      return state.username + '!!!'
    }
  },
  mutations: {
    update (state, payload) {
      state.username = 'ls'
    }
  },
  actions: {
    update (ctx) {
    // 发请求
      setTimeout(() => {
        ctx.commit('update')
      }, 1000)
    }
  }

}
// vue2.0是new Vuex.store({})
// // vue3.0创建仓库createStore({})
// export default createStore({
//   state: {
//     username: 'zs'
//   },
//   getters: {
//     newName (state) {
//       return state.username
//     }
//   },
//   mutations: {
//     update (state, payload) {
//       state.username = 'ls'
//     }
//   },
//   actions: {
//     update (ctx) {
//     // 发请求
//       setTimeout(() => {
//         ctx.commit('update')
//       }, 1000)
//     }
//   },
//   modules: {
//   }
// })

export default createStore({
  modules: {
    moduleA,
    moduleB
  }
})
