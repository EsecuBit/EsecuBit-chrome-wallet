<template>
  <div class="login-container" >
    <div class="layadmin-user-login" >
      <div class="layadmin-user-login-main">
        <div class="layadmin-user-login-box layadmin-user-login-header">
          <div class="img">
            <img src="../../common/imgs/49.png"  height=80>
          </div>
          <p>{{$t('message.login_detail')}}</p>
        </div>
      </div>
    </div>
    <div class="layadmin-center">
      <div class="layadmin-user-login-box layadmin-user-login-header" >
        <div style="position: relative;">
          <div class="loader-anim">
            <i class="icon iconfont swing-anim icon-bug"  style="font-size: 50px;" v-show="isShowError"></i>
            <i class="layui-icon layui-anim layui-anim-rotate layui-anim-loop" v-show="isLoadingIcon && !isShowError" style="font-size: 50px;"> </i>
            <i class="icon iconfont icon-thumbDrive usb-blinking-anim" style="font-size: 50px" v-show="!isLoadingIcon && !isShowError"></i>
          </div>
          <h3>{{promptMsg}}</h3>
        </div>
      </div>
    </div>
    <div class="contact-us">
      <a href="https://www.esecubit.com/" target="_blank">{{$t('message.login_contact_us')}}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  props: ['status', 'loginErrorMsg'],
  data () {
    return {
      isLoadingIcon: false,
      promptMsg: this.$t('message.login_prompt_msg1'),
      isShowError: false
    }
  },
  watch: {
    status: {
      handler (newValue, oldValue) {
        if (newValue === 404) {
          this.isShowError = true
          this.showErrorMsg()
        } else {
          this.isShowError = false
          if (newValue === 2) this.init()
          if (newValue === 3) this.sync()
          if (newValue === 99) this.quitLoading()
        }
      }
    }
  },
  methods: {
    showErrorMsg () {
      this.promptMsg = this.loginErrorMsg
    },
    init () {
      this.promptMsg = this.$t('message.login_prompt_msg2')
      this.isLoadingIcon = true
    },
    sync () {
      this.promptMsg = this.$t('message.login_prompt_msg3')
    },
    quitLoading () {
      this.promptMsg = this.$t('message.login_prompt_msg1')
      this.isLoadingIcon = false
    }
  }
}
</script>

<style scoped lang="less">
  .login-container{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .layadmin-user-login {
      flex: 1;
      display: flex;
      width: 100%;
      .layadmin-user-login-main {
        width: 375px;
        margin: auto;
        height: 200px;
        box-sizing: border-box
      }
      .img {
        margin-bottom: 25px;
      }
    }
    .layadmin-center{
      flex: 1;
      display: flex;
      margin: auto;
      width: 100%;
      padding: 0 ;
      background-color: #F2F2F2;
    }
  }
  .layadmin-user-login-box {
    padding: 20px
  }

  .layadmin-user-login-header {
    text-align: center;
    margin: auto;
    font-weight: 300;
    h2 {
      margin-bottom: 10px;
      height: 30px;
      line-height: 30px;
      font-size: 30px;
      color: #000
    }
    h3 {
      margin-bottom: 10px;
      font-size: 20px;
      color: #000
    }
    p {
      color: #999
    }
  }
  .loader-anim {
    margin-bottom: 20px;
    font-weight: 300;
    height: 50px;
    line-height: 50px;
    font-size: 30px;
    color: #000
  }
  .contact-us {
    flex: 1;
    display: flex;
    width: 100%;
    text-align: center;
    a{
      margin: auto;
      font-weight: 300;
      color: #999;
      &:hover {
        color: #555;
      }
    }
  }
  @media screen and (max-width: 768px) {
    .layadmin-user-login {
      padding-top: 80px
    }
    .layadmin-user-login-main {
      width: 300px
    }
  }
  .usb-blinking-anim {
    display: inline-block;
    -webkit-animation-name: usb-anim;
    animation-name: usb-anim;
    -webkit-animation-duration: 2s;
    animation-duration: 2s;
    -webkit-animation-timing-function: ease;
    animation-timing-function: ease;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
  }
  .swing-anim{
    display: inline-block;
    -webkit-animation-name: swing-anim;
    animation-name: swing-anim;
    -webkit-animation-duration: 4s;
    animation-duration: 4s;
    -webkit-animation-timing-function: linear;
    animation-timing-function: linear;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
  }
  @keyframes swing-anim{
    from{
      opacity: 1;
    }
    30% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
    70% {
      opacity: 1;
    }
    to{
      opacity: 1;
    }
  }
  @keyframes usb-anim {
    from{
      opacity: 0.5;
      transform: scale(1, 1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2, 1.2);
    }
    to{
      opacity: 0.5;
      transform: scale(1, 1);
    }
  }
</style>
