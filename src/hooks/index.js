// 提供复用逻辑的函数(钩子)
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
// 数据懒加载
/**
 * 数据懒加载函数
 * @param {Object} target -dom对象
 * @param {Function} apiFn -API函数
 */
export const useLazyData = (apiFn) => {
  const result = ref([])
  const target = ref(null)
  // stop停止观察
  const { stop } = useIntersectionObserver(
    // target监听的目标元素
    target,
    // isIntersecting 是否进入可视区
    // observerElement观察的元素
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        // 进入可视区
        stop()
        apiFn().then((data) => {
          result.value = data.result
        })
      }
    },
    {
      threshold: 0
    }
  )
  return { result, target }
}
