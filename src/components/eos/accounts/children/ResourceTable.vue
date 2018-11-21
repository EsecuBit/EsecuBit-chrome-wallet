<template>
  <div>
    <table class="layui-table" lay-skin="line">
      <colgroup>
        <col width="6%">
        <col width="10%">
        <col width="15%">
        <col width="10%">
        <col width="30%">
        <col width="6%">
      </colgroup>
      <thead>
      <tr>
        <th>txId</th>
        <th>status</th>
        <th>time</th>
        <th>type</th>
        <th>description</th>
        <th>detail</th>
      </tr>
      </thead>
      <tbody >
      <!-- Determine whether to resend -->
      <tr v-for="item in tableData">
        <td>{{item.txId}}</td>
        <td><span class="form-status" :class="[getStatus(item) === 'waiting'? 'waiting' :'executed']">{{getStatus(item)}}</span></td>
        <td>{{getFormatTime(item.time)}}</td>
        <td><span class="form-type">{{getType(item)}}</span></td>
        <td style="text-overflow: clip;white-space: normal;">
          <span></span>
          <span>{{getDescription(item)}}</span>
          <span></span>
        </td>
        <td>
          <a title="link" :href="item.link"  target="_blank" >
            <i class="layui-icon layui-icon-search"></i>
          </a>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="page-wrapper">
      <div class="page-content" id="pagination"></div>
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
  computed: {
    ...mapState({
      'eosClassifyTx': 'eosClassifyTx'
    })
  },
  watch: {
    eosClassifyTx: {
      handler () {
        this.setTableData()
      }
    }
  },
  methods: {
    getDescription (item) {
      console.log(item)
      if (item.actions.name === 'delegatebw') {
        return `${item.actions.data.from} delegated  ${item.actions.data.stake_cpu_quantity} in CPU and
        ${item.actions.data.stake_net_quantity} in Net for ${item.actions.data.receiver}`
      } else if (item.actions.name === 'undelegatebw') {
        return `${item.actions.data.from} undelegated ${item.actions.data.unstake_cpu_quantity} in CPU and
        ${item.actions.data.unstake_net_quantity} in Net for ${item.actions.data.receiver}`
      } else if (item.actions.name === 'buyram') {
        return `${item.actions.data.payer} bought ${item.actions.data.quant} ram for ${item.actions.data.receiver}`
      } else if (item.actions.name === 'sellrambytes' || item.actions.name === 'sellram') {
        return `${item.actions.data.account} sold ${item.actions.data.bytes} bytes ram `
      }
    },
    getType (item) {
      return item.actions.name
    },
    getStatus (item) {
      let status = (item.confirmations === this.D.tx.confirmation.waiting && 'waiting') || (item.confirmations === this.D.tx.confirmation.executed && 'executed') || ''
      return status
    },
    getFormatTime (time) {
      return utils.getFormatTime(time)
    },
    openDetail (item) {
      this.isShowDetail = true
      this.detail = item
    },
    changeShowDetail (...data) {
      this.isShowDetail = data[0]
    },
    pageList () {
      let total = this.total
      let page = 1
      let limit = this.limit
      let that = this
      laypage.render({
        elem: 'pagination',
        count: total,
        limit: limit,
        curr: page,
        prev: '<',
        next: '>',
        layout: ['first', 'prev', 'page', 'next', 'last'],
        jump: function (obj, first) {
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
      this.tableData = this.eosClassifyTx.resourceActionArray.slice(this.pageStartIndex, this.pageEndIndex)
      this.total = this.eosClassifyTx.resourceActionArray.length
      console.log(this.tableData, this.total)
      this.pageList()
    },
    changeTableData (limit, page) {
      const startItem = limit * (page - 1)
      const endItem = limit * (page - 1) + limit
      this.tableData = this.eosClassifyTx.resourceActionArray.slice(startItem, endItem)
    }
  }
}
</script>

<style scoped lang="less">
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
