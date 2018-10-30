<template>
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
</template>

<script>
import Store from '../../../../common/js/store'
import { mapMutations } from 'vuex'

const form = layui.form
export default{
  name: 'Interface',
  data () {
    return {
      unitBitChecked: '',
      unitEthChecked: '',
      selectedExchangeRate: '',
      bitUnitValueList: [],
      ethUnitValueList: [],
      initLang: null,
      langList: [
        { label: 'English', value: 'en-US' },
        { label: '简体中文', value: 'zh-CN' }
      ],
      exchangeRate: null,
      seedValue: '',
      netChecked: '',
      currentNet: ''
    }
  },
  computed: {
    skinColor () {
      return [
        { name: this.$t('message.setting_black'), colorClass: 'black-skin', id: 'black' },
        { name: this.$t('message.setting_dark_blue'), colorClass: 'blue-skin', id: 'blue' },
        { name: this.$t('message.setting_green'), colorClass: 'green-skin', id: 'green' },
        { name: this.$t('message.setting_gray'), colorClass: 'gray-skin', id: 'gray' }
      ]
    }
  },
  mounted () {
    this.init()
    this.switchLang()
    this.switchExchange()
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
        { label: this.D.unit.btc.BTC, value: this.D.unit.btc.BTC },
        { label: this.D.unit.btc.mBTC, value: this.D.unit.btc.mBTC },
        { label: this.D.unit.btc.satoshi, value: this.D.unit.btc.satoshi }
      ]
      this.ethUnitValueList = [
        { label: this.D.unit.eth.ETH, value: this.D.unit.eth.ETH },
        { label: this.D.unit.eth.GWei, value: this.D.unit.eth.GWei },
        { label: this.D.unit.eth.Wei, value: this.D.unit.eth.Wei }
      ]
      this.$nextTick(() => {
        form.render('select', 'form3')
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
    async init () {
      // Initialize defaults
      const getExchangeList = this.D.suppertedLegals()
      this.exchangeRate = this.editExchangeList(getExchangeList)
      if (localStorage) {
        this.initLang = Store.fetch('lang') ? Store.fetch('lang') : navigator.language
        this.unitBitChecked = Store.fetch('bitUnit') ? Store.fetch('bitUnit') : this.D.unit.btc.BTC
        this.unitEthChecked = Store.fetch('ethUnit') ? Store.fetch('ethUnit') : this.D.unit.eth.ETH
        this.selectedExchangeRate = Store.fetch('exchange') ? Store.fetch('exchange') : this.D.unit.legal.USD
      } else {
        const lang = await Store.setPromise('lang')
        const bitUnit = await Store.setPromise('bitUnit')
        const ethUnit = await Store.setPromise('ethUnit')
        const exchange = await Store.setPromise('exchange')
        this.initLang = lang[ 'lang' ] ? lang[ 'lang' ] : navigator.language
        this.unitBitChecked = bitUnit[ 'bitUnit' ] ? bitUnit[ 'bitUnit' ] : this.D.unit.btc.BTC
        this.unitEthChecked = ethUnit[ 'ethUnit' ] ? ethUnit[ 'ethUnit' ] : this.D.unit.eth.ETH
        this.selectedExchangeRate = exchange[ 'exchange' ] ? exchange[ 'exchange' ] : this.D.unit.legal.USD
      }
      this.initUnitsForm()
    },
    editExchangeList (arr) {
      let exRate = []
      if (Array.isArray(arr) && arr.length > 0) {
        for (let item of arr) {
          exRate.push({ label: item, value: item })
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
</style>
