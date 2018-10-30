<template>
  <div class="vote-box-container height-scroll">
    <div class="layui-card">
      <div class="layui-card-header">Vote</div>
      <div class="layui-card-header">
        <form class="layui-form" lay-filter="form">
          <div class="layui-form-item">
            <label class="layui-form-label"> Select category</label>
            <div class="layui-input-block">
              <input type="radio" name="category" lay-filter="category" value="producers" title="Block Producers">
              <input type="radio" name="category" lay-filter="category" value="proxies" title="Block Producers" checked>
            </div>
          </div>
        </form>
      </div>
      <Producers v-show="isProducersPage"></Producers>
      <Proxies v-show="!isProducersPage"></Proxies>
    </div>
  </div>
</template>

<script>
import Producers from './children/Producers'
import Proxies from './children/Proxies'
const form = layui.form
export default {
  name: 'Vote',
  data () {
    return {
      isProducersPage: true
    }
  },
  components: {
    Producers,
    Proxies
  },
  mounted () {
    form.render('radio', 'form')
    form.on('radio(category)', data => {
      this.isProducersPage = data.value === 'producers'
    })
  }
}
</script>

<style scoped lang="less">
  ::-webkit-input-placeholder{
    color: #aaa;
  }
  .vote-box-container{
    padding: 20px 10px;
    .layui-card{
      border-radius: 8px;
      border: 1px solid #f0f0f0;
      box-shadow: 1px 3px 10px 0 #e2e2e2;
      .layui-card-header{
        height: 46px;
        padding-top: 4px;
        font-size: 16px;
        border-bottom: 1px solid #eee;
      }
    }
    .layui-form-item{
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
  }
</style>
