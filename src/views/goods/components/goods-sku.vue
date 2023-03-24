<template>
  <div class="goods-sku">
    <dl
      v-for="item in goods.specs"
      :key="item.id"
    >
      <dt>{{item.name}}</dt>
      <dd>
        <template
          v-for="val in item.values"
          :key="val.name"
        >
          <img
            @click="changeSku(val,item)"
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
            :class="{selected:val.selected,disabled:val.disabled}"
          >
          <span
            :class="{selected:val.selected,disabled:val.disabled}"
            @click="changeSku(val,item)"
            v-else
          >{{val.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>

<script>
import powerSet from '@/vender/power-set'
const spliter = '★'
// 得到一个路径字典对象
const getPathMap = (skus) => {
  // 1.得到所有的sku集合 goods.skus
  // 2.从所有的sku集合中筛选出有效的sku
  const pathMap = {}// 路径字典
  skus.forEach(sku => {
    if (sku.inventory > 0) {
      // 3.根据有效sku使用power-set算法得到子集
      // 计算子集
      // 可选值数组
      const valueArr = sku.specs.map(val => val.valueName)
      // 可选值数组子集
      const valueArrPoweSet = powerSet(valueArr)
      // 4.根据子集往路径字典对象中存储key-value

      // 遍历子集 往pathMap中插入数据
      valueArrPoweSet.forEach(arr => {
        // 根据arr得到字符串的key约定★为拼接符
        const key = arr.join(spliter)
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}
// 得到当前选中规格集合
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    const selectedVal = item.values.find(val => val.selected)
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}
// 更新按钮禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  // 约定每个按钮的禁用状态由它本身的disabled数据控制
  specs.forEach((item, i) => {
    const selectedValues = getSelectedValues(specs)
    item.values.forEach(val => {
      // 判断当前是否选中，选中不用判断，
      if (val.selected) return
      // 未选中：拿着当前的值按照索引位置套入选中的值数据
      selectedValues[i] = val.name
      // 提出undefined数据 用★拼接成一个key
      const key = selectedValues.filter(values => values).join(spliter)
      // 拿着key去路径字典中查找数据
      // 有可以点击，没有就禁用
      val.disabled = !pathMap[key]
    })
  })
}
// 默认选中方法
const initDefaultSelected = (goods, skuId) => {
  // 找出sku的信息
  const sku = goods.skus.find(sku => sku.id === skuId)
  goods.specs.forEach((item, i) => {
    const val = item.values.find(val => val.name === sku.specs[i].valueName)
    val.selected = true
  })
  // 遍历每个按钮 按钮的值和sku记录的值相同就选中
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => { }
    },
    skuId: {
      type: String,
      default: ''
    }
  },

  setup (props, { emit }) {
    // 组件初始化是根据传入的skuId初始化选中状态
    if (props.skuId) { initDefaultSelected(props.goods, props.skuId) }

    const pathMap = getPathMap(props.goods.skus)

    // 组件初始化更新按钮禁用状态
    updateDisabledStatus(props.goods.specs, pathMap)

    // console.log(pathMap)
    // 选中与取消选中,约定在每一个按钮都拥有一个是否选中数据
    const changeSku = (val, item) => {
      // 当按钮时禁用的 阻止继续运行
      if (val.disabled) return
      // 优化只能单选
      if (val.selected) {
        val.selected = !val.selected
      } else {
        item.values.forEach(valItem => {
          valItem.selected = false
        })
        val.selected = !val.selected
      }
      // 点击按钮更新按钮禁用状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // debugger
      // 把选择的sku信息通知父组件
      // 选择完整的sku组合按钮，才可以拿到这些信息，提交父组件
      // 不是完整的sku组合按钮，提交空对象给父组件
      const validSelectedValues = getSelectedValues(props.goods.specs).filter(v => v)
      if (validSelectedValues.length === props.goods.specs.length) {
        const skuIds = pathMap[validSelectedValues.join(spliter)]

        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((p, n) => `${p} ${n.name}：${n.valueName}`, '').replace(' ', '')// 属性名：属性值...这样的字符串 颜色：黑色 产地：日本

        })
      } else {
        // 加入购物车时父组件需要判断规格是否选择完
        emit('change', {})
      }
    }
    return { changeSku }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
