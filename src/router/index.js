import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      // 侧边栏名称 和 图标
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }

  // {
  //   path: '/movie',
  //   redirect: '/movie/moviedetail',
  //   component: Layout,
  //   name: 'Movie',
  //   meta: { title: '电影放映管理', icon: 'el-icon-goods', roles: ['superAdmin', 'film show manager'] },
  //   children: [
  //     {
  //       path: 'moviedetail',
  //       name: 'movieDetail',
  //       component: () => import('@/views/movie/MovieDetail'),
  //       meta: { title: '电影管理', roles: ['superAdmin', 'film show manager'] }
  //     },
  //     {
  //       path: 'movietype',
  //       name: 'movieType',
  //       component: () => import('@/views/movie/MovieType'),
  //       meta: { title: '电影类型管理', roles: ['superAdmin', 'film show manager'] }
  //     },
  //     {
  //       path: 'room',
  //       name: 'Room',
  //       component: () => import('@/views/movie/Room'),
  //       meta: { title: '放映厅管理', roles: ['superAdmin', 'film show manager'] }
  //     },
  //     {
  //       path: 'show',
  //       name: 'Show',
  //       component: () => import('@/views/movie/Show'),
  //       meta: { title: '放映管理', roles: ['superAdmin', 'film show manager'] }
  //     }
  //   ]
  // },

  // {
  //   path: '/user',
  //   component: Layout,
  //   // redirect: '/example/table',
  //   name: '用户管理',
  //   meta: { title: '用户管理', icon: 'el-icon-s-help', roles: ['superAdmin'] },
  //   children: [
  //     {
  //       path: 'admin',
  //       name: 'Admin',
  //       component: () => import('@/views/admin/index'),
  //       meta: { title: '管理员', icon: 'table', roles: ['superAdmin'] }
  //     },
  //     {
  //       path: 'user',
  //       name: 'User',
  //       component: () => import('@/views/user/index'),
  //       meta: { title: '用户', icon: 'tree', roles: ['superAdmin'] }
  //     }
  //   ]
  // },

  // {
  //   path: '/order',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Order',
  //       component: () => import('@/views/order/index'),
  //       meta: { title: '订单管理', icon: 'form', roles: ['superAdmin', 'ticket seller'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/comment',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Comment',
  //       component: () => import('@/views/comment/index'),
  //       meta: { title: '评论管理', icon: 'form', roles: ['superAdmin', 'Comment manager'] }
  //     }
  //   ]
  // },
  // // {
  // //   path: '/profit',
  // //   component: Layout,
  // //   children: [
  // //     {
  // //       path: 'profit',
  // //       name: 'Profit',
  // //       component: () => import('@/views/profit/index'),
  // //       meta: { title: '盈利情况', icon: 'form' }
  // //     }
  // //   ]
  // // },
  // {
  //   path: '/select_movie',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Select_movie',
  //       component: () => import('@/views/front/select_movie/index'),
  //       meta: { title: '电影购票', icon: 'form', roles: ['user'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/check_order',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Check_order',
  //       component: () => import('@/views/front/check_order/index'),
  //       meta: { title: '订单查询', icon: 'form', roles: ['user'] }
  //     }
  //   ]
  // },
  // {
  //   path: '/user_info',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'User_info',
  //       component: () => import('@/views/front/user_info/index'),
  //       meta: { title: '个人信息', icon: 'form', roles: ['user'] }
  //     }
  //   ]
  // },
]

export const asyncRoutes = [
  {
    path: '/movie',
    redirect: '/movie/moviedetail',
    component: Layout,
    name: 'Movie',
    meta: { title: '电影放映管理', icon: 'el-icon-goods', roles: ['superAdmin', 'film show manager'] },
    children: [
      {
        path: 'moviedetail',
        name: 'movieDetail',
        component: () => import('@/views/movie/MovieDetail'),
        meta: { title: '电影管理', roles: ['superAdmin', 'film show manager'] }
      },
      {
        path: 'movietype',
        name: 'movieType',
        component: () => import('@/views/movie/MovieType'),
        meta: { title: '电影类型管理', roles: ['superAdmin', 'film show manager'] }
      },
      {
        path: 'room',
        name: 'Room',
        component: () => import('@/views/movie/Room'),
        meta: { title: '放映厅管理', roles: ['superAdmin', 'film show manager'] }
      },
      {
        path: 'show',
        name: 'Show',
        component: () => import('@/views/movie/Show'),
        meta: { title: '放映管理', roles: ['superAdmin', 'film show manager'] }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    // redirect: '/example/table',
    name: '用户管理',
    meta: { title: '用户管理', icon: 'el-icon-s-help', roles: ['superAdmin'] },
    children: [
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/admin/index'),
        meta: { title: '管理员', icon: 'table', roles: ['superAdmin'] }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/user/index'),
        meta: { title: '用户', icon: 'tree', roles: ['superAdmin'] }
      }
    ]
  },

  {
    path: '/order',
    component: Layout,
    meta: { title: '订单管理', icon: 'form', roles: ['superAdmin', 'ticket seller'] },
    children: [
      {
        path: 'index',
        name: 'Order',
        component: () => import('@/views/order/index'),
        meta: { title: '订单管理', icon: 'form', roles: ['superAdmin', 'ticket seller'] }
      }
    ]
  },
  {
    path: '/comment',
    component: Layout,
    meta: { title: '评论管理', icon: 'form', roles: ['superAdmin', 'Comment manager'] },
    children: [
      {
        path: 'index',
        name: 'Comment',
        component: () => import('@/views/comment/index'),
        meta: { title: '评论管理', icon: 'form', roles: ['superAdmin', 'Comment manager'] }
      }
    ]
  },
  // {
  //   path: '/profit',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'profit',
  //       name: 'Profit',
  //       component: () => import('@/views/profit/index'),
  //       meta: { title: '盈利情况', icon: 'form' }
  //     }
  //   ]
  // },
  {
    path: '/select_movie',
    component: Layout,
    meta: { roles: ['user'] },
    children: [
      {
        path: 'index',
        name: 'Select_movie',
        component: () => import('@/views/front/select_movie/index'),
        meta: { title: '电影购票', icon: 'form', roles: ['user'] }
      }
    ]
  },
  {
    path: '/check_order',
    component: Layout,
    meta: { roles: ['user'] },
    children: [
      {
        path: 'index',
        name: 'Check_order',
        component: () => import('@/views/front/check_order/index'),
        meta: { title: '订单查询', icon: 'form', roles: ['user'] }
      }
    ]
  },
  {
    path: '/user_info',
    component: Layout,
    meta: { roles: ['user'] },
    children: [
      {
        path: 'index',
        name: 'User_info',
        component: () => import('@/views/front/user_info/index'),
        meta: { title: '个人信息', icon: 'form', roles: ['user'] }
      }
    ]
  },
  {
    path: '/log',
    component: Layout,
    meta: { roles: ['superAdmin'] },
    children: [
      {
        path: 'index',
        name: 'Log',
        component: () => import('@/views/log/index'),
        meta: { title: '数据库操作日志', icon: 'form', roles: ['superAdmin'] }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
