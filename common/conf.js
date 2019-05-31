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
// 故障状态
// const invstate = {
// 	BIKE_EX_OK : 0,
//     BIKE_ALERT_LOCK_FAILED : 1, //关锁失败
//     BIKE_ALERT_UNDER_VOLT : 2, //欠压
//     BIKE_ALERT_OFFLINE : 4, //离线
//     BIKE_ALERT_GPS_FAILED : 8, //定位失败
// 	BIKE_ALERT_FAULT : 16, //故障警告
// 	BIKE_ALERT_STOLEN : 32, //怀疑被盗
// 	BIKE_ALERT_EX_UNLOCK : 64, //异常开锁
// 	BIKE_ALERT_LONG_BATTERY_UNLOCKED : 128, //电池锁长时间打开
// 	BIKE_ALERT_LONG_BATTERY_OFF : 256, //长时间电池空置
// 	BIKE_ALERT_EX_BATTERY_OFF : 512, //电池异常空置
// 	BIKE_ALERT_EX_LONG_UNLOCK : 1024, //超时未锁
// }
export {
	eums,parkstate,invstate
}
