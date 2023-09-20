// 提供复用逻辑的函数(钩子)
import { ref, onUnmounted } from 'vue'
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'

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
/**
 * @param {Interger}
 */
export const usePayTime = () => {
  // 倒计时逻辑
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) {
      pause()
    }
  }, 1000, false)
  onUnmounted(() => {
    pause()
  })
  // 开启定时器
  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }
  return { start, timeText }
}
