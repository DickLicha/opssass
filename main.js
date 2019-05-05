import Vue from 'vue'
import App from './App'
import './static/iconfont/iconfont.css';
import store from './store'
import request from './common/request.js'
import './common/gobel.css';
import {eums,parkstate,invstate} from './common/conf.js'
// import './static/iconfont'
Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.$httpReq = request
Vue.prototype.$store = store
Vue.prototype.$parkstate = function(type){
	let place_name=''
	if (type == parkstate.BIKE_PARK_STAT_FREE) {
		place_name = '自由停放'
	} else if (type == parkstate.BIKE_PARK_STAT_PARK) {
		place_name = '站点停放'
	} else if (type == parkstate.BIKE_PARK_STAT_NPA) {
		place_name = '禁停区停放'
	}else if (type == parkstate.BIKE_PARK_STAT_OSA) {
		place_name = '服务区外'
	}
	return place_name	
}
Vue.prototype.$invstate = function(type){
	let inv_name=''
	if (type == invstate.BIKE_INV_STATE_IN_MARKET) {
		inv_name = '投入市场'
	} else if (type == invstate.BIKE_INV_STATE_IN_WAREHOUSE ) {
		inv_name = '入库'
	} else if (type == invstate.BIKE_INV_STATE_RECALL) {
		inv_name = '入库维修'
	}else if (type == invstate.BIKE_INV_STATE_SCRAPED) {
		inv_name = '报废'
	}else if (type == invstate.BIKE_INV_STATE_DEPOT_REPAIRED) {
		inv_name = '返厂维修'
	}
	return inv_name	
}
Vue.prototype.$faulttype = function(type){
	let health_state=''
	if (type == eums.BIKE_FAULT_HEALTH) {
		health_state = '健康'
	} else if (type == eums.BIKE_FAULT_TYPE_X_KONG_ZHI_QI) {
		health_state = '控制器故障'
	} else if (type == eums.BIKE_FAULT_TYPE_X_KONG_ZHI_QI_JIN_SHUI_DUAN_LU) {
		health_state = '控制器故障, 进水短路'
	}else if (type == eums.BIKE_FAULT_TYPE_X_KONG_ZHI_QI_GONG_NENG) {
		health_state = '控制器故障, 功能故障'
	}else if (type == eums.BIKE_FAULT_TYPE_X_DIAN_JI) {
		health_state = '电机故障'
	}else if (type == eums.BIKE_FAULT_TYPE_X_DIAN_JI_XIAN_LU) {
		health_state = '电机故障,线路故障'
	}else if (type == eums.BIKE_FAULT_TYPE_X_DIAN_JI_GAI_LIE) {
		health_state = '电机故障,盖子裂了'
	}else if (type == eums.BIKE_FAULT_TYPE_X_DIAN_JI_GONG_NENG) {
		health_state = '电机故障, 功能故障'
	}else if (type == eums.BIKE_FAULT_TYPE_X_SHA_CHE) {
		health_state = '刹车故障'
	}else if (type == eums.BIKE_FAULT_TYPE_X_SHA_CHE_QIAN) {
		health_state = '刹车-前刹'
	}else if (type == eums.BIKE_FAULT_TYPE_X_SHA_CHE_HOU) {
		health_state = '刹车-后刹'
	}else if (type == eums.BIKE_FAULT_TYPE_X_SHA_CHE_XIAN) {
		health_state = '刹车-刹车线'
	}else if (type == eums.BIKE_FAULT_TYPE_X_SHA_CHE_DIAO_JIE) {
		health_state = '刹车-不能调节'
	}else{
		health_state = '故障'
	}
	return health_state
}

const app = new Vue({
    ...App
})
app.$mount()

