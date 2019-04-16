import Vue from 'vue'
import App from './App'
import './static/iconfont/iconfont.css';
// import './static/iconfont'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

