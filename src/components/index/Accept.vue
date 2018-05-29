<template>
  <div>
    <blockquote class="site-text layui-elem-quote" style="margin-top: 30px">
      <i class="layui-icon">&#xe645;</i>   Select an account to generate QR code
    </blockquote>
    <div class="site-title" style="margin-top: 20px">
      <fieldset><legend><a name="use">Receive Bitcoins</a></legend></fieldset>
    </div>
    <div class="site-text site-block">
      <form class="layui-form"  lay-filter="form2">
        <div class="layui-form-item">
          <label class="layui-form-label account-label" >Choose an Account</label>
          <div class="layui-input-block">
            <select name="receiveAccount" lay-verify="required" lay-filter="receiveAccount" v-model="selected">
              <option disabled value="">请选择</option>
              <option v-for="account in accountAddress" v-bind:value="account.value">{{account.label}}</option>
            </select>
          </div>
        </div>
        <div class="layui-form-item">
          <div id="code" class="qrcode"></div>
        </div>
        <div class="layui-form-item">
          <div class="address-btn">
            <button class="layui-btn" id="change_address" type="button">&nbsp;Change Address&nbsp;</button>
          </div>
        </div>
        <div class="layui-form-item">
          <div class="description">Please use the mobile phone to scan the QR code in the picture</div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Bus from '../../common/js/bus'
// eslint-disable-next-line
const form = layui.form
export default {
  name: 'accept',
  data () {
    return {
      selected: '',
      accountAddress: [ { label: 'accout 1', value: '2313131352' }, {label: 'accout 2', value: 'https://www.baidu.com'} ]
    }
  },
  mounted () {
    form.render('select', 'form2')
    this.generateQRCode()
    Bus.$on('test', function (msg) {
      console.log(msg)
    })
  },
  methods: {
    generateQRCode () {
      const that = this
      // eslint-disable-next-line
      const accountQrcode = new QRCode('code', {
        text: that.accountAddress[0].value,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        // eslint-disable-next-line
        correctLevel: QRCode.CorrectLevel.H
      })
      form.on('select(receiveAccount)', function (data) {
        accountQrcode.makeCode(data.value)
      })
    }
  }
}
</script>

<style scoped>
.account-label{
  font-size: 13px;
  padding-left: 0;
  width: 150px;
}
</style>
