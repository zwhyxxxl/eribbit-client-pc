import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'
import cart from './modules/cart'
import category from './modules/category'
import user from './modules/user'

export default createStore({
  modules: {
    cart,
    category,
    user
  },
  plugins: [createPersistedstate({
    // 默认存储才localStorage上
    // 本地存储的名字
    key: 'erabbit-client-pc-store',
    // 指定需要存储的模块
    paths: ['user', 'cart']
  })]
})
