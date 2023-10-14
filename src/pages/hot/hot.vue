<template>
  <view class="viewport">
    <!-- 推荐封面图 -->
    <view class="cover">
      <image :src="bannerPicture"></image>
    </view>
    <!-- 推荐选项 -->
    <view class="tabs">
      <text
        v-for="(item, index) in subTypes"
        :key="item.id"
        class="text"
        :class="{ active: index === activeIndex }"
        @tap="activeIndex = index"
      >
        {{ item.title }}</text
      >
    </view>
    <!-- 推荐列表 -->
    <scroll-view
      v-for="(item, index) in subTypes"
      :key="item.id"
      v-show="activeIndex === index"
      scroll-y
      class="scroll-view"
      @scrolltolower="onscrolltolower"
    >
      <view class="goods">
        <navigator
          hover-class="none"
          class="navigator"
          v-for="goods in item.goodsItems.items"
          :key="goods.id"
          :url="`/pages/goods/goods?id=${goods.id}`"
        >
          <image class="thumb" :src="goods.picture"></image>
          <view class="name ellipsis">{{ goods.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ goods.price }}</text>
          </view>
        </navigator>
      </view>
      <view class="loading-text">{{ item.finish ? '没有更多数据了~' : '正在加载' }}</view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { onReady, onLoad } from '@dcloudio/uni-app'
import { getHotRecommendAPI } from '@/services/hot'
import type { SubTypeItem } from '@/types/hot'
// 1.热门推荐页 标题和url
const urlMap = [
  { type: '1', title: '特惠推荐', url: '/hot/preference' },
  { type: '2', title: '爆款推荐', url: '/hot/inVogue' },
  { type: '3', title: '一站买全', url: '/hot/oneStop' },
  { type: '4', title: '新鲜好物', url: '/hot/new' },
]
const query = defineProps<{ type: string }>()
const currUrlMap = urlMap.find((v) => v.type === query.type)
// 2.动态设置标题
onReady(() => {
  uni.setNavigationBarTitle({ title: currUrlMap!.title })
})
// 3.获取热门推荐的数据
// 4.保存背景图片
const bannerPicture = ref('')
// 5.推荐选项
const subTypes = ref<SubTypeItem[] & { finish?: boolean }>([])
// 高亮显示
const activeIndex = ref(0)
const getHotRecommendData = async () => {
  const res = await getHotRecommendAPI(currUrlMap!.url, {
    page: import.meta.env.DEV ? 30 : 1,
    pageSize: 10,
  })
  bannerPicture.value = res.result.bannerPicture
  subTypes.value = res.result.subTypes
}
// 6.滚动触低
const onscrolltolower = async () => {
  // 获取当前数据
  const currsubTypes = subTypes.value[activeIndex.value]
  // 分页条件
  if (currsubTypes.goodsItems.page < currsubTypes.goodsItems.pages) {
    currsubTypes.goodsItems.page++
  } else {
    // 标记已结束
    currsubTypes.finish = true
    return uni.showToast({
      title: '没有更多数据了',
      icon: 'none',
    })
  }
  // 页码累加
  currsubTypes.goodsItems.page++
  // 获取新内容
  const res = await getHotRecommendAPI(currUrlMap!.url, {
    subType: currsubTypes.id,
    page: currsubTypes.goodsItems.page,
    pageSize: currsubTypes.goodsItems.pageSize,
  })
  // 保存新内容
  const newsubTypes = res.result.subTypes[activeIndex.value]

  // 追加新内容
  currsubTypes.goodsItems.items.push(...newsubTypes.goodsItems.items)
}

onLoad(() => {
  getHotRecommendData()
})
</script>

<style lang="scss">
page {
  height: 100%;
  background-color: #f4f4f4;
}
.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 180rpx 0 0;
  position: relative;
}
.cover {
  width: 750rpx;
  height: 225rpx;
  border-radius: 0 0 40rpx 40rpx;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
}
.scroll-view {
  flex: 1;
}
.tabs {
  display: flex;
  justify-content: space-evenly;
  height: 100rpx;
  line-height: 90rpx;
  margin: 0 20rpx;
  font-size: 28rpx;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
  color: #333;
  background-color: #fff;
  position: relative;
  z-index: 9;
  .text {
    margin: 0 20rpx;
    position: relative;
  }
  .active {
    &::after {
      content: '';
      width: 40rpx;
      height: 4rpx;
      transform: translate(-50%);
      background-color: #27ba9b;
      position: absolute;
      left: 50%;
      bottom: 24rpx;
    }
  }
}
.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx 20rpx;
  .navigator {
    width: 345rpx;
    padding: 20rpx;
    margin-top: 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }
  .thumb {
    width: 305rpx;
    height: 305rpx;
  }
  .name {
    height: 88rpx;
    font-size: 26rpx;
  }
  .price {
    line-height: 1;
    color: #cf4444;
    font-size: 30rpx;
  }
  .symbol {
    font-size: 70%;
  }
  .decimal {
    font-size: 70%;
  }
}

.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0 50rpx;
}
</style>
