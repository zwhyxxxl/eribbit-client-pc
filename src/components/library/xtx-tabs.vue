<script>
import { useVModel } from '@vueuse/core'
import { provide } from 'vue'
export default {
  name: 'XtxTabs',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  setup (props, { emit }) {
    const activeName = useVModel(props, 'modelValue', emit)
    provide('activeName', activeName)
    const tabClick = (name, index) => {
      activeName.value = name
      // 触发一个点击自定义时间
      emit('tab-click', { name, index })
    }
    return { activeName, tabClick }
  },
  render () {
    // 获取插槽节点
    const panels = this.$slots.default()
    // 动态panels组件集合
    const dynamicPanels = []
    panels.forEach(item => {
      if (item.type.name === 'XtxTabsPanel') {
        // 静态
        dynamicPanels.push(item)
      } else {
        item.children.forEach(item => {
          dynamicPanels.push(item)
        })
      }
    })
    // 需要在这里进行组织
    // 1.选项卡tabs组件大容器
    // 2.选项卡标签结构
    // 3.选项卡内容
    // console.log(dynamicPanels)
    const nav = <nav>
      {dynamicPanels.map((item, i) => {
        return <a onClick={() => this.tabClick(item.props.name, i)} class={{ active: item.props.name === this.activeName }} href='javascript:;'>{item.props.label}</a>
      })}
    </nav>

    return <div class='xtx-tabs'>{[nav, dynamicPanels]}</div>
  }
}
</script>
<style lang="less">
.xtx-tabs {
  background: #fff;
  > nav {
    height: 60px;
    line-height: 60px;
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    > a {
      width: 110px;
      border-right: 1px solid #f5f5f5;
      text-align: center;
      font-size: 16px;
      &.active {
        border-top: 2px solid @xtxColor;
        height: 60px;
        background: #fff;
        line-height: 56px;
      }
    }
  }
}
</style>
