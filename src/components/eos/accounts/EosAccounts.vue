<template>
  <div class="account-information-wrapper">
    <div class="account-information">
      <div class="account-msg">
        <div class="max-width-250">
          <span class="layui-badge-dot layui-bg-green"></span>
          <span>{{$t('message.accounts_account')}}</span>
          <span  style="color: #e74c3c">accounts</span>
        </div>
      </div>
      <div class="account-msg">
        <div class="max-width-400">
          <span class="layui-badge-dot layui-bg-green"></span>
          <span>{{$t('message.accounts_balance')}}</span>
          <span >123</span>
          <span>
            <span class="exchange-rate">(100 eu)</span>
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
      <a :title="$t('message.icon_title_refresh')" href="#" class="refresh-data max-width-250">
        <i class="layui-icon layui-icon-refresh-2"></i>
      </a>
    </div>

    <div class="resource-list-wrapper">
      <div class="resource-item">
        <div class="resource-item-circle">
          <Progress :radius="radius" :percent="percent" class="progress"></Progress>
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
          <Progress :radius="radius" :percent="percent"></Progress>
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
          <Progress :radius="radius" :percent="percent"></Progress>
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
</template>

<script>
import Progress from './progress/Progress'

export default {
  name: 'EosAccounts',
  components: {
    Progress
  },
  data () {
    return {
      radius: 60,
      percent: 0.1
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
</style>
