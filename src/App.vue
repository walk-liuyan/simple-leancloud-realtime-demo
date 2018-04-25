<template>
  <div id="app">
    <PageHeader></PageHeader>
    <div class="p-t-20"></div>
    <div class="p-t-30"></div>
    <div class="container">
      <transition name="fade-fast">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>
<style lang="less">
  @import '~vux/src/styles/reset';
</style>
<script>
  import PageHeader from './components/common/page_header'
  import ApiMixin from './assets/js/apis-mixins'

  export default {
    name: 'app',
    components: {
      PageHeader,
    },
    data() {
      return {
        data: null,
      }
    },
    mixins: [ApiMixin],
  }
</script>
