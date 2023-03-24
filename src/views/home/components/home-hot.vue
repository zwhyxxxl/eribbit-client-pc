<template>
  <div class="home-hot">
    <home-panel
      title="人气推荐"
      subTitle='人气爆款 不容错过'
    >
      <div
        style="position:relative;height:426px"
        ref="target"
      >
        <!-- 面板内容 -->
        <Transition name="fade">
          <ul
            ref="pannel"
            class="goods-list"
            v-if="list.length"
          >
            <li
              v-for="item in list"
              :key="item.id"
            >
              <RouterLink to="/">
                <img
                  :src="item.picture"
                  alt=""
                >
                <p class="name">{{item.title}}</p>
                <p class="desc">{{item.alt}}</p>
              </RouterLink>
            </li>
          </ul>
          <home-skeleton v-else></home-skeleton>
        </Transition>

      </div>

    </home-panel>
  </div>
</template>

<script>
import HomePanel from './home-panel.vue'
import { findHot } from '@/api/home'
// import { ref } from 'vue'
import HomeSkeleton from './home-skeleton.vue'
import { useLazyData } from '@/hooks'
export default {
  components: { HomePanel, HomeSkeleton },
  name: 'HomeHot',
  setup () {
    // const list = ref([])
    // findHot().then((data) => {
    //   list.value = data.result
    // })

    const { target, result } = useLazyData(findHot)

    return { list: result, target }
  }
}
</script>

<style scoped lang="less">
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
