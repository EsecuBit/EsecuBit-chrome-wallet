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
           <span>13223</span>
          </div>
          <div class="account-msg">
            <span class="layui-badge-dot layui-bg-green"></span>
            <span>余额 ：</span>
            <span>123</span>
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
                <col width="5%">
                <col width="10%">
                <col width="10%">
                <col width="10%">
                <col width="10%">
                <col width="8%">
                <col width="8%">
              </colgroup>
              <thead>
              <tr>
                <th>Id</th>
                <th>CoinType</th>
                <th>Count</th>
                <th>Date</th>
                <th>Direction</th>
                <th>Operation</th>
                <th>Search</th>
              </tr>
              </thead>
              <tbody v-for="table in tablecount" :key="table.id">
                <tr style="height: 39px;overflow-x: hidden">
                  <td>{{table.id}}</td>
                  <td>{{table.coinType}}</td>
                  <td v-bind:class="[table.count<0?active:'']">{{table.count}}</td>
                  <td>{{table.date}}</td>
                  <td>{{table.direction}}</td>
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
          <td>id</td>
          <td>{{description.id}}</td>
        </tr>
        <tr>
          <td>coinType</td>
          <td>{{description.coinType}}</td>
        </tr>
        <tr>
          <td>count</td>
          <td>{{description.count}}</td>
        </tr>
        <tr>
          <td>date</td>
          <td>{{description.date}}</td>
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
  data () {
    return {
      grid_pager: 'grid_pager',
      description: {
        id: '',
        coinType: '',
        count: '',
        date: '',
        direction: ''
      },
      wallet: [
        {
          label: 'bitcoin',
          account: ['account1', 'account2']
        },
        {
          label: 'litcoin',
          account: ['account3', 'account4']
        }
      ],
      gridList: [
        [
          {id: 1, coinType: '1s', count: -100, date: '2018-5-18', direction: 'asdasdgasasddddddddddddddddgksadddddddddddajsdglasgdajhdgajk21154dsadasdsadasdasdasdsad6666'},
          {id: 10, coinType: '1', count: 100, date: '2018-5-18', direction: ''}
        ],
        [
          {id: 2, coinType: 'bitcoin', count: 200, date: '2018-5-18', direction: ''}
        ],
        [
          {id: 3, coinType: 'litcoin', count: 300, date: '2018-5-18', direction: ''}
        ],
        [
          {id: 4, coinType: 'litcoin', count: 400, date: '2018-5-18', direction: ''}
        ]
      ],
      active: 'active-count'
    }
  },
  mounted () {
    this.createTab()
    for (let index of this.gridList.keys()) {
      this.pageList(index)
    }
  },
  methods: {
    changeTableData (id) {
      this.$set(this.gridList, id, [
        {id: 100, coinType: 'litcoin', count: 400, date: '2018-5-18', direction: ''}
      ])
    },
    sendMsg () {
      Bus.$emit('test', '123')
    },
    pageList (i) {
      let total = 12
      let page = 1
      let limit = 10
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
            console.log(that)
            that.changeTableData(i)
          }
        }
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
      this.description.id = table.id
      this.description.coinType = table.coinType
      this.description.count = table.count
      this.description.date = table.date
      this.description.direction = table.direction
      layer.open({
        type: 1,
        title: '详情',
        area: ['600px', '380px'],
        shadeClose: true,
        btn: ['关闭'],
        content: $('.content')
      })
    }
  }
}
</script>

<style scoped>
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
</style>
