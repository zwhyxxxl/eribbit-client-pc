// 分类模块
import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
export default {
  namespaced: true,
  state () {
    return {
      // 分类信息集合
      list: topCategory.map(item => ({ name: item }))
    }
  },
  // 修改分类
  mutations: {
    setCategory (state, payload) {
      // payload所有分类集合
      state.list = payload
    },
    // 定义控制当前分类的二级分类显示隐藏的函数
    show (state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = true
    },
    hide (state, id) {
      const currCategory = state.list.find(item => {
        return item.id === id
      })
      currCategory.open = false
    }
  },
  actions: {
    async getList (ctx) {
      const { result } = await findAllCategory()
      // 给每个分类加上控制二级分类显示隐藏的数据
      result.forEach(top => {
        top.open = false
      })
      ctx.commit('setCategory', result)
    }
  }
}
