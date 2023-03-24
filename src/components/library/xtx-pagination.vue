<template>
  <div class="xtx-pagination">
    <a
      v-if="myCurrentPage > 1"
      href="javascript:;"
      @click="changePager(myCurrentPage-1)"
    >上一页</a>
    <a
      href="javascript:;"
      v-else
      class="disabled"
    >上一页</a>
    <span v-if='pager.start>1'>...</span>
    <a
      href="javascript:;"
      v-for="i in pager.btnArr"
      :key="i"
      @click="changePager(i)"
      :class="{active:i===myCurrentPage}"
    >{{i}}</a>

    <span v-if="pager.end<pager.pageCount">...</span>
    <a
      href="javascript:;"
      v-if="myCurrentPage < pager.pageCount"
      @click="changePager(myCurrentPage+1)"
    >下一页</a>
    <a
      href="javascript:;"
      class='disabled'
      v-else
    >下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    total: {
      type: Number,
      default: 100
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  setup (props, { emit }) {
    // 切换分页函数
    const changePager = (page) => {
      myCurrentPage.value = page
      emit('currentChange', page)
    }
    // 需要数据
    // 1.约定按钮的个数 5个
    const count = 5
    // 2. 当前显示的页码
    const myCurrentPage = ref(1)
    // 3.总页数=总条数/每页条数 向上取整
    const myTotal = ref(100)
    const myPageSize = ref(10)
    // 其他数据(总页数、起始按钮，结束按钮，按钮数组)依赖上面数据得到
    const pager = computed(() => {
      // 总页数
      const pageCount = Math.ceil(myTotal.value / myPageSize.value)
      // 计算起始页码和结束页码
      // 1. 理想情况根据当前页码，和按钮个数可得到
      let start = myCurrentPage.value - Math.floor(count / 2)
      let end = start + count - 1
      // 2.1 如果起始页码小于1了，需要重新计算
      if (start < 1) {
        start = 1
        end = (start + count - 1) > pageCount ? pageCount : (start + count - 1)
      }
      // 2.2 如果结束页码大于总页数，需要重新计算
      if (end > pageCount) {
        end = pageCount
        start = (end - count + 1) < 1 ? 1 : (end - count + 1)
      }
      const btnArr = []
      for (let i = start; i <= end; i++) {
        btnArr.push(i)
      }
      return { pageCount, btnArr, start, end }
    })
    // 监听props的变化,更新内部数据
    watch(props, () => {
      myTotal.value = props.total
      myPageSize.value = props.pageSize
      myCurrentPage.value = props.currentPage
    }, { immediate: true })

    return { myCurrentPage, pager, changePager }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
