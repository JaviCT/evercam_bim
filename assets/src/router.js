import Vue from 'vue'
import Router from 'vue-router'
import Bim from './views/Bim.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/bim',
      name: 'bim',
      component: Bim
    }
  ],
  linkActiveClass: "exact-active",
  linkExactActiveClass: "active"
})
