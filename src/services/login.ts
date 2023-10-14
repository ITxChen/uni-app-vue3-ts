import { http } from '@/utils/http'
import type { LoginResult } from '@/types/member'
type LoginParams = {
  code: string
  encryptedData: string
  iv: string
}
// 小程序快捷登录企业版
export const postLoginWenxin = (data: LoginParams) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/weixin',
    data,
  })
}
// 小程序快捷登录测试版
export const postLoginWxMinSimpleApi = (phoneNumber: string) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/wxMin/simple',
    data: {
      phoneNumber,
    },
  })
}
