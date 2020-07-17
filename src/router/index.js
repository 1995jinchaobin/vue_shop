import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// import User from '../components/user/User.vue'
const User = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/User.vue')
// import Rights from '../components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
// import Roles from '../components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')

// import Categories from '../components/shop/Categories.vue'
const Categories = () => import(/* webpackChunkName: "Categories_Params" */ '../components/shop/Categories.vue')
// import Params from '../components/shop/Params.vue'
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/shop/Params.vue')

// import Goods from '../components/shop/Goods.vue'
const Goods = () => import(/* webpackChunkName: "Goods_Add" */ '../components/shop/Goods.vue')
// import Add from '../components/shop/Add.vue'
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/shop/Add.vue')

// import Orders from '../components/orders/Orders.vue'
const Orders = () => import(/* webpackChunkName: "Order_Report" */ '../components/orders/Orders.vue')
// import Reports from '../components/reports/Reports.vue'
const Reports = () => import(/* webpackChunkName: "Order_Report" */ '../components/reports/Reports.vue')



Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/Welcome',
    children: [{ path: '/Welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Orders },
      { path: '/Reports', component: Reports }
    ]
  }
]

const router = new VueRouter({
  mode:'history',
  routes
})
router.beforeEach((to, from, next) => {
  // 如果访问的是登陆页面,则放行
  if (to.path === '/login') return next()
  // 否则从sessionStorage拿出token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果token值是空的,则强制返回登陆页面
  if (!tokenStr) return next('/login')
  // 否则放行
  next()
})
export default router
