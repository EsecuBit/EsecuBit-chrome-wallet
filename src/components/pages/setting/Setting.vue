<template>
  <div style="height: 100%">
    <!-- menu -->
    <div class="site-tree">
      <ul class="layui-tree ">
        <li><h2>{{$t('message.app_setting')}}</h2></li>
        <li class="tab-title-2 layui-this">
          <a href="#">
            <i class="layui-icon">&#xe632;</i>
            <cite>{{$t('message.setting_display')}}</cite>
            </a>
        </li>
        <li class="tab-title-2">
          <a href="#">
            <i class="layui-icon" >&#xe628;</i>
            <cite>{{$t('message.setting_information')}}</cite>
          </a>
        </li>
        <li class="tab-title-2" v-if="!isOfficial">
          <a href="#">
            <i class="layui-icon">&#xe857;</i>
            <cite>{{$t('message.setting_init')}}</cite>
          </a>
        </li>
      </ul>
    </div>

    <!-- content -->
    <div class="site-content height-scroll">
      <div class="tab-content-2">

        <div class="tab-item layui-show">
          <div class="site-text site-block">
            <form class="layui-form" lay-filter="form3">
              <div class="layui-form-item">
                <label class="layui-form-label">{{$t('message.setting_interface_lang')}}</label>
                <div class="layui-input-inline input-width">
                  <select name="lang" lay-filter="lang" v-model="initLang">
                    <option :value="lang.value" v-for="lang in langList">{{lang.label}}</option>
                  </select>
                </div>
              </div>
              <div class="layui-form-item" >
                <label class="layui-form-label">{{$t('message.setting_btc_units')}}</label>
                <div class="layui-input-block" >
                  <input type="radio" lay-filter="bitUnit" name="bitUnit" :value="item.value" :title="item.label" :checked="item.value === unitBitChecked" v-for="item in bitUnitValueList">
                </div>
              </div>
              <div class="layui-form-item" >
                <label class="layui-form-label">{{$t('message.setting_etc_units')}}</label>
                <div class="layui-input-block" >
                  <input type="radio" lay-filter="ethUnit" name="ethUnit" :value="item.value" :title="item.label" :checked="item.value === unitEthChecked" v-for="item in ethUnitValueList">
                </div>
              </div>
              <div class="layui-form-item">
                <label class="layui-form-label">{{$t('message.setting_exchange_rate')}}</label>
                <div class="layui-input-inline input-width">
                  <select name="exchangeRate" lay-filter="exchange" v-model="selectedExchangeRate">
                    <option :value="itemExchangeRate.value" v-for="itemExchangeRate in exchangeRate">{{itemExchangeRate.label}}</option>
                  </select>
                </div>
              </div>
              <div class="layui-form-item">
                <label class="layui-form-label">{{$t('message.setting_skin')}}</label>
                <div class="layui-input-inline input-width">
                    <a href="#" class="layui-btn layui-btn-sm" v-bind:class="[item.colorClass]" @click="switchColor(item.id)" v-for="item in skinColor">{{item.name}}</a>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- hardware information -->
        <div class="tab-item">
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
          <div class="table-item">
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
              <tr v-for="item in bitNetList" v-if="bitNetList.length > 0">
                <td>{{item.name}}</td>
                <td>{{item.value}}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="table-item">
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
              <tr v-for="item in etcNetList" v-if="etcNetList.length > 0">
                <td>{{item.name}}</td>
                <td>{{item.value}}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Set seed -->
        <div class="tab-item" v-if="!isOfficial">
          <div class="site-text site-block">
            <form class="layui-form" lay-filter="form4">
              <div class="layui-form-item" >
                <label class="layui-form-label">{{$t('message.setting_swift_device')}}</label>
                <div class="layui-input-block" >
                  <input type="radio" lay-filter="device" name="device" title="software" value="soft" :checked="'soft' === deviceChecked">
                  <input type="radio" lay-filter="device" name="device" title="hardware" value="hard" :checked="'hard' === deviceChecked">
                </div>
              </div>
              <div class="layui-form-item" >
                <label class="layui-form-label">{{$t('message.setting_net_type')}}</label>
                <div class="layui-input-block" >
                  <input type="radio" lay-filter="net" name="net" title="main net" value="main" :checked="'main' === netChecked">
                  <input type="radio" lay-filter="net" name="net" title="test net" value="test" :checked="'test' === netChecked">
                </div>
              </div>
              <div class="layui-form-item">
                <label class="layui-form-label">{{$t('message.setting_current_seed')}}</label>
                <div class="layui-input-inline input-width">
                  <input type="text" class="layui-input" v-model="seedValue"/>
                </div>
              </div>
              <div class="layui-form-item">
                <label class="layui-form-label"></label>
                <div class="layui-input-inline input-width">
                    <button class="layui-btn layui-btn-sm "  type="button" @click="randomGenerate">{{$t('message.setting_random_produce')}}</button>
                  <button class="layui-btn layui-btn-sm layui-btn-normal"  type="button" @click="setSeed">{{$t('message.setting_setting')}}</button>
                </div>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Store from '../../../common/js/store'
