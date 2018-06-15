<template>
  <div class="login-container" >
    <div class="layadmin-user-login" >
      <div class="layadmin-user-login-main">
        <div class="layadmin-user-login-box layadmin-user-login-header">
          <div class="img">
            <img src="../common/imgs/49.png"  height=70>
          </div>
          <h2>{{$t('message.login_title')}}</h2>
          <p>{{$t('message.login_detail')}}</p>
        </div>
      </div>
    </div>
    <div class="layadmin-center">
      <div class="layadmin-user-login-box layadmin-user-login-header" >
        <div style="position: relative;">
          <div class="loader-anim">
            <i class="layui-icon layui-anim layui-anim-rotate layui-anim-loop" v-if="isLoadingIcon" style="font-size: 50px;"> </i>
            <i class="icon iconfont icon-thumbDrive" style="font-size: 50px" v-else></i>
          </div>
          <h3 v-text="promptMsg"></h3>
        </div>
      </div>
    </div>
    <div class="contact-us">
      <a href="#">{{$t('message.login_contact_us')}}</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  props: ['status'],
  data () {
    return {
      promptMsg: this.$t('message.login_prompt_msg'),
      loadingMsg1: this.$t('message.login_prompt_msg1'),
      loadingMsg2: this.$t('message.login_prompt_msg2'),
      loadingMsg3: this.$t('message.login_prompt_msg3'),
      loadingMsg4: this.$t('message.login_prompt_msg4'),
      isLoadingIcon: false
    }
  },
  watch: {
    status: {
      handler (newValue, oldValue) {
        if (newValue === 2) this.init()
        if (newValue === 3) this.sync()
        if (newValue === 99) this.quitLoading()
      }
    }
  },
  mounted () {
  },
  methods: {
    loading () {
      this.promptMsg = this.loadingMsg2
      this.isLoadingIcon = !this.isLoadingIcon
    },
    init () {
      this.promptMsg = this.loadingMsg2
      this.isLoadingIcon = !this.isLoadingIcon
    },
    sync () {
      this.promptMsg = this.loadingMsg3
    },
    quitLoading () {
      this.promptMsg = this.loadingMsg1
      this.isLoadingIcon = !this.isLoadingIcon
    }
  }
}
</script>

<style scoped>
  body, html {
    height: 100%;
    font-size: 13px;
    position:relative;
    font-family: 'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif;
  }
  .login-container{
    width: 100%;
    height: 100%;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .layadmin-user-login {
    flex: 1;
    display: flex;
    width: 100%;
  }
  .img {
    margin-bottom: 25px;
  }
  .layadmin-center{
    flex: 1;
    display: flex;
    margin: auto;
    width: 100%;
    padding: 0 ;
    background-color: #f5f5f5;
  }

  .layadmin-user-login-main {
    width: 375px;
    margin: auto;
    height: 200px;
    box-sizing: border-box
  }

  .layadmin-user-login-box {
    padding: 20px
  }

  .layadmin-user-login-header {
    text-align: center;
    margin: auto;
  }
  .layadmin-user-login-header h2 {
    margin-bottom: 10px;
    font-weight: 300;
    height: 30px;
    line-height: 30px;
    font-size: 30px;
    color: #000
  }
  .loader-anim {
    margin-bottom: 20px;
    font-weight: 300;
    height: 50px;
    line-height: 50px;
    font-size: 30px;
    color: #000
  }
  .layadmin-user-login-header h3 {
    margin-bottom: 10px;
    font-weight: 300;
    font-size: 20px;
    color: #000
  }

  .layadmin-user-login-header p {
    font-weight: 300;
    color: #999
  }
  .contact-us {
    flex: 1;
    display: flex;
    width: 100%;
    text-align: center;
  }
  .contact-us a{
    margin: auto;
    font-weight: 300;
    color: #999;
  }
  .contact-us a:hover {
    font-weight: 300;
    color: #555;
  }
  @media screen and (max-width: 768px) {
    .layadmin-user-login {
      padding-top: 80px
    }
    .layadmin-user-login-main {
      width: 300px
    }
  }
</style>
