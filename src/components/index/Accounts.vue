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
            <span>账户 ：</span>
           <span >{{newAccount[index].info.label}}</span>
          </div>
          <div class="account-msg">
            <span class="layui-badge-dot layui-bg-green"></span>
            <span>余额 ：</span>
            <span >{{newAccount[index].info.balance}}</span>
          </div>
          <div class="account-msg">
            <a title="刷新" href="#" class="refresh-data" @click="refresh">
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
                <col width="10%">
                <col width="8%">
                <col width="12%">
                <col width="6%">
                <col width="8%">
                <col width="8%">
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
                  <td :class="[table.blockNumber<0?active:'']">{{table.blockNumber}}</td>
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
// eslint-disable-next-line
const $ = layui.jquery
// eslint-disable-next-line
const layer = layui.layer
// eslint-disable-next-line
const laypage = layui.laypage
export default {
  name: 'accouts',
  props: ['accountInfo'],
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
      newAccount: [{info: {label: '', balance: 0}}],
      wallet: [
        {
          label: 'bitcoin',
          account: ['account1']
        }
      ],
      gridList: [
        [
          {txId: '', coinType: 'asd', blockNumber: -100, time: 1527665599, direction: 'in'}
        ]
      ],
      totalNum: [],
      active: 'active-count',
      green: 'green-font',
      red: 'red-font',
      test: 0
    }
  },
  watch: {
    accountInfo: {
      handler (newValue, oldValue) {
        this.test++
        console.log(this.test,'this is a test')
        const arr = []
        const accountList = []
        for (let elem of newValue) {
          if (!arr.includes(elem.info.coinType)) {
            arr.push(elem.info.coinType)
            accountList.push({label: elem.info.coinType, account: [elem.info.label]})
          } else {
            for (let val of accountList) {
              if (val.label === elem.info.coinType) {
                val.account.push(elem.info.label)
                break
              }
            }
          }
        }
        // 拼接成理想数据类型
        this.wallet = accountList
        this.newAccount = this.orderArr(newValue)
        let newGridList = []
        let total = []
        let txInfoPromise = this.newAccount.map(item => item.getTxInfos(0, 3))
        Promise.all(txInfoPromise).then(data => {
          for (let value of data) {
            newGridList.push(value[1])
            total.push(value[0])
          }
          this.gridList = newGridList
          this.totalNum = total
          for (let index of this.gridList.keys()) {
            this.pageList(index, total[index])
          }
        })
      }
    }
  },
  mounted () {
    this.createTab()
  },
  methods: {
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
        this.$set(this.gridList, id, data[1])
      })
    },
    createTab () {
      // 初始化第一個tab标签
      $('.tab-title-1:first').addClass('layui-this')
      $('.tab-item:first').addClass('layui-show')
      // 独立各tab操作
      $('.tab-title-1 a').click(function () {
        $('li.tab-title-1').removeClass('layui-this')
        $(this).parent('li').addClass('layui-this')
        let tabIndex = $(this).parent().index('.tab-title-1')
        $('.tab-content-1 .layui-show').removeClass('layui-show')
        $('.tab-content-1 .tab-item').eq(tabIndex).addClass('layui-show')
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
      let date = new Date(time * 1000)
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
</style>
