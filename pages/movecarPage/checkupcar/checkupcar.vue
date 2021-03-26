<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="swapdata" type='4' :border='borders' @itemclick='gocarcenter'></item-cell>
			<view v-show="showdetil">
				<item-cell :itemdata="swapbatterydata" type='2' :border='borders'></item-cell>
				<view class='check-bottom-view'>
					<view class='checkup-text'><text>安全检查项目:</text></view>
					<view class='checkup-text' v-for="(item,i) in checkupdata" :key='i'><text>{{item}}</text></view>
				</view>
				<view class='change-battery-button'>
					<button class='share-button-default checkup-button' type="primary" @click='changbattery(0)'>车辆故障</button>
					<button class='share-button-default checkup-button' type='primary' @click='changbattery(1)'>车辆正常</button>
				</view>
			</view>


			<view v-show=''>
				<map class='base-map-view' :show-location='true' v-show='showmap' @markertap='markclick' :scale="scale" :latitude="latitude"
				 :longitude="longitude" :markers="covers" @controltap='mapcentionloc' :circles="circles" :controls='maploc'>
				</map>
			</view>

			<!-- <view v-show="showshartmove" class='end-move-button'>
				<button class='share-button-default margin-topbtn' @click='startmovecar'>开始挪车</button>
			</view> -->

			<view v-show="showendmove" class='end-move-button1'>
				<button class='share-button-default margin-topbtn' type='primary' @click='startmovecar(1)'>单个挪车</button>
			</view>
			<view v-show="showendmove" class='end-move-button2'>
				<button class='share-button-default margin-topbtn' type='primary' @click='startmovecar(0)'>批量挪车</button>
			</view>

		</view>
	</view>
</template>

