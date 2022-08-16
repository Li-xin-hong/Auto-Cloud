import Router from 'vue-router'
import Vue from 'vue'
//导入路由模块
import Login from '@/components/MyLogin.vue'
import Home from '@/views/Home.vue'
import ConSole from '@/views/ConSole.vue'
import ConSoleAdd from '@/views/ConSoleAdd.vue'
import ConSoleUpdate from '@/views/ConSoleUpdate.vue'
import pathArr from './PathArr'
Vue.use(Router)


const routes = [
    //首页重定向
    { path: '/', redirect: '/login' },
    //首页路由
    { path: '/login', component: Login },
    //控制台路由
    {
        path: '/home',
        component: Home,
        redirect: '/home/console', //默认进入控制台
        children: [{
            path: 'console',
            component: ConSole,
            redirect: '/home/console/consoleadd', //默认进入添加页面
            children: [
                { path: 'consoleadd', component: ConSoleAdd },
                { path: 'consoleupdate', component: ConSoleUpdate }
            ]
        }]
    }

]
const router = new Router({
        routes
    })
    //全局前置守卫
router.beforeEach(function(to, from, next) {
    if (pathArr.indexOf(to.path) !== -1) { //判断是否访问home......路径
        const token = localStorage.getItem('token'); //获取token值
        if (token) { //判断是否存在token值
            next() //存在,直接放行
        } else {
            next('/login') //不存在,跳转到登录页面
        }
    } else {
        //放行
        next()
    }
})
export default router