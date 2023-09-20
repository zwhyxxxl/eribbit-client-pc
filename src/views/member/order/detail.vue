<template>
  <div
    class="member-order-detail"
    v-if="order"
  >
    <!-- 头部 -->
    <DetailAction :order='order'></DetailAction>
    <!-- 进度 -->
    <DetailSteps :order="order" />
    <!-- 物流 -->
    <Suspense>
      <template #default>
        <DetailLogistics
          v-if="[3,4,5].includes(order.orderState)"
          :order='order'
        ></DetailLogistics>
      </template>
      <template #fallback>
        <div class="loading">loading</div>
      </template>
    </Suspense>

    <!-- 信息 -->
    <DetailInfo :order='order'></DetailInfo>
  </div>
</template>

<script>
import { ref } from 'vue'
import DetailAction from './components/detail-action.vue'
import DetailSteps from './components/detail-steps'
import { useRoute } from 'vue-router'
import { findOrder } from '@/api/order'
import DetailLogistics from './components/detail-logistics.vue'
import DetailInfo from './components/detail-info.vue'
export default {
  components: { DetailAction, DetailSteps, DetailLogistics, DetailInfo },
  name: 'MemberDetail',
  setup () {
    const route = useRoute()
    const order = ref(null)
    findOrder(route.params.id).then(data => {
      order.value = data.result
      // console.log(order.value)
    })
    return { order }
  }
}
</script>

<style scoped lang='less'>
.member-order-detail {
  height: 100%;
  background-color: #fff;
}
.loading {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 30px;
  background-color: #f5f5f5;
  margin: 30px 50px 0;
}
</style>
