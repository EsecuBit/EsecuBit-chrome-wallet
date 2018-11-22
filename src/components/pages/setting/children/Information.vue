<template>
  <div>
    <div class="table-item">
      <h3>{{$t('message.setting_version')}}</h3>
      <table class="layui-table" >
        <colgroup>
          <col width="100">
          <col width="200">
        </colgroup>
        <thead>
        <tr>
          <th>{{$t('message.setting_name')}}</th>
          <th>{{$t('message.setting_information')}}</th>
        </tr>
        </thead>
        <tbody >
        <tr v-for="item in hardwareList" v-if="hardwareList.length > 0">
          <td>{{item.name}}</td>
          <td>{{item.value}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="table-item" v-if="bitNetList.length > 0">
      <h3>{{$t('message.setting_btc_net')}}</h3>
      <table class="layui-table" >
        <colgroup>
          <col width="100">
          <col width="200">
        </colgroup>
        <thead>
        <tr>
          <th>{{$t('message.setting_name')}}</th>
          <th>{{$t('message.setting_network')}}</th>
        </tr>
        </thead>
        <tbody >
        <tr v-for="item in bitNetList">
          <td>{{item.name}}</td>
          <td>{{item.value}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="table-item" v-if="ethNetList.length > 0">
      <h3>{{$t('message.setting_etc_net')}}</h3>
      <table class="layui-table" >
        <colgroup>
          <col width="100">
          <col width="200">
        </colgroup>
        <thead>
        <tr>
          <th>{{$t('message.setting_name')}}</th>
          <th>{{$t('message.setting_network')}}</th>
        </tr>
        </thead>
        <tbody >
        <tr v-for="item in ethNetList">
          <td>{{item.name}}</td>
          <td>{{item.value}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="table-item" v-if="eosNetList.length > 0">
      <h3>{{$t('message.setting_eos_net')}}</h3>
      <table class="layui-table" >
        <colgroup>
          <col width="100">
          <col width="200">
        </colgroup>
        <thead>
        <tr>
          <th>{{$t('message.setting_name')}}</th>
          <th>{{$t('message.setting_network')}}</th>
        </tr>
        </thead>
        <tbody >
        <tr v-for="item in eosNetList">
          <td>{{item.name}}</td>
          <td>{{item.value}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Information',
  computed: {
    ...mapState({
      'walletInfo': 'walletInfo',
      'netInfo': 'netInfo',
      'appVersion': 'appVersion'
    }),
    hardwareList () {
      if (this.walletInfo) {
        return [
          {name: this.$t('message.setting_sdk_version'), value: this.walletInfo.sdk_version},
          {name: this.$t('message.setting_cos_version'), value: this.walletInfo.cos_version},
          {name: this.$t('message.setting_app_version'), value: this.appVersion}
        ]
      } else return []
    },
    bitNetList () {
      if (this.netInfo[this.D.coin.test.btcTestNet3] || this.netInfo[this.D.coin.main.btc]) {
        let netString = this.netInfo[this.D.coin.test.btcTestNet3] ? this.D.coin.test.btcTestNet3 : this.D.coin.main.btc
        let exchangeNet = this.netInfo[netString].exchange
        let feeNet = this.netInfo[netString].fee
        let btcNet = this.netInfo[netString].network
        return [
          {name: this.$t('message.setting_btc_info'), value: btcNet},
          {name: this.$t('message.setting_fee'), value: feeNet},
          {name: this.$t('message.setting_exchange'), value: exchangeNet}
        ]
      } else return []
    },
    ethNetList () {
      if (this.netInfo[this.D.coin.test.ethRinkeby] || this.netInfo[this.D.coin.main.eth]) {
        let netString = this.netInfo[this.D.coin.test.ethRinkeby] ? this.D.coin.test.ethRinkeby : this.D.coin.main.eth
        let exchangeNet = this.netInfo[netString].exchange
        let feeNet = this.netInfo[netString].fee
        let btcNet = this.netInfo[netString].network
        return [
          {name: this.$t('message.setting_btc_info'), value: btcNet},
          {name: this.$t('message.setting_fee'), value: feeNet},
          {name: this.$t('message.setting_exchange'), value: exchangeNet}
        ]
      } else return []
    },
    eosNetList () {
      if (this.netInfo[this.D.coin.test.eosJungle] || this.netInfo[this.D.coin.main.eos]) {
        let netString = this.netInfo[this.D.coin.test.eosJungle] ? this.D.coin.test.eosJungle : this.D.coin.main.eos
        let exchangeNet = this.netInfo[netString].exchange
        let btcNet = this.netInfo[netString].network
        return [
          {name: this.$t('message.setting_btc_info'), value: btcNet},
          {name: this.$t('message.setting_exchange'), value: exchangeNet}
        ]
      } else return []
    }
  }
}
</script>

<style scoped>
  .layui-table td, .layui-table th {
    padding: 6px 15px;
    font-size: 13px;
  }
</style>
