import Mock from 'mockjs'
import qs from 'qs'
// 基本配置
Mock.setup({
  // 随机延时500-1000毫秒
  timeout: '500-1000'
})
// 拦截接口
// 第一个参数：url，使用正则去匹配
// 第二个参数：请求方式
// 第三个参数： 返回数据(函数返回数据)
Mock.mock(/\/my\/test/, 'get', () => {
  // 随机数据逻辑 五条数据 有id 和name
  const arr = []
  for (let i = 4; i < 5; i++) {
    arr.push(Mock.mock({
      id: '@id',
      name: '@name'
    }))
  }
  return { msg: '获取数据成功', result: [] }
})
// 模拟我的收藏
Mock.mock(/\/member\/collect/, 'get', (config) => {
  const queryString = config.url.split('?')[1]
  const queryObject = qs.parse(queryString)
  // console.log(queryObject)
  const item = []
  for (let i = 0; i < queryObject.pageSize; i++) {
    item.push(Mock.mock({
      id: '@id',
      name: '@ctitle(10,20)',
      desc: '@ctitle(4,10)',
      price: '@float(100,200,2,2)',
      picture: `http://zhoushugang.gitee.io/erabbit-client-pc-static/uploads/clothes_goods_${Mock.mock('@integer(1,8)')}.jpg`
    }))
  }
  // console.log(item)
  return {
    counts: 35,
    pageSize: +queryObject.pageSize,
    page: +queryObject.page,
    items: item
  }
})
