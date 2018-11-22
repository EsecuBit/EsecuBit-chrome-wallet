<template>
  <div style="height: 100%">
    <div class="site-tree">
      <ul class="layui-tree">
        <li><h2>RAM</h2></li>
        <li :class="{'layui-this': 0 === currentMenuIndex}">
          <a href="#" @click="switchMenu(0)">
            <cite>Buy RAM</cite>
          </a>
        </li>
        <li :class="{'layui-this': 1 === currentMenuIndex}">
          <a href="#" @click="switchMenu(1)">
            <cite>Sell RAM</cite>
          </a>
        </li>
        <li><h2>Stake/Unstake</h2></li>
        <li :class="{'layui-this': 2 === currentMenuIndex}">
          <a href="#" @click="switchMenu(2)">
            <cite>Stake CPU/NET</cite>
          </a>
        </li>
        <li :class="{'layui-this': 3 === currentMenuIndex}">
          <a href="#" @click="switchMenu(3)">
            <cite>Unstake CPU/NET</cite>
          </a>
        </li>
      </ul>
    </div>

    <div class="site-content">
      <div class="tab-item" :class="{'layui-show': 0 === currentMenuIndex}">
        <BuyRAM></BuyRAM>
      </div>
      <div class="tab-item" :class="{'layui-show': 1 === currentMenuIndex}">
        <SellRAM></SellRAM>
      </div>
      <div class="tab-item" :class="{'layui-show': 2 === currentMenuIndex}">
        <Stake></Stake>
      </div>
      <div class="tab-item" :class="{'layui-show': 3 === currentMenuIndex}">
        <Unstake></Unstake>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import BuyRAM from './children/BuyRAM'
import SellRAM from './children/SellRAM'
import Unstake from './children/Unstake'
import Stake from './children/Stake'
export default {
  name: 'EosSend',
  components: {
    BuyRAM,
    SellRAM,
    Unstake,
    Stake
  },
  props: {
    errorCodeMsg: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      currentMenuIndex: 0
    }
  },
  computed: {
    ...mapState({
      'isPreventClick': 'isPreventClick'
    })
  },
  methods: {
    switchMenu (index) {
      if (this.isPreventClick) return
      this.currentMenuIndex = index
    }
  }
}
</script>

<style scoped lang="less">
  .site-tree{
    height: 100%;
    border: 0;
    padding: 0;
    .layui-tree{
      border-right: 1px solid #eee;
      height: 100%;
      padding: 5px 0 10px;
      width: 170px;
    }
  }
</style>
