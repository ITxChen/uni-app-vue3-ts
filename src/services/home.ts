import type { BannerItem, CategoryItem, HotItem, GuessItem } from '@/types/home'
import type { PageResult, PageParams } from '@/types/global'
import { http } from '@/utils/http'
/*
广告区域展示位置
1 为首页（默认值）
2 为商品分类页
*/
export const getHomeBannerAPI = (distributionSite = 1) => {
  return http<BannerItem[]>({
    method: 'GET',
    url: '/home/banner',
    data: {
      distributionSite,
    },
  })
}
// services/home.ts
/**
 * 首页-前台分类-小程序
 */
export const getHomeCategoryAPI = () => {
  return http<CategoryItem[]>({
    method: 'GET',
    url: '/home/category/mutli',
  })
}
// services/home.ts
/**
 * 首页-热门推荐-小程序
 */
export const getHomeHotAPI = () => {
  return http<HotItem[]>({
    method: 'GET',
    url: '/home/hot/mutli',
  })
}

// src/services/home.ts
/**
 * 猜你喜欢-小程序
 */
export const getHomeGoodsGuessLikeAPI = (data?: PageParams) => {
  return http<PageResult<GuessItem>>({
    method: 'GET',
    url: '/home/goods/guessLike',
    data,
  })
}
