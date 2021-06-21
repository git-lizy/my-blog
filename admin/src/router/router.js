//路由配置
import AsyncComponent from './asyncComponent'
const login = AsyncComponent(()=>import('../pages/login'))
const admin = AsyncComponent(()=>import('../pages/admin'))
const addArticle = AsyncComponent(()=>import('../pages/admin/add'))
const list = AsyncComponent(()=>import('../pages/admin/list'))
const type = AsyncComponent(()=>import('../pages/admin/type'))
const message = AsyncComponent(()=>import('../pages/admin/message'))

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
                component: type,//文章类型
                path: '/admin/type',
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
