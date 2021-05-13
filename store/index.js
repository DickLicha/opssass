import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		loginProvider: "",
		openid: null,
		faultinfo: '',
		// 全局字典配置信息
		directinfo: {},
		sn: '',
		bikeid: '',
		// 第一笔订单id
		orderfirstid: '',
		orderinfo: {},
		selectfaultobj: [],
		// 所有车辆信息
		bikeinfo: {},
		warehoselist: {},
		putstorageindex: 0,
		longitude: '119',
		latitude: '28',
		mapcovers: [],
		imgarr: [],
		violationsInfo: {},
		softconf: {},
		removecaritem: {},
		// userinfo: {},
		inginfo:{},//未结束的订单
		endmove:false,
		orderid:'',
		baseurl:'https://api.lexiangys.top',
		// baseurl:'https://api.dd-test.ildjoy.com',
		gobelrelogin:false,
		blueres:{},
		bluestate:false,
		blueconectstate:0,
		movebikearr:[],
		appid:'',
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
		setSn(state, sn) {
			state.sn = sn
		},
		setBikeid(state, bikeid) {
			state.bikeid = bikeid
		},
		setOrderfirstid(state, orderfirstid) {
			state.orderfirstid = orderfirstid
		},
		setOrderinfo(state, orderinfo) {
			state.orderinfo = orderinfo
		},
		setSelectfaultobj(state, selectfaultobj) {
			state.selectfaultobj = selectfaultobj
		},
		setBikeinfo(state, bikeinfo) {
			state.bikeinfo = bikeinfo
		},
		setWarehoselist(state, warehoselist) {
			state.warehoselist = warehoselist
		},
		setPutstorageindex(state, putstorageindex) {
			state.putstorageindex = putstorageindex
		},
		setLongitude(state, longitude) {
			state.longitude = longitude
		},
		setLatitude(state, latitude) {
			state.latitude = latitude
		},
		setMapcovers(state, mapcovers) {
			state.mapcovers = mapcovers
		},
		setImgarr(state, imgarr) {
			state.imgarr = imgarr
		},
		setSoftconf(state, softconf) {
			state.softconf = softconf
		},
		setRemovecaritem(state, removecaritem) {
			state.removecaritem = removecaritem
		},
		// setUserinfo(state, userinfo) {
		// 	state.userinfo = userinfo
		// },
		setViolationsInfo(state, violationsInfo) {
			state.violationsInfo = violationsInfo
		},
		setInginfo(state, inginfo) {
			state.inginfo = inginfo
		},
		setEndmove(state, endmove) {
			state.endmove = endmove
		},
		setOrderid(state, orderid) {
			state.orderid = orderid
		},
		setBaseurl(state, baseurl) {
			state.baseurl = baseurl
		},
		setGobelrelogin(state, gobelrelogin) {
			state.gobelrelogin = gobelrelogin
		},
		setBlueres(state, blueres) {
			state.blueres = blueres
		},
		setBluestate(state, bluestate) {
			state.bluestate = bluestate
		},
		setBlueconectstate(state,blueconectstate){
			state.blueconectstate=blueconectstate
		},
		setMovebikearr(state,movebikearr){
			state.movebikearr=movebikearr
		},
		setAppid(state,appid){
			state.appid=appid
		}
		
	},
	actions: {
		// lazy loading openid
		getUserOpenId: async function({
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
							setTimeout(function() { //模拟异步请求服务器获取 openid
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
