<script setup lang="ts">
import {
  getMemberAddressByIdAPI,
  postMemberAddressAPI,
  putMemberAddressByIdAPI,
} from '@/services/address'
import showModal from '@dcloudio/uni-app'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'

// 1.表单数据
const form = ref({
  receiver: '', // 收货人
  contact: '', // 联系方式
  fullLocation: '', // 省市区(前端展示)
  provinceCode: '', // 省份编码(后端参数)
  cityCode: '', // 城市编码(后端参数)
  countyCode: '', // 区/县编码(后端参数)
  address: '', // 详细地址
  isDefault: 0, // 默认地址，1为是，0为否
})
const query = defineProps<{
  id?: string
}>()
// 2.修改页面获取收获地址详情
const getMemberAddressByIdData = async () => {
  // 页面回显
  if (query.id) {
    const res = await getMemberAddressByIdAPI(query.id)
    Object.assign(form.value, res.result)
  }
}
// 3.根据是否有props来动态修改标题
uni.setNavigationBarTitle({ title: query.id ? '修改地址' : '新建地址' })
// 4.地区
const onRegionChange: UniHelper.RegionPickerOnChange = (ev) => {
  // 前段页面显示
  form.value.fullLocation = ev.detail.value.join(' ')
  // 后端参数处理
  const [provinceCode, cityCode, countyCode] = ev.detail.code!
  // 将数据合并到原本的对象中
  Object.assign(form.value, { provinceCode, cityCode, countyCode })
}
// 5.地址
const onSwitchChange: UniHelper.SwitchOnChange = (ev) => {
  form.value.isDefault = ev.detail.value ? 1 : 0
}
// 6.定义表单校验规则
const rules: UniHelper.UniFormsRules = {
  receiver: {
    rules: [{ required: true, errorMessage: '请输入收货人姓名' }],
  },
  contact: {
    rules: [
      { required: true, errorMessage: '请输入联系方式 ' },
      { pattern: /^1[3-9]\d{9}$/, errorMessage: '手机号码格式不正确' },
    ],
  },
  fullLocation: {
    rules: [{ required: true, errorMessage: '请输入所在地区 ' }],
  },
  address: {
    rules: [{ required: true, errorMessage: '请输入详细地址 ' }],
  },
}
// 7.提交表单
const formRef = ref<UniHelper.UniFormsInstance>()
const onSubmit = async () => {
  // 表单校验
  try {
    await formRef.value?.validate?.()
    if (query.id) {
      // 修改页面
      await putMemberAddressByIdAPI(query.id, form.value)
    } else {
      // 新建页面
      await postMemberAddressAPI(form.value)
    }

    uni.showToast({
      icon: 'success',
      title: '新建成功',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 500)
  } catch (error) {
    uni.showToast({
      icon: 'none',
      title: '请填写完整信息',
    })
  }
}
onLoad(() => {
  getMemberAddressByIdData()
})
</script>

<template>
  <view class="content">
    <uni-forms :rules="rules" :modelValue="form" ref="formRef">
      <uni-forms-item required name="receiver" class="form-item">
        <text class="label">收货人</text>
        <input class="input" placeholder="请填写收货人姓名" v-model="form.receiver"
      /></uni-forms-item>
      <!-- 表单内容 -->
      <uni-forms-item class="form-item" required name="contact">
        <text class="label">手机号码</text>
        <input class="input" placeholder="请填写收货人手机号码" v-model="form.contact" />
      </uni-forms-item>
      <uni-forms-item class="form-item" required name="fullLocation">
        <text class="label">所在地区</text>
        <picker
          @change="onRegionChange"
          class="picker"
          mode="region"
          :value="form.fullLocation.split(' ')"
        >
          <view v-if="form.fullLocation">{{ form.fullLocation }}</view>
          <view v-else class="placeholder">请选择省/市/区(县)</view>
        </picker>
      </uni-forms-item>
      <uni-forms-item class="form-item" required name="address">
        <text class="label">详细地址</text>
        <input class="input" placeholder="街道、楼牌号等信息" v-model="form.address"
      /></uni-forms-item>
      <view class="form-item">
        <label class="label">设为默认地址</label>
        <switch
          class="switch"
          color="#27ba9b"
          @change="onSwitchChange"
          :checked="form.isDefault === 1"
        />
      </view>
    </uni-forms>
  </view>
  <!-- 提交按钮 -->
  <button class="button" @tap="onSubmit">保存并使用</button>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.content {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .form-item,
  .uni-forms-item {
    display: flex;
    align-items: center;
    min-height: 96rpx;
    padding: 25rpx 10rpx 40rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;
    margin-bottom: 0;

    // 调整 uni-forms 样式
    .uni-forms-item__content {
      display: flex;
    }

    .uni-forms-item__error {
      margin-left: 200rpx;
    }

    &:last-child {
      border: none;
    }

    .label {
      width: 200rpx;
      color: #333;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .switch {
      position: absolute;
      right: -20rpx;
      transform: scale(0.8);
    }

    .picker {
      flex: 1;
    }

    .placeholder {
      color: #808080;
    }
  }
}

.button {
  height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
</style>
