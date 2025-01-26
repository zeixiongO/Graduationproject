import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: () => import('@/views/layout/index.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('../views/layout/home/index.vue'),
          meta: {
            title: '首页'
          },
        },
        {
          path: 'poem',
          name: 'Poem',
          component: () => import('../views/layout/poem/index.vue'),
          meta: {
            title: '诗文'
          },
        },
        {
          path: 'poemDetail/:id',
          name: 'PoemDetail',
          component: () => import('../views/layout/poemDetail/index.vue'),
          meta: {
            title: '诗词详情'
          },
        },
        {
          path: 'note',
          name: 'Note',
          component: () => import('../views/layout/note/index.vue'),
          meta: {
            title: '社区'
          },
        },
        {
          path: 'noteDetail/:id',
          name: 'NoteDetail',
          component: () => import('../views/layout/noteDetail/index.vue'),
          meta: {
            title: '笔记详情'
          },
        },
        {
          path: 'video',
          name: 'Admin',
          component: () => import('../views/layout/video/index.vue'),
          meta: {
            title: '视频'
          },
        },
        {
          path: 'search',
          name: 'Search',
          component: () => import('../views/layout/search/index.vue'),
          meta: {
            title: '搜索'
          },
        },
        {
          path: 'author/:id',
          name: 'Author',
          component: () => import('../views/layout/author/index.vue'),
          meta: {
            title: '作者'
          },
        },
        {
          path: 'personal',
          name: 'Personal',
          component: () => import('../views/layout/personal/index.vue'),
          meta: {
            title: '个人中心',
            requireAuth: true
          },
          children: [
            {
              path: '',
              name: 'Data',
              component: () => import('../views/layout/personal/views/data.vue'),
              meta: {
                title: '数据统计',
                requireAuth: true
              },
            },
            {
              path: 'userinfo',
              name: 'Userinfo',
              component: () => import('../views/layout/personal/views/userinfo.vue'),
              meta: {
                title: '个人资料',
                requireAuth: true
              },
            },
            {
              path: 'note',
              name: 'MyNote',
              component: () => import('../views/layout/personal/views/myNote.vue'),
              meta: {
                title: '我的笔记',
                requireAuth: true
              },
            },
            {
              path: 'star',
              name: 'MyStar',
              component: () => import('../views/layout/personal/views/myStar.vue'),
              meta: {
                title: '我的收藏',
                requireAuth: true
              },
            },
            {
              path: 'comment',
              name: 'MyComment',
              component: () => import('../views/layout/personal/views/myComment.vue'),
              meta: {
                title: '我的评论',
                requireAuth: true
              },
            },
          ]
        },
      ]
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404',
      meta: {
        title: '页面未找到'
      },
      children: [
        {
          path: '/404',
          name: '404',
          component: () => import('../views/error/404.vue'),
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        title: '登录'
      }
    },

  ]
})

const webName = import.meta.env.VITE_WEB_NAME

//路由前置守卫
router.beforeEach(async (to, from, next) => {
  if (to.meta.requireAuth && !localStorage.getItem('token')) {

    ElMessage.error('请登录')
    next('/login')

  } else {
    document.title = to.meta.title + ' - ' + webName || webName
    next()
  }
})

export default router
