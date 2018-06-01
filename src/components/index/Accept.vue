<template>
  <div>
    <blockquote class="site-text layui-elem-quote" style="margin-top: 20px">
      <i class="layui-icon">&#xe645;</i>   Please use the mobile phone to scan the QR code in the picture
    </blockquote>
    <div class="site-title" style="margin-top: 20px">
      <fieldset><legend><a name="use">Receive Coin</a></legend></fieldset>
    </div>
    <div class="site-text site-block">
      <form class="layui-form"  lay-filter="form2">
        <div class="layui-form-item">
          <label class="layui-form-label account-label" >Current Account :</label>
          <div class="layui-input-block account-info">
            <div class="account-msg">{{accountName}}</div>
          </div>
        </div>
        <div class="layui-form-item" v-if="isSelect">
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
        <!--<div class="layui-form-item">-->
          <!--<div class="address-btn">-->
            <!--<button class="layui-btn" id="change_address" type="button">&nbsp;Change Address&nbsp;</button>-->
          <!--</div>-->
        <!--</div>-->
        <div class="layui-form-item">
          <div class="description">{{"QR code Address :" + "  " + qrAddress}}</div>
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
  props: ['accountInfo'],
  data () {
    return {
      selected: '',
      isSelect: false,
      qrAddress: null,
      accountIndex: 0,
      accountOrder: [],
      accountName: null,
      accountAddress: [ { label: 'accout 1', value: '2313131352' }, {label: 'accout 2', value: 'https://www.baidu.com'} ]
    }
  },
  watch: {
    accountInfo: {
      handler (newValue, oldValue) {
        this.accountOrder = this.orderArr(newValue)
        this.accountName = this.accountOrder[0].info.label
        this.accountOrder[0].getAddress().then(value => {
          this.generateQRCode(value.qrAddress)
          this.qrAddress = value.address
        })
      }
    },
    accountIndex: {
      handler (newValue, oldValue) {
        this.accountName = this.accountOrder[newValue].info.label
        this.accountOrder[newValue].getAddress().then(value => {
          this.generateQRCode(value.qrAddress)
          this.qrAddress = value.address
        })
      }
    }
  },
  mounted () {
    form.render('select', 'form2')
    Bus.$on('switchAccount', function (index) {
      this.accountIndex = index
    })
    Bus.$on('test', function (msg) {
      console.log(msg)
    })
  },
  methods: {
    generateQRCode (address) {
      // eslint-disable-next-line
      const accountQrcode = new QRCode('code', {
        text: address,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        // eslint-disable-next-line
        correctLevel: QRCode.CorrectLevel.H
      })
      // form.on('select(receiveAccount)', function (data) {
      //   accountQrcode.makeCode(data.value)
      // })
    },
    orderArr (targetArr) {
      const arr = []
      const accountList = []
      for (let val of targetArr) {
        if (!arr.includes(val.info.coinType)) {
          arr.push(val.info.coinType)
          accountList.push({type: val.info.coinType, list: [val]})
        } else {
          for (let item of accountList) {
            if (item.type === val.info.coinType) {
              item.list.push(val)
              break
            }
          }
        }
      }
      let a = []
      for (let val of accountList) {
        a = a.concat(val.list)
      }
      return a
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
  .account-msg {
    display: inline-block;
    height: 38px;
    line-height: 38px;
    color: #e74c3c;
    font-weight: 600;
  }
  /*自定义的qrcode*/
  .qrcode{
    display: block;
    width: 210px;
    height: 210px;
    margin: 20px auto 10px;

  }
  .address-btn {
    margin: 0 auto;
    text-align: center ;

  }
  .description{
    padding: 9px 0!important;
    margin: 0 auto;
    display: block;
    line-height: 20px;
    color: #999!important;
    text-align: center ;
  }
</style>
