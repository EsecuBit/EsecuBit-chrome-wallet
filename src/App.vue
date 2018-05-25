<template>
  <div id="app" >
    <div v-cloak>
      <div v-if="isLogin">
        <Login @loginSystem="signIn" />
      </div>
      <div v-else>
        <Index/>
      </div>
    </div>
  </div>
</template>

<script>
import Login from './components/Login'
import Index from './components/Index'

export default {
  name: 'App',
  data () {
    return {
      what: 'name',
      isLogin: true
    }
  },
  methods: {
    test () {
      // console.log(this.$t('message.hello'))
    },
    signIn (...data) {
      this.isLogin = !data[0]
    }
  },
  components: {
    Login,
    Index
  }
}
</script>

<style>
@import './common/css/iconfont.css' ;
@import './common/css/main.css' ;
</style>
