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
            <span>CPU Staked: </span>
            <span style="color: #e74c3c" v-if="currentAccount">{{currentAccount.resources.stake.total.cpu}}</span>
          </div>
        </div>
        <div class="account-msg">
          <div class="max-width-250">
            <span class="layui-badge-dot layui-bg-green"></span>
            <span>NET Staked: </span>
            <span style="color: #e74c3c" v-if="currentAccount">{{currentAccount.resources.stake.total.net}}</span>
          </div>
        </div>
        <a :title="$t('message.icon_title_refresh')" href="#" class="refresh-data max-width-250" @click="refresh">
          <i class="layui-icon layui-icon-refresh-1 layui-anim " :class="loadingClass"></i>
        </a>
      </div>

      <div class="resource-list-wrapper">
        <div class="resource-item">
          <div class="resource-item-circle">
            <Progress :percent="percentRAM" class="progress"></Progress>
          </div>
          <div class="resource-item-description-wrapper">
            <div class="resource-item-description">
              <div class="resource-item-title">RAM</div>
              <div class="resource-item-content">{{descriptionRAM}}</div>
            </div>
          </div>
        </div>
        <div class="resource-item">
          <div class="resource-item-circle">
            <Progress :percent="percentNet"></Progress>
          </div>
          <div class="resource-item-description-wrapper">
            <div class="resource-item-description">
              <div class="resource-item-title">NET</div>
              <div class="resource-item-content">{{descriptionNet}}</div>
            </div>
          </div>
        </div>
        <div class="resource-item">
          <div class="resource-item-circle">
            <Progress :percent="percentCPU"></Progress>
          </div>
          <div class="resource-item-description-wrapper">
            <div class="resource-item-description">
              <div class="resource-item-title">CPU</div>
              <div class="resource-item-content">{{descriptionCPU}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

      <div class="table-title"><i class="layui-icon">&#xe62d;</i> <span>Account Transactions</span>
      <form class="layui-form" lay-filter="form">
        <div class="layui-form-item">
          <label class="layui-form-label">Expand the form</label>
          <div class="layui-input-block">
            <input type="checkbox" name="switch" lay-skin="switch" lay-text="ON|OFF">
          </div>
        </div>
      </form>
    </div>
    <div class="layui-row">
      <div class="layui-col-xs12 ">
        <div class="layui-tab layui-tab-brief">
          <ul class="layui-tab-title">
            <li class="layui-this">Token Transfers</li>
            <li>Resource transaction</li>
            <li>Vote</li>
          </ul>
          <div class="layui-tab-content">
            <div class="layui-tab-item layui-show">
              <TokenTransfers></TokenTransfers>
            </div>
            <div class="layui-tab-item">
              <ResourceTable></ResourceTable>
            </div>
            <div class="layui-tab-item">
              <VoteTable></VoteTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Progress from './progress/Progress'
import ResourceTable from './children/ResourceTable'
import TokenTransfers from './children/TokenTransfers'
import VoteTable from './children/VoteTable'
import { mapState, mapGetters, mapMutations } from 'vuex'
import utils from '../../../utils/utils'
const form = layui.form
export default {
  name: 'EosAccounts',
  components: {
    Progress,
    ResourceTable,
    TokenTransfers,
    VoteTable
  },
  data () {
    return {
      loadingClass: {
        'layui-anim-rotate': false,
        'layui-anim-loop': false
      }
    }
  },
  watch: {
    currentAccount: {
      handler () {
        this.currentAccount.getTxInfos().then(value => {
          this.setEosClassifyTx(utils.classifyTx(value.txInfos))
        }).catch(value => {
          utils.displayErrorCode(this, value)
        })
      }
    }
  },
  mounted () {
    form.render('checkbox', 'form')
    form.on('checkbox(switch)', data => {
    })
    this.currentAccount.getTxInfos().then(value => {
      this.setEosClassifyTx(utils.classifyTx(value.txInfos))
    }).catch(value => {
      utils.displayErrorCode(this, value)
    })
  },
  computed: {
    ...mapState({
      'accountList': 'accountList',
      'currentExchangeRate': 'currentExchangeRate'
    }),
    ...mapGetters({
      'currentAccount': 'currentAccount',
      'currentAccountType': 'currentAccountType'
    }),
    percentRAM () {
      if (this.currentAccount) {
        let percent = (this.currentAccount.resources.ram.used / this.currentAccount.resources.ram.total)
        return (percent >= 1) ? 1 : utils.toTwoPoint(percent)
      }
    },
    descriptionRAM () {
      if (this.currentAccount) {
        let usedRAM = utils.toTwoPoint(this.currentAccount.resources.ram.used / 1024)
        let totalRAM = utils.toTwoPoint(this.currentAccount.resources.ram.total / 1024)
        return `${usedRAM}KB / ${totalRAM}KB`
      }
    },
    percentNet () {
      if (this.currentAccount) {
        let percent = (this.currentAccount.resources.net.used / this.currentAccount.resources.net.max)
        return (percent >= 1) ? 1 : utils.toTwoPoint(percent)
      }
    },
    descriptionNet () {
      if (this.currentAccount) {
        let usedRAM = utils.toTwoPoint(this.currentAccount.resources.net.used / 1024)
        let totalRAM = utils.toTwoPoint(this.currentAccount.resources.net.max / 1024)
        return `${usedRAM}KB / ${totalRAM}KB`
      }
    },
    percentCPU () {
      if (this.currentAccount) {
        let percent = (this.currentAccount.resources.cpu.used / this.currentAccount.resources.cpu.max)
        return (percent >= 1) ? 1 : utils.toTwoPoint(percent)
      }
    },
    descriptionCPU () {
      if (this.currentAccount) {
        let usedRAM = this.currentAccount.resources.cpu.used / 1000
        let totalRAM = this.currentAccount.resources.cpu.max / 1000
        return `${usedRAM} ms / ${totalRAM} ms`
      }
    },
    accountBalance () {
      console.log(this.currentAccount, 'this.currentAccount')
      return this.currentAccount ? this.currentAccount.balance + ' EOS' : ''
    },
    displayExchangeRate () {
      if (this.currentAccount) {
        let amount = utils.toTwoPoint(this.esWallet.convertValue(this.currentAccountType, this.currentAccount.balance, this.D.unit.eos.EOS, this.currentExchangeRate))
        return this.currentExchangeRate ? `(${amount} ${this.currentExchangeRate})` : ''
      }
    }
  },
  methods: {
    ...mapMutations({
      setEosClassifyTx: 'SET_EOS_CLASSIFY_TX'
    }),
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
      padding: 18px 15px 0 15px;
      border-radius: 5px;
      .account-msg {
        display: inline-block;
        max-height: 19px;
        margin-right: 20px;
        margin-bottom: 8px;
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
      padding: 0 10px;
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
    position: relative;
    margin-top: 10px;
    margin-bottom: 5px;
    color: #5e5d5d;
    font-size: 18px;
    font-weight: 300;
    .layui-icon{
      font-size: 20px;
    }
    .layui-form{
      position: absolute;
      right: 10px;
      top: 0;
      .layui-form-label{
        padding-right: 0;
      }
    }
  }
  .layui-tab{
    margin: 0;
  }
  .layui-icon-refresh-1{
    vertical-align: top;
  }

</style>
