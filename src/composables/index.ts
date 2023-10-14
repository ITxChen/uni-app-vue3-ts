import { ref } from 'vue'
import XtxGuess from '@/compontens/XtxGuess.vue'
export const useGuessList = () => {
  // 获取实例
  const guessRef = ref<InstanceType<typeof XtxGuess>>()
  // 触底滚动
  const onScrolltolower = () => {
    guessRef.value?.getHomeGoodsGuessListData()
  }
  return {
    guessRef,
    onScrolltolower,
  }
}
