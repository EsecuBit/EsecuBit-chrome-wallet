<template>
<div>
  <div class="site-tree">
    <ul class="layui-tree">
      <template v-for="item in wallet">
        <li class="menu-title"><h2>{{item.label}}</h2></li>
        <li class="site-tree-noicon tab-title-1" v-for="accout in item.account"><a href="#"><cite>{{accout}}</cite><em>{{accout}}</em></a></li>
      </template>
    </ul>
  </div>
  <div class="site-content">
    <div class="tab-content-1" id="tab-content-1">
      <div class="tab-item" v-for="(tablecount, index) in gridList">
        <div class="account-information">
          <div class="account-msg">
            <span class="layui-badge-dot layui-bg-green"></span>
            <span>Account ：</span>
           <span style="color: #e74c3c">{{newAccount[index].label}}</span>
            <a title="edit" href="#" class="edit-account" @click="editAccount(index)">
              <i class="layui-icon ">&#xe642;</i>
            </a>
          </div>
          <div class="account-msg">
            <span class="layui-badge-dot layui-bg-green"></span>
            <span>Balance ：</span>
            <span v-if="coinTypeList[index]">{{toTargetCoinUnit(coinTypeList[index], newAccount[index].balance)}}</span>
            <span>{{currentUnit}}</span>
          </div>
          <div class="account-msg">
            <a title="refresh" href="#" class="refresh-data" @click="refresh">
              <i class="layui-icon layui-icon-refresh-2" :class="loadingClass"></i>
            </a>
          </div>
        </div>
        <div class="site-title">
          <fieldset>
            <legend><a name="default">Recent Operations</a></legend>
          </fieldset>
        </div>
        <div class="layui-row">
          <div class="layui-col-xs12 ">
            <table class="layui-table">
              <colgroup>
                <col width="8%">
                <col width="8%">
                <col width="10%">
                <col width="12%">
                <col width="6%">
                <col width="8%">
                <col width="6%">
              </colgroup>
              <thead>
              <tr>
                <th>txId</th>
                <th>coinType</th>
                <th>blockNumber</th>
                <th>time</th>
                <th>direction</th>
                <th>Operation</th>
                <th>Search</th>
              </tr>
              </thead>
              <tbody v-for="table in tablecount" >
                <tr style="height: 39px;overflow-x: hidden">
                  <td>{{table.txId}}</td>
                  <td>{{table.coinType}}</td>
                  <td :class="[table.blockNumber<0?active:'']" v-if="coinTypeList[index]">{{toTargetCoinUnit(coinTypeList[index], table.blockNumber)}}</td>
                  <td>{{getFormatTime(table.time)}}</td>
                  <td :class ="[table.direction === 'in'?green:red]">{{table.direction}}</td>
                  <td>
                    <a title="详情" href="#" @click="getDescription(table); sendMsg()">
                    <i class="layui-icon">&#xe63c;</i> 详情
                    </a>
                  </td>
                  <td>
                    <a title="查询" href="#">
                      <i class="layui-icon">&#xe615;</i> 查询
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-bind:id="grid_pager + index"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="edit-account-wrapper" id="edit-account">
    <p class="description">
      <i class="layui-icon" style="color: #dd4b39;">&#xe702;</i>&nbsp;
      <span>请输入新的用户名！！</span>
    </p>
    <form class="layui-form" lay-filter="edit-form">
      <div class="layui-form-item" >
        <label class="layui-form-label" style="width: 130px">Account Name</label>
        <div class="layui-input-inline" style="width: 350px">
          <input type="text"  placeholder="Enter Yours New Account Name" id="editNameInput" v-model="renameValue" class="layui-input">
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
        <th>Name</th>
        <th>Information</th>
      </tr>
      </thead>
      <tbody>
        <tr>
          <td>txId</td>
          <td>{{description.txId}}</td>
        </tr>
        <tr>
          <td>coinType</td>
          <td>{{description.coinType}}</td>
        </tr>
        <tr>
          <td>blockNumber</td>
          <td>{{description.blockNumber}}</td>
        </tr>
        <tr>
          <td>time</td>
          <td>{{getFormatTime(description.time)}}</td>
        </tr>
        <tr>
          <td>direction</td>
          <td >{{description.direction}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
import Bus from '../../common/js/bus'
import D from '../../common/js/wallet/sdk/D'
import EsWallet from '../../common/js/wallet/sdk/EsWallet'

// eslint-disable-next-line
const $ = layui.jquery
// eslint-disable-next-line
const layer = layui.layer
// eslint-disable-next-line
const laypage = layui.laypage
export default {
  name: 'accouts',
  props: ['accountInfo', 'currentUnit', 'currentExchangeRate'],
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
      newAccount: [{label: '', balance: 0}],
      wallet: [
        {
          label: 'bitcoin',
          account: ['account1']
        }
      ],
      gridList: [
        [
          {txId: '', coinType: '', blockNumber: null, time: null, direction: ''}
        ]
      ],
      coinTypeList: [],
      totalNum: [],
      active: 'active-count',
      green: 'green-font',
      red: 'red-font'
    }
  },
  watch: {
    accountInfo: {
      handler (newValue, oldValue) {
        const a = this.toTargetCoinUnit('bitcoin_test', 32132131, D.UNIT_BTC_SANTOSHI, this.currentUnit)
        console.log(a, 'wadawdadasd')
        let newCoinTypeList = []
        for (let item of newValue) {
          newCoinTypeList.push(item.coinType)
        }
        this.coinTypeList = newCoinTypeList
        this.newAccount = newValue
        let newGridList = []
        let total = []
        let txInfoPromise = this.newAccount.map(item => item.getTxInfos(0, 3))
        Promise.all(txInfoPromise).then(data => {
          for (let value of data) {
            newGridList.push(value.txInfos)
            total.push(value.total)
          }
          this.gridList = newGridList
          this.totalNum = total
          this.$nextTick(() => {
            for (let index of this.gridList.keys()) {
              this.pageList(index, total[index])
            }
          })
        }).catch(value => { console.log(value) })
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
  },
  methods: {
    toTargetCoinUnit (coinType, value) {
      return EsWallet.convertValue(coinType, value, D.UNIT_BTC_SANTOSHI, this.currentUnit)
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
      const that = this
      layer.open({
        type: 1,
        area: ['530px', '315px'],
        shadeClose: true,
        title: 'Edit Account Name',
        btn: ['submit', 'cancel'],
        content: $('#edit-account'),
        yes (index) {
          if (!that.renameValue) {
            layer.msg('必填项不能为空！', {icon: 5, anim: 6})
            document.getElementById('editNameInput').focus()
            return false
          }
          if (that.newAccount[orderNum].rename) {
            that.newAccount[orderNum].rename(that.renameValue).then(value => {
              that.setMenuList(that.newAccount)
              layer.close(index)
              layer.msg('update successfully !!', { icon: 1 })
            })
              .catch(value => { layer.msg('Failed to update !!', { icon: 2 }) })
          }
        }
      })
      document.getElementById('editNameInput').focus()
    },
    sendMsg () {
      Bus.$emit('test', '123')
    },
    pageList (i, totalCount) {
      let total = totalCount
      let page = 1
      let limit = 3
      let that = this
      laypage.render({
        elem: 'grid_pager' + i,
        count: total,
        limit: limit,
        curr: page,
        prev: 'prev',
        next: 'next',
        first: 'first',
        last: 'last',
        layout: ['prev', 'page', 'next', 'count'],
        jump: function (obj, first) {
          // obj包含了当前分页的所有参数，比如：
          // console.log(obj.curr) // 得到当前页，以便向服务端请求对应页的数据。
          // console.log(obj.limit) // 得到每页显示的条数
          // 首次不执行
          if (!first) {
            limit = obj.limit
            page = obj.curr
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
      }).catch(value => { layer.msg('Failed to retrieve data !!', { icon: 2 }) })
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
    getDescription (table) {
      this.description.txId = table.txId
      this.description.coinType = table.coinType
      this.description.blockNumber = table.blockNumber
      this.description.time = table.time
      this.description.direction = table.direction
      layer.open({
        type: 1,
        title: '详情',
        area: ['600px', '380px'],
        shadeClose: true,
        btn: ['关闭'],
        content: $('.content')
      })
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
    padding-left: 15px;
    padding-right: 15px;
  }
  .account-information {
    display: block;
    height: 52px;
    margin-bottom: 15px;
    padding: 15px;
    background-color: #f6f6f6;
    border-radius: 5px;
    border: 1px solid #f0f0f0;
    box-shadow: 1px 4px 8px 0 rgba(0,0,0,0.15);
  }
  .account-msg {
    display: inline-block;
    max-width: 200px;
    max-height: 19px;
    margin-right: 30px;
    overflow: hidden;
    white-space:nowrap;
  }
  .edit-account{
    margin-left: 5px;
  }
  .edit-account :hover{
    color: #009688;
  }
  .account-msg a.refresh-data:hover {
    color: #009688;
  }
  .layui-badge-dot {
    margin-right: 4px;
  }
  table{
    table-layout:fixed;
  }
  td {
    overflow:hidden;
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
    overflow: hidden;
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
</style>
