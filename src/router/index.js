import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/hello',
    },
    {
      path: '/error',
      name: 'Error',
      component(resolve) {
        require(['@/components/common/page_error'], resolve)
      },
    },
  ],
})
