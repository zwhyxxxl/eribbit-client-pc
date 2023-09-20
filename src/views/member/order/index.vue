<template>
  <div class="member-order">
    <!-- tab组件 -->
    <XtxTabs
      v-model="activeName"
      @tab-click='tabClick'
    >
      <XtxTabsPanel
        v-for="(item,i) in orderStatus"
        :key='i'
        :label="item.label"
        :name='item.name'
      >
      </XtxTabsPanel>
    </XtxTabs>
    <!-- 订单列表 -->
    <div class="order-list">
      <div
        v-if="loading"
        class="loading"
      ></div>
      <div
        class="none"
        v-if="!loading && orderList.length === 0"
      >暂无数据</div>
      <OrderItem
        @on-delete="handlerDelete"
        @on-cancel='handlerCancel'
        @on-confirm='handlerConfirm'
        @on-logistics='handlerLogistics'
        v-for="item in orderList"
        :key="item.id"
        :order='item'
      ></OrderItem>
    </div>
    <!-- 分页组件 -->
    <XtxPagination
      :current-pag='reqParams.page'
      :page-size='reqParams.pageSize'
      :total='total'
      v-if="total>0"
      @current-change='reqParams.page=$event'
    ></XtxPagination>
    <!-- 取消原因组件 -->
    <OrderCancel ref="orderCancelCom"></OrderCancel>
    <!-- 查询物流组件 -->
    <OrderLogistics ref="orderLogistics"></OrderLogistics>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import OrderItem from './components/order-item.vue'
import { confirmOrder, delteOrder, findOrderList } from '@/api/order'
import OrderCancel from './components/order-cancel.vue'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'
import OrderLogistics from './components/order-logistics.vue'
export default {
  name: 'MemberOrder',
  components: {
    OrderItem,
    OrderCancel,
    OrderLogistics
  },

  setup () {
    const loading = ref(false)

    const activeName = ref('all')
    const total = ref(0)
    // 获取订单数据
    const orderList = ref([])
    const reqParams = reactive({
      page: 1,
      pageSize: 5,
      orderState: 0
    })
    const getOrderList = () => {
      loading.value = true
      findOrderList(reqParams).then(data => {
        orderList.value = data.result.items
        total.value = data.result.counts
        // console.log(orderList)
        loading.value = false
      })
    }
    watch(reqParams, () => {
      getOrderList()
    }, { immediate: true })

    const tabClick = ({ name, index }) => {
      console.log(index)
      reqParams.page = 1
      reqParams.orderState = index
    }

    // 删除订单
    const handlerDelete = (order) => {
      Confirm({ text: '确认删除订单吗？' }).then(() => {
        delteOrder([order.id]).then(() => {
          Message({ type: 'success', text: '删除成功' })
          getOrderList()
        })
      }).catch(() => {

      })
    }
    return {
      activeName,
      orderStatus,
      orderList,
      tabClick,
      loading,
      total,
      reqParams,
      ...useCancel(),
      handlerDelete,
      ...useConfirm(),
      ...useLogistics()
    }
  }
}
// 取消订单逻辑
export const useCancel = () => {
  const orderCancelCom = ref(null)
  const handlerCancel = (order) => {
    orderCancelCom.value.open(order)
  }
  return { handlerCancel, orderCancelCom }
}
// 确认收货逻辑
export const useConfirm = () => {
  const handlerConfirm = (order) => {
    Confirm({ text: '确认收货？' }).then(() => {
      confirmOrder(order.id).then(() => {
        Message({ type: 'success', text: '确认收货成功' })
        order.orderState = 4
      })
    })
  }
  return { handlerConfirm }
}
// 查看物流逻辑
export const useLogistics = () => {
  const orderLogistics = ref(null)
  const handlerLogistics = (order) => {
    orderLogistics.value.open(order)
  }
  return { handlerLogistics, orderLogistics }
}
</script>

<style lang="less" scoped>
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif)
    no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}

.member-order {
  height: 100%;
  background: #fff;
}
</style>>
