const formatetimes = (timestamp)=> {
	var date = new Date(timestamp*1000);
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
	var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
	var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
	var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
	return Y + M + D + h + m + s;
}
 // 日志类型 event = 3 
 const parseSelectionName = (selections, value) => {
   if (selections.length > 0) {
     if (Array.isArray(value)) {
       var names = []
       for (let index = 0; index < selections.length; index++) {
         const element = selections[index]
         if (value.indexOf(element.value) > -1) {
           names.push(element.title)
         }
       }
       return names.join('\n')
     } else {
       for (let index = 0; index < selections.length; index++) {
         const element = selections[index]
         if (element.value == value) {
           return element.title
         }
       }
     }
   }
   return '未知'
 }
  const parseBitsValue = (n) => {
    var r = []
    var i = 0
    while (n > 0) {
      if (n & 0x01 === 1) {
        r.push(i)
      }
      i++
      n = n >> 1
    }
    return r
  }
  const parseSwBitsObj = (sw) => {
    let swPosition = [
      ['撤防','设防'],
      ['电门关','电门开'],
      ['后轮锁解锁','后轮锁上锁'],
      ['电池仓锁解锁','电池仓锁上锁'],
      ['电瓶断开','电瓶连接'],
      ['GPS静止','GPS运动'],
      ['车辆静止','车辆运动'],
      ['后轮静止','后轮转动'],
      ['功耗正常模式','低功耗模式'],
      ['休眠正常模式','休眠模式'],
      ['移动告警不触发语音','移动告警触发语音']
    ] 
    let obj = {
      numbers: [],
      desc: []
    }
    for (let index = 0; index < swPosition.length; index++) {
		if([2,3,5,8,9].indexOf(index)>-1){
			continue
		}
      const el = swPosition[index];
      let val = sw & (1 << index) ? 1 : 0
      obj.numbers.push(val)
      obj.desc.push(el[val])
    }
    return obj
  }
// 车辆状态
const eums = {
	BIKE_FAULT_HEALTH: 0, //健康
	BIKE_FAULT_TYPE_X_KONG_ZHI_QI: 1000, //控制器故障
	BIKE_FAULT_TYPE_X_KONG_ZHI_QI_JIN_SHUI_DUAN_LU: 1001, //控制器故障, 进水短路 
	BIKE_FAULT_TYPE_X_KONG_ZHI_QI_GONG_NENG: 1002, //控制器故障, 功能故障 
	BIKE_FAULT_TYPE_X_DIAN_JI: 1100, //电机故障,
	BIKE_FAULT_TYPE_X_DIAN_JI_XIAN_LU: 1101, //电机故障,线路故障
	BIKE_FAULT_TYPE_X_DIAN_JI_GAI_LIE: 1102, //电机故障,盖子裂了
	BIKE_FAULT_TYPE_X_DIAN_JI_GONG_NENG: 1103, //电机故障, 功能故障 
	BIKE_FAULT_TYPE_X_SHA_CHE: 1200, //刹车
	BIKE_FAULT_TYPE_X_SHA_CHE_QIAN: 1201, //刹车-前刹
	BIKE_FAULT_TYPE_X_SHA_CHE_HOU: 1202, //刹车-后刹
	BIKE_FAULT_TYPE_X_SHA_CHE_XIAN: 1203, //刹车-莎车县
	BIKE_FAULT_TYPE_X_SHA_CHE_DIAO_JIE: 1204 //刹车-不能调节
}
// 位置信息
const parkstate = {
	BIKE_PARK_STAT_FREE:0, //自由停放
	BIKE_PARK_STAT_PARK:1, //站点停放
	BIKE_PARK_STAT_NPA:11, //禁停区停放
	BIKE_PARK_STAT_OSA:21 //服务区外
}
// 库存状态
const invstate = {
	BIKE_INV_STATE_IN_MARKET:0, //投放市场
	BIKE_INV_STATE_IN_WAREHOUSE:1, //入库
	BIKE_INV_STATE_RECALL:2, //入库维修
	BIKE_INV_STATE_SCRAPED:3, //报废
	BIKE_INV_STATE_DEPOT_REPAIRED:4 //返厂维修
}
export {
	formatetimes,eums,parkstate,invstate,parseSelectionName,parseBitsValue,parseSwBitsObj,
}