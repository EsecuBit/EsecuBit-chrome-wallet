<template>
  <div>
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

    <h1 class="table-title">{{$t('message.accounts_recent_operations')}}</h1>

    <div class="layui-row">
      <div class="layui-col-xs12 ">
        <!-- operation log table -->
        <table class="layui-table" lay-skin="line">
          <colgroup>
            <col width="15%">
            <col width="30%">
            <col width="10%">
            <col width="10%">
            <col width="10%">
            <col width="6%">
          </colgroup>
          <thead>
          <tr>
            <th>时间</th>
            <th>地址</th>
            <th>状态</th>
            <th>金额</th>
            <th>状态</th>
            <th>备注</th>
          </tr>
          </thead>
          <tbody >
          <!-- Determine whether to resend -->
          <tr>
            <td>数据</td>
            <td>数据</td>

            <td></td>
            <!-- if current coin is etc, it will display transaction fee-->
            <td>数据</td>
            <td>数据</td>
            <td>
              <a title="search" href="#" target="_blank">
                <i class="layui-icon">&#xe615;</i>
              </a>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="page-wrapper">
          <div class="page-content" id="grid_pager"></div>
          <div class="total-num-wrapper">
            <div class="total-num">
              <span>{{$t('message.accounts_total') + ' ' + 10 + ' ' + $t('message.accounts_items')}}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Progress from './progress/Progress'
const laypage = layui.laypage
export default {
  name: 'EosAccounts',
  components: {
    Progress
  },
  data () {
    return {
      radius: 60,
      percent: 0.1,
      limit: 5,
      pageStartIndex: 0,
      pageEndIndex: 5
    }
  },
  mounted () {
    this.pageList()
  },
  methods: {
    pageList () {
      let total = 10
      let page = 1
      let limit = this.limit
      laypage.render({
        elem: 'grid_pager',
        count: total,
        limit: limit,
        curr: page,
        prev: '<',
        next: '>',
        layout: ['first', 'prev', 'page', 'next', 'last'],
        jump: function (obj, first) {
          // obj包含了当前分页的所有参数，比如：
          // console.log(obj.curr) // 得到当前页，以便向服务端请求对应页的数据。
          // console.log(obj.limit) // 得到每页显示的条数
          // 首次不执行
          if (!first) {
            limit = obj.limit
            page = obj.curr
          }
        }
      })
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
  .table-title{
    margin-top: 10px;
    margin-bottom: 5px;
    color: #5e5d5d;
    font-size: 18px;
    font-weight: 300;
  }
  /*table*/
  .layui-table{
    table-layout:fixed;
    td,th {
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space:nowrap;
    }
    tr {
      display: table-row;
      vertical-align: inherit;
      border-color: inherit;
    }
    thead {
      font-weight: bold;
    }
  }
  /*Pagination*/
  .page-wrapper{
    display: block;
    .page-content {
      display: inline;
    }
    .total-num-wrapper {
      display: inline;
      font-size: 12px;
      margin-left: 10px;
      .total-num {
        display: inline-block;
        vertical-align: middle;
        margin: 10px 0;
        box-sizing: content-box;
        span{
          display: inline-block;
          vertical-align: middle;
          height: 28px;
          line-height: 28px;
          margin: 0 -1px 5px 0;
          background-color: #fff;
          color: #333;
          font-size: 12px;
        }
      }
    }
  }
</style>
