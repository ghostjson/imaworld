import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Designview from './views/Designview.vue'
import Playlist from './views/Playlist.vue'
import Logout from './views/Logout.vue'
import SignUp from './views/SignUp.vue'
import Admin from  './views/Admin.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/logout',
      name: 'logout',
      component: Logout
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin
    }
  ]
})
