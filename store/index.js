import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		loginProvider: "",
		openid: null,
		faultinfo:'',
		// 全局字典配置信息
		directinfo:{},
		sn:'',
		bikeid:'',
		// 第一笔订单id
		orderfirstid:'',
		selectfaultobj:[],
		// 所有车辆信息
		bikeinfo:{},
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.loginProvider = provider;
		},
		logout(state) {
			state.hasLogin = false
			state.openid = null
		},
		setOpenid(state, openid) {
			state.openid = openid
		},
		setFaultinfo(state, faultinfo) {
			state.faultinfo = faultinfo
		},
		setDirectinfo(state, directinfo) {
			state.directinfo = directinfo
		},
		setSn(state, sn){
			state.sn = sn
		},
		setBikeid(state, bikeid){
			state.bikeid = bikeid
		},
		setOrderfirstid(state, orderfirstid){
			state.orderfirstid = orderfirstid
		},
		setSelectfaultobj(state, selectfaultobj){
			state.selectfaultobj = selectfaultobj
		},
		setBikeinfo(state, bikeinfo){
			state.bikeinfo = bikeinfo
		},
		
	},
	actions: {
		// lazy loading openid
		getUserOpenId: async function ({
			commit,
			state
		}) {
			return await new Promise((resolve, reject) => {
				if (state.openid) {
					resolve(state.openid)
				} else {
					uni.login({
						success: (data) => {
							commit('login')
							setTimeout(function () { //模拟异步请求服务器获取 openid
								const openid = '123456789'
								commit('setOpenid', openid)
								resolve(openid)
							}, 1000)
						},
						fail: (err) => {
							console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err)
							reject(err)
						}
					})
				}
			})
		}
	}
})

export default store
