import store from '@/store'
export default function(obj) {
	// if (obj.method === 'GET') {
	let sn, id;
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
		}
	} catch (e) {
		// error
	}
	// var token = store.state.userinfo.token
	// console.log('tocken',tocken)
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
		city_id: "350001",
	})

	// let baseUrl = 'http://www.fishors.com:8086'
	let baseUrl = 'https://dd0001.izyscp.com'
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
			complete() {
				// isShowLoading = false
				// store.commit("setloadingFlag", false);
			}
		});
	})
	return p
}
