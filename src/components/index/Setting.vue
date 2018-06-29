<template>
  <div>
    <div class="site-tree">
      <ul class="layui-tree ">
        <li><h2>{{$t('message.app_setting')}}</h2></li>
        <li class="tab-title-2 layui-this">
          <a href="#">
            <i class="layui-icon" style="top: 3px;">&#xe632;</i>
            <cite>{{$t('message.setting_display')}}</cite>
            </a>
        </li>
        <li class="tab-title-2">
          <a href="#">
            <i class="layui-icon" style="top: 3px;">&#xe628;</i>
            <cite>{{$t('message.setting_information')}}</cite>
          </a>
        </li>
        <li class="tab-title-2">
          <a href="#">
            <i class="layui-icon" style="top: 3px;">&#xe857;</i>
            <cite>{{$t('message.setting_seed')}}</cite>
          </a>
        </li>
      </ul>
    </div>
    <div class="site-content">
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
              <div class="layui-form-item" v-show="isBitcoin">
                <label class="layui-form-label">{{$t('message.setting_units')}}</label>
                <div class="layui-input-block" >
                  <input type="radio" lay-filter="bitUnit" name="bitUnit" :value="item.value" :title="item.label" :checked="item.value === unitBitChecked" v-for="item in bitUnitValueList">
                </div>
              </div>
              <div class="layui-form-item" v-show="!isBitcoin">
                <label class="layui-form-label">{{$t('message.setting_units')}}</label>
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
                    <a href="#" class="layui-btn layui-btn-sm" v-bind:class="[item.colorClass]" @click="switchColor(item.name)" v-for="item in skinColor">{{item.name}}</a>
                </div>
              </div>
            </form>
          </div>
        </div>
        <!--硬件信息-->
        <div class="tab-item">
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
            <tbody v-for="item in hardwareList">
              <tr>
                <td>{{item.name}}</td>
                <td>{{item.value}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--设置种子-->
        <div class="tab-item">
          <div class="site-text site-block">
            <form class="layui-form" lay-filter="seed">
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
import Bus from '../../common/js/bus'
import Store from '../../common/js/store'
// eslint-disable-next-line
const form = layui.form
// eslint-disable-next-line
const $ = layui.jquery
// eslint-disable-next-line
const layer = layui.layer
export default {
  name: 'Setting',
  props: ['walletInfo', 'accountInfo'],
  data () {
    return {
      hardwareList: [
        {name: '', value: ''}
      ],
      skinColor: [
        {name: 'black', colorClass: 'black-skin'},
        {name: 'gray', colorClass: 'gray-skin'},
        {name: 'blue', colorClass: 'blue-skin'},
        {name: 'red', colorClass: 'red-skin'}
      ],
      unitBitChecked: '',
      unitEthChecked: '',
      selectedExchangeRate: '',
      bitUnitValueList: [
        {label: 'BTC', value: 'btc'},
        {label: 'mBTC', value: 'mbtc'}
      ],
      ethUnitValueList: [
        {label: 'BTC', value: 'btc'},
        {label: 'mBTC', value: 'mbtc'}
      ],
      initLang: null,
      langList: [
        {label: 'English', value: 'en-US'},
        {label: '简体中文', value: 'zh-CN'}
      ],
      exchangeRate: null,
      currentAccount: {},
      coinType: '',
      isBitcoin: true,
      isBitFirst: true,
      isEthFirst: true,
      accountOrder: [],
      seedValue: ''
    }
  },
  watch: {
    walletInfo: {
      handler (newValue, oldValue) {
        this.hardwareList = newValue
      },
      deep: true
    },
    accountInfo: {
      handler (newValue, oldValue) {
        this.accountOrder = newValue
        this.currentAccount = this.accountOrder[0]
      }
    },
    currentAccount: {
      handler (newValue, oldValue) {
        this.coinType = newValue.coinType
        if (this.D.isBtc(this.coinType)) {
          this.isBitcoin = true
          if (!this.isBitFirst) return false
          this.bitUnitValueList = [
            {label: 'BTC', value: this.D.unit.btc.BTC},
            {label: 'mBTC', value: this.D.unit.btc.mBTC},
            {label: 'santoshi', value: this.D.unit.btc.santoshi}
          ]
          this.$nextTick(() => {
            form.render('radio', 'form3')
            form.on('radio(bitUnit)', data => {
              // Store.save('bitUnit', data.value)
              Store.saveChromeStore('bitUnit', data.value)
              this.$emit('setBitUnit', data.value)
            })
          })
          this.isBitFirst = false
        } else if (this.D.isEth(this.coinType)) {
          this.isBitcoin = false
          if (!this.isEthFirst) return false
          this.ethUnitValueList = [
            {label: 'ETH', value: this.D.unit.eth.ETH},
            {label: 'GWei', value: this.D.unit.eth.GWei},
            {label: 'Wei', value: this.D.unit.eth.Wei}
          ]
          this.$nextTick(() => {
            form.render('radio', 'form3')
            form.on('radio(ethUnit)', data => {
              // Store.save('ethUnit', data.value)
              Store.saveChromeStore('ethUnit', data.value)
              this.$emit('setEthUnit', data.value)
            })
          })
          this.isEthFirst = false
        }
      }
    }
  },
  mounted () {
    this.init()
    Bus.$on('switchAccount', (index) => { this.currentAccount = this.accountOrder[index] })
    this.switchLang()
    this.switchExchange()
    this.switchTab()
  },
  methods: {
    async init () {
      // 初始化默认值
      const getExchangeList = this.D.suppertedLegals()
      this.exchangeRate = this.editExchangeList(getExchangeList)
      if (localStorage) {
        this.initLang = Store.fetch('lang') ? Store.fetch('lang') : navigator.language
        this.unitBitChecked = Store.fetch('bitUnit') ? Store.fetch('bitUnit') : this.D.unit.btc.mBTC
        this.unitEthChecked = Store.fetch('ethUnit') ? Store.fetch('ethUnit') : this.D.unit.eth.GWei
        this.selectedExchangeRate = Store.fetch('exchange') ? Store.fetch('exchange') : this.D.unit.legal.USD
        if (Store.fetch('seedValue')) this.seedValue = Store.fetch('seedValue')
      } else {
        const lang = await Store.setPromise('lang')
        const bitUnit = await Store.setPromise('bitUnit')
        const ethUnit = await Store.setPromise('ethUnit')
        const exchange = await Store.setPromise('exchange')
        const seedValue = await Store.setPromise('seedValue')
        this.initLang = lang['lang'] ? lang['lang'] : navigator.language
        this.unitBitChecked = bitUnit['bitUnit'] ? bitUnit['bitUnit'] : this.D.unit.btc.mBTC
        this.unitEthChecked = ethUnit['ethUnit'] ? ethUnit['ethUnit'] : this.D.unit.eth.GWei
        this.selectedExchangeRate = exchange['exchange'] ? exchange['exchange'] : this.D.unit.legal.USD
        this.seedValue = seedValue['seedValue'] ? seedValue['seedValue'] : ''
      }
      this.$nextTick(() => {
        form.render('select', 'form3')
      })
    },
    editExchangeList (arry) {
      let exRate = []
      if (Array.isArray(arry) && arry.length > 0) {
        for (let item of arry) {
          exRate.push({label: item, value: item})
        }
      }
      return exRate
    },
    switchExchange () {
      form.on('select(exchange)', (data) => {
        this.selectedExchangeRate = data.value
        Store.saveChromeStore('exchange', data.value)
        // Store.save('exchange', data.value)
        this.$emit('setExchangeRate', data.value)
      })
    },
    switchLang () {
      form.on('select(lang)', (data) => {
        this.$i18n.locale = data.value
        Store.saveChromeStore('lang', data.value)
        // Store.save('lang', data.value)
        this.$emit('switchSetting', this.$t('message.app_setting'))
      })
    },
    switchColor (color) {
      this.$emit('settingColor', color)
    },
    switchTab () {
      // 独立各tab操作
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
    setSeed () {
      Store.saveChromeStore('seedValue', this.seedValue)
      // Store.save('seedValue', this.seedValue)
      this.D.test.txSeed = this.seedValue
      this.D.test.txWalletId = this.seedValue
      layer.msg(this.$t('message.setting_setting_success'), { icon: 1 })
    }
  }
}
</script>

<style scoped>
  a.layui-btn {
    color: #fff;
    width: 70px;
  }
  .blue-skin {
    background:#2d668c;
    border-color:#2d668c;
    color: #fff;
  }
  .red-skin {
    background:#dd4b39;
    border-color:#dd4b39;
    color: #fff;
  }
  .black-skin {
    background:#23262E;
    border-color:#23262E;
    color: #fff;
  }
  .gray-skin {
    background:#4b505d;
    border-color:#4b505d;
    color: #fff;
  }
  .layui-form-label {
    font-size: 13px;
  }
  .layui-btn-normal {
    background:#4898d5;
    border-color:#4898d5;
    color: #fff;
  }
</style>
