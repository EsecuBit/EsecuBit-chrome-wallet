<template>
  <div>
    <div class="account-information-wrapper">
      <div class="account-information">
        <div class="account-msg">
          <div class="max-width-250">
            <span class="layui-badge-dot layui-bg-green"></span>
            <span>{{$t('message.accounts_account')}}</span>
            <span  style="color: #e74c3c" v-if="currentAccount">{{currentAccount.label}}</span>
          </div>
        </div>
        <div class="account-msg">
          <div class="max-width-400">
            <span class="layui-badge-dot layui-bg-green"></span>
            <span>{{$t('message.accounts_balance')}}</span>
            <span >{{accountBalance}}</span>
            <span>
            <span class="exchange-rate">{{displayExchangeRate}}</span>
          </span>
          </div>
        </div>
        <div class="account-msg">
          <div class="max-width-250">
            <span class="layui-badge-dot layui-bg-green"></span>
            <span>EOS Staked: </span>
            <span style="color: #e74c3c">200.2 EOS</span>
          </div>
        </div>
        <a :title="$t('message.icon_title_refresh')" href="#" class="refresh-data max-width-250" @click="refresh">
          <i class="layui-icon layui-icon-refresh-2 layui-anim " :class="loadingClass"></i>
        </a>
      </div>

      <div class="resource-list-wrapper">
        <div class="resource-item">
          <div class="resource-item-circle">
            <Progress :percent="percent.RAM" class="progress"></Progress>
          </div>
          <div class="resource-item-description-wrapper">
            <div class="resource-item-description">
              <div class="resource-item-title">RAM</div>
              <div class="resource-item-content">3.98 KiB/5.34 KiB</div>
            </div>
          </div>
        </div>
        <div class="resource-item">
          <div class="resource-item-circle">
            <Progress :percent="percent.CPU"></Progress>
          </div>
          <div class="resource-item-description-wrapper">
            <div class="resource-item-description">
              <div class="resource-item-title">CPU</div>
              <div class="resource-item-content">3.98 KiB/5.34 KiB</div>
            </div>
          </div>
        </div>
        <div class="resource-item">
          <div class="resource-item-circle">
            <Progress :percent="percent.NET"></Progress>
          </div>
          <div class="resource-item-description-wrapper">
            <div class="resource-item-description">
              <div class="resource-item-title">NET</div>
              <div class="resource-item-content">3.98 KiB/5.34 KiB</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h1 class="table-title"><i class="layui-icon">&#xe62d;</i> Account Transactions</h1>

    <div class="layui-row">
      <div class="layui-col-xs12 ">
        <div class="layui-tab layui-tab-brief">
          <ul class="layui-tab-title">
            <li class="layui-this">All transaction</li>
            <li>Token Transfers</li>
          </ul>
          <div class="layui-tab-content">
            <div class="layui-tab-item layui-show">
              <TransactionsTable></TransactionsTable>
            </div>
            <div class="layui-tab-item">
              <TokenTransfers></TokenTransfers>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Progress from './progress/Progress'
import TransactionsTable from './children/TransactionsTable'
import TokenTransfers from './children/TokenTransfers'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'EosAccounts',
  components: {
    Progress,
    TransactionsTable,
    TokenTransfers
  },
  computed: {
    ...mapState({
      'currentExchangeRate': 'currentExchangeRate'
    }),
    ...mapGetters({
      'currentAccount': 'currentAccount'
    }),
    accountBalance () {
      return this.currentAccount ? this.currentAccount.balance + ' EOS' : ''
    },
    displayExchangeRate () {
      return this.currentExchangeRate ? `(100 ${this.currentExchangeRate})` : ''
    }
  },
  data () {
    return {
      loadingClass: {
        'layui-anim-rotate': false,
        'layui-anim-loop': false
      },
      percent: {
        RAM: 0.45,
        CPU: 0.23,
        NET: 0.87
      },
      tableData: [
        {time: '2018-10-29', direction: '', showAddresses: 'oxasjkdhkjasdhja', value: '12', memo: '这是一个demo', confirmations: '1'},
        {time: '2018-10-28', direction: '', showAddresses: 'oxasjkdhkjasdhja', value: '2313', memo: '这是一个demo', confirmations: '2'},
        {time: '2018-10-27', direction: '', showAddresses: 'oxasjkdhkjasdhja', value: '1231', memo: '这是一个demo', confirmations: '3'},
        {time: '2018-10-26', direction: '', showAddresses: 'oxasjkdhkjasdhja', value: '123', memo: '这是一个demo', confirmations: '4'},
        {time: '2018-10-26', direction: '', showAddresses: 'oxasjkdhkjasdhja', value: '1231', memo: '这是一个demo', confirmations: '5'}
      ],
      limit: 5,
      pageStartIndex: 0,
      pageEndIndex: 5,
      total: 0
    }
  },
  methods: {
    refresh () {
      this.loadingClass['layui-anim-rotate'] = true
      this.loadingClass['layui-anim-loop'] = true
      setTimeout(() => {
        this.loadingClass['layui-anim-rotate'] = false
        this.loadingClass['layui-anim-loop'] = false
      }, 2000)
    }
  }
}
</script>

<style scoped lang="less">
  .max-width(@width){
    display: inline-block;
    max-width: @width;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap;
  }
  .account-information-wrapper{
    border-radius: 15px;
    border: 1px solid #f0f0f0;
    box-shadow: 3px 5px 20px 0 #e2e2e2;
    padding: 5px 10px;
    margin-bottom: 20px;
    /*account-information*/
    .account-information {
      display: block;
      height: 52px;
      padding: 18px 15px 16px 15px;
      border-radius: 5px;
      .account-msg {
        display: inline-block;
        max-height: 19px;
        margin-right: 20px;
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
            color: #009688;
          }
        }
        .refresh-data {
          height: 16px;
          &:hover{
            color: #009688;
          }
        }
      }
    }

    /*resource*/
    .resource-list-wrapper{
      display: flex;
      align-items: center;
      .resource-item{
        display: flex;
        flex: 1;
        height: 80px;
        .resource-item-circle{
          display: flex;
          align-items: center;
        }
        .resource-item-description-wrapper{
          display: flex;
          flex: 1;
          padding-left: 15px;
          align-items: center;
          .resource-item-description{
            display: block;
            height: 60px;
            width: 100%;
            .resource-item-title{
              display: block;
              font-weight: lighter;
              font-size: 20px;
              letter-spacing: 1px;
            }
            .resource-item-content{
              display: block;
              margin-top: 10px;
              font-size: 14px;
              color: #777;
            }
          }
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
  .layui-tab{
    margin: 0;
  }

</style>
