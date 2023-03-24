<template>
  <div class="home-new">
    <home-panel
      title="新鲜好物"
      subTitle='新鲜出炉 品质靠谱'
    >
      <template #right>
        <xtx-more path='/'></xtx-more>
      </template>
      <div
        style="position:relative;height:426px"
        ref="target"
      >
        <!-- 面板内容 -->
        <Transition name="fade">
          <ul
            v-if="goods.length"
            class="goods-list"
          >
            <li
              v-for="item in goods"
              :key="item.id"
            >
              <RouterLink :to="`/product/${item.id}`">
                <img
                  :src="item.picture"
                  alt=""
                >
                <p class="name ellipsis">{{item.name}}</p>
                <p class="price">&yen;{{item.price}}</p>
              </RouterLink>
            </li>
          </ul>
          <home-skeleton
            bg="#f0f9f4"
            v-else
          ></home-skeleton>
        </Transition>
      </div>

    </home-panel>
  </div>
</template>

<script>
import XtxMore from '@/components/library/xtx-more.vue'
import homePanel from './home-panel.vue'
import { findNew } from '@/api/home'
import HomeSkeleton from './home-skeleton.vue'
import { useLazyData } from '@/hooks'
export default {
  components: { homePanel, XtxMore, HomeSkeleton },
  name: 'HomeNew',
  setup () {
    // const goods = ref([])
    // findNew().then((data) => {
    //   goods.value = data.result
    // })
    const { target, result } = useLazyData(findNew)
    return { goods: result, target }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: @priceColor;
    }
  }
}
</style>
