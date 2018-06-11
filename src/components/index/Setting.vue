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
            <cite>{{$t('message.setting_hardware')}}</cite>
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
              <div class="layui-form-item">
                <label class="layui-form-label">{{$t('message.setting_units')}}</label>
                <div class="layui-input-block" >
                  <input type="radio" lay-filter="unit" name="unit" :value="item.value" :title="item.label" :checked="index === 1" v-for="(item, index) in unitValueList">
                </div>
              </div>
              <div class="layui-form-item">
                <label class="layui-form-label">{{$t('message.setting_exchange_rate')}}</label>
                <div class="layui-input-inline input-width">
                  <select name="exchangeRate" lay-filter="exchange">
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
          <table class="layui-table" lay-skin="line">
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
      </div>
    </div>
  </div>
</template>

<script>
import Bus from '../../common/js/bus'
import D from '../../common/js/wallet/sdk/D'
// eslint-disable-next-line
const form = layui.form
// eslint-disable-next-line
const $ = layui.jquery
const currentLang = navigator.language
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
      unitChecked: '',
      selectedExchangeRate: '',
      unitValueList: [
        {label: 'BTC', value: 'btc'},
        {label: 'mBTC', value: 'mbtc'}
      ],
      initLang: currentLang,
      langList: [
        {label: 'English', value: 'en-US'},
        {label: '简体中文', value: 'zh-CN'}
      ],
      exchangeRate: [
        {label: 'USD', value: 'USD'},
        {label: 'HK', value: 'HK'},
        {label: '软妹币', value: 'RMB'}
      ],
      currentAccount: {},
      coinType: '',
      accountOrder: []
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
        if (this.coinType === D.COIN_BIT_COIN_TEST) {
          this.unitValueList = [
            {label: 'BTC', value: 'btc'},
            {label: 'mBTC', value: 'mbtc'}
          ]
          this.$nextTick(() => {
            form.render('radio', 'form3')
            form.on('radio(unit)', data => {
              this.unitChecked = data.value
              this.$emit('setUnit', data.value)
            })
          })
        } else if (this.coinType === 'lit_test') {
        }
      }
    }
  },
  mounted () {
    Bus.$on('switchAccount', (index) => { this.currentAccount = this.accountOrder[index] })
    form.render('select', 'form3')
    this.switchLang()
    this.switchExchange()
    this.switchTab()
  },
  methods: {
    switchExchange () {
      form.on('select(exchange)', (data) => {
        this.selectedExchangeRate = data.value
        this.$emit('setExchangeRate', data.value)
      })
    },
    switchLang () {
      form.on('select(lang)', (data) => {
        this.$i18n.locale = data.value
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
</style>
