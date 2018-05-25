<template>
  <div>
    <div class="site-tree">
      <ul class="layui-tree ">
        <li><h2>Setting</h2></li>
        <li class="tab-title-2 layui-this">
          <a href="#">
            <i class="layui-icon" style="top: 3px;">&#xe632;</i>
            <cite>display</cite>
            </a>
        </li>
        <li class="tab-title-2">
          <a href="#">
            <i class="layui-icon" style="top: 3px;">&#xe628;</i>
            <cite>hardware information</cite>
          </a>
        </li>
      </ul>
    </div>
    <div class="site-content">
      <div class="tab-content-2">
        <div class="tab-item layui-show">
          <div class="site-text site-block">
            <form class="layui-form" lay-filter="form3">
              <div class="layui-form-item">
                <label class="layui-form-label" style="font-size: 13px">Interface Language</label>
                <div class="layui-input-inline input-width">
                  <select name="lang" lay-filter="lang">
                    <option value="en-us">English</option>
                    <option value="cn-zh">简体中文</option>
                  </select>
                </div>
              </div>
              <div class="layui-form-item">
                <label class="layui-form-label" style="font-size: 13px">Skin</label>
                <div class="layui-input-inline input-width">
                  <template v-for="item in skinColor">
                    <a href="#" class="layui-btn layui-btn-sm" v-bind:class="[item.colorClass]" @click="switchColor(item.name)">{{item.name}}</a>
                  </template>
                </div>
              </div>
            </form>
          </div>
        </div>
        <!--硬件信息-->
        <div class="tab-item">
          <table class="layui-table" lay-skin="line">
            <colgroup>
              <col width="100">
              <col width="200">
            </colgroup>
            <thead>
            <tr>
              <th>Name</th>
              <th>Information</th>
            </tr>
            </thead>
            <tbody v-for="item in hardwareList">
              <tr>
                <td>{{item.name}}</td>
                <td>{{item.information}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line
const form = layui.form
// eslint-disable-next-line
const $ = layui.jquery
export default {
  name: 'Setting',
  data () {
    return {
      hardwareList: [
        {name: 'CPU', information: 'HDASajdasknawikn'},
        {name: 'version', information: 'v 1.0.0'}
      ],
      skinColor: [
        {name: 'black', colorClass: 'black-skin'},
        {name: 'gray', colorClass: 'gray-skin'},
        {name: 'blue', colorClass: 'blue-skin'},
        {name: 'red', colorClass: 'red-skin'}
      ]
    }
  },
  mounted () {
    form.render('select', 'form3')
    this.switchLang()
    this.switchTab()
  },
  methods: {
    switchLang () {
      form.on('select(lang)', (data) => {
        this.$i18n.locale = data.value
        this.$emit('switchSetting', this.$t('message.setting'))
      })
    },
    switchColor (color) {
      this.$emit('settingColor', color)
    },
    switchTab () {
      // 独立各tab操作
      $('.tab-title-2 a').click(function () {
        $('li.tab-title-2').removeClass('layui-this')
        $(this).parent('li').addClass('layui-this')
        const tabIndex = $(this).parent().index('.tab-title-2')
        $('.tab-content-2 .layui-show').removeClass('layui-show')
        $('.tab-content-2 .tab-item').eq(tabIndex).addClass('layui-show')
      })
    }
  }
}
</script>

<style scoped>
  a.layui-btn {
    color: #fff;
    width: 70px;
  }
  .blue-skin {
    background:#2d668c;
    border-color:#2d668c;
    color: #fff;
  }
  .red-skin {
    background:#dd4b39;
    border-color:#dd4b39;
    color: #fff;
  }
  .black-skin {
    background:#23262E;
    border-color:#23262E;
    color: #fff;
  }
  .gray-skin {
    background:#4b505d;
    border-color:#4b505d;
    color: #fff;
  }
</style>
