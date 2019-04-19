import Vue from 'vue'
import App from './App'
import './static/iconfont/iconfont.css';
import store from './store'
import request from './common/request.js'
// import './static/iconfont'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.$httpReq = request
Vue.prototype.$store = store

const app = new Vue({
    ...App
})
app.$mount()

