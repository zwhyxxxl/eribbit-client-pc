// 扩展vue原有功能:全局组件，自定义指令，挂载原型方法 注意：vue3没有全局过滤器
// vue2.0插件写法：导出一个对象，有install函数，默认传入了vue构造函数，在vue基础之上扩展
// vue3.0插件写法要素：导出一个对象，有install函数，默认传入了App实例，在vue基础之上扩展
import defaultImg from '@/assets/images/200.png'
// 其实就是vue插件，扩展vue功能，全局组件、指令、函数 （vue.30取消过滤器）
// 当你在mian.js导入，使用Vue.use()  (vue3.0 app)的时候就会执行install函数
// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item.vue'
import Message from './Message'

// 导入library文件夹下的所有组件
// 批量导入需要使用一个函数 require.context(dir,deep,matching)
// 参数：1. 目录  2. 是否加载子目录  3. 加载的正则匹配
const importFn = require.context('./', false, /\.vue$/)
// console.dir(importFn.keys()) 文件名称数组

export default {
  install (app) {
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBread.name, XtxBread)
    // app.component(XtxBreadItem.name, XtxBreadItem)
    // console.log(importFn.keys())
    // 批量注册全局组件
    importFn.keys().forEach(key => {
      // 导入组件
      const component = importFn(key).default
      // 注册组件
      app.component(component.name, component)
    })
    // 定义指令
    defineDirective(app)

    // 定义一个原型函数
    app.config.globalProperties.$message = Message// 原型函数
  }
}

const defineDirective = (app) => {
// 图片懒加载指令
  // 原理：先存储图片地址
  // 当图片进入可视区 将src的地址换为存储的地址
  app.directive('lazy', {
    // vue2.0 监听使用指令的DOM是否创建好的钩子函数是：inserted
    // vue3.0指令拥有的钩子函数和组件的一样，监听使用指令的DOM是否创建好的钩子函数是：mounted
    mounted (el, binding) {
      // console.log('mounted')
      // 创建一个观察对象，来观察当前使用指令的元素
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          // 进入可视区停止观察
          observe.unobserve(el)
          // 图片加载失败
          el.onerror = () => { // error是图片加载失败 load是图片加载成功
            el.src = defaultImg
          }
          // console.log('进入可视区', el)
          // 把指令的值设置给el的src属性 binding.value就是指令传进来的值
          el.src = binding.value
        }
      }, {
        threshold: 0
      })
      observe.observe(el)
    }
  })
}
