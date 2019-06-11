import store from '@/store'
export default function(obj) {
	// if (obj.method === 'GET') {
	let sn, id,cityid;
	sn = store.state.sn || ""
	if (obj.url == '/balert/confirm') {
		id = obj.data.id
	} else {
		id = store.state.bikeid || ''
	}
	var token=''
	try {
		const value = uni.getStorageSync('userinfo');
		if (value) {
			token=value.token
			cityid=value.userinfo.city_id
		}
	} catch (e) {
		// error
	}
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

	// let baseUrl = 'https://dd0001.izyscp.com'
	// 线上测试版本
	let baseUrl = 'https://api.dd-test.ildjoy.com'
	// 线上真实环境
	// let baseUrl = 'https://api.dd-dev.ildjoy.com'
	for (const key in obj.data) {
		const element = obj.data[key]
		// 全选
		if (element === '*' || undefined === element || element === null) {
			delete obj.data[key]
		}
	}
	let p = new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + obj.url,
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
						icon:'none'
					});
					setTimeout(()=>{
						uni.navigateTo({
							url: '/pages/mine/loginView/loginView',
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
					},1000)
				}
				// isShowLoading = false
				// store.commit("setloadingFlag", false);
			}
		});
	})
	return p
}
