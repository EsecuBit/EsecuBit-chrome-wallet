<template>
  <div class="layui-card-body layui-row layui-col-space10">
    <form class="layui-form">
      <div class="layui-form-item">
        <label class="from-label">Username </label>
        <input type="text" placeholder="Enter EOS Username" v-model="username" autocomplete="off" class="layui-input" readonly>
      </div>
      <div class="layui-form-item">
        <label class="from-label">Producers</label>
          <input type="text" placeholder="Producers name" v-model="producersNameArr[index]" autocomplete="off" class="layui-input producer-input"
                 v-for="(item, index) in producersNameArr" lay-verify="isEmpty">
      </div>
      <div class="layui-form-item">
        <a class="add-data" @click="addProducerInput" href="#">
          <i class="layui-icon">&#xe654;</i> add Producers
        </a>
        <a class="delete-data" @click="deleteProducerInput" href="#" v-if="producersNameArr.length > 1">
          <i class="layui-icon layui-icon-close-fill"></i> delete Producer
        </a>
      </div>
      <div class="layui-form-item" style="margin-top: 10px">
        <button class="layui-btn" type="button" lay-submit @click="submit">Vote</button>
        <button type="button" class="layui-btn layui-btn-primary" @click="resetForm">Reset</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import utils from '../../../../utils/utils'

const form = layui.form
const layer = layui.layer
export default {
  name: 'Producers',
  data () {
    return {
      producersNameArr: ['']
    }
  },
  mounted () {
    this.verifyForm()
  },
  computed: {
    ...mapState({
      'isPreventClick': 'isPreventClick'
    }),
    ...mapGetters({
      'currentAccount': 'currentAccount',
      'currentAccountType': 'currentAccountType'
    }),
    username () {
      if (this.currentAccount) {
        return this.currentAccount.label
      }
    }
  },
  methods: {
    ...mapMutations({
      setIsPreventClick: 'SET_IS_PREVENT_CLICK'
    }),
    resetForm () {
      this.producersNameArr = ['']
    },
    verifyForm () {
      let that = this
      form.verify({
        isEmpty (value) {
          if (!value) return that.$t('message.send_form_is_empty')
        }
      })
    },
    addProducerInput () {
      this.producersNameArr.push('')
    },
    deleteProducerInput () {
      this.producersNameArr.pop()
    },
    submit () {
      if (this.isPreventClick) return
      for (let i = 0; i < this.producersNameArr.length; i++) {
        if (!this.producersNameArr[i]) return
      }
      this.setIsPreventClick(true)
      let formData = {
        producers: this.producersNameArr
      }
      layer.msg(this.$t('message.send_is_trading'), {icon: 0, time: 600000000})
      this.currentAccount.prepareVote(formData).then(value => {
        return this.currentAccount.buildTx(value)
      }).then(value => {
        return this.currentAccount.sendTx(value)
      }).then(value => {
        // Empty retransmission status
        this.setIsPreventClick(false)
        layer.closeAll('msg')
        layer.msg(this.$t('message.send_submit_success'), { icon: 1 })
      }).catch(value => {
        this.setIsPreventClick(false)
        utils.displayErrorCode(this, value)
      })
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
    .layui-input{
      width: calc(100% - 50px);
    }
    .from-label{
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
    }
    .producer-input{
      margin-bottom: 5px;
    }
  }
  .add-data{
    color: #009a61;
    margin-right: 15px;
    &:hover{
      opacity: .75;
    }
  }
  .delete-data{
    color: #e74c3c;
    .layui-icon{
      display: inline-block;
      vertical-align: middle;
    }
    &:hover{
      opacity: .75;
    }
  }
</style>
