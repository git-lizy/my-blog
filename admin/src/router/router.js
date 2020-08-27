import login from '../pages/login'
import admin from '../pages/admin'
import addArticle from '../pages/admin/add'
import deleteArticle from '../pages/admin/delete'
import modifyArticle from '../pages/admin/modify'
import message from '../pages/admin/message'
let router=[
    {
        component:login,
        path:'/',
        exact:true,
    },
    {
        component:admin,
        path:'/admin',
        exact:false,
        child:[
            {
                component:addArticle,
                path:'/admin',
                exact:true,
            },
            {
                component:deleteArticle,
                path:'/admin/delete',
                exact:true,
            },
            {
                component:modifyArticle,
                path:'/admin/modify',
                exact:true,
            },
            {
                component:message,
                path:'/admin/message',
                exact:true,
            }
        ]
    }
]

export default router
