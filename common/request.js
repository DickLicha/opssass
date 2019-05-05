import store from '@/store'
export default function(obj) {
	// if (obj.method === 'GET') {
	let sn,id;
	//#ifndef H5
	sn = store.state.sn || ""
	id = store.state.bikeid || ""
	// #endif
	// #ifdef H5
	// #endif
	obj.header = obj.header || {}
	  Object.assign(obj.data, {
	    id: id,
		bike_id:id,
	    token: 'xxxx',		
		city_id: "35000",
		bike_sn:sn,
	  })

	let baseUrl = 'http://www.fishors.com:8086'
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
