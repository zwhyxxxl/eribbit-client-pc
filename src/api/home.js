// 首页相关接口函数
import request from '@/utils/request'
// 获取品牌
/**
 * 获取品牌
 * @param {Integer} limit
 * @returns Promis
 */
export const findBrand = (limit = 6) => {
  return request('/home/brand', 'get', { limit })
}

/**
 * 获取广告图
 * @returns Promise
 */
export const findBanner = () => {
  return request('/home/banner', 'get')
}
/**
 * 获取新鲜好物
 * @returns Promise
 */
export const findNew = () => {
  return request('home/new', 'get')
}
/**
 *  获取人气推荐
 * @returns promise
 */
export const findHot = () => {
  return request('home/hot', 'get')
}
/**
 * 获取商品信息
 * @returns Promise
 */
export const findGoods = () => {
  return request('home/goods', 'get')
}
/**
 * 获取最新专题
 * @returns Promise
 */
export const findSpecial = () => {
  return request('home/special', 'get')
}
