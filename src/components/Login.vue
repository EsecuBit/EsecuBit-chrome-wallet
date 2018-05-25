<template>
  <div class="login-container" >
    <div class="layadmin-user-login" >
      <div class="layadmin-user-login-main">
        <div class="layadmin-user-login-box layadmin-user-login-header">
          <div class="img">
            <img src="../common/imgs/49.png"  height=70>
          </div>
          <h2>Bitcion Wallet</h2>
          <p>A secure offline management tool</p>
        </div>
      </div>
    </div>
    <div class="layadmin-center">
      <div class="layadmin-user-login-box layadmin-user-login-header" style="padding-top: 40px">
        <div style="position: relative;height: 50px">
          <h2>
            <i class="layui-icon layui-anim layui-anim-rotate layui-anim-loop" v-if="isLoadingIcon" style="font-size: 36px;"> </i>
            <i class="icon iconfont icon-thumbDrive" style="font-size: 50px" v-else></i>
          </h2>
          <h3 v-text="promptMsg"></h3>
        </div>
      </div>
    </div>
    <div class="contact-us">
      <a href="#">If you need help, please contact us.</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      promptMsg: 'Please insert your key on your computer and unlock your wallet',
      isLoadingIcon: false
    }
  },
  mounted () {
    setTimeout(this.login, 5000)
  },
  methods: {
    login () {
      const loadingMsg = 'Loading... please wait a moment'
      this.promptMsg = loadingMsg
      this.isLoadingIcon = !this.isLoadingIcon
      setTimeout(this.sendLoginMsg, 3000)
    },
    sendLoginMsg () {
      let data = true
      this.$emit('loginSystem', data)
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
  }
  .layadmin-user-login {
    position: relative;
    left: 0;
    top: 0;
    padding: 60px 0 40px 0;
    max-height: 100%;
    box-sizing: border-box
  }
  .img {
    margin-bottom: 25px;
  }
  .layadmin-center{
    padding: 0 ;
    margin-bottom: 100px;
    height: 200px;
    background-color: #f4f4f4;
    box-sizing: border-box
  }

  .layadmin-user-login-main {
    width: 375px;
    margin: 0 auto;
    box-sizing: border-box
  }

  .layadmin-user-login-box {
    padding: 20px
  }

  .layadmin-user-login-header {
    text-align: center
  }
  .layadmin-user-login-header h2 {
    margin-bottom: 10px;
    font-weight: 300;
    line-height: 30px;
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
    text-align: center;
  }
  .contact-us a{
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
