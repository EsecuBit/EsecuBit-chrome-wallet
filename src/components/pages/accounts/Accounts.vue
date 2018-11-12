<template>
<div style="height: 100%">
  <!-- left sidebar -->
  <div class="site-tree">
    <!--<ul class="layui-tree">-->
      <!--<template v-for="(item, walletIndex) in walletGroup">-->
        <!--<li class="menu-title" v-if="item.label"><h2>{{item.label}}</h2></li>-->
        <!--<li class="site-tree-noicon tab-title-1"-->
            <!--v-for="(account, index) in item.account"-->
            <!--:class="{'layui-this': (walletIndex > 0 ? (walletGroup[walletIndex - 1].account.length + index) : index) === currentAccountIndex}">-->
          <!--<a href="#" @click="switchTab(index, walletIndex)"><cite>{{account}}</cite></a></li>-->
      <!--</template>-->
    <!--</ul>-->
    <ul class="layui-nav layui-nav-tree">
      <template v-for="item in walletGroup" v-if="walletGroup.length > 0 ">
        <li class="layui-nav-item " :class="{'layui-nav-itemed': item.active}">
          <a href="#" class="nav-title" @click="switchMenu(item)">{{item.label}}<span class="layui-nav-more"></span></a>
          <dl class="layui-nav-child">
            <dd v-for="account in item.children"
                :class="{'layui-this': account.index === currentAccountIndex}">
              <a href="#" @click="switchTab(account.index)"><span><i class="layui-icon ">&#xe612;</i>{{account.label}}</span></a></dd>
          </dl>
        </li>
      </template>
    </ul>
  </div>

  <!-- main content -->
  <div class="site-content">
    <div class="tab-content-1" id="tab-content-1">
      <div v-if="isShowEosPages">
        <EosAccounts></EosAccounts>
      </div>

      <div v-if="isShowBtcEthPages">
        <BtcEthAccounts></BtcEthAccounts>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
import EosAccounts from '../../eos/accounts/EosAccounts'
import BtcEthAccounts from './BtcEthAccounts'
export default {
  name: 'accounts',
  components: {
    EosAccounts,
    BtcEthAccounts
  },
  computed: {
    ...mapState({
      'accountList': 'accountList',
      'walletGroup': 'walletGroup',
      'currentAccountIndex': 'currentAccountIndex'
    }),
    ...mapGetters({
      'currentAccountType': 'currentAccountType'
    }),
    isShowEosPages () {
      return this.D.isEos(this.currentAccountType)
    },
    isShowBtcEthPages () {
      return this.D.isBtc(this.currentAccountType) || this.D.isEth(this.currentAccountType)
    }
  },
  watch: {
    accountList: {
      handler (newValue, oldValue) {
        this.setMenuList(newValue)
      }
    }
  },
  methods: {
    ...mapMutations({
      setCurrentAccountIndex: 'SET_CURRENT_ACCOUNT_INDEX',
      setWalletGroup: 'SET_WALLET_GROUP'
    }),
    switchMenu (item) {
      item.active ? this.$set(item, 'active', false) : this.$set(item, 'active', true)
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
    switchTab (index) {
      this.setCurrentAccountIndex(index)
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
  .site-title {
    margin-top:30px;
  }
  .site-tree{
    height: 100%;
    background-color: @white;
    padding: 0;
    border: 0;
    .layui-tree{
      border-right: 1px solid #eee;
      height: 100%;
      width: 170px;
    }
    .layui-nav-tree{
      padding: 15px 0 10px;
      border-right: 1px solid #eee;
      height: 100%;
      .layui-nav-item{
        .nav-title{
          background: #eee;
          text-transform: uppercase;
        }
      }
    }
  }
  .layui-nav-tree{
    width: 170px;

    .layui-nav-item a{
      height: 40px;
      line-height: 40px;
      &:hover{
        background-color: #eee;
      }
    }
    .layui-nav-child {
      dd.layui-this{
        background-color: @white!important;
        color: @font-color;
      }
      a{
        color: @font-color;
        &:hover{
          background-color: @white;
          color: @font-color;
        }
        .layui-icon{
          display: inline-block;
          margin-right: 4px;
        }
      }
    }
    .layui-nav-itemed .layui-nav-child{
      background: @white!important;
    }
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
</style>
