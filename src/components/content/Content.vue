<template>
  <div class="height-scroll">
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
            <EosTransaction :error-code-msg="errorCodeMsg"/>
          </div>
          <div class="main-tab-item" :class="{'layui-show': 2 === pageIndex}">
            <Vote :error-code-msg="errorCodeMsg"/>
          </div>
          <div class="main-tab-item" :class="{'layui-show': 3 === pageIndex}">
            <ResourceManagement :error-code-msg="errorCodeMsg"/>
          </div>
          <div class="main-tab-item" :class="{'layui-show': 4 === pageIndex}">
            <Setting/>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Accounts from '../pages/accounts/Accounts'
import Send from '../pages/send/Send'
import Setting from '../pages/setting/Setting'
import Accept from '../pages/accept/Accept'
import EosTransaction from '../eos/transaction/EosTransaction'
import Vote from '../eos/vote/Vote'
import ResourceManagement from '../eos/resource/ResourceManagement'
export default {
  name: 'Content',
  props: ['errorCodeMsg'],
  components: {
    Accounts,
    Send,
    Setting,
    Accept,
    EosTransaction,
    Vote,
    ResourceManagement
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
  .layui-container{
    height: 100%;
  }
</style>
