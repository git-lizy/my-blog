//路由配置
import login from '../pages/login'
import admin from '../pages/admin'
import addArticle from '../pages/admin/add'
import list from '../pages/admin/list'
import message from '../pages/admin/message'

let router = [
    {
        component: login,//登录
        path: '/',
        exact: true,
    },
    {
        component: admin,//主页（发布文章页）
        path: '/admin',
        exact: false,
        child: [
            {
                component: addArticle,//主页（发布文章页）
                path: '/admin',
                exact: true,
            },

            {
                component: list,//文章列表管理页
                path: '/admin/list',
                exact: true,
            },
            {
                component: message,//留言管理页
                path: '/admin/message',
                exact: true,
            }
        ]
    }
];

export default router