import { mapState, mapMutations } from 'vuex'

const form = layui.form
const $ = layui.jquery
const layer = layui.layer
export default {
  name: 'Setting',
  data () {
    return {
      unitBitChecked: '',
      unitEthChecked: '',
      selectedExchangeRate: '',
      bitUnitValueList: [],
      ethUnitValueList: [],
      initLang: null,
      langList: [
        {label: 'English', value: 'en-US'},
        {label: '简体中文', value: 'zh-CN'}
      ],
      exchangeRate: null,
      seedValue: '',
      deviceChecked: '',
      netChecked: '',
      currentNet: '',
      isOfficial: Store.isOfficial
    }
  },
  watch: {
    accountInfo: {
      handler (newValue, oldValue) {
        this.getCurrentSeed()
      }
    }
  },
  computed: {
    ...mapState({
      'accountInfo': 'accountList',
      'walletInfo': 'walletInfo',
      'netInfo': 'netInfo',
      'appVersion': 'appVersion'
    }),
    hardwareList () {
      if (this.walletInfo) {
        let hardwareArr = [
          {name: this.$t('message.setting_sdk_version'), value: this.walletInfo.sdk_version},
          {name: this.$t('message.setting_cos_version'), value: this.walletInfo.cos_version},
          {name: this.$t('message.setting_app_version'), value: this.appVersion}
        ]
        return hardwareArr
      } else return []
    },
    bitNetList () {
      if (this.netInfo) {
        let netString = this.netInfo[this.D.coin.test.btcTestNet3] ? this.D.coin.test.btcTestNet3 : this.D.coin.main.btc
        let exchangeNet = this.netInfo[netString].exchange
        let feeNet = this.netInfo[netString].fee
        let btcNet = this.netInfo[netString].network

        let netList = [
          {name: this.$t('message.setting_btc_info'), value: btcNet},
          {name: this.$t('message.setting_fee'), value: feeNet},
          {name: this.$t('message.setting_exchange'), value: exchangeNet}
        ]
        return netList
      } else return []
    },
    etcNetList () {
      if (this.netInfo) {
        let netString = this.netInfo[this.D.coin.test.ethRinkeby] ? this.D.coin.test.ethRinkeby : this.D.coin.main.eth
        let exchangeNet = this.netInfo[netString].exchange
        let feeNet = this.netInfo[netString].fee
        let btcNet = this.netInfo[netString].network
        let netList = [
          {name: this.$t('message.setting_btc_info'), value: btcNet},
          {name: this.$t('message.setting_fee'), value: feeNet},
          {name: this.$t('message.setting_exchange'), value: exchangeNet}
        ]
        return netList
      } else return []
    },
    skinColor () {
      return [
        {name: this.$t('message.setting_black'), colorClass: 'black-skin', id: 'black'},
        {name: this.$t('message.setting_dark_blue'), colorClass: 'blue-skin', id: 'blue'},
        {name: this.$t('message.setting_green'), colorClass: 'green-skin', id: 'green'},
        {name: this.$t('message.setting_gray'), colorClass: 'gray-skin', id: 'gray'}
      ]
    }
  },
  mounted () {
    this.init()
    this.switchLang()
    this.switchExchange()
    this.switchTab()
  },
  methods: {
    ...mapMutations({
      setCurrentExchangeRate: 'SET_CURRENT_EXCHANGE_RATE',
      setCurrentUnitBtc: 'SET_CURRENT_UNIT_BTC',
      setCurrentUnitEth: 'SET_CURRENT_UNIT_ETH',
      setHeadColor: 'SET_HEAD_COLOR',
      setCustomizeColor: 'SET_CUSTOMIZE_COLOR',
      setSwitchLangTimes: 'SET_SWITCH_LANG_TIMES'
    }),
    initUnitsForm () {
      this.bitUnitValueList = [
        {label: this.D.unit.btc.BTC, value: this.D.unit.btc.BTC},
        {label: this.D.unit.btc.mBTC, value: this.D.unit.btc.mBTC},
        {label: this.D.unit.btc.satoshi, value: this.D.unit.btc.satoshi}
      ]
      this.ethUnitValueList = [
        {label: this.D.unit.eth.ETH, value: this.D.unit.eth.ETH},
        {label: this.D.unit.eth.GWei, value: this.D.unit.eth.GWei},
        {label: this.D.unit.eth.Wei, value: this.D.unit.eth.Wei}
      ]
      this.$nextTick(() => {
        form.render('radio', 'form3')
        form.on('radio(bitUnit)', data => {
          Store.saveChromeStore('bitUnit', data.value)
          this.setCurrentUnitBtc(data.value)
        })
        form.render('radio', 'form3')
        form.on('radio(ethUnit)', data => {
          Store.saveChromeStore('ethUnit', data.value)
          this.setCurrentUnitEth(data.value)
        })
      })
    },
    async getCurrentSeed () {
      this.seedValue = await this.esWallet.getTestSeed()
    },
    async init () {
      // Initialize defaults
      const getExchangeList = this.D.suppertedLegals()
      this.exchangeRate = this.editExchangeList(getExchangeList)
      if (localStorage) {
        this.initLang = Store.fetch('lang') ? Store.fetch('lang') : navigator.language
        this.unitBitChecked = Store.fetch('bitUnit') ? Store.fetch('bitUnit') : this.D.unit.btc.BTC
        this.unitEthChecked = Store.fetch('ethUnit') ? Store.fetch('ethUnit') : this.D.unit.eth.ETH
        this.selectedExchangeRate = Store.fetch('exchange') ? Store.fetch('exchange') : this.D.unit.legal.USD
        this.deviceChecked = Store.fetch('device') ? Store.fetch('device') : 'soft'
        this.netChecked = Store.fetch('net') ? Store.fetch('net') : 'test'
      } else {
        const lang = await Store.setPromise('lang')
        const bitUnit = await Store.setPromise('bitUnit')
        const ethUnit = await Store.setPromise('ethUnit')
        const exchange = await Store.setPromise('exchange')
        const device = await Store.setPromise('device')
        const net = await Store.setPromise('net')
        this.initLang = lang['lang'] ? lang['lang'] : navigator.language
        this.unitBitChecked = bitUnit['bitUnit'] ? bitUnit['bitUnit'] : this.D.unit.btc.BTC
        this.unitEthChecked = ethUnit['ethUnit'] ? ethUnit['ethUnit'] : this.D.unit.eth.ETH
        this.selectedExchangeRate = exchange['exchange'] ? exchange['exchange'] : this.D.unit.legal.USD
        this.deviceChecked = device['device'] ? device['device'] : 'soft'
        this.netChecked = net['net'] ? net['net'] : 'test'
        this.currentNet = net['net'] ? net['net'] : 'test'
      }
      this.$nextTick(() => {
        form.render('select', 'form3')
        form.render('radio', 'form4')
        form.on('radio(net)', data => {
          Store.saveChromeStore('net', data.value)
        })
        form.on('radio(device)', data => {
          Store.saveChromeStore('device', data.value)
        })
      })
      this.initUnitsForm()
    },
    editExchangeList (arr) {
      let exRate = []
      if (Array.isArray(arr) && arr.length > 0) {
        for (let item of arr) {
          exRate.push({label: item, value: item})
        }
      }
      return exRate
    },
    switchExchange () {
      form.on('select(exchange)', (data) => {
        this.selectedExchangeRate = data.value
        Store.saveChromeStore('exchange', data.value)
        this.setCurrentExchangeRate(data.value)
      })
    },
    switchLang () {
      form.on('select(lang)', (data) => {
        this.$i18n.locale = data.value
        Store.saveChromeStore('lang', data.value)
        this.setSwitchLangTimes()
      })
    },
    switchColor (color) {
      Store.saveChromeStore('skin', color)
      let getHeadColor = color + '-skin'
      this.setHeadColor(getHeadColor)
      let getCustomizeColor = color + '-customize'
      this.setCustomizeColor(getCustomizeColor)
    },
    switchTab () {
      $('.tab-title-2 a').click(function () {
        $('li.tab-title-2').removeClass('layui-this')
        $(this).parent('li').addClass('layui-this')
        const tabIndex = $(this).parent().index('.tab-title-2')
        $('.tab-content-2 .layui-show').removeClass('layui-show')
        $('.tab-content-2 .tab-item').eq(tabIndex).addClass('layui-show')
      })
    },
    randomGenerate () {
      this.seedValue = this.D.test.generateSeed()
    },
    async setSeed () {
      await this.esWallet.setTestSeed(this.seedValue)
      layer.msg(this.$t('message.setting_setting_success'), { icon: 1 })
    }
  }
}
</script>

<style scoped lang="less">
  .color-skin(@color) {
    background:@color;
    border-color:@color;
    color: #fff;
  }
  .site-tree{
    height: 100%;
    .layui-tree{
      width: 170px;
    }
  }
  a.layui-btn {
    color: #fff;
    width: 70px;
  }
  .blue-skin {
    .color-skin(#2d3451);
  }
  .green-skin {
    .color-skin(#2e5c62);
  }
  .black-skin {
    .color-skin(#23262E);
  }
  .gray-skin {
    .color-skin(#424650);
  }
  .layui-form-label {
    font-size: 13px;
  }
  .layui-btn-normal {
    .color-skin(#4898d5);
  }
  .layui-table td, .layui-table th {
    padding: 6px 15px;
    font-size: 13px;
  }
</style>
