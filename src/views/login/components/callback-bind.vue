<template>
  <Form
    ref="formCom"
    :validation-schema="mySchema"
    v-slot='{errors}'
    autocomplete="off"
    class="xtx-form"
  >
    <div class="user-info">
      <img
        :src="avatar"
        alt=""
      />
      <p>Hi，{{nickname}} 欢迎来小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
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
          placeholder="绑定的手机号"
        />
      </div>
      <div
        class="error"
        v-if="errors.mobile"
      >
        {{errors.mobile}}</div>
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
          placeholder="短信验证码"
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
      >
        {{errors.code}}</div>
    </div>
    <a
      href="javascript:;"
      class="submit"
      @click="submit"
    >立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import { reactive, ref } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  name: 'CallbackBind',
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  components: {
    Form,
    Field
  },
  setup (props) {
    const store = useStore()
    const router = useRouter()
    // 1.准备信息
    // unionId(openId) QQ头像和昵称
    // 2.完成表单校验
    // 3.发送验证码(校验，定义API，倒计时)
    // 4.进行绑定，绑定成功就时登陆成功
    const nickname = ref(null)
    const avatar = ref(null)
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        // console.log(res)
        nickname.value = res.data.nickname
        avatar.value = res.data.figureurl_1
      })
    }
    // 表单数据对象
    const form = reactive({
      mobile: null,
      code: null
    })
    // 校验规则对象
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
    }

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
        await userQQBindCode(form.mobile)
        start()
        Message({ type: 'success', text: '发送验证码成功' })
      } else {
        // 失败 使用vee的错误函数 显示错误信息 setFieldError(字段名称，错误信息）
        formCom.value.setFieldError('mobile', valid)
      }
    }
    // 立即绑定
    const submit = () => {
      const valid = formCom.value.validate()
      if (valid) {
        userQQBindLogin({ unionId: props.unionId, ...form }).then(data => {
          // 绑定成功
          // 实现和登录一样的逻辑
          // 存储用户信息
          const { id, account, nickname, avatar, token, mobile } = data.result
          store.commit('user/setUser', { id, account, nickname, avatar, token, mobile })
          // 跳转到来源页或者首页
          router.push(store.state.user.redirectUrl)
          // 成功提示
          Message({ type: 'success', text: '绑定成功' })
        }).catch(e => {
          Message({ type: 'error', text: '绑定失败' })
        })
      }
    }
    return { nickname, avatar, form, mySchema, formCom, send, countDown, submit }
  }
}
</script>

<style scoped lang='less'>
.user-info {
  width: 320px;
  height: 70px;
  margin: 0 auto;
  display: flex;
  background: #f2f2f2;
  align-items: center;
  padding: 0 10px;
  margin-bottom: 25px;
  img {
    background: #f2f2f2;
    width: 50px;
    height: 50px;
  }
  p {
    padding-left: 10px;
  }
}
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
