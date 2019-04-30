import store from '@/store'
export default function(obj) {
	// if (obj.method === 'GET') {
	let sid;
	//#ifndef H5
	sid = store.state.sid || ""
	// #endif
	// #ifdef H5
	sid = sessionStorage.getItem('etf_sid') || ""
	// #endif
	obj.header = obj.header || {}
	  Object.assign(obj.data, {
	    id: 'test0001',
	    token: 'xxxx',
		bike_id:'test0001',
		city_id: "35000",
	  })

	console.log('data', obj.data)
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
