<template>
  <XtxDialog
    :title="`${formData.id?'修改收货地址':'添加收货地址'}`"
    v-model:visible="visibleDialog"
  >
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input
              class="input"
              placeholder="请输入收货人"
              v-model="formData.receiver"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input
              class="input"
              placeholder="请输入手机号"
              v-model="formData.contact"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <XtxCity
              :fullLocation='formData.fullLocation'
              @change="changeCity"
              placeholder="请选择所在地区"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input
              class="input"
              placeholder="请输入详细地址"
              v-model="formData.address"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input
              class="input"
              placeholder="请输入邮政编码"
              v-model="formData.postalCode"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input
              class="input"
              placeholder="请输入地址标签，逗号分隔"
              v-model="formData.addressTags"
            />
          </div>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <XtxButton
        type="gray"
        style="margin-right:20px"
        @click="visibleDialog=false"
      >取消</XtxButton>
      <XtxButton
        type="primary"
        @click="submit"
      >确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { reactive, ref } from 'vue'
import { addAddress, editAddress } from '@/api/order'
import Message from '@/components/library/Message'
export default {
  name: 'AddressEdit',

  setup (props, { emit }) {
    const visibleDialog = ref(false)
    // 定义一个open函数 作为打开对话框函数
    const open = (address) => {
      if (address.id) {
        // 修改
        // 填充表单
        for (const key in address) {
          formData[key] = address[key]
        }
      } else {
        // 如果是添加 清空表单
        for (const key in formData) {
          if (key === 'isDefault') {
            formData[key] = 1
          } else {
            formData[key] = null
          }
        }
      }
      visibleDialog.value = true
    }
    // 定义表单数据对象
    const formData = reactive({
      receiver: null,
      contact: null,
      provinceCode: null,
      cityCode: null,
      countyCode: null,
      address: null,
      postalCode: null,
      addressTags: null,
      isDefault: 1,
      // 城市组件显示文字
      fullLocation: null

    })
    // 城市选择
    const changeCity = (result) => {
      formData.provinceCode = result.provinceCode
      formData.cityCode = result.cityCode
      formData.countyCode = result.countyCode
      formData.fullLocation = result.fullLocation
    }
    // 提交操作
    const submit = () => {
      if (formData.id) {
        // 修改请求
        // 修改请求
        editAddress(formData).then(data => {
          // 提示
          Message({ type: 'success', text: '修改收货地址成功' })
          // 关闭
          visibleDialog.value = false
          // 触发自定义事件
          emit('on-success', formData)
        })
      } else {
        // 添加请求
        // 省略的校验
        addAddress(formData).then(data => {
          formData.id = data.result.id
          Message({ type: 'success', text: '添加收货地址成功' })
          visibleDialog.value = false
          // 触发自定义事件
          emit('on-success', formData)
        })
      }
    }

    return { visibleDialog, open, formData, changeCity, submit }
  }
}
</script>
<style scoped lang="less">
.xtx-dialog {
  :deep(.wrapper) {
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.xtx-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.xtx-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>
