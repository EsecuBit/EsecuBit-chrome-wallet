<template>
  <div>
    <table class="layui-table" lay-skin="line">
      <colgroup>
        <col width="6%">
        <col width="8%">
        <col width="10%">
        <col width="15%">
        <col width="10%">
        <col width="10%">
        <col width="6%">
      </colgroup>
      <thead>
      <tr>
        <th>txId</th>
        <th>status</th>
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
        <td>{{item.txId}}</td>
        <td><span class="form-status" :class="[getStatus(item) === 'waiting'? 'waiting' :'executed']">{{getStatus(item)}}</span></td>
        <td>{{getFormatTime(item.time)}}</td>
        <td>{{getAddressDirection(item)}}</td>
        <td>{{getAmount(item)}}</td>
        <td>{{getMemo(item)}}</td>
        <td>
          <!--<a title="detail" href="#"  @click="openDetail(item)">-->
            <!--<i class="layui-icon layui-icon-form"></i>-->
          <!--</a>-->
          <a title="link" :href="item.link"  target="_blank" >
            <i class="layui-icon layui-icon-search"></i>
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
    <!--<Detail :detail="detail" v-if="isShowDetail" @changeShowDetail = "changeShowDetail"></Detail>-->
  </div>
</template>

<script>
import Detail from './Detail'
import { mapState } from 'vuex'
import utils from '../../../../utils/utils'

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
      tableData: [],
      limit: 5,
      pageStartIndex: 0,
      pageEndIndex: 5,
      total: 0
    }
  },
  watch: {
    eosClassifyTx: {
      handler () {
        this.setTableData()
      }
    }
  },
  computed: {
    ...mapState({
      'eosClassifyTx': 'eosClassifyTx'
    })
  },
  methods: {
    getAddressDirection (item) {
      let formAddress = item.actions.data.from
      let toAddress = item.actions.data.to
      return `${formAddress} --> ${toAddress}`
    },
    getStatus (item) {
      let status = (item.confirmations === this.D.tx.confirmation.waiting && 'waiting') || (item.confirmations === this.D.tx.confirmation.executed && 'executed') || ''
      return status
    },
    getAmount (item) {
      return item.actions.data.quantity
    },
    getFormatTime (time) {
      return utils.getFormatTime(time)
    },
    getMemo (item) {
      return item.actions.data.memo
    },
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
    setTableData () {
      this.tableData = this.eosClassifyTx.transferActionArray.slice(this.pageStartIndex, this.pageEndIndex)
      this.total = this.eosClassifyTx.transferActionArray.length
      console.log(this.tableData, this.total)
      this.pageList()
    },
    changeTableData (limit, page) {
      const startItem = limit * (page - 1)
      const endItem = limit * (page - 1) + limit
      this.tableData = this.eosClassifyTx.transferActionArray.slice(startItem, endItem)
    }
  }
}
</script>

<style scoped lang="less">
  .layui-table td, .layui-table th {
    padding: 9px 5px;
  }
  .layui-icon-form{
    margin-right: 5px;
    font-size: 18px;
  }
  .form-status{
    color: #fff;
    padding: 3px 4px;
    border-radius: 4px;
    font-size: 12px;
    &.waiting{
      background: #f0ad47;
    }
    &.executed{
      background: #43b566;
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
