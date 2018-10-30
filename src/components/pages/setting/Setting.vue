<template>
  <div style="height: 100%">
    <!-- menu -->
    <div class="site-tree">
      <ul class="layui-tree ">
        <li><h2>{{$t('message.app_setting')}}</h2></li>
        <li :class="{'layui-this': 0 === currentMenuIndex}">
          <a href="#" @click="switchMenu(0)">
            <i class="layui-icon">&#xe632;</i>
            <cite>{{$t('message.setting_display')}}</cite>
            </a>
        </li>
        <li :class="{'layui-this': 1 === currentMenuIndex}">
          <a href="#" @click="switchMenu(1)">
            <i class="layui-icon" >&#xe628;</i>
            <cite>{{$t('message.setting_information')}}</cite>
          </a>
        </li>
        <li v-if="!isOfficial" :class="{'layui-this': 2 === currentMenuIndex}">
          <a href="#" @click="switchMenu(2)">
            <i class="layui-icon">&#xe857;</i>
            <cite>{{$t('message.setting_init')}}</cite>
          </a>
        </li>
      </ul>
    </div>

    <!-- content -->
    <div class="site-content height-scroll">
      <div class="tab-content-2">

        <div class="tab-item" :class="{'layui-show': 0 === currentMenuIndex}">
          <Interface></Interface>
        </div>

        <!-- hardware information -->
        <div class="tab-item" :class="{'layui-show': 1 === currentMenuIndex}">
          <Information></Information>
        </div>

        <!-- Set seed -->
        <div class="tab-item" v-if="!isOfficial" :class="{'layui-show': 2 === currentMenuIndex}">
          <Config></Config>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Information from './children/Information'
import Config from './children/Config'
import Interface from './children/Interface'
import { mapState } from 'vuex'

export default{
  name: 'Setting',
  components: {
    Information,
    Config,
    Interface
  },
  data () {
    return {
      currentMenuIndex: 0
    }
  },
  computed: {
    ...mapState({
      'isOfficial': 'isOfficial'
    })
  },
  methods: {
    switchMenu (index) {
      this.currentMenuIndex = index
    }
  }
}
</script>

<style scoped lang="less">
  .site-tree{
    height: 100%;
    .layui-tree{
      width: 170px;
    }
  }
</style>