<script>
	var blueWriteState = 0,
		loadtime = 1000,
		gpsSb = '',
		stateSb = '',
		parkid = "",
		allmovetype=1
	import itemCell from '@/components/item-cell/item-cell.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import ble from '../../../common/xa-bluetooth.js'
	// import {doCmd} from '../../../common/strdel.js'
	export default {
		data() {
			return {
				latitude: 39.909,
				circles: [],
				timmer: null,
				longitude: 116.39742,
				scale: 18,
				covers: [],
				showmap: false,
				type: 0,
				bikeid: '',
				showshartmove: false,
				showendmove: false,
				showdetil: true,
				borders: true,
				orderid: '',
				maploc:[{
					id:90,
					position:{left:10,top:50,width:30,height:30},
					// iconPath:'../../../static/image/location.png',
					iconPath:'../../../static/image/mapcenter.png',
					clickable:true,
				},
				{
					id:91,
					position:{left:10,top:100,width:30,height:30},
					iconPath:'../../../static/image/close.png',
					clickable:true,
				},
				],
				swapdata: [{
					name: '车辆编号',
					val: ''
				}],
				swapbatterydata: [{
						name: '最近一次检查时间:',
						val: '04-18 19：10：40'
					},
					{
						name: '最近一次检查人:',
						val: ''
					},
					// {
					// 	name: '待安全检查持续时长:',
					// 	val: ''
					// }
				],
				checkupdata: [
					'1、转把', '2、车把', '3、刹车', '4、车灯', '5、喇叭', '6、挡泥板'
				],
				ids: '',
				openOrClose: 100,
			}
		},
		components: {
			itemCell
		},
		computed: mapState(['bikeinfo', 'blueres', 'bluestate', 'blueconectstate']),
		onLoad(e) {
			if (e.type != 100) {
				var _self = this
				var name = _self.bikeinfo.bluetooth_name
				if (!!name && !!_self.bikeinfo.bluetooth_token) {
					ble.onBLECharacteristicValueChange((res) => {
						console.log('特征值返回', res,_self.openOrClose)						
						// 泰币特类型
						if(_self.bikeinfo.ecu_model == "WA-209D"){
							if(res=='连接成功'){
								
							}else if(res=='开锁成功'){
								blueWriteState = 1
								// _self.reportblue(_self.openOrClose, 0, loadtime,'')
								console.log(1111)
								_self.opercar(allmovetype,0,loadtime,res)
							}else if(res=='上锁成功'){
								blueWriteState = 1
								// _self.opercar(1,0,loadtime,res)
								_self.endmoveopr(parkid,0,loadtime,res)
							}
						}
						else{
							var gps = res.slice(0, 2)
							var blestate=res.slice(-3, -2)
							if (gps == 20) {
								if (blestate == 0) {
									blueWriteState = 1
									console.log('biaozhiwei',_self.openOrClose)
									// _self.reportblue(_self.openOrClose, 0, loadtime,'')
									// 挪车开锁
									if(_self.openOrClose == 11){
										console.log(2222)
										_self.opercar(allmovetype,0,loadtime,'')
									}else{
										_self.endmoveopr(parkid,0,loadtime,res)
									}
									
								}else{
									var bleerrstate=''
									if(blestate==1){
										bleerrstate='token校验失败'
									}else if(blestate==2){
										bleerrstate='请求内容错误'
									}else if(blestate==3){
										bleerrstate='请求命令错误'
									}else if(blestate==4){
										bleerrstate='操作失败'
									}else if(blestate==5){
										bleerrstate='命令不支持'
									}else if(blestate==6){
										bleerrstate='车辆正在骑行中'
									}else{
										bleerrstate='未知失败'
									}
									console.log('caozuo蓝牙失败',bleerrstate)
									// _self.reportblue(_self.openOrClose, 1, loadtime,bleerrstate)
									if(_self.openOrClose == 11){
										console.log(3333)
										_self.opercar(allmovetype,1,loadtime,bleerrstate)
									}else{
										_self.endmoveopr(parkid,1,loadtime,bleerrstate)
									}
								}
							}
							if (gps == 32) {
								gpsSb = res
								if (!!_self.bikeinfo.bluetooth_token) {
									var str1 = ble.doCmd('21', '', _self.bikeinfo.bluetooth_token)
									ble.openLock(str1,'', function(res) {
										console.log('蓝牙操作', res)
									})
								}
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
						if (!!_self.bikeinfo.bluetooth_token) {
							var str1 = ble.doCmd('32', '', _self.bikeinfo.bluetooth_token)
							setTimeout(() => {
								ble.openLock(str1, '', function(ress) {
									console.log('蓝牙操作', ress)
								})
							}, 0);
						}
					})
					ble.onBluetoothAdapterStateChange(function(res) {
						console.log('回调', res)
						if (res.available == true && res.discovering == false && _self.bluestate == false) {
							ble.initBluetooth(_self.bikeinfo, (res) => {
								_self.setBlueres(res)
							})
						}
					})
				} else {
					console.log('++++蓝牙不可用++++')
				}


			}

			console.log('type', e.type)
			if (e.type == 99) {
				this.showdetil = false
				this.showmap = true
				// this.showendmove = true
				this.bikeid = e.bikeid
				this.ids = e.orderid
				this.setSn(e.bikeid.slice(6, 14))
				this.getcarinfo()
				this.getmovingbike()
				if (this.timmer == null) {
					this.timmer = setInterval(() => {
						this.getmovingbike()
					}, 3000)
				}
			} else {
				this.bikeid = this.bikeinfo.id
				this.checkcars()
			}
			uni.getLocation({
				type: 'gcj02',
				success: res => {
					this.longitude = res.longitude
					this.latitude = res.latitude
				},
				fail: () => {},
				complete: () => {}
			});

			this.swapdata[0].val = this.bikeinfo.sn
		},
		onUnload() {
			clearInterval(this.timmer)
			this.timmer = null
			if(!!this.blueres.deviceId){
				uni.closeBLEConnection({
					deviceId: this.blueres.deviceId,
					success(res) {
						console.log('断开蓝牙连接成功', res)
						uni.closeBluetoothAdapter({
							success(res) {
								console.log('关闭蓝牙成功', res)
							}
						})
					}
				})
			}
		},
		methods: {
			...mapMutations(['setEndmove', 'setOrderid', 'setSn', 'setBlueres','setBikeinfo']),
			mapcentionloc(e){
				if(e.controlId==90){
					this.refreshinfo()
				}
				else if(e.controlId==91){
					if(!!this.ids){
						uni.showModal({
							title: '确定结束',
							content: this.bikeinfo.sn+'挪车订单?',
							showCancel: true,
							cancelText: '取消',
							confirmText: '确定',
							success: res => {
								if (res.confirm) {
									this.endorder()
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
								
							},
							fail: () => {},
							complete: () => {}
						});
					}
					else{
						uni.showToast({
							title: '无挪车订单!'
						});
					}
				}
				
			},
			endorder() {
				var options = {
					url: '/rporder/finish', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						bike_id: this.bikeinfo.id,
						order_id: this.ids,
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
			// 刷新车辆信息
			refreshinfo(){
				var options = {
					url: '/bike/refresh_info', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('刷新车辆信息', res)
					if (res.status == 0) {
						this.covers = []
						var temparr = []
						let tmpObj = {}
						tmpObj.latitude = res.coordinate[1]
						tmpObj.longitude = res.coordinate[0]
						tmpObj.iconPath = '../../../static/mapicon/car_normal.png'
						tmpObj.type = 'car'
						tmpObj.width = 39
						tmpObj.height = 48
						temparr.push(tmpObj)
						this.covers = temparr
			
					} else {
			
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 获取车辆信息
			getcarinfo() {
				var options = {
					url: '/bike/info', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					if (res.status == 0) {
						this.setBikeinfo(res.info)

					} else {
						uni.showToast({
							title: res.message ? res.message : '获取车辆信息失败',
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
			markclick(e) {
				console.log('e', e)
				var pointtype = '',
					bickcount = '',
					allkcount = '',
					pointname = ''		

				for (let k = 0; k < this.covers.length; k++) {
					if (this.covers[k].id == e.markerId) {
						pointtype = this.covers[k].type
						pointname = this.covers[k].name
						if (pointtype == 'stop') {
							bickcount = this.covers[k].bickcount
							allkcount = this.covers[k].allkcount
							parkid = this.covers[k].parkid
							// this.setMapcovers(this.covers[k])
						}
						break
					}
				}
				if (pointtype == 'stop') {
					uni.showModal({
						title: '确定挪到以下车站吗？',
						content: pointname,
						showCancel: true,
						cancelText: '取消',
						confirmText: '确定',
						success: res => {
							if (res.confirm) {
								this.endmovecars(parkid)
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						},
						fail: () => {},
						complete: () => {}
					});
				}
			},
			// 蓝牙预结束挪车处理
			presubmit(parkid) {
				this.setSn('*')
				this.openOrClose = 10
				uni.getLocation({ //获取当前的位置坐标
					type: 'gcj02',
					success: (res) => {
						var options = {
							url: '/rporder/pre_finish', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
							    "order_id":this.ids,
								"user_coordinate": [
									res.longitude, res.latitude
								],
								"park_id":parkid
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('预结束挪车', res)
							if (res.status == 0) {
								// 有token并且蓝牙已经连接
								if (!!this.bikeinfo.bluetooth_token && this.blueconectstate == 1) {
									var str1 = ble.doCmd('20', '01', this.bikeinfo.bluetooth_token)
									ble.openLock(str1, 'close', function(res) {
										console.log('蓝牙操作', res)
										loadtime = res.loadtime							
									})
									blueWriteState = 0
									setTimeout(() => {
										if (blueWriteState == 0) {
											console.log('蓝牙写入失败', blueWriteState)
											// this.reportblue(this.openOrClose, 1, loadtime,'无特征值返回')
											this.endmoveopr(parkid,1,loadtime,'无特征值返回')
										}
									}, 5000)
								}
								uni.showToast({
									title: '挪车成功',
									mask: false,
									duration: 3000
								});
								setTimeout(() => {
									uni.navigateBack({
										delta: 2
									});
								}, 2500)
							} else {
								uni.showToast({
									title: res.message ? res.message : '挪车失败',
									mask: false,
									icon: 'none',
									duration: 3000
								});
							}
						}).catch((err) => {
							// 请求失败的回调
							console.error(err, '捕捉')
						})
					},
					fail: (res) => {
				
					},
				})				
			},
			// 结束挪车
			endmovecars(parkid) {
				if (!!this.bikeinfo.bluetooth_token && this.blueconectstate == 1) {
					this.presubmit(parkid)
					}else{
					this.endmoveopr(parkid,1,'','')	
					}				
			},
			// 结束挪车核心逻辑
			endmoveopr(parkid,successorfail,time,errmess){
				this.setSn('*')
				this.openOrClose = 10
				uni.getLocation({ //获取当前的位置坐标
					type: 'gcj02',
					success: (res) => {
						var options = {
							url: '/rporder/finish', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"order_id": this.ids,
								"park_id": parkid,
								"bluetooth": this.blueconectstate,
								"bleinfo":{
								  "success": successorfail,
								  "cost": time,
								  "error_msg":errmess
								},
								"user_coordinate": [
									res.longitude, res.latitude
								]
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('挪车333333', res)
							if (res.status == 0) {
								// 有token并且蓝牙已经连接
								// if (!!this.bikeinfo.bluetooth_token && this.blueconectstate == 1) {
								// 	var str1 = ble.doCmd('20', '01', this.bikeinfo.bluetooth_token)
								// 	ble.openLock(str1, 'close', function(res) {
								// 		console.log('蓝牙操作', res)
								// 		loadtime = res.loadtime							
								// 	})
								// 	blueWriteState = 0
								// 	setTimeout(() => {
								// 		if (blueWriteState == 0) {
								// 			console.log('蓝牙写入失败', blueWriteState)
								// 			// this.reportblue(this.openOrClose, 1, loadtime,'无特征值返回')
								// 		}
								// 	}, 5000)
								// }
								uni.showToast({
									title: '挪车成功',
									mask: false,
									duration: 3000
								});
								setTimeout(() => {
									uni.navigateBack({
										delta: 2
									});
								}, 2500)
							} else {
								uni.showToast({
									title: res.message ? res.message : '挪车失败',
									mask: false,
									icon: 'none',
									duration: 3000
								});
							}
						}).catch((err) => {
							// 请求失败的回调
							console.error(err, '捕捉')
						})
					},
					fail: (res) => {
				
					},
				})
			},
			// 车辆安全检查
			checkbike() {
				this.showshartmove = false
				this.showendmove = true
				uni.getLocation({ //获取当前的位置坐标
					type: 'gcj02',
					success: (res) => {
						var options = {
							url: '/bike/check', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"bike_id": this.bikeid,
								"user_coordinate": [res.longitude, res.latitude],
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('安全检查', res)
							if (res.status == 0) {
								this.showdetil = false
								this.showshartmove = true
							} else {
								uni.showToast({
									title: res.message ? res.message : '安全检查失败',
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
					fail: (res) => {
						console.log('fail', res)
					}
				});
			},
			gocarcenter() {
				uni.navigateTo({
					url: '/pages/carBigCenter/carcenter/carcenter',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			//上报蓝牙操作
			reportblue(type, state, loadtime,errname) {
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						var opername = ''
						if (type == 10) {
							opername = '挪车关锁'
						}
						if (type == 11) {
							opername = '挪车开锁'
						}
						var options = {
							url: '/bike/report_bluetooth_oper', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								// "token": "xxx",
								"bike_id": this.bikeinfo.id,
								"bound_order_type": "BIKE_REPARK", //绑定订单类型， USER_RIDE =用户骑行订单，BIKE_REPARK=挪车订单，BIKE_BATTERY_RECHANGE=换电订单，
								"bound_order_id": this.ids,
								"bound_order_op": opername, //骑行开锁，骑行关锁，挪车开锁，挪车关锁，换电开锁 。。。,
								"type": type, //10=关锁，11=开锁，21=开电池锁,
								"result": { //操作结果
									"success": state, //0=成功， 其他值失败
									"cost": loadtime, //耗时 1000毫秒
									"error_msg": errname //错误信息
								},
								"user_coordinate": [res.longitude, res.latitude]
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('上报接口', res)
							if (res.status == 0) {}
						}).catch((err) => {
							// 请求失败的回调
							console.error(err, '捕捉')
						})
					},
					fail: () => {},
					complete: () => {
						uni.hideLoading()
					}
				});
			},
			// 挪车预处理
			premovecar(type) {
				var options = {
					url: '/rporder/pre_submit', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"bike_id": this.bikeid,
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('预处理订单', res)
					this.showmap = true
					if (res.status == 0) {
						if (!!this.bikeinfo.bluetooth_token && this.blueconectstate==1 && type==1) {
							var str1 = ble.doCmd('20', '00', this.bikeinfo.bluetooth_token)
							ble.openLock(str1, 'open', function(res) {
								console.log('蓝牙操作', res)
							})
							blueWriteState = 0
							setTimeout(() => {
								if (blueWriteState == 0) {
									console.log('blueWriteState2', blueWriteState)
									// this.reportblue(this.openOrClose, 1, loadtime,'无特征值返回')
									console.log(4444)
									this.opercar(allmovetype,1,loadtime,'无特征值返回')
								}
							}, 5000)
						}							
						// this.ids = res.info.id
						// this.setOrderid(res.info.id)						
						this.getmovingbike()
						if (this.timmer == null) {
							this.timmer = setInterval(() => {
								this.getmovingbike()
							}, 3000)
						}
							
						// uni.navigateBack({
						// 	delta: 1
						// });
					} else {
						uni.showToast({
							title: res.message ? res.message : '该车不可挪',
							mask: false,
							icon: 'none',
							duration: 2500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 开始挪车
			startmovecar(type) {
				allmovetype=type
				this.showshartmove = false
				this.showendmove = false
				this.openOrClose = 11
				if (!!this.bikeinfo.bluetooth_token && this.blueconectstate==1 && type==1) {
					this.premovecar(type)
				}else{
					console.log(5555)
					this.opercar(type,1,100,'')
				}
				
			},
			// 挪车具体操作
			opercar(type,successorfail,time,errmess){
				uni.getLocation({ //获取当前的位置坐标
					type: 'gcj02',
					success: (res) => {
						console.log('位置信息', res.longitude, res.latitude)
						var options = {
							url: '/rporder/submit', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"bike_id": this.bikeid,
								"user_coordinate": [res.longitude, res.latitude],
								"channel": "xxx",
								"bluetooth": this.blueconectstate,
								'unlock':type,
								// 执行成功传的值不成功不传
								"bleinfo": {
								  "success": successorfail,
								  "cost": time,
								  "error_msg": errmess
								 },
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('开始订单', res)
							this.showmap = true
							if (res.status == 0) {
								// if (!!this.bikeinfo.bluetooth_token && this.blueconectstate==1 && type==1) {
								// 	var str1 = ble.doCmd('20', '00', this.bikeinfo.bluetooth_token)
								// 	ble.openLock(str1, 'open', function(res) {
								// 		console.log('蓝牙操作', res)
								// 	})
								// 	blueWriteState = 0
								// 	setTimeout(() => {
								// 		if (blueWriteState == 0) {
								// 			console.log('blueWriteState2', blueWriteState)
								// 			this.reportblue(this.openOrClose, 1, loadtime,'无特征值返回')
								// 		}
								// 	}, 5000)
								// }							
								this.ids = res.info.id
								this.setOrderid(res.info.id)						
								this.getmovingbike()
								if (this.timmer == null) {
									this.timmer = setInterval(() => {
										this.getmovingbike()
									}, 3000)
								}
				
								// uni.navigateBack({
								// 	delta: 1
								// });
							} else {
								uni.showToast({
									title: res.message ? res.message : '该车不可挪',
									mask: false,
									icon: 'none',
									duration: 2500
								});
							}
						}).catch((err) => {
							// 请求失败的回调
							console.error(err, '捕捉')
						})
					},
					fail: (res) => {
						console.log('fail', res)
					}
				});
			},
			changbattery(type) {
				if (type == 1) {
					this.checkbike()
				} else {
					uni.navigateTo({
						url: '/pages/carBigCenter/breakdowncar/breakdowncar',
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}
			},
			checkcars() {
				var options = {
					url: '/bike/oper_list', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						type: 40,
						pno: 1,
						psize: 1,
						bike_id: this.bikeid
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('最后一次检查信息', res)
					if (res.status == 0) {
						this.swapbatterydata[0].val = res.list[0].create_time
						this.swapbatterydata[1].val = res.list[0].user_name
					} else {
						uni.showToast({
							title: res.message ? res.message : '获取车辆信息失败',
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
			getmovingbike() {
				var options = {
					url: '/bike/coord_and_park_nearby', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						bike_id: this.bikeid
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					// console.log('正在挪车辆信息', res)
					if (res.status == 0) {
						this.covers = []
						var temparr = []
						var circles = []
						let tmpObj = {}
						tmpObj.latitude = res.coordinate[1]
						tmpObj.longitude = res.coordinate[0]
						tmpObj.iconPath = '../../../static/mapicon/car_normal.png'
						tmpObj.type = 'car'
						tmpObj.width = 39
						tmpObj.height = 48
						temparr.push(tmpObj)
						for (let j = 0; j < res.parks.length; j++) {
							let tmpObjs = {}
							let circlesObj = {}
							tmpObjs.id = res.parks[j].id
							if (!!res.parks[j].coordinate) {
								tmpObjs.latitude = res.parks[j].coordinate[1]
								tmpObjs.longitude = res.parks[j].coordinate[0]
								circlesObj.latitude = res.parks[j].coordinate[1]
								circlesObj.longitude = res.parks[j].coordinate[0]
								circlesObj.radius = res.parks[j].radius
								circlesObj.fillColor = "#FF9F0040"
								circlesObj.color = "#FF9F0040"
								circlesObj.strokeWidth = 2
							}
							tmpObjs.name = res.parks[j].name
							var bikenum = parseInt(res.parks[j].capacity) - parseInt(res.parks[j].bike_count)
							tmpObjs.iconPath = this.$imagepath(res.parks[j], 'stop', bikenum,res.parks[j].grade)
							tmpObjs.type = 'stop'
							tmpObjs.bickcount = res.parks[j].bike_count
							tmpObjs.allkcount = res.parks[j].capacity
							tmpObjs.radius = res.parks[j].radius
							tmpObjs.remark = res.parks[j].remark
							tmpObjs.grade = res.parks[j].grade
							// tmpObjs.allkcount = res.parks[j].capacity
							tmpObjs.width = 39
							tmpObjs.height = 48
							tmpObjs.parkid = res.parks[j].id
							temparr.push(tmpObjs)
							circles.push(circlesObj)
							// this.covers.push(tmpObjs)
						}
						this.covers = temparr
						this.circles = circles
					} else {
						uni.showToast({
							title: res.message ? res.message : '获取车辆信息失败',
							mask: false,
							icon: 'none',
							duration: 1500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			}
		}
	}
</script>

<style lang='scss'>
	.wrap {
		background-color: rgb(245, 245, 245);
		padding-top: 1upx;
		padding-bottom: 1upx;
		/* height: 100vh; */
		overflow: hidden;

		.end-move-button1 {
			position: absolute;
			width: 100%;
			bottom: 150upx;
		}
		.end-move-button2 {
			position: absolute;
			width: 100%;
			bottom: 40upx;
		}

		/* margin-bottom: 20upx; */
		.view-common {
			margin: 10upx 22upx;
			height: 98vh;
			position: relative;

			.base-map-view {
				width: 100%;
				height: calc(100vh - 140upx);
				margin-top: 30upx;
			}

			.change-battery-button {
				position: fixed;
				bottom: 3vh;
				width: 706upx;
				display: flex;

				.checkup-button {
					width: 50%;
					margin: 0 30upx;
				}
			}

			.margin-topbtn {
				margin: 20upx 0 0 0;
			}

			.check-bottom-view {
				margin-top: 20upx;
				background-color: white;
				border-radius: 20upx;

				.checkup-text {
					margin: 18upx 40upx;
				}
			}
		}
	}
</style>
