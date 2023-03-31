
import { createVNode, render } from 'vue'
import Confirm from './xtx-confirm.vue'
const div = document.createElement('div')
div.setAttribute('class', 'xtx-confirm-container')
document.body.appendChild(div)
// 返回的是Promise对象,点确认和取消都要销毁组件
export default ({ title, text }) => {
  // 1.导入被创建的组件
  // 2.使用createVNode创建虚拟节点
  // 3.准备一个dom容易装载节点
  // 4.使用render把虚拟节点渲染
  return new Promise((resolve, reject) => {
    const submitCallback = () => {
      render(null, div)
      resolve()
    }
    const cancelCallback = () => {
      render(null, div)
      reject(new Error('点击取消'))
    }
    const vnode = createVNode(Confirm, { title, text, submitCallback, cancelCallback })
    render(vnode, div)
  })
}
