<template>
  <div class="layui-card-body layui-row layui-col-space10">
    <form class="layui-form">
      <div class="layui-form-item">
        <label class="from-label">Proxies</label>
        <input type="text" placeholder="Account that owns the RAM" lay-verify="isEmpty" v-model="proxiesName" autocomplete="off" class="layui-input">
      </div>
      <div class="layui-form-item">
        <label class="from-label">Username </label>
        <input type="text" placeholder="Enter Proxies EOS Username" lay-verify="isEmpty" v-model="username" autocomplete="off" class="layui-input">
      </div>
      <div class="layui-form-item">
        <button class="layui-btn" lay-submit @click="submit">Vote</button>
        <button type="button" class="layui-btn layui-btn-primary" @click="resetForm">Reset</button>
      </div>
    </form>
  </div>
</template>

<script>
const form = layui.form
export default {
  name: 'Proxies',
  data () {
    return {
      proxiesName: '',
      username: ''
    }
  },
  mounted () {
    this.verifyForm()
  },
  methods: {
    resetForm () {
      this.proxiesName = ''
      this.username = ''
    },
    verifyForm () {
      let that = this
      form.verify({
        isEmpty (value) {
          if (!value) return that.$t('message.send_form_is_empty')
        }
      })
    },
    submit () {
    }
  }
}
</script>

<style scoped lang="less">
  ::-webkit-input-placeholder{
    color: #aaa;
  }
  .layui-form-item{
    padding: 4px;
    margin-bottom: 4px!important;
    .layui-btn{
      color: #fff;
    }
    .layui-form-label{
      width: auto;
      padding-left: 0;
    }
    .layui-input-block{
      margin-left: 0;
    }
    .from-label{
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
    }
  }
</style>
