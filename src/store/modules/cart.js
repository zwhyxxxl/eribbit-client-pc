import { getNewCartGoods, mergeLocalCart } from '@/api/cart'
// 购物车状态

// 购物车模块
export default {
  namespaced: true,
  state: () => {
    return {
      list: []
    }
  },
  getters: {
    // 有效商品列表
    validList (state) {
      return state.list.filter(goods => {
        return (goods.stock > 0 && goods.isEffective)
      })
    },
    // 有效商品总件数
    validTotal (state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount (state, getters) {
      return getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100
    },
    // 无效商品列表
    invalidList (state) {
      return state.list.filter(item => !(item.stock > 0 && item.isEffective))
    },
    // 已选商品列表
    selectedList (state, getters) {
      return getters.validList.filter(goods => {
        return goods.selected
      })
    },
    // 已选商品总件数
    selectedTotal (state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额
    selectedAmount (state, getters) {
      return getters.selectedList.reduce((p, c) => p + (c.count * 100 * c.nowPrice) / 100, 0)
    },
    // 是否全选
    isCheckAll (state, getters) {
      return getters.validList.length === getters.selectedList.length && getters.selectedList.length !== 0
    }
  },
  mutations: {
    insertCart (state, payload) {
      // 约定的字段必须和后端保持一致
      // 本地：id skuId name picture price nowPrice count attrsText selected stock isEffective
      // 插入数据的规则：
      // 1.先找是否有相同的商品
      // 如果有：查询数量 累加到payload上 再保存 原来商品需要删除
      // 如果没有：直接保存在最新位置
      const smaeIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (smaeIndex > -1) {
        // 有相同的商品
        payload.count = payload.count + state.list[smaeIndex].count
        state.list.splice(smaeIndex, 1)
      }
      state.list.unshift(payload)
    },
    // 修改购物车商品状态
    updateCart (state, payload) {
      // payload：商品信息 字段不固定 有哪些字段就改哪些字段
      // 必须有skuId
      const updateGoods = state.list.find(item => item.skuId === payload.skuId)
      for (const key in payload) {
        if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
          updateGoods[key] = payload[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart (state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 设置购物车列表
    setCartList (state, payload) {
      console.log('设置购物车')
      state.list = payload
    }
  },
  actions: {
    // 加入购物车
    insertCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          ctx.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 获取商品列表
    findCart (ctx, payload) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录
        } else {
          // 未登录
          // 同时发送请求
          // 等所有结果返回后，一起修改本地数据
          // Promise.all(promise数组).then((dataList)=>{})
          const promiseArr = ctx.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          Promise.all(promiseArr).then(dataList => {
            // console.log(dataList)
            // 更新本地购物车
            dataList.forEach((data, i) => {
              ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...data.result })
            })
            resolve()
          })
        }
      })
    },
    // 删除购物车
    deleteCart (ctx, payload) {
      // 单挑删除payload就是skuId
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录
        } else {
          // 未登录
          ctx.commit('deleteCart', payload)
          resolve()
        }
      })
    },
    // 修改购物车(选中状态，数量)
    updateCart (ctx, payload) {
      // payload必须要有skuId 可能有selected count
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 已登录
        } else {
          // 未登录
          ctx.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 全选
    // 做有效商品的全选&反选
    checkAllCart (ctx, selected) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
        } else {
          // 本地
          // 1. 获取有效的商品列表，遍历的去调用修改mutations即可
          ctx.getters.validList.forEach(item => {
            ctx.commit('updateCart', { skuId: item.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 批量删除
    batchDeleteCart (ctx, isClear) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
        } else {
          // 本地
          ctx.getters[isClear ? 'invalidList' : 'selectedList'].forEach(item => {
            ctx.commit('deleteCart', { skuId: item.skuId })
          })
          resolve()
        }
      })
    },
    // 修改规格
    updateCartSku (ctx, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (ctx.rootState.user.profile.token) {
          // 登录 TODO
        } else {
          // 本地
          // 1.找出旧的商品信息
          // 2.删除旧的商品信息
          // 3.根据新的sku信息和旧的商品信息，合并成一条新的商品数据
          // 4.添加新的商品
          const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
          ctx.commit('deleteCart', oldSkuId)
          const { skuId, price: nowPrice, specsText: attrsText, inventory: stock } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, attrsText, stock }
          ctx.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // 合并本地购物车
    // 一定是登录后做的 不用区分是否登录
    async mergeLocalCart (ctx) {
      // 存储token后调用合并API接口函数进行购物合并
      const cartList = ctx.getters.validList.map((goods) => {
        return { skuId: goods.skuId, selected: goods.selected, count: goods.count }
      })
      await mergeLocalCart(cartList)
      // 合并成功将本地购物车删除
      ctx.commit('setCartList', [])
    }
  }
}
