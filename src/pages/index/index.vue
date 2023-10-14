<template>
  <!-- 自定义导航栏 -->
  <CustomNavbar />
  <!-- 设置滚动栏的滚动区域。给父级设置flex布局，组件设置flex:1 -->
  <!-- 滚动栏 -->
  <!--
    refresherrefresh 下拉刷新默认事件
    scrolltolower 滚动条默认事件
    -->
  <scroll-view
    scroll-y
    @scrolltolower="onScrolltolower"
    refresher-enabled
    :refresher-triggered="isRefresh"
    @refresherrefresh="onRefresherrefresh"
  >
    <PageSkeleton v-if="isLoading" />
    <template v-else>
      <XtxSwiper :list="bannerList" />
      <!--首页分类  -->
      <CategoryPanel :list="categoryList" />
      <!-- 热门推荐 -->
      <HotPanel :list="hotList" />
      <!-- 猜你喜欢 -->
      <XtxGuess ref="guessRef" />
    </template>
    <!-- 自定义轮播图 -->
  </scroll-view>
</template>
<script setup lang="ts">
import XtxSwiper from '@/compontens/XtxSwiper.vue'
import XtxGuess from '@/compontens/XtxGuess.vue'
import CategoryPanel from '../components/CategoryPanel.vue'
import CustomNavbar from '../components/CustomNavbar.vue'
import HotPanel from '../components/HotPanel.vue'
import PageSkeleton from '../components/PageSkeleton.vue'
import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'
import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import { onLoad } from '@dcloudio/uni-app'
import { useGuessList } from '@/composables/index'
import { ref } from 'vue'
// 1.获取广告区域的内容
const bannerList = ref<BannerItem[]>([])
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}
// 2.获取前台数据的内容
const categoryList = ref<CategoryItem[]>([])
const getHomeCategoryData = async () => {
  const res = await getHomeCategoryAPI()
  categoryList.value = res.result
}
// 3.获取热门推荐的内容
const hotList = ref<HotItem[]>([])
const getHotData = async () => {
  const res = await getHomeHotAPI()
  hotList.value = res.result
  // console.log(res)
}
// 4.滚动处理
const { guessRef, onScrolltolower } = useGuessList()
// 5.下拉刷新
const isRefresh = ref(false) //
const onRefresherrefresh = async () => {
  // 开启下拉刷新动画
  isRefresh.value = true
  // 重置数据
  guessRef.value?.resetData()
  // 一次性请求所有数据
  await Promise.all([
    getHomeBannerData(),
    getHomeCategoryData(),
    getHotData(),
    guessRef.value?.getHomeGoodsGuessListData(),
  ])
  // 关闭动画
  isRefresh.value = false
}
// 6.页面加载实现骨架屏
const isLoading = ref(false)
onLoad(async () => {
  isLoading.value = true
  await Promise.all([getHomeBannerData(), getHomeCategoryData(), getHotData()])
  isLoading.value = false
})
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.scroll-view {
  flex: 1;
}
</style>
