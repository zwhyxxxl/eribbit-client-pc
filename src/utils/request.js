import axios from 'axios'
import store from '@/store'
import router from '@/router'

// 1.创建一个新的axios实例
// 2.请求拦截器，如果有token就携带
// 3.相应拦截器：1.剥离无效数据 2.处理token失效
// 4.到处一个函数，调用当前axios实例发请求，返回值promise

// 导出基准地址，有可能有些地方不是通过axios发请求的也要用到基准地址
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  // axios的一些配置 baseURL timeout
  baseURL,
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use((config) => {
// 拦截业务逻辑额
  // 进行请求配置进行修改
  // 本地有token就在头部携带token
  // 1.获取用户信息对象
  const profile = store.state.user.profile
  if (profile.token) {
    // 有tkoen
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截器
// res => res.data 取出data数据，调接口的时候拿到的就是后台数据
instance.interceptors.response.use(res => res.data, err => {
  // 401状态码，进入该函数
  // 跳转到登录页
  if (err.response && err.response.state === 401) {
    // 1.清空无效信息
    // 2.跳转到登录页面
    // 3.跳转需要传当前路由地址给登录页(方便登陆之后跳转回来)
    store.commit('user/setUser', {})
    // 当前路由地址
    // 组件里:/user?a=10 $route.path得到的是/user $route.fullPath === /user?a=10
    // js模块中: router.currentRoute.value.fullPath就是当期路由地址 router.currentRoute相当于组件中的$route
    // router.currentRoute是ref包装的响应式数据 需要加.value拿数据
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    // encodeURIComponent 转换uri编码，防止解析地址出问题
    router.push('/login?redirectURL=' + fullPath)
  }
  return Promise.reject(err)
})

// 请求工具函数
export default (url, method, submitData) => {
  // 负责发请求：请求地址，请求方式，提交的数据
  return instance({
    url,
    method,
    // 1. 如果是get请求  需要使用params来传递submitData   ?a=10&c=10
    // 2. 如果不是get请求  需要使用data来传递submitData   请求体传参
    // [] 设置一个动态的key, 写js表达式，js表达式的执行结果当作KEY
    // method参数：get,Get,GET  转换成小写再来判断
    // 在对象，['params']:submitData ===== params:submitData 这样理解
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
