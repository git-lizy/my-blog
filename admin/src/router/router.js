import login from '../pages/login'
import admin from '../pages/admin'
import addArticle from '../pages/admin/add'
import list from '../pages/admin/list'
import message from '../pages/admin/message'

let router = [
    {
        component: login,
        path: '/',
        exact: true,
    },
    {
        component: admin,
        path: '/admin',
        exact: false,
        child: [
            {
                component: addArticle,
                path: '/admin',
                exact: true,
            },

            {
                component: list,
                path: '/admin/list',
                exact: true,
            },
            {
                component: message,
                path: '/admin/message',
                exact: true,
            }
        ]
    }
];

export default router
