import Vue from 'vue'
import App from './App.vue'
//引入路由
import router from '@/router'
//引入elementui组件库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//引入vant组件库
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);
Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    router
}).$mount('#app')