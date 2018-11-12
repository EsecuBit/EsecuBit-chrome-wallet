<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray"  stroke-linecap="round" :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
    <div class="progress-text">{{Math.round(percent* 100)+ '%'}}</div>
  </div>
</template>

<script>
export default {
  name: 'Progress',
  props: {
    radius: {
      type: Number,
      default: 60
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dashArray: Math.PI * 100
    }
  },
  computed: {
    dashOffset () {
      return (1 - (this.percent)) * this.dashArray
    }
  }
}
</script>

<style scoped lang="less">
  .progress-circle{
    position: relative;
    display: inline-block;
    circle{
      stroke-width: 8px;
      transform-origin: center;
      &.progress-background{
        transform: scale(0.9);
        stroke: rgb(229, 233, 242);
      }
      &.progress-bar{
        transform: scale(0.9) rotate(-90deg);
        stroke: #00dfb9
      }
    }
    .progress-text{
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      text-align: center;
      margin: 0;
      transform: translateY(-50%);
      font-size: 16px;
      color: #606266;
      display: inline-block;
      vertical-align: middle;
      line-height: 1;
    }
  }
</style>
