<template>
  <!-- 猜你喜欢 -->
  <view class="caption">
    <text class="text">猜你喜欢</text>
  </view>
  <view class="guess">
    <navigator
      class="guess-item"
      v-for="item in guessList"
      :key="item.id"
      :url="`/pages/goods/goods?id=${item.id}`"
    >
      <image class="image" mode="aspectFill" :src="item.picture"></image>
      <view class="name">{{ item.name }}</view>
      <view class="price">
        <text class="small">¥</text>
        <text>{{ item.price }}</text>
      </view>
    </navigator>
  </view>
  <view class="loading-text"> {{ finish ? '没有更多数据啦' : '正在加载...' }} </view>
</template>

<script setup lang="ts">
import { onMounted, ref, defineExpose } from 'vue'
import { getHomeGoodsGuessLikeAPI } from '@/services/home'
import type { GuessItem } from '@/types/home'
import type { PageResult, PageParams } from '@/types/global'
//获取猜你喜欢数据
const guessList = ref<GuessItem[]>([])
// 分页数据
const pageParams: Required<PageParams> = {
  page: 1,
  pageSize: 10,
}
// 结束标记
const finish = ref(false)
const getHomeGoodsGuessListData = async () => {
  // 页码大于后台数据时退出判断
  if (finish.value === true) {
    return uni.showToast({
      title: '没有更多数据啦',
      icon: 'none',
    })
  }
  const res = await getHomeGoodsGuessLikeAPI(pageParams)
  // 数组追加
  guessList.value.push(...res.result.items)
  // console.log(guessList.value[0].id)
  // 页码累加
  if (pageParams.page < res.result.pages) {
    pageParams.page++
  } else {
    finish.value = true
  }
}
// 下拉刷新后重置页码
const resetData = () => {
  pageParams.page = 1
  guessList.value = []
  finish.value = false
}
defineExpose({
  getHomeGoodsGuessListData,
  resetData,
})
onMounted(() => {
  getHomeGoodsGuessListData()
})
</script>

<style lang="scss">
:host {
  display: block;
}
/* 分类标题 */
.caption {
  display: flex;
  justify-content: center;
  line-height: 1;
  padding: 36rpx 0 40rpx;
  font-size: 32rpx;
  color: #262626;
  .text {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 28rpx 0 30rpx;

    &::before,
    &::after {
      content: '';
      width: 20rpx;
      height: 20rpx;
      background-image: url(@/static/images/bubble.png);
      background-size: contain;
      margin: 0 10rpx;
    }
  }
}

/* 猜你喜欢 */
.guess {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;
  .guess-item {
    width: 345rpx;
    padding: 24rpx 20rpx 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    overflow: hidden;
    background-color: #fff;
  }
  .image {
    width: 304rpx;
    height: 304rpx;
  }
  .name {
    height: 75rpx;
    margin: 10rpx 0;
    font-size: 26rpx;
    color: #262626;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .price {
    line-height: 1;
    padding-top: 4rpx;
    color: #cf4444;
    font-size: 26rpx;
  }
  .small {
    font-size: 80%;
  }
}
// 加载提示文字
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>
