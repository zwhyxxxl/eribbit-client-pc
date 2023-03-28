<template>
  <Form
    ref="formCom"
    :validation-schema="mySchema"
    v-slot="{errors}"
    class="xtx-form"
    autocomplete="off"
  >
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field
          v-model="form.account"
          :class="{err:errors.account}"
          name='account'
          class="input"
          type="text"
          placeholder="请输入用户名"
        />
      </div>
      <div
        class="error"
        v-if="errors.account"
      >{{errors.account}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field
          :class="{err:errors.mobile}"
          v-model="form.mobile"
          name='mobile'
          class="input"
          type="text"
          placeholder="请输入手机号"
        />
      </div>
      <div
        class="error"
        v-if="errors.mobile"
      >{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field
          :class="{err:errors.code}"
          v-model="form.code"
          name='code'
          class="input"
          type="text"
          placeholder="请输入验证码"
        />
        <span
          v-if="countDown"
          class="code"
        >{{ countDown }}秒后发送</span>
        <span
          v-else
          class="code"
          @click="send"
        >发送验证码</span>
      </div>
      <div
        class="error"
        v-if="errors.code"
      >{{errors.code}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          :class="{err:errors.password}"
          v-model="form.password"
          name='password'
          class="input"
          type="password"
          placeholder="请输入密码"
          autocomplete="off"
        />
      </div>
      <div
        class="error"
        v-if="errors.password"
      >{{errors.password}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field
          :class="{err:errors.repassword}"
          autocomplete="off"
          v-model="form.repassword"
          name='repassword'
          class="input"
          type="password"
          placeholder="请确认密码"
        />
      </div>
      <div
        class="error"
        v-if="errors.repassword"
      >{{errors.repassword}}</div>
    </div>
    <a
      href="javascript:;"
      class="submit"
      @click="submit"
    >立即提交</a>
  </Form>
</template>

<script>
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import { Form, Field } from 'vee-validate'
import { reactive, ref } from 'vue'
import schema from '@/utils/vee-validate-schema'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackPatch',
  components: {
    Form,
    Field
  },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const store = useStore()
    const router = useRouter()
    // 1. 表单校验(多了两种校验规则) 用户名是否存在 再次输入密码是否一致
    // 2.发送短信验证码
    // 3.完善信息

    // 表单数据对象
    const form = reactive({
      mobile: null,
      code: null,
      account: null,
      password: null,
      repassword: null
    })
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code,
      account: schema.accountApi,
      password: schema.password,
      repassword: schema.rePassword
    }
    // 倒计时
    const countDown = ref(0) // 定义倒计时变量
    const formCom = ref(null)
    const start = () => {
      countDown.value = 60 // 设置倒计时为60秒
      const timer = setInterval(() => {
        countDown.value-- // 倒计时每秒减1
        if (countDown.value === 0) {
          clearInterval(timer) // 倒计时结束，清除定时器
        }
      }, 1000)
    }
    // 1.1发送验证码
    // 1.2校验手机号，如果成功去发送短信 开启60S倒计时 如果失败提示消息
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 通过
        await userQQPatchCode(form.mobile)
        start()
        Message({ type: 'success', text: '发送验证码成功' })
      } else {
        // 失败 使用vee的错误函数 显示错误信息 setFieldError(字段名称，错误信息）
        formCom.value.setFieldError('mobile', valid)
      }
    }
    // 完善信息
    const submit = () => {
      const valid = formCom.value.validate()
      if (valid) {
        userQQPatchLogin({ unionId: props.unionId, ...form }).then(data => {
          // 绑定成功
          // 实现和登录一样的逻辑
          // 存储用户信息
          const { id, account, nickname, avatar, token, mobile } = data.result
          store.commit('user/setUser', { id, account, nickname, avatar, token, mobile })
          // 跳转到来源页或者首页
          router.push(store.state.user.redirectUrl)
          // 成功提示
          Message({ type: 'success', text: 'QQ完善信息成功' })
        }).catch(e => {
          Message({ type: 'error', text: '完善信息失败' })
        })
      }
    }
    return { form, mySchema, send, countDown, formCom, submit }
  }
}
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
