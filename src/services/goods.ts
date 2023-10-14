import type { GoodsResult } from '@/types/goods'
import { http } from '@/utils/http'

export const getGoodsByIdAPI = (id: string) => {
  return http<GoodsResult>({
    method: 'GET',
    url: '/goods',
    data: {
      id,
    },
  })
}
