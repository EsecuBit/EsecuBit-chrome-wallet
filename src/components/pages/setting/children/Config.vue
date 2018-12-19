<template>
  <div>
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
</template>

<script>
import Store from '../../../../common/js/store'
import { mapState } from 'vuex'
const form = layui.form
const layer = layui.layer

export default {
  name: 'Config',
  data () {
    return {
      deviceChecked: '',
      netChecked: '',
      seedValue: ''
    }
  },
  computed: {
    ...mapState({
      'accountList': 'accountList'
    })
  },
  watch: {
    accountList: {
      handler (newValue, oldValue) {
        this.getCurrentSeed()
      }
    }
  },
  mounted () {
    this.init()
    this.getCurrentSeed()
  },
  methods: {
    async init () {
      // Initialize defaults
      if (localStorage) {
        this.deviceChecked = Store.fetch('device') ? Store.fetch('device') : 'soft'
        this.netChecked = Store.fetch('net') ? Store.fetch('net') : 'test'
      } else {
        const device = await Store.setPromise('device')
        const net = await Store.setPromise('net')
        this.deviceChecked = device['device'] ? device['device'] : 'soft'
        this.netChecked = net['net'] ? net['net'] : 'test'
      }
      this.$nextTick(() => {
        form.render('radio', 'form4')
        form.on('radio(net)', data => {
          Store.saveChromeStore('net', data.value)
        })
        form.on('radio(device)', data => {
          Store.saveChromeStore('device', data.value)
        })
      })
    },
    async getCurrentSeed () {
      this.seedValue = await this.esWallet.getTestSeed()
      console.log(this.seedValue, 'this.seedValue')
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
  .layui-btn-normal {
    .color-skin(#4898d5)!important;
  }

</style>
