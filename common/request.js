import store from '@/store'
export default function(obj) {
	// if (obj.method === 'GET') {
	let sn, id,cityid,baseurl;
	sn = store.state.sn || ""
		var token='',value={}
	try {
		var value = uni.getStorageSync('userinfo');
		if (value) {
			token=value.token
			cityid=value.userinfo.city_id
		}
	} catch (e) {
		// error
	}
	try {
		baseurl = uni.getStorageSync('baseurl');
	} catch (e) {
		// error
	}
	// 字段冲突过滤
	if (obj.url == '/balert/confirm' || obj.url == '/park/del' || obj.url=='/balert/handle' || obj.url=='/bike/unlock_battery' 
	|| obj.url=='/bike/ring' ||obj.url=='/bike/unlock_battery' || obj.url=='/park/update') {
		id = obj.data.id
	} else {
		id = store.state.bikeid || ''
	}
	if(obj.url=='/staff/switch_city'){
		cityid=obj.data.city_id
	}
	if(obj.url=='/bike/report_bike_gps'){
		cityid="*"
		id="*"
		sn="*"
	}
	// else{
	// 	if(value){
	// 		cityid=value.userinfo.city_id
	// 	}
	// 	
	// }
	// uni.showLoading({
	// 	title: '加载中',
	// 	mask: false
	// });
	// var token = store.state.userinfo.token
	//#ifndef H5	
	// #endif
	// #ifdef H5
	// #endif
	obj.header = obj.header || {}
	Object.assign(obj.data, {
		id: id,
		bike_sn: sn,
		// bike_id:id,	
		token: token,
		city_id: cityid,
	})
	for (const key in obj.data) {
		const element = obj.data[key]
		// 全选
		if (element === '*' || undefined === element || element === null) {
			delete obj.data[key]
		}
	}
	let p = new Promise((resolve, reject) => {
		uni.request({
			url: baseurl + obj.url,
			// url: store.state.baseurl + obj.url,
			method: obj.method || 'GET',
			data: obj.data || {},
			header: obj.header || {},
			context: obj.context || '',
			dataType: obj.dataType || '',
			success: res => {
				resolve(res.data)
			},
			fail: (res) => {
				console.error('ajax错误：', res)
				reject()
			},
			complete(res) {
				// setTimeout(()=>{
				// 	uni.hideLoading();
				// },300)			
				if(res.data.status==-530){					
					uni.showToast({
						title: 'token验证失败，请重新登录',
						icon:'none',
						duration:1000
					});
					try {
						uni.removeStorageSync('userinfo');
					} catch (e) {
						// error
					}
					var loginstate=store.state.gobelrelogin
					if(loginstate===false){
						store.commit("setGobelrelogin", true);
						setTimeout(()=>{							
							uni.navigateTo({
								url: '/pages/mine/loginView/loginView',
								success: res => {
									// store.mutations.setGobelrelogin(true)									
								},
								fail: () => {},
								complete: () => {}
							});
						},1000)
					}					
				}
				// isShowLoading = false
				// store.commit("setloadingFlag", false);
			}
		});
	})
	return p
}
