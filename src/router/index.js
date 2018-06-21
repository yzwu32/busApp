import Vue from 'vue'
import Router from 'vue-router'
import BusSeach from '@/components/BusSeach'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'BusSeach',
      component: BusSeach
    }
  ]
})
