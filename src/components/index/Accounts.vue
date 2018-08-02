<template>
<div>
  <div class="site-tree">
    <ul class="layui-tree">
      <template v-for="item in wallet">
        <li class="menu-title" v-if="item.label"><h2>{{item.label}}</h2></li>
        <li class="site-tree-noicon tab-title-1" v-for="account in item.account"><a href="#"><cite>{{account}}</cite></a></li>
      </template>
    </ul>
  </div>
  <div class="site-content">
    <div class="tab-content-1" id="tab-content-1">
      <div class="tab-item" v-for="(tablecount, index) in gridList" >
        <div class="account-information">
          <div class="account-msg">
            <div class="max-width-250">
              <span class="layui-badge-dot layui-bg-green"></span>
              <span>{{$t('message.accounts_account')}}</span>
              <span  style="color: #e74c3c" v-if="newAccount.length > 0">{{newAccount[index].label}}</span>
            </div>
            <a title="edit" href="#" class="edit-account max-width-250" @click="editAccount(index)">
              <i class="icon iconfont icon-bianji1 "></i>
            </a>
          </div>
          <div class="account-msg">
            <div class="max-width-400">
              <span class="layui-badge-dot layui-bg-green"></span>
              <span>{{$t('message.accounts_balance')}}</span>
              <span v-if="coinTypeList[index] && newAccount.length > 0">{{formatBalance(newAccount[index].coinType, newAccount[index].balance)}}</span>
              <span v-if="coinTypeList[index]">{{currentDisplayUnit(coinTypeList[index])}}</span>
              <span v-if="newAccount.length > 0 && newAccount[index].balance">
                <span class="exchange-rate">(</span>
                <span class="exchange-rate" v-if="currentExchangeRate && coinTypeList[index] && newAccount[index].balance">{{toExchangeText(coinTypeList[index], newAccount[index].balance)}}</span>
                <span class="exchange-rate">{{currentExchangeRate}}</span>
                <span class="exchange-rate">)</span>
              </span>
            </div>
          </div>
          <a title="refresh" href="#" class="refresh-data max-width-250" @click="refresh">
            <i class="layui-icon layui-icon-refresh-2" :class="loadingClass"></i>
          </a>
        </div>
        <div class="site-title">
          <fieldset>
            <legend><a name="default">{{$t('message.accounts_recent_operations')}}</a></legend>
          </fieldset>
        </div>
        <div class="layui-row">
          <div class="layui-col-xs12 ">
            <table class="layui-table" lay-skin="line"  v-if="tablecount.length > 0">
              <colgroup>
                <col width="15%">
                <col width="30%">
                <col width="10%">
                <col v-if="isEtcType(newAccount[index])" width="10%">
                <col width="10%">
                <col width="6%">
              </colgroup>
              <thead>
              <tr>
                <th>{{$t('message.accounts_table_time')}}</th>
                <th>{{$t('message.accounts_table_address')}}</th>
                <th>{{$t('message.accounts_table_blockNumber')}}</th>
                <th v-if="isEtcType(newAccount[index])" >{{$t('message.accounts_table_fee')}}</th>
                <th>{{$t('message.accounts_confirmations')}}</th>
                <th>{{$t('message.accounts_details')}}</th>
              </tr>
              </thead>
              <tbody v-for="table in tablecount">
                <tr style="height: 39px;overflow-x: hidden">
                  <td>{{getFormatTime(table.time)}}</td>
                  <td>
                    <span :class ="[table.direction === 'in'?green:red]" class="text-opacity">{{toOrForm(table.direction)}}</span>
                    <span style="cursor: text;">{{getTableAddress(table)}}</span>
                  </td>
                  <td :class="[table.value>0?green:red]" >
                    <span>{{tableBlockNumber(table)}}</span>
                    <span v-if="coinTypeList[index]" class="unit-display-2">{{currentDisplayUnit(table.coinType)}}</span>
                  </td>
                  <td v-if="isEtcType(newAccount[index])" >
                    <span>{{weiToGwei(newAccount[index].coinType, table.fee)}}</span>
                    <span v-if="coinTypeList[index]" class="unit-display-2">{{D.unit.eth.GWei}}</span>
                  </td>
                  <td style="padding: 0">
                    <canvas class="canvas" :class="'canvas-'+ index" width="100" height="30" :data-counts="table.confirmations"></canvas>
                  </td>
                  <td>
                    <!--<a title="Details" href="#" @click="getDescription(table, index);">-->
                    <!--<i class="layui-icon">&#xe63c;</i>-->
                    <!--</a>&nbsp;-->
                    <a title="search" :href="table.link" target="_blank">
                      <i class="layui-icon">&#xe615;</i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="page-wrapper">
              <div v-bind:id="grid_pager + index" class="page-content"></div>
              <div class="total-num-wrapper">
                <div class="total-num">
                  <span>{{$t('message.accounts_total') + ' ' + totalNum[index] + ' ' + $t('message.accounts_items')}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="edit-account-wrapper" id="edit-account">
    <p class="description">
      <i class="layui-icon" style="color: #dd4b39;">&#xe702;</i>&nbsp;
      <span>{{$t('message.accounts_enter_username')}}</span>
    </p>
    <form class="layui-form" lay-filter="edit-form">
      <div class="layui-form-item" >
        <label class="layui-form-label" style="width: 130px">{{$t('message.accounts_form_username')}}</label>
        <div class="layui-input-inline" style="width: 350px">
          <input type="text"  :placeholder="$t('message.accounts_form_placeholder')" id="editNameInput" v-model="renameValue" @keyup.enter="submitEven" class="layui-input">
        </div>
      </div>
    </form>
  </div>
  <div class="content" style="display: none">
    <table class="table table-striped">
      <colgroup>
        <col width="20%">
        <col width="80%">
      </colgroup>
      <thead>
      <tr>
        <th>{{$t('message.accounts_name')}}</th>
        <th>{{$t('message.accounts_information')}}</th>
      </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{$t('message.accounts_table_time')}}</td>
          <td>{{description.time}}</td>
        </tr>
        <tr>
          <td>{{$t('message.accounts_table_address')}}</td>
          <td>
            <span :class ="[description.direction === 'in'?green:red]" class="text-opacity">{{description.toOrForm}}</span>
            <span>{{description.address}}</span>
          </td>
        </tr>
        <tr>
          <td>{{$t('message.accounts_table_blockNumber')}}</td>
          <td>{{description.blockNumber}}</td>
        </tr>
        <tr>
          <td>{{$t('message.accounts_confirmations')}}</td>
          <td>{{description.confirmations}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
import Bus from '../../common/js/bus'

const $ = layui.jquery
const layer = layui.layer
const laypage = layui.laypage
export default {
  name: 'accouts',
  props: ['accountInfo', 'currentUnit', 'currentUnitEth', 'currentExchangeRate', 'errorCodeMsg'],
  data () {
    return {
      grid_pager: 'grid_pager',
      description: {
        txId: '',
        coinType: '',
        blockNumber: '',
        time: '',
        direction: ''
      },
      loadingClass: {
        'layui-anim': false,
        'layui-anim-rotate': false,
        'layui-anim-loop': false
      },
      renameValue: '',
      newAccount: [],
      wallet: [
        {
          label: 'bitcoin',
          account: ['account1']
        }
      ],
      gridList: [
        []
      ],
      coinTypeList: [],
      totalNum: [],
      active: 'active-count',
      green: 'green-font',
      red: 'red-font',
      currentIndex: 0,
      limit: 5,
      pageStartIndex: 0,
      pageEndIndex: 5
    }
  },
  watch: {
    accountInfo: {
      handler (newValue, oldValue) {
        let newCoinTypeList = []
        for (let item of newValue) {
          newCoinTypeList.push(item.coinType)
        }
        this.coinTypeList = newCoinTypeList
        this.newAccount = newValue
        let newGridList = []
        let total = []
        let txInfoPromise = this.newAccount.map(item => item.getTxInfos(this.pageStartIndex, this.pageEndIndex))
        Promise.all(txInfoPromise).then(data => {
          for (let value of data) {
            newGridList.push(value.txInfos)
            total.push(value.total)
          }
          this.gridList = newGridList
          this.totalNum = total
          this.$nextTick(() => {
            this.tableCanvas()
            for (let index of this.gridList.keys()) {
              this.pageList(index, total[index])
            }
          })
        }).catch(value => {
          console.warn(value)
          this.displayErrorCode(value)
        })
      }
    },
    newAccount: {
      handler (newValue, oldValue) {
        this.setMenuList(newValue)
      }
    }
  },
  mounted () {
    this.createTab()
    this.listenTXInfo()
  },
  methods: {
    isEtcType (currentAccount) {
      let type = currentAccount.coinType
      return !this.D.isBtc(type)
    },
    displayErrorCode (value) {
      layer.closeAll()
      let errorKey = String(value)
      if (this.errorCodeMsg[errorKey]) {
        layer.msg(this.errorCodeMsg[errorKey], {icon: 2})
      } else {
        layer.msg(errorKey, {icon: 2, anim: 6})
      }
    },
    listenTXInfo () {
      this.esWallet.listenTxInfo((error, txInfo) => {
        if (this.errorCodeMsg[String(error)]) {
          this.displayErrorCode(error)
        }
        let nowIndex = 10
        if (this.newAccount.length === 0) return false
        this.newAccount.forEach((item, index) => {
          if (item.accountId === txInfo.accountId) nowIndex = index
        })
        // 刷新交易记录
        let total = 0
        this.clearCanvas(nowIndex)
        this.newAccount[nowIndex].getTxInfos(this.pageStartIndex, this.pageEndIndex).then(value => {
          this.$set(this.gridList, nowIndex, value.txInfos)
          total = value.total
          this.$nextTick(() => {
            this.tableCanvas(nowIndex)
            this.pageList(nowIndex, total)
          })
        }).catch(value => {
          console.warn(value)
          this.displayErrorCode(value)
        })
      })
    },
    toTwoPoint (num) {
      return Math.round(num * 100) / 100
    },
    toOrForm (value) {
      return value === 'in' ? 'from' : 'to'
    },
    getTableAddress (table) {
      if (table.showAddresses) {
        let address = ''
        if (table.showAddresses.length === 1) {
          address = table.showAddresses[0]
        } else if (table.showAddresses.length > 1) {
          for (let item of table.showAddresses) {
            address += item + '; '
          }
        }
        return address
      }
    },
    formatBalance (coinType, value) {
      return this.toTargetCoinUnit(coinType, value)
    },
    tableBlockNumber (table) {
      let newValue = this.toTargetCoinUnit(table.coinType, table.value)
      return this.toTwoPoint(newValue) + ' '
    },
    currentDisplayUnit (coinType) {
      return this.D.isBtc(coinType) ? this.currentUnit : this.currentUnitEth
    },
    toExchangeText (coinType, value) {
      let newValue = this.toTargetCoinUnit(coinType, value)
      let exchange = this.D.isBtc(coinType) ? this.esWallet.convertValue(coinType, newValue, this.currentUnit, this.currentExchangeRate) : this.esWallet.convertValue(coinType, newValue, this.currentUnitEth, this.currentExchangeRate)
      return this.formatNum(exchange)
    },
    toTargetCoinUnit (coinType, value) {
      return this.D.isBtc(coinType) ? this.esWallet.convertValue(coinType, value, this.D.unit.btc.satoshi, this.currentUnit) : this.esWallet.convertValue(coinType, value, this.D.unit.eth.Wei, this.currentUnitEth)
    },
    tableCanvas (index) {
      let canvasClass = index ? ('canvas-' + index) : 'canvas'
      let canvasList = document.getElementsByClassName(canvasClass)
      for (let canvas of canvasList) {
        let context = canvas.getContext('2d') // 获取画图环境，指明为2d
        let centerX = canvas.width / 2 // Canvas中心点x轴坐标
        let centerY = canvas.height / 2 // Canvas中心点y轴坐标
        let rad = Math.PI * 2 / 100 // 将360度分成100份，那么每一份就是rad度
        let data = parseInt(canvas.getAttribute('data-counts'))
        if (data === -1) {
          context.fillStyle = '#e74c3c'
          context.font = '16px'
          context.fillText('Pending..', centerX - 25, centerY + 4)
        } else {
          let n = (data === 0 && 0) || (data === 1 && 1) || (data === 2 && 2) || (data === 3 && 3) || (data === 4 && 4) || (data === 5 && 5) || (data >= 6 && 6)
          let percentDisplay = n * 100 / 6
          // 绘制灰色外圈
          context.save()
          context.beginPath()
          context.lineWidth = 5// 设置线宽
          context.strokeStyle = '#ddd'
          context.arc(centerX, centerY, 10, 0, Math.PI * 2, false)
          context.stroke()
          // 绘制5像素宽的运动外圈
          context.save()
          context.strokeStyle = '#009688' // 设置描边样式
          context.lineWidth = 5// 设置线宽
          context.beginPath()// 路径开始
          context.arc(centerX, centerY, 10, -Math.PI / 2, -Math.PI / 2 + percentDisplay * rad, false) // 用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
          context.stroke() // 绘制
        }
      }
    },
    clearCanvas (index) {
      let canvasClass = index ? ('canvas-' + index) : 'canvas'
      let canvasList = document.getElementsByClassName(canvasClass)
      for (let canvas of canvasList) {
        let context = canvas.getContext('2d') // 获取画图环境，指明为2d
        let centerX = canvas.width
        let centerY = canvas.height
        context.clearRect(0, 0, centerX, centerY)
      }
    },
    refresh () {
      this.loadingClass['layui-anim'] = true
      this.loadingClass['layui-anim-rotate'] = true
      this.loadingClass['layui-anim-loop'] = true
      setTimeout(() => {
        this.loadingClass['layui-anim'] = false
        this.loadingClass['layui-anim-rotate'] = false
        this.loadingClass['layui-anim-loop'] = false
      }, 3000)
      let index = this.currentIndex
      let total = 0
      this.clearCanvas(index)
      this.newAccount[index].sync(false).then(value => {
        this.newAccount[index].getTxInfos(this.pageStartIndex, this.pageEndIndex).then(value => {
          this.$set(this.gridList, index, value.txInfos)
          total = value.total
          this.$nextTick(() => {
            this.tableCanvas(index)
            this.pageList(index, total)
          })
        })
        layer.msg(this.$t('message.accounts_sync_success'), { icon: 1 })
      }).catch(value => {
        console.warn(value)
        this.displayErrorCode(value)
      })
    },
    setMenuList (targetArray) {
      const arr = []
      const accountList = []
      for (let elem of targetArray) {
        if (!arr.includes(elem.coinType)) {
          arr.push(elem.coinType)
          accountList.push({label: elem.coinType, account: [elem.label]})
        } else {
          for (let val of accountList) {
            if (val.label === elem.coinType) {
              val.account.push(elem.label)
              break
            }
          }
        }
      }
      // 拼接成理想数据类型
      this.wallet = accountList
      this.$nextTick(() => {
        this.switchTab()
      })
    },
    editAccount (orderNum) {
      this.renameValue = ''
      this.currentIndex = orderNum
      const that = this
      layer.open({
        type: 1,
        area: ['530px', '315px'],
        shadeClose: true,
        title: that.$t('message.accounts_layer_title'),
        btn: [that.$t('message.accounts_submit_btn'), that.$t('message.accounts_cancel_btn')],
        content: $('#edit-account'),
        yes (index) {
          that.submitEven()
        }
      })
      document.getElementById('editNameInput').focus()
    },
    submitEven () {
      if (!this.renameValue) {
        layer.msg(this.$t('message.accounts_form_is_empty'), {icon: 5, anim: 6})
        document.getElementById('editNameInput').focus()
        return false
      }
      if (this.newAccount[this.currentIndex].rename) {
        this.newAccount[this.currentIndex].rename(this.renameValue).then(value => {
          this.setMenuList(this.newAccount)
          layer.closeAll('page')
          layer.msg(this.$t('message.accounts_update_msg'), { icon: 1 })
        })
          .catch(value => {
            console.warn(value)
            this.displayErrorCode(value)
          })
      }
    },
    pageList (i, totalCount) {
      let total = totalCount
      let page = 1
      let limit = this.limit
      let that = this
      laypage.render({
        elem: 'grid_pager' + i,
        count: total,
        limit: limit,
        curr: page,
        prev: '<',
        next: '>',
        layout: ['first', 'prev', 'page', 'next', 'last'],
        jump: function (obj, first) {
          // obj包含了当前分页的所有参数，比如：
          // console.log(obj.curr) // 得到当前页，以便向服务端请求对应页的数据。
          // console.log(obj.limit) // 得到每页显示的条数
          // 首次不执行
          if (!first) {
            limit = obj.limit
            page = obj.curr
            that.clearCanvas(i)
            that.changeTableData(i, limit, page)
          }
        }
      })
    },
    changeTableData (id, limit, page) {
      // 分页参数
      const startItem = limit * (page - 1)
      const endItem = limit * (page - 1) + limit
      this.newAccount[id].getTxInfos(startItem, endItem).then(data => {
        this.$set(this.gridList, id, data.txInfos)
        this.$nextTick(() => {
          this.tableCanvas(id)
        })
      }).catch(value => {
        console.warn(value)
        this.displayErrorCode(value)
      })
    },
    createTab () {
      // 初始化第一個tab标签
      $('.tab-title-1:first').addClass('layui-this')
      $('.tab-item:first').addClass('layui-show')
    },
    switchTab () {
      // 独立各tab操作
      $('.tab-title-1 a').click(function () {
        if ($(this).parent('li').hasClass('layui-this')) return false
        $('li.tab-title-1').removeClass('layui-this')
        $(this).parent('li').addClass('layui-this')
        let tabIndex = $(this).parent().index('.tab-title-1')
        $('.tab-content-1 .layui-show').removeClass('layui-show')
        $('.tab-content-1 .tab-item').eq(tabIndex).addClass('layui-show')
        // 切换qrcode
        Bus.$emit('switchAccount', tabIndex)
      })
    },
    getDescription (table, index) {
      this.description.blockNumber = this.tableBlockNumber(this.coinTypeList[index], table.blockNumber)
      this.description.time = this.getFormatTime(table.time)
      this.description.toOrForm = this.toOrForm(table.direction) + ' '
      this.description.address = this.getTableAddress(table)
      this.description.direction = table.direction
      this.description.confirmations = table.confirmations
      const that = this
      layer.open({
        type: 1,
        title: that.$t('message.accounts_details_title'),
        area: ['550px', '340px'],
        shadeClose: true,
        btn: ['close'],
        content: $('.content')
      })
    },
    weiToGwei (coinType, value) {
      return this.esWallet.convertValue(coinType, value, this.D.unit.eth.Wei, this.D.unit.eth.GWei) + '  '
    },
    getFormatTime (time) {
      let date = new Date(time)
      let yyyy = date.getFullYear()
      let moth = date.getMonth() + 1
      let MM = parseInt(moth / 10) ? moth : '0' + moth
      let dd = parseInt(date.getDate() / 10) ? date.getDate() : '0' + date.getDate()
      let HH = parseInt(date.getHours() / 10) ? date.getHours() : '0' + date.getHours()
      let mm = parseInt(date.getMinutes() / 10) ? date.getMinutes() : '0' + date.getMinutes()
      let ss = parseInt(date.getSeconds() / 10) ? date.getSeconds() : '0' + date.getSeconds()
      let arr = []
      arr.push(yyyy)
      arr.push('-')
      arr.push(MM)
      arr.push('-')
      arr.push(dd)
      arr.push(' ')
      arr.push(HH)
      arr.push(':')
      arr.push(mm)
      arr.push(':')
      arr.push(ss)
      return arr.join('')
    },
    formatNum (num) {
      return parseFloat(num).toLocaleString()
    }
  }
}
</script>

<style scoped>
  .site-title {
    margin-top:30px;
  }
  .content {
    font-size: 13px;
    min-height: 100px;
    padding: 15px;
    margin-right: auto;
    margin-left: auto;
  }
  .account-information {
    display: block;
    height: 52px;
    margin-bottom: 15px;
    padding: 18px 15px 16px 15px;
    background-color: #f2f2f2;
    border-radius: 5px;
    border: 1px solid #f0f0f0;
    box-shadow: 1px 4px 8px 0 rgba(0,0,0,0.15);
  }
  .account-msg {
    display: inline-block;
    max-height: 19px;
    margin-right: 30px;

  }
  .max-width-250 {
    display: inline-block;
    max-width: 250px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap;
  }
  .max-width-400 {
    display: inline-block;
    max-width: 400px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap;
  }
  .edit-account{
    margin-left: 10px;
    height: 16px;
  }
  .edit-account :hover{
    color: #009688;
  }
  .refresh-data {
    height: 16px;
  }
  .account-msg .refresh-data:hover {
    color: #009688;
  }
  .layui-badge-dot {
    margin-right: 4px;
  }
  table{
    table-layout:fixed;
  }
  td {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap;
  }
  .content .table {
    width: 100%;
    max-width: 100%;
    margin-bottom: 17px;
    background-color: transparent;
    border-collapse: collapse;
    border-spacing: 0;
    display: table;
  }
  .content thead {
    display: table-header-group;
    vertical-align: middle;
    border-color: inherit;
  }
  tr {
    display: table-row;
    vertical-align: inherit;
    border-color: inherit;
  }
  th {
    font-weight: bold;
    display: table-cell;
    text-align: left;
  }
  .table td {
    box-sizing: border-box;
  }
  .layui-table td, .layui-table th{
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: center;
  }
  .table > thead > tr > th {
    width: 40px;
    border-bottom: 2px solid #f4f4f4;
    vertical-align: bottom;
    padding: 8px;
    line-height: 1.42857143;
  }
  .table > thead:first-child > tr:first-child > th{
    border-top: 0
  }
  tbody {
    display: table-row-group;
    vertical-align: middle;
    border-color: inherit;
  }
  .table-striped > tbody > tr:nth-of-type(odd) {
    background-color: #f9f9f9;
  }
  .table > tbody > tr > td {
    border-top: 1px solid #f4f4f4;
    padding: 8px;
    line-height: 1.42857143;
    vertical-align: top;
    word-break: break-all;
    white-space: pre-wrap;
  }
  .active-count {
    color: #e74c3c;
  }
  .green-font {
    color: #009a61;
  }
  .red-font {
    color: #e74c3c;
  }
  /*编辑账户名*/
  .edit-account-wrapper{
    display: none;
    margin: 30px 12px 10px
  }
  .description {
    text-indent: 2em;
    font-size:16px;
    height: 36px;
    line-height: 36px;
    color: #333;
    background-color: #F8F8F8;
    border-radius: 6px;
    margin: 0 20px 20px;
  }
  .exchange-rate{
    font-size: 12px;
    color:#666;
  }
  .text-opacity {
    opacity: 0.8;
    font-size: 10px;
  }
  canvas{
    vertical-align: middle;
  }
  .page-wrapper{
    display: block;
  }
  .page-content {
    display: inline;
  }
  .total-num-wrapper {
    display: inline;
    font-size: 12px;
    margin-left: 10px;
  }
  .total-num {
    display: inline-block;
    vertical-align: middle;
    margin: 10px 0;
    box-sizing: content-box;
  }
  .total-num span{
    display: inline-block;
    vertical-align: middle;
    height: 28px;
    line-height: 28px;
    margin: 0 -1px 5px 0;
    background-color: #fff;
    color: #333;
    font-size: 12px;
  }
  .layui-tree {
    max-height: 520px;
    overflow-y: hidden;
  }
  .layui-tree:hover {
    max-height: 520px;
    overflow-y: scroll;
  }
  ::-webkit-scrollbar {
    display:none
  }
  .unit-display-2 {
    font-size: .4em;
    opacity: .8;
  }
  .layui-table th {
    padding: 9px 0;
  }

</style>
