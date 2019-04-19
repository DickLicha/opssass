import store from '@/store'
export default function (obj) {
  // if (obj.method === 'GET') {
  let sid;
  //#ifndef H5
  sid = store.state.sid || ""
  // #endif
  // #ifdef H5
  sid = sessionStorage.getItem('etf_sid') || ""
  // #endif
  obj.header = obj.header || {}
//   Object.assign(obj.header, {
//     clienttype: 'web',
//     ver: 'v1.0',
//     sid,
//   })
  // }
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
        console.error('ajax错误：',res)
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
