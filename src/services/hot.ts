import { http } from '@/utils/http'
import type { PageParams } from '@/types/global'
import type { HotResult } from '@/types/hot'
/**
 * 通用热门推荐类型
 * @param url 请求地址
 * @param data 请求参数
 */
type hotType = PageParams & { subType?: string }
export const getHotRecommendAPI = (url: string, data?: hotType) => {
  return http<HotResult>({
    method: 'GET',
    url,
    data,
  })
}
