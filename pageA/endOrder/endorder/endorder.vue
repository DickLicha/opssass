<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="carcenterdata1" :type='2' :border='true' @itemclick='go'></item-cell>
			<item-cell :itemdata="carcenterdata2" :type='2' :border='true' @itemclick='go'></item-cell>
			<item-cell :itemdata="carcenterdata3" :type='2' :border='true' @itemclick='go'></item-cell>
			<button class='share-button-default endorder-btn' type='primary' @click="endorder">结束订单</button>
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	import {
		mapState
	} from 'vuex'
	import ble from '../../../common/xa-bluetooth.js'
	import {getcarinfodetil,getheaderinfo} from '@/common/conf.js'
	export default {
		components: {
			itemCell
		},
		computed: mapState(['bikeinfo', 'blueres', 'bluestate', 'baseurl','blueconectstate']),
		data() {
			return {
				carcenterdata1: [{
						name: '用户订单:',
						val: ''
					},
					{
						name: '用户姓名:',
						val: ''
					},
					{
						name: '手机号码:',
						val: '',
						click: true
					},
					{
						name: '订单开始:',
						val: ''
					},
					{
						name: '订单状态:',
						val: ''
					},
				],
				carcenterdata2: [{
						name: '换电订单:',
						val: ''
					},
					{
						name: '换电人员:',
						val: ''
					},
					{
						name: '手机号码:',
						val: '',
						click: true
					},
					{
						name: '订单开始:',
						val: ''
					},
				],
				carcenterdata3: [{
						name: '挪车订单:',
						val: ''
					},
					{
						name: '挪车人员:',
						val: ''
					},
					{
						name: '手机号码:',
						val: '',
						click: true
					},
					{
						name: '订单开始:',
						val: ''
					},
				],
			}
		},
		onUnload() {
			uni.closeBluetoothAdapter({
				success(res) {
					console.log(res)
				}
			})
		},
		onLoad() {
			var _self = this
			var name = _self.bikeinfo.bluetooth_name
			if (!!name && !!_self.bikeinfo.bluetooth_token) {
				var headerinfo={}
				var uploadflag=true
				ble.onBLECharacteristicValueChange(function(res) {
					console.log('特征值返回', res)
					// 泰币特类型
					if(_self.bikeinfo.ecu_model == "WA-209D"){
						if(res.name=='连接成功'){
							headerinfo=getheaderinfo(res)
						}else if(res.name=='开锁成功'){
							blueWriteState = 1
							// _self.reportblue(_self.openOrClose, 0, loadtime,'')
							console.log(1111)
							// _self.opercar(allmovetype,0,loadtime,res)
						}else if(res.name=='上锁成功'){
							blueWriteState = 1
							// _self.opercar(1,0,loadtime,res)
							// _self.endmoveopr(parkid,0,loadtime,res)
						}
						else if(res.name=='心跳包'){
								if(uploadflag){
									uploadflag=false
									var cc=getcarinfodetil(res)
										console.log('headerinfo',headerinfo)
										var options = {
											url: '/bike/ble_report_gpsv2', //请求接口
											method: 'POST', //请求方法全部大写，默认GET
											context: '',
											data: {
												"bike_id": _self.bikeinfo.id,
												"gsm_signal_strength" : cc.gsm_signal_strength,//gsm信号强度
												"satellite" : cc.satellite, //卫星数量
												"is_online" : 1, //是否在线
												"battery_volt" : cc.battery_volt, //电压
												"is_defend_on" : headerinfo.is_defend_on, //设防
												"is_acc_on" : 1,	//电门
												"is_wheel_locked" : 1, //车轮锁
												"is_sleeping" : headerinfo.is_sleeping,		//是否休眠
												"is_in_motion" : headerinfo.is_in_motion,		//是否运动
												"trip_miles" : cc.trip_miles,		//里程
												"gps_flag" : cc.gps_flag,			//0=定位失败，1=定位成功，2=缓存定位
												"locate_type" : cc.locate_type, 	//定位类型 gps lbs
												"gps" :
													{
														"gps_update_time" : "2020-07-07 07:00:00",
														"coordinate" : cc.coordinate,
														"speed" : cc.speed,
														"course" : cc.course,
														"hdop" : ''
													},
												"lbs" :{"cellid":cc.cellid,"lac":cc.lac,"mcc":cc.mcc,"mnc":cc.mnc}
											}
										}
										_self.$httpReq(options).then((res) => {
											// 请求成功的回调
											// res为服务端返回数据的根对象
											console.log('上报gpsv2', res)
										}).catch((err) => {
											// 请求失败的回调
											console.error(err, '捕捉')
										})
									}
								}
								
					}
					else{
						var gps = res.slice(0, 2)
						if (gps == 32) {
							gpsSb = res
							var str1 = ble.doCmd('21', '', _self.bikeinfo.bluetooth_token)
							ble.openLock(str1,'', function(res) {
								console.log('蓝牙操作', res)
							})
						}
						if (gps == 21) {
							stateSb = res
							var options = {
								url: '/bike/report_bike_gps', //请求接口
								method: 'POST', //请求方法全部大写，默认GET
								context: '',
								data: {
									bike_id: _self.bikeinfo.id,
									stat: stateSb,
									gps: gpsSb,
									tm:new Date().getTime()/1000
								}
							}
							_self.$httpReq(options).then((res) => {
								// 请求成功的回调
								// res为服务端返回数据的根对象
								console.log('上报', res)
							}).catch((err) => {
								// 请求失败的回调
								console.error(err, '捕捉')
							})
						}
					}
									
				})
				ble.initBluetooth(_self.bikeinfo, (res) => {
					_self.setBlueres(res)
					var str1 = ble.doCmd('32', '', _self.bikeinfo.bluetooth_token)
					setTimeout(() => {
						// ble.openLock(str1, res.deviceId, res.serviceId, res.characterId, function(ress) {
						ble.openLock(str1,'gps', function(ress) {
							console.log('蓝牙操作', ress)
						})
					}, 4000);
				})
				ble.onBluetoothAdapterStateChange(function(res) {
					console.log('回调', res)
					if (res.available == true && res.discovering == false && _self.bluestate == false) {
						console.log(66666)
						ble.initBluetooth(_self.bikeinfo, (res) => {
							_self.setBlueres(res)
						})
					}
				})
			} else {
				console.log('++++蓝牙不可用++++')
			}			
			
			// 订单编号
			this.carcenterdata1[0].val = this.bikeinfo.last_order_id

			// 用户姓名
			this.carcenterdata1[1].val = this.bikeinfo.last_order_oper_name

			// 手机号码
			this.carcenterdata1[2].val = this.bikeinfo.last_order_oper_phone

			// 订单开始时间
			this.carcenterdata1[3].val = this.bikeinfo.last_order_start_time

			// 订单状态
			this.carcenterdata1[4].val = this.$bus_state(this.bikeinfo.bus_state)
			
			// 换电
			// 订单编号
			this.carcenterdata2[0].val = this.bikeinfo.last_battery_change_order_id
			
			// 用户姓名
			this.carcenterdata2[1].val = this.bikeinfo.last_battery_change_order_oper_name
			
			// 手机号码
			this.carcenterdata2[2].val = this.bikeinfo.last_battery_change_order_oper_phone
			
			// 订单开始时间
			this.carcenterdata2[3].val = this.bikeinfo.last_battery_change_order_start_time
			
			
			// 挪车
			// 订单编号
			this.carcenterdata3[0].val = this.bikeinfo.last_repark_order_id
			
			// 用户姓名
			this.carcenterdata3[1].val = this.bikeinfo.last_repark_order_oper_name
			
			// 手机号码
			this.carcenterdata3[2].val = this.bikeinfo.last_repark_order_oper_phone
			
			// 订单开始时间
			this.carcenterdata3[3].val = this.bikeinfo.last_repark_order_start_time
			// 骑行中的订单
			if (this.bikeinfo.bus_state == 10 || this.bikeinfo.bus_state == 11 || this.bikeinfo.bus_state == 12) {
				// 订单编号
				this.carcenterdata1[0].val = this.bikeinfo.last_order_id

				// 用户姓名
				this.carcenterdata1[1].val = this.bikeinfo.last_order_oper_name

				// 手机号码
				this.carcenterdata1[2].val = this.bikeinfo.last_order_oper_phone

				// 订单开始时间
				this.carcenterdata1[3].val = this.bikeinfo.last_order_start_time

				// 订单状态
				this.carcenterdata1[4].val = this.$bus_state(this.bikeinfo.bus_state)
			}
			// 挪车中的订单
			else if (this.bikeinfo.bus_state == 20) {

			}
			// 换点中的订单
			else if (this.bikeinfo.bus_state == 30) {

			} else {
				uni.showToast({
					title: '订单状态异常',
					icon: 'none'
				});
			}
		},
		methods: {
			gocarcenter(e) {
				// 				uni.navigateTo({
				// 					url: '/pages/map/map',
				// 					success: res => {},
				// 					fail: () => {},
				// 					complete: () => {}
				// 				});
			},
			endorder() {
				var url = '',
					order_id = '',
					user_coordinate = []
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						console.log(res, 'res')
						user_coordinate = [res.longitude, res.latitude]
					},
					fail: () => {},
					complete: () => {}
				});
				if (this.bikeinfo.bus_state == 10 || this.bikeinfo.bus_state == 11 || this.bikeinfo.bus_state == 12) {
					url = '/urorder/force_finish'
					order_id = '*'
					user_coordinate = '*'
				}
				// 换电
				else if (this.bikeinfo.bus_state == 30) {
					url = '/bcorder/finish'
					order_id = this.bikeinfo.last_battery_change_order_id
				}
				// 挪车
				else if (this.bikeinfo.bus_state == 20) {
					url = '/rporder/finish'
					order_id = this.bikeinfo.last_repark_order_id
					if (!!this.bikeinfo.bluetooth_token && this.blueconectstate==1) {
						var str1 = ble.doCmd('20', '01', this.bikeinfo.bluetooth_token)
						ble.openLock(str1, 'open', function(res) {
							console.log('蓝牙操作', res)
						})
					}										
				}
				var options = {
					url: url, //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						bike_id: this.bikeinfo.id,
						order_id: order_id,
						user_coordinate: []
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('结束订单', res)
					if (res.status == 0) {
						uni.showToast({
							title: '结束订单成功',
							icon: 'none',
							duration: 2000,
						});
						setTimeout(() => {
							uni.navigateBack({
								delta: 1,
							});
						}, 1500)
					} else {
						uni.showToast({
							title: res.message ? res.message : '结束订单失败',
							mask: false,
							icon: 'none',
							duration: 1500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			go(item) {
				if (item.click) {
					if (item.name == '手机号码:') {
						uni.showModal({
							title: '',
							content: item.val,
							// showCancel: false,
							cancelText: '取消',
							confirmText: '拨打',
							success: res => {
								if (res.confirm) {
									uni.makePhoneCall({
										phoneNumber: item.val
									})
								}
							},
							fail: () => {},
							complete: () => {}
						});
					} else if (item.name == '订单轨迹:') {
						uni.navigateTo({
							// url: '/pages/map/map?name=' + name
							url: `/pageA/map/map?name=订单轨迹&type=0.1&text=33`
						});
					}
				}
			},
		}
	}
</script>

<style lang='scss' scoped>
	.wrap {
		background-color: rgb(245, 245, 245);
		height: calc(125vh);
		padding-top: 1upx;
		/* overflow: hidden; */

		/* padding-bottom: 1upx; */
		.view-common {
			margin: 10upx 22upx 0 22upx;
			/* overflow-y: auto; */
            /* height:140vh; */
			.endorder-btn {
				margin-top: 20upx;
			}
		}
	}
</style>
