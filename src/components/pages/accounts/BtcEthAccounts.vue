<template>
  <div>
    <!-- account information -->
    <div class="account-information">
      <div class="account-msg">
        <div class="max-width-250">
          <span class="layui-badge-dot layui-bg-green"></span>
          <span>{{$t('message.accounts_account')}}</span>
          <span  style="color: #e74c3c" v-if="currentAccount">{{currentAccount.label}}</span>
        </div>
        <a :title="$t('message.icon_title_edit')" href="#" class="edit-account max-width-250" @click="updateAccountName()">
          <i class="icon iconfont icon-bianji1 "></i>
        </a>
      </div>
      <div class="account-msg">
        <div class="max-width-400">
          <span class="layui-badge-dot layui-bg-green"></span>
          <span>{{$t('message.accounts_balance')}}</span>
          <span v-if="currentAccount">{{formatBalance(currentAccountType, currentAccount.balance) + ' ' + currentDisplayUnit(currentAccountType)}}</span>
          <span class="exchange-rate" v-if="currentAccount"
          >{{'( ' + toExchangeText(currentAccountType, currentAccount.balance) + ' ' + currentExchangeRate + ' )'}}</span>
        </div>
      </div>
      <div class="account-msg refresh-icon">
        <a :title="$t('message.icon_title_refresh')" href="#" class="refresh-data max-width-250" @click="refresh">
          <i class="layui-icon layui-icon-refresh layui-anim" :class="loadingClass"></i>
        </a>
      </div>
    </div>

    <h1 class="table-title"><i class="layui-icon layui-icon-table"></i> {{$t('message.accounts_recent_operations')}}</h1>

    <div class="layui-row">
      <div class="layui-col-xs12 ">
        <!-- operation log table -->
        <table class="layui-table" lay-skin="line"  v-if="tableData.length > 0">
          <colgroup>
            <col width="15%">
            <col width="30%">
            <col width="10%">
            <col v-if="isEtcType" width="10%">
            <col width="10%">
            <col width="6%">
          </colgroup>
          <thead>
          <tr>
            <th>{{$t('message.accounts_table_time')}}</th>
            <th>{{$t('message.accounts_table_address')}}</th>
            <th>
              <span>{{$t('message.accounts_table_blockNumber')}}</span>
              <span class="table-unit">
                    {{' ' + currentDisplayUnit(currentAccountType)}}
                  </span>
            </th>
            <th v-if="isEtcType" >{{$t('message.accounts_table_fee')}}</th>
            <th>{{$t('message.accounts_confirmations')}}</th>
            <th>{{$t('message.accounts_details')}}</th>
          </tr>
          </thead>
          <tbody>
          <!-- Determine whether to resend -->
          <tr style="height: 39px;overflow-x: hidden" v-for="(table, trIndex) in tableData"
              @mouseenter="reSendPrompt(table.canResend, table.shouldResend, trIndex)" @mouseleave="clearLayer" :class="'prompt_' + trIndex" >
            <td>{{formatTableTime(table.time)}}</td>
            <td>
              <span :class ="[table.direction === 'in' ? green : red]" class="text-opacity">{{toOrForm(table.direction)}}</span>
              <span style="cursor: text;">{{getTableAddress(table)}}</span>
            </td>

            <td :class="[table.value > 0 ? green : red]" >
              <span>{{getAmountValue(table)}}</span>
            </td>
            <!-- if current coin is etc, it will display transaction fee-->
            <td v-if="isEtcType" >
              <span>{{weiToGwei(currentAccountType, table.fee)}}</span>
              <span v-if="currentAccountType" class="unit-display-2">{{D.unit.eth.GWei}}</span>
            </td>

            <!-- Draw a circular state diagram -->
            <td style="padding: 0">
              <canvas class="canvas" :class="[table.canResend ? 'hoverClass' : '']" :data-canresend='table.canResend' :data-shouldresend="table.shouldResend"
                      width="100" height="30" :data-counts="table.confirmations" @click="sendTransaction(table,  table.canResend)"></canvas>
            </td>
            <td>
              <a title="search" :href="table.link" target="_blank">
                <i class="layui-icon">&#xe615;</i>
              </a>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="page-wrapper">
          <div v-bind:id="grid_pager" class="page-content"></div>
          <div class="total-num-wrapper">
            <div class="total-num">
              <span>{{$t('message.accounts_total') + ' ' + total + ' ' + $t('message.accounts_items')}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="edit-account-wrapper" id="edit-account">
      <p class="description">
        <i class="layui-icon layui-icon-tips" style="color: #dd4b39;"></i>&nbsp;
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
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import utils from '../../../utils/utils'

const $ = layui.jquery
const layer = layui.layer
const laypage = layui.laypage
export default {
  name: 'BtcEthAccounts',
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
        'layui-anim-rotate': false,
        'layui-anim-loop': false
      },
      renameValue: '',
      tableData: [],
      total: 0,
      active: 'active-count',
      green: 'green-font',
      red: 'red-font',
      isShowAgainSendMsg: true,
      limit: 5,
      pageStartIndex: 0,
      pageEndIndex: 5
    }
  },
  computed: {
    ...mapState({
      'accountList': 'accountList',
      'currentUnitBtc': 'currentUnitBtc',
      'currentUnitEth': 'currentUnitEth',
      'currentExchangeRate': 'currentExchangeRate'
    }),
    ...mapGetters({
      'currentAccountType': 'currentAccountType',
      'currentAccount': 'currentAccount'
    }),
    isEtcType () {
      return this.D.isEth(this.currentAccountType)
    }
  },
  watch: {
    currentAccount: {
      handler () {
        this.clearCanvas()
        this.setTableData(this.pageStartIndex, this.pageEndIndex)
      }
    }
  },
  mounted () {
    // Monitor for new transactions
    this.listenTXInfo()
    this.setTableData(this.pageStartIndex, this.pageEndIndex)
  },
  methods: {
    ...mapMutations({
      setPageIndex: 'SET_PAGE_INDEX',
      addRenameTimes: 'ADD_RENAME_TIMES',
      setFillTableTimes: 'SET_FILL_TABLE_TIMES',
      setAutoFillTableData: 'SET_AUTO_FILL_TABLE_DATA',
      setWalletGroup: 'SET_WALLET_GROUP'
    }),
    listenTXInfo () {
      this.esWallet.listenTxInfo((error, txInfo) => {
        let errorCodeMsg = utils.getErrorCodeMsg(this)
        if (errorCodeMsg[ String(error) ]) {
          utils.displayErrorCode(this, error)
        }
        if (!this.currentAccount || this.currentAccount.accountId !== txInfo.accountId) return false
        // Refresh transaction history
        this.clearCanvas()
        // table Repagination
        this.currentAccount.getTxInfos(this.pageStartIndex, this.pageEndIndex).then(value => {
          this.tableData = value.txInfos
          this.total = value.total
          this.$nextTick(() => {
            this.tableCanvas()
            this.pageList(value.total)
          })
        }).catch(value => {
          utils.displayErrorCode(this, value)
        })
      })
    },
    formatTableTime (time) {
      return utils.getFormatTime(time)
    },
    reSendPrompt (canResend, shouldResend, trIndex) {
      let msg = shouldResend ? this.$t('message.accounts_resend_prompt') : this.$t('message.accounts_resend_prompt_1')
      if (canResend) {
        let selector = '.prompt_' + trIndex
        layer.tips(msg, selector, {
          tips: [ 3, '#f0ad47' ],
          area: [ '730px', '38px' ],
          time: 600000
        })
      }
    },
    clearLayer () {
      layer.closeAll('tips')
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
    getAmountValue (table) {
      return this.toTargetCoinUnit(table.coinType, table.value) + ' '
    },
    currentDisplayUnit (coinType) {
      return this.D.isBtc(coinType) ? this.currentUnitBtc : this.currentUnitEth
    },
    toExchangeText (coinType, value) {
      let newValue = this.toTargetCoinUnit(coinType, value)
      let exchange = this.D.isBtc(coinType) ? this.esWallet.convertValue(coinType, newValue, this.currentUnitBtc, this.currentExchangeRate) : this.esWallet.convertValue(coinType, newValue, this.currentUnitEth, this.currentExchangeRate)
      return utils.formatNum(exchange)
    },
    weiToGwei (coinType, value) {
      return this.esWallet.convertValue(coinType, value, this.D.unit.eth.Wei, this.D.unit.eth.GWei) + '  '
    },
    toTargetCoinUnit (coinType, value) {
      return this.D.isBtc(coinType) ? this.esWallet.convertValue(coinType, value, this.D.unit.btc.satoshi, this.currentUnitBtc) : this.esWallet.convertValue(coinType, value, this.D.unit.eth.Wei, this.currentUnitEth)
    },
    tableCanvas () {
      let canvasList = document.getElementsByClassName('canvas')
      for (let canvas of canvasList) {
        let context = canvas.getContext('2d') // Get the drawing environment, indicated as 2d
        let centerX = canvas.width / 2 // Canvas center point x-axis coordinates
        let centerY = canvas.height / 2 // Canvas center point y-axis coordinates
        let rad = Math.PI * 2 / 100 // Divide 360 degrees into 100 copies, then each one is radi
        let data = parseInt(canvas.getAttribute('data-counts'))
        let shouldResend = canvas.getAttribute('data-shouldresend')
        if (shouldResend === 'true') {
          context.fillStyle = '#e74c3c'
          context.font = '18px'
          context.fillText('!', centerX - 5, centerY + 4)
        } else {
          if (data < 0) {
            context.fillStyle = '#e74c3c'
            context.font = '18px'
            let getContent = (data === -1 && 'Pending') || (data === -2 && 'Invalid')
            context.fillText(getContent, centerX - 15, centerY + 4)
          } else {
            let n = (data === 0 && 0) || (data === 1 && 1) || (data === 2 && 2) || (data === 3 && 3) || (data === 4 && 4) || (data === 5 && 5) || (data >= 6 && 6)
            let percentDisplay = n * 100 / 6
            // Draw a gray outer ring
            context.save()
            context.beginPath()
            context.lineWidth = 5// Set line width
            context.strokeStyle = '#ddd'
            context.arc(centerX, centerY, 10, 0, Math.PI * 2, false)
            context.stroke()
            // Draw a 5-pixel wide moving outer ring
            context.save()
            context.strokeStyle = '#009688' // Set the stroke style
            context.lineWidth = 5// Set line width
            context.beginPath()// Path begins
            context.arc(centerX, centerY, 10, -Math.PI / 2, -Math.PI / 2 + percentDisplay * rad, false) // 用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
            context.stroke() // draw
          }
        }
      }
    },
    clearCanvas () {
      let canvasList = document.getElementsByClassName('canvas')
      for (let canvas of canvasList) {
        let context = canvas.getContext('2d')
        let centerX = canvas.width
        let centerY = canvas.height
        context.clearRect(0, 0, centerX, centerY)
      }
    },
    refresh () {
      // refresh Transaction Record
      this.loadingClass[ 'layui-anim-rotate' ] = true
      this.loadingClass[ 'layui-anim-loop' ] = true
      this.clearCanvas()
      this.currentAccount.sync(false).then(value => {
        this.currentAccount.getTxInfos(this.pageStartIndex, this.pageEndIndex).then(value => {
          console.log(value, 'value')
          this.loadingClass[ 'layui-anim-rotate' ] = false
          this.loadingClass[ 'layui-anim-loop' ] = false
          this.tableData = value.txInfos
          this.total = value.total
          this.$nextTick(() => {
            this.tableCanvas()
            this.pageList(value.total)
          })
        })
        layer.msg(this.$t('message.accounts_sync_success'), { icon: 1 })
      }).catch(value => {
        this.loadingClass[ 'layui-anim-rotate' ] = false
        this.loadingClass[ 'layui-anim-loop' ] = false
        utils.displayErrorCode(this, value)
      })
    },
    updateAccountName () {
      this.renameValue = ''
      const that = this
      layer.open({
        type: 1,
        area: [ '530px', '315px' ],
        shadeClose: false,
        title: that.$t('message.accounts_layer_title'),
        btn: [ that.$t('message.accounts_submit_btn'), that.$t('message.accounts_cancel_btn') ],
        content: $('#edit-account'),
        yes (index) {
          // update account name
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
      if (this.currentAccount.rename) {
        this.currentAccount.rename(this.renameValue).then(value => {
          this.addRenameTimes()
          this.setMenuList(this.accountList)
          layer.closeAll('page')
          layer.msg(this.$t('message.accounts_update_msg'), { icon: 1 })
        }).catch(value => {
          utils.displayErrorCode(this, value)
        })
      }
    },
    setMenuList (targetArray) {
      const arr = []
      const newAccountList = []
      targetArray.forEach((currentValue, index) => {
        if (!arr.includes(currentValue.coinType)) {
          arr.push(currentValue.coinType)
          newAccountList.push({label: currentValue.coinType, active: true, children: [{label: currentValue.label, index: index}]})
        } else {
          for (let val of newAccountList) {
            if (val.label === currentValue.coinType) {
              val.children.push({label: currentValue.label, index: index})
              break
            }
          }
        }
      })
      // Stitching into ideal data types
      this.setWalletGroup(newAccountList)
    },
    pageList (total) {
      let page = 1
      let limit = this.limit
      let that = this
      laypage.render({
        elem: that.grid_pager,
        count: total,
        limit: limit,
        curr: page,
        prev: '<',
        next: '>',
        layout: [ 'first', 'prev', 'page', 'next', 'last' ],
        jump: function (obj, first) {
          // obj包含了当前分页的所有参数，比如：
          // console.log(obj.curr) // 得到当前页，以便向服务端请求对应页的数据。
          // console.log(obj.limit) // 得到每页显示的条数
          // 首次不执行
          if (!first) {
            limit = obj.limit
            page = obj.curr
            // clear canvas
            that.clearCanvas()
            // update data
            that.changeTableData(limit, page)
          }
        }
      })
    },
    changeTableData (limit, page) {
      // Paging parameter
      const startItem = limit * (page - 1)
      const endItem = limit * (page - 1) + limit
      // Pagination
      this.currentAccount.getTxInfos(startItem, endItem).then(value => {
        this.total = value.total
        this.tableData = value.txInfos
        this.$nextTick(() => {
          this.tableCanvas()
        })
      }).catch(value => {
        utils.displayErrorCode(this, value)
      })
    },
    setTableData (startItem, endItem) {
      this.currentAccount.getTxInfos(startItem, endItem).then(value => {
        this.total = value.total
        this.tableData = value.txInfos
        this.$nextTick(() => {
          this.tableCanvas()
          this.pageList(value.total)
        })
      }).catch(value => {
        utils.displayErrorCode(this, value)
      })
    },
    closeAgainSendMsg () {
      this.isShowAgainSendMsg = false
    },
    sendTransaction (table, canResend) {
      // jump to send page
      if (canResend) {
        this.setPageIndex(1)
        this.setFillTableTimes()
        this.setAutoFillTableData(table)
      }
    }
  }
}
</script>

<style scoped lang="less">
  @blue:#409eff;
  @font-color: #333;
  @white: #fff;
  @cyan-blue: #009688;
  @red: #e74c3c;
  @green: #009a61;
  .max-width(@width){
    display: inline-block;
    max-width: @width;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap;
  }
  /*rewrite sidebar css*/
  .layui-nav{
    background: #fff;
    color: @font-color;
    .layui-nav-itemed>a{
      color: @font-color;
    }
    .layui-nav-more{
      border-color: @font-color transparent transparent;
    }
    .layui-nav-itemed .layui-nav-more {
      border-color: transparent transparent @font-color!important;
    }
    .layui-nav-item a{
      color: @font-color!important;
    }
  }
  /*account-information*/
  .account-information {
    display: block;
    height: 52px;
    margin-bottom: 15px;
    padding: 18px 15px 16px 15px;
    background-color: #f2f2f2;
    border-radius: 5px;
    border: 1px solid #f0f0f0;
    box-shadow: 1px 4px 8px 0 rgba(0,0,0,0.15);
    .account-msg {
      display: inline-block;
      max-height: 19px;
      margin-right: 30px;
      .exchange-rate{
        font-size: 12px;
        color:#666;
      }
      .layui-badge-dot {
        margin-right: 4px;
      }
      .max-width-250 {
        .max-width(250px);
      }
      .max-width-400 {
        .max-width(400px);
      }
      .edit-account{
        margin-left: 10px;
        height: 16px;
        &:hover{
          color: @cyan-blue;
        }
      }
      .refresh-data {
        height: 16px;
        &:hover{
          color: @cyan-blue;
        }
      }
    }
  }
  /*table*/
  .layui-table{
    table-layout:fixed;
    td,th {
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space:nowrap;
    }
    tr {
      display: table-row;
      vertical-align: inherit;
      border-color: inherit;
    }
    thead {
      font-weight: bold;
    }
  }
  .active-count {
    color: @red;
  }
  .green-font {
    color: @green;
  }
  .red-font {
    color: @red;
  }
  /*Edit account name*/
  .edit-account-wrapper{
    display: none;
    margin: 30px 12px 10px
  }
  .description {
    text-indent: 2em;
    font-size:16px;
    height: 36px;
    line-height: 36px;
    color: @font-color;
    background-color: #f2f2f2;
    border-radius: 6px;
    margin: 0 20px 20px;
  }
  .text-opacity {
    opacity: 0.8;
    font-size: 10px;
  }
  canvas{
    vertical-align: middle;
  }
  /*Pagination*/
  .page-wrapper{
    display: block;
    .page-content {
      display: inline;
    }
    .total-num-wrapper {
      display: inline;
      font-size: 12px;
      margin-left: 10px;
      .total-num {
        display: inline-block;
        vertical-align: middle;
        margin: 10px 0;
        box-sizing: content-box;
        span{
          display: inline-block;
          vertical-align: middle;
          height: 28px;
          line-height: 28px;
          margin: 0 -1px 5px 0;
          background-color: @white;
          color: @font-color;
          font-size: 12px;
        }
      }
    }
  }
  .table-title{
    margin-top: 10px;
    margin-bottom: 5px;
    color: #5e5d5d;
    font-size: 18px;
    font-weight: 300;
    .layui-icon{
      font-size: 20px;
    }
  }
  .unit-display-2 {
    font-size: .4em;
    opacity: .8;
  }
  .layui-table th {
    padding: 9px 0;
  }
  .menu-title {
    text-transform: uppercase;
  }
  .table-unit {
    font-size: 10px;
    font-weight: 400;
    opacity: .8;
  }
  .again-send-msg{
    margin-bottom: 10px;
    position: relative;
    width: 100%;
    background-color: #f8e2c1;
    padding: 10px;
    border: 1px solid #f6d8ab;
    border-radius: 4px;
    color: #8f6c38;
  }
  .again-send-content{
    display: inline-block;
    font-size: 14px;
  }
  .close-msg {
    position: absolute;
    top: 0;
    right: 15px;
    height: 39px;
    line-height: 39px;
    & .layui-icon:hover {
      font-weight: 900;
    }
  }
  .hoverClass:hover {
    cursor: pointer;
    border: 1px solid #f6ae85;
    border-radius: 4px;
  }
  .refresh-icon{
    margin-right: 0;
    .layui-icon{
      font-size: 16px;
      color: #666;
    }
  }
</style>
