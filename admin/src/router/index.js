import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login/index.vue'),
      meta: {
        title: '登录',
        requireAuth: false
      },
    },
    {
      path: '/',
      name: 'Layout',
      component: () => import('../views/Layout/index.vue'),
      redirect: '/panel',
      meta: {
        requireAuth: true
      },
      children: [
        {
          path: 'poem',
          name: 'Poem',
          component: () => import('../views/Layout/Poem/index.vue'),
          meta: {
            requireAuth: true
          },
          children: [
            {
              path: 'poem',
              name: 'Poem',
              component: () => import('../views/Layout/Poem/Poem/index.vue'),
              meta: {
                title: '诗词管理',
                requireAuth: true,
                keepAlive: true
              },
            },
            {
              path: 'excerpt',
              name: 'Excerpt',
              component: () => import('../views/Layout/Poem/Excerpt/index.vue'),
              meta: {
                title: '摘抄管理',
                requireAuth: true,
                keepAlive: true
              },
            },
            {
              path: 'author',
              name: 'Author',
              component: () => import('../views/Layout/Poem/Author/index.vue'),
              meta: {
                title: '作者管理',
                requireAuth: true,
                keepAlive: true
              },
            },
            {
              path: 'dynasty',
              name: 'Dynasty',
              component: () => import('../views/Layout/Poem/Dynasty/index.vue'),
              meta: {
                title: '朝代管理',
                requireAuth: true,
                keepAlive: true
              },
            },
            {
              path: 'category',
              name: 'Category',
              component: () => import('../views/Layout/Poem/Category/index.vue'),
              meta: {
                title: '分类管理',
                requireAuth: true,
                keepAlive: true
              },
            },
            {
              path: 'form',
              name: 'Form',
              component: () => import('../views/Layout/Poem/Form/index.vue'),
              meta: {
                title: '形式管理',
                requireAuth: true,
                keepAlive: true
              },
            },
          ]
        },
        {
          path: 'user',
          name: 'User',
          component: () => import('../views/Layout/User/index.vue'),
          meta: {
            title: '用户管理',
            requireAuth: true
          },
        },
        {
          path: 'community',
          name: 'Community',
          component: () => import('../views/Layout/Community/index.vue'),
          meta: {
            title: '社区管理',
            requireAuth: true
          },
          children: [
            {
              path: 'note',
              name: 'Note',
              component: () => import('../views/Layout/Community/Note/index.vue'),
              meta: {
                title: '笔记管理',
                requireAuth: true
              },
            },
            {
              path: 'keyword',
              name: 'Keyword',
              component: () => import('../views/Layout/Community/Keyword/index.vue'),
              meta: {
                title: '关键词管理',
                requireAuth: true
              },
            },
            {
              path: 'comment',
              name: 'Comment',
              component: () => import('../views/Layout/Community/Comment/index.vue'),
              meta: {
                title: '评论管理',
                requireAuth: true
              },
            },
          ]
        },
        {
          path: 'video',
          name: 'Video',
          component: () => import('../views/Layout/Video/index.vue'),
          meta: {
            title: '视频管理',
            requireAuth: true
          },
        },
        {
          path: 'panel',
          name: 'Panel',
          component: () => import('../views/Layout/Statistics/index.vue'),
          meta: {
            title: '数据看板',
            requireAuth: true
          },
        },
      ]
    }
  ]
})

//路由前置守卫
router.beforeEach(async (to, from, next) => {
  if (to.meta.requireAuth && !sessionStorage.getItem('token')) {

    ElMessage.error('请登录')
    next('/login')

  } else {
    document.title = to.meta.title + ' - 诗词文化 - 后台管理系统' || '诗词文化 - 后台管理系统'
    next()
  }
})

export default router
