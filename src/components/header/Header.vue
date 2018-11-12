<template>
  <div class="fly-header bg-black" v-bind:class="[headColor]">
    <div class="layui-container">
      <a class="logo" href="#"> <img src="../../common/imgs/logo.png"></a>
      <!-- header nav.menu -->
      <ul class="layui-nav fly-nav layui-hide-xs menu-switch">
        <li class="layui-nav-item " :class="{'layui-this': index === pageIndex}" v-for="(item, index) in pageList" @click="switchPage(index)">
          <a href="#"><i class="icon iconfont" :class="item.icon"></i>{{item.label}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  name: 'breadcrumb',
  props: {
    isAddAccounts: {
      type: Boolean,
      default: true
    },
    navTitle: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      'pageIndex': 'pageIndex',
      'isPreventSwitch': 'isPreventSwitch',
      'headColor': 'headColor',
      'customizeColor': 'customizeColor'
    }),
    ...mapGetters({
      'currentAccountType': 'currentAccountType'
    }),
    pageList () {
      // nav.menu label and icon
      let defaultPageList = [
        {label: this.$t('message.app_accounts'), icon: 'icon-zhanghu1'},
        {label: this.$t('message.app_send'), icon: 'icon-msnui-cloud-upload'},
        {label: this.$t('message.app_accept'), icon: 'icon-msnui-cloud-download'},
        {label: this.$t('message.app_setting'), icon: 'icon-shezhi2'}
      ]
      let eosPageList = [
        {label: this.$t('message.app_accounts'), icon: 'icon-zhanghu1'},
        {label: this.$t('message.app_transaction'), icon: 'icon-jiaoyi'},
        {label: this.$t('message.app_vote'), icon: 'icon-toupiao'},
        {label: this.$t('message.app_resource'), icon: 'icon-huabanfuben'},
        {label: this.$t('message.app_setting'), icon: 'icon-shezhi2'}
      ]
      return this.D.isEos(this.currentAccountType) ? eosPageList : defaultPageList
    }
  },
  methods: {
    ...mapMutations({
      setIsAddAccounts: 'SET_IS_Add_ACCOUNTS',
      setPageIndex: 'SET_PAGE_INDEX'
    }),
    addAccountContent () {
      this.$emit('addAccountContent')
    },
    switchPage (index) {
      if (!this.isPreventSwitch) {
        this.setPageIndex(index)
        let isAddAccounts = index === 0
        this.setIsAddAccounts(isAddAccounts)
      }
    }
  }
}
</script>

<style lang="less" >
  .icon-huabanfuben{
    font-size: 22px!important;
  }
  .icon-shezhi2{
    font-size: 24px!important;
  }
  .icon-jiaoyi{
    font-size: 24px!important;
  }
</style>
