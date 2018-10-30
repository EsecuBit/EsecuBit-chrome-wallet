<template>
  <div>
    <table class="layui-table" lay-skin="line">
      <colgroup>
        <col width="8%">
        <col width="10%">
        <col width="10%">
        <col width="10%">
        <col width="15%">
        <col width="6%">
      </colgroup>
      <thead>
      <tr>
        <th>tx</th>
        <th>date</th>
        <th>from/to</th>
        <th>amount</th>
        <th>memo</th>
        <th>detail</th>
      </tr>
      </thead>
      <tbody >
      <!-- Determine whether to resend -->
      <tr v-for="item in tableData">
        <td>{{item.tx}}</td>
        <td>{{item.time}}</td>
        <td>{{item.showAddresses}}</td>
        <td>{{item.value}}</td>
        <td>{{item.memo}}</td>
        <td>
          <a title="detail" href="#"  @click="openDetail(item)">
            <i class="layui-icon">&#xe615;</i>
          </a>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="page-wrapper">
      <div class="page-content" id="pagination-2"></div>
      <div class="total-num-wrapper">
        <div class="total-num">
          <span>{{$t('message.accounts_total') + ' ' + total + ' ' + $t('message.accounts_items')}}</span>
        </div>
      </div>
    </div>
    <Detail :detail="detail" v-if="isShowDetail" @changeShowDetail = "changeShowDetail"></Detail>
  </div>
</template>

<script>
import Detail from './Detail'
const laypage = layui.laypage
export default {
  name: 'TransactionsTable',
  components: {
    Detail
  },
  data () {
    return {
      isShowDetail: false,
      detail: {},
      tableData: [
        {
          time: '2018-10-29',
          tx: '797d73caa2e8ffcc76c884bf384538f90',
          showAddresses: 'account',
          value: '60.00',
          memo: '这是一个demo',
          confirmations: '1'
        },
        {
          time: '2018-10-29',
          tx: '797d73caa2e8ffcc76c884bf384538f90',
          showAddresses: 'account',
          value: '60.00',
          memo: '这是一个demo',
          confirmations: '1'
        },
        {
          time: '2018-10-29',
          tx: '797d73caa2e8ffcc76c884bf384538f90',
          showAddresses: 'account',
          value: '60.00',
          memo: 'test',
          confirmations: '1'
        },
        {
          time: '2018-10-29',
          tx: '797d73caa2e8ffcc76c884bf384538f90',
          showAddresses: 'account',
          value: '60.00',
          memo: 'test',
          confirmations: '1'
        },
        {
          time: '2018-10-29',
          tx: '797d73caa2e8ffcc76c884bf384538f90',
          showAddresses: 'account',
          value: '60.00',
          memo: 'test',
          confirmations: '1'
        }
      ],
      limit: 5,
      pageStartIndex: 0,
      pageEndIndex: 5,
      total: 0
    }
  },
  mounted () {
    this.total = 5
    this.pageList()
  },
  methods: {
    openDetail (item) {
      this.isShowDetail = true
      this.detail = item
    },
    changeShowDetail (...data) {
      this.isShowDetail = data[ 0 ]
    },
    pageList () {
      let total = this.total
      let page = 1
      let limit = this.limit
      let that = this
      laypage.render({
        elem: 'pagination-2',
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
            that.changeTableData(limit, page)
          }
        }
      })
    },
    changeTableData (limit, page) {
      // Paging parameter
      // let startItem = limit * (page - 1)
      // let endItem = limit * (page - 1) + limit
      // Pagination
      this.tableData = [
        {
          time: '2018-10-29',
          direction: '',
          showAddresses: 'oxasjkdhkjasdhja',
          value: '12',
          memo: '',
          confirmations: '1'
        },
        {
          time: '2018-10-28',
          direction: '',
          showAddresses: 'oxasjkdhkjasdhja',
          value: '2313',
          memo: '',
          confirmations: '2'
        },
        {
          time: '2018-10-27',
          direction: '',
          showAddresses: 'oxasjkdhkjasdhja',
          value: '1231',
          memo: '',
          confirmations: '3'
        },
        {
          time: '2018-10-26',
          direction: '',
          showAddresses: 'oxasjkdhkjasdhja',
          value: '123',
          memo: '',
          confirmations: '4'
        },
        {
          time: '2018-10-26',
          direction: '',
          showAddresses: 'oxasjkdhkjasdhja',
          value: '1231',
          memo: '',
          confirmations: '5'
        }
      ]
    }
  }
}
</script>

<style scoped lang="less">
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
          background-color: #fff;
          color: #333;
          font-size: 12px;
        }
      }
    }
  }
</style>
