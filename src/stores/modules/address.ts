import { defineStore } from 'pinia'
// import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AddressItem } from '@/types/address'
export const useAddressStore = defineStore('address', () => {
  const selectedAddress = ref<AddressItem>()
  const changeSelectedAddress = (val: AddressItem) => {
    selectedAddress.value = val
  }
  return {
    selectedAddress,
    changeSelectedAddress,
  }
})
