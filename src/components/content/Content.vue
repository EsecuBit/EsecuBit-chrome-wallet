<template>
  <div class="layui-container main-content-wrapper">
    <div class="main-tab-content">
      <div class="main-tab-item" :class="{'layui-show': 0 === pageIndex}">
        <Accounts :error-code-msg="errorCodeMsg"/>
      </div>
      <template v-if="!isTest">
        <div class="main-tab-item" :class="{'layui-show': 1 === pageIndex}">
          <Send :error-code-msg="errorCodeMsg"/>
        </div>
        <div class="main-tab-item" :class="{'layui-show': 2 === pageIndex}">
          <Accept :error-code-msg="errorCodeMsg"/>
        </div>
        <div class="main-tab-item" :class="{'layui-show': 3 === pageIndex}">
          <Setting/>
        </div>
      </template>
      <template v-if="isTest">
        <div class="main-tab-item" :class="{'layui-show': 1 === pageIndex}">
          <EosSend :error-code-msg="errorCodeMsg"/>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Accounts from '../pages/accounts/Accounts'
import Send from '../pages/send/Send'
import Setting from '../pages/setting/Setting'
import Accept from '../pages/accept/Accept'
import EosSend from '../eos/send/EosSend'
export default {
  name: 'Content',
  props: ['errorCodeMsg'],
  components: {
    Accounts,
    Send,
    Setting,
    Accept,
    EosSend
  },
  computed: {
    ...mapState({
      'isTest': 'isTest',
      'pageIndex': 'pageIndex'
    })
  }
}
</script>

<style scoped>

</style>
