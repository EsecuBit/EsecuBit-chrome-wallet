<template>
  <div style="height: 100%">
    <!-- menu -->
    <div class="site-tree">
      <ul class="layui-tree ">
        <li><h2>{{$t('message.app_setting')}}</h2></li>
        <li :class="{'layui-this': index === currentMenuIndex}" v-for="( item, index ) in sidebarList" v-if="!isOfficial || index !== 2">
          <a href="#" @click="switchMenu(index)">
            <i class="layui-icon " :class="item.icon"></i>
            <cite>{{item.label}}</cite>
            </a>
        </li>
      </ul>
    </div>

    <!-- content -->
    <div class="site-content">
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
import Store from '../../../common/js/store'

export default{
  name: 'Setting',
  components: {
    Information,
    Config,
    Interface
  },
  data () {
    return {
      currentMenuIndex: 0,
      isOfficial: Store.isOfficial
    }
  },
  computed: {
    sidebarList () {
      return [
        {label: this.$t('message.setting_display'), icon: 'layui-icon-layouts'},
        {label: this.$t('message.setting_information'), icon: 'layui-icon-form'},
        {label: this.$t('message.setting_init'), icon: 'layui-icon-component'}
      ]
    }
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
