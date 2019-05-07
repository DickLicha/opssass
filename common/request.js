import store from '@/store'
export default function(obj) {
	// if (obj.method === 'GET') {
	let sn,id;
	sn = store.state.sn || ""
	id = store.state.bikeid || ""
	//#ifndef H5	
	// #endif
	// #ifdef H5
	// #endif
	obj.header = obj.header || {}
	  Object.assign(obj.data, {
	    // id: id,
		bike_sn:sn,
		// bike_id:id,
	    token: 'xxxx',		
		city_id: "35000",	
	  })

	// let baseUrl = 'http://www.fishors.com:8086'
	let baseUrl = 'http://test3.fishors.com:8086'
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
