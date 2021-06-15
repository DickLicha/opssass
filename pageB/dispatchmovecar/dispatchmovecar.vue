<template>
	<view class='wrap'>
		<view class='view-common'>
			<view>
				<map class='base-map-view' :show-location='true' v-show='showmap' @markertap='markclick' :scale="scale"
					:latitude="latitude" :longitude="longitude" :markers="covers" @controltap='mapcentionloc'
					:circles="circles" :controls='maploc' :style="{height:mapheihts}">
				</map>
				<view v-if='type==101' class='moving-view'>
					<view style='font-size: 36upx;'>
						挪车列表
					</view>
					<view class='view-commons'>
						<view class='flexd-posion'>
							<view class='view-flexs switch-head' @click='checkboxchange'>
								<view>车辆编号</view>
								<view class='view-border-letf'>派单人</view>
								<view class='view-border-letf'>挪车站点</view>
								<checkbox class='view-border-letf' refs='checkid' :checked='isallselect'></checkbox>
							</view>
						</view>

						<scroll-view>
							<view class='view-flexs view-border-bottom' v-for="(item,i) in switchdatatotal" :key='i'
								@click='itemclick(i,item.isselect)'>
								<view>{{item.sn}}</view>
								<view class='view-border-letf'>{{item.dispatcher_name}}</view>
								<view class='view-border-letf'>{{item.end_park_name}}</view>
								<checkbox class='view-border-letf' :checked='item.isselect'></checkbox>
							</view>
						</scroll-view>
					</view>

					<!-- <view style='margin-top: 30upx;'>
						<base-input @scanCode='scanCode(1)' @goPage='goNewPage' :title='inputval' @hidekeygo='manualsgo'></base-input>
					</view> -->

					<view class='moveview'>
						<view class='startmove' :class="{'grayclass':isclick==1}" @click="startmoveallclick">
							{{dispatchbtn}}</view>
						<!-- <view class='startmove' :class="{'grayclass':isclick==1}" @click="listenorder">{{dispatchbtn}}</view> -->

					</view>
				</view>
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
		allmovetype = 1
	import itemCell from '@/components/item-cell/item-cell.vue'
	// import baseInput from '@/components/baseinput/baseinput.vue'
	import {
		getcarinfodetil,
		getheaderinfo
	} from '@/common/conf.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import ble from '../../common/xa-bluetooth.js'
	// import {doCmd} from '../../../common/strdel.js'
	export default {
		data() {
			return {
				bikeorder: [],
				dispatchbtn: '开始派单',
				isclick: 0,
				// 批量结束挪车索引
				endcarindex: 0,
				// 批量开始挪车索引
				isallselect: true,
				userinfo: {},
				moveorder: [],
				mapheihts: '87vh',
				latitude: 30,
				circles: [],
				timmer: null,
				longitude: 50,
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
				maploc: [{
					id: 90,
					position: {
						left: 10,
						top: 50,
						width: 50,
						height: 50
					},
					iconPath: '../../static/image/location.png',
					clickable: true,
				}],
				swapdata: [{
					name: '车辆编号',
					val: ''
				}],
				swapbatterydata: [{
						name: '最近一次检查时间:',
						val: ''
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
				uploadflag: true,
				switchdatatotal: [],
			}
		},
		components: {
			itemCell
		},
		computed: mapState(['bikeinfo', 'blueres', 'bluestate', 'blueconectstate', 'sn']),
		onLoad(e) {
			console.log('type', e.type, this.switchdatatotal)
			this.type = e.type
			this.dispatchorder()
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
			if (e.type == 101) {
				this.mapheihts = '45vh'
				this.showdetil = false
				this.showmap = true
				try {
					const value = uni.getStorageSync('userinfo');
					if (value) {
						this.userinfo = value
						// this.movingbike()
					}
				} catch (e) {
					// error
				}
				setTimeout(() => {
					if (this.switchdatatotal.length > 0) {
						// this.bikeid=this.switchdatatotal[0].id
						// this.getmovingbike()
					}
				}, 3000);
				// return
			}
			// 挪车界面跟正在进行中的订单
			if (e.type != 100) {
				console.log(11)
				var _self = this
				var name = _self.bikeinfo.bluetooth_name
				if (!!name && !!_self.bikeinfo.bluetooth_token || e.type == 101) {
					var headerinfo = {}
					this.uploadflag = true
					ble.onBLECharacteristicValueChange((res) => {
						console.log('特征值返回', res, _self.openOrClose)
						var ecu_model = _self.bikeinfo.ecu_model
						console.log(1111, ecu_model)
						if (_self.type == 101) {
							// ecu_model=_self.switchdatatotal[_self.remarkcarindex].ecu_model
							if (_self.openOrClose == 11) {
								ecu_model = _self.plncble(0).ecu_model
							} else {
								ecu_model = _self.plncble(1).ecu_model
							}
						}
						console.log(2222, ecu_model)
						// 泰币特类型
						if (ecu_model == "WA-209D") {
							if (res.name == '连接成功') {
								headerinfo = getheaderinfo(res)
							} else if (res.name == '开锁成功') {
								blueWriteState = 1
								// _self.reportblue(_self.openOrClose, 0, loadtime,'')
								console.log('woshi2')
								_self.opercar(allmovetype, 0, loadtime, res)
							} else if (res.name == '上锁成功') {
								blueWriteState = 1
								// _self.opercar(1,0,loadtime,res)
								_self.endmoveopr(parkid, 0, loadtime, res)
							} else if (res.name == '心跳包') {
								if (this.uploadflag) {
									this.uploadflag = false
									var cc = getcarinfodetil(res)
									console.log('headerinfo', headerinfo)
									var options = {
										url: '/bike/ble_report_gpsv2', //请求接口
										method: 'POST', //请求方法全部大写，默认GET
										context: '',
										data: {
											"bike_id": _self.bikeinfo.id,
											"gsm_signal_strength": cc.gsm_signal_strength, //gsm信号强度
											"satellite": cc.satellite, //卫星数量
											"is_online": 1, //是否在线
											"battery_volt": cc.battery_volt, //电压
											"is_defend_on": headerinfo.is_defend_on, //设防
											"is_acc_on": 1, //电门
											"is_wheel_locked": 1, //车轮锁
											"is_sleeping": headerinfo.is_sleeping, //是否休眠
											"is_in_motion": headerinfo.is_in_motion, //是否运动
											"trip_miles": cc.trip_miles, //里程
											"gps_flag": cc.gps_flag, //0=定位失败，1=定位成功，2=缓存定位
											"locate_type": cc.locate_type, //定位类型 gps lbs
											"gps": {
												"gps_update_time": "2020-07-07 07:00:00",
												"coordinate": cc.coordinate,
												"speed": cc.speed,
												"course": cc.course,
												"hdop": ''
											},
											"lbs": {
												"cellid": cc.cellid,
												"lac": cc.lac,
												"mcc": cc.mcc,
												"mnc": cc.mnc
											}
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

						} else //小安
						{
							var gps = res.slice(0, 2)
							var blestate = res.slice(-3, -2)
							if (gps == 20) {
								if (blestate == 0) {
									blueWriteState = 1
									console.log('biaozhiwei', _self.openOrClose)
									// _self.reportblue(_self.openOrClose, 0, loadtime,'')
									// 挪车开锁
									if (_self.openOrClose == 11) {
										console.log('woshi3')
										_self.opercar(allmovetype, 0, loadtime, '')
									} else if (_self.openOrClose == 10) {
										_self.endmoveopr(parkid, 0, loadtime, res)
									}

								} else {
									var bleerrstate = ''
									if (blestate == 1) {
										bleerrstate = 'token校验失败'
									} else if (blestate == 2) {
										bleerrstate = '请求内容错误'
									} else if (blestate == 3) {
										bleerrstate = '请求命令错误'
									} else if (blestate == 4) {
										bleerrstate = '操作失败'
									} else if (blestate == 5) {
										bleerrstate = '命令不支持'
									} else if (blestate == 6) {
										bleerrstate = '车辆正在骑行中'
									} else {
										bleerrstate = '未知失败'
									}
									console.log('caozuo蓝牙失败', bleerrstate)
									// _self.reportblue(_self.openOrClose, 1, loadtime,bleerrstate)
									if (_self.type != 101) {
										if (_self.openOrClose == 11) {
											console.log('woshi4')
											_self.opercar(allmovetype, 1, loadtime, bleerrstate)
										} else {
											_self.endmoveopr(parkid, 1, loadtime, bleerrstate)
										}
									}
								}
							}
							if (gps == 32) {
								gpsSb = res
								if (!!_self.bikeinfo.bluetooth_token) {
									var str1 = ble.doCmd('21', '', _self.bikeinfo.bluetooth_token)
									ble.openLock(str1, '', function(res) {
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
										tm: new Date().getTime() / 1000
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
					if (e.type != 101) {
						ble.initBluetooth(_self.bikeinfo, (res) => {
							_self.setBlueres(res)
							if (!!_self.bikeinfo.bluetooth_token) {
								var str1 = ble.doCmd('32', '', _self.bikeinfo.bluetooth_token)
								setTimeout(() => {
									// ble.openLock(str1, res.deviceId, res.serviceId, res.characterId, function(ress) {
									ble.openLock(str1, 'gps', function(ress) {
										console.log('蓝牙操作', ress)
									})
								}, 1);
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
					}

				} else {
					console.log('++++蓝牙不可用++++')
				}


			}
			// 正在进行中的订单界面跳转过来
			if (e.type == 99) {
				console.log(22)
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
			}
			// type==100是检查车辆的界面 或者，没有type
			else {
				console.log(33)
				this.bikeid = this.bikeinfo.id
				// this.checkcars()
			}
		},
		onUnload() {
			clearInterval(this.timmer)
			this.timmer = null
			if (!!this.blueres.deviceId) {
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
			...mapMutations(['setEndmove', 'setOrderid', 'setSn', 'setBlueres', 'setBikeinfo', 'setBikeid']),
			mapcentionloc() {
				this.refreshinfo()
			},
			//派单列表
			dispatchorder() {
				var options = {
					url: '/rporder/my_dispatched_list', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					if (res.status == 0) {
						// this.setSn(this.carnum)
						console.log('我的派单列表', res)
						this.bikeorder = res.orders
						this.drawingicon(res)
					} else {
						// uni.showToast({
						// 	title: res.message ? res.message : '获取派单信息失败',
						// 	mask: false,
						// 	icon: 'none',
						// 	duration: 1500
						// });
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			//听单
			listenorder() {
				uni.getLocation({
					type: 'wgs84',
					success: ress => {
						var options = {
							url: '/rporder/listen', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								'coordinate': [ress.longitude, ress.latitude]
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							if (res.status == 0) {
								// this.setSn(this.carnum)
								console.log('听单', res)
								uni.showToast({
									title: '派单成功'
								});
								this.bikeorder = res.orders
								this.drawingicon(res)
							} else {
								uni.showToast({
									title: res.message ? res.message : '听单失败',
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
					fail: () => {},
					complete: () => {}
				});
			},
			drawingicon(res) {	
				if (!!res.bikes) {
					this.covers = []
					var temparr = []
					for (let i = 0; i < res.bikes.length; i++) {
						let tmpObj = {}
						tmpObj.id = res.bikes[i].id
						if (!!res.bikes[i].coordinate) {
							tmpObj.latitude = res.bikes[i].coordinate[1]
							tmpObj.longitude = res.bikes[i].coordinate[0]
						}
						tmpObj.name = res.bikes[i].name
						// tmpObj.iconPath = '../../static/mapicon/car_normal.png'
						tmpObj.iconPath = this.$imagepath(res.bikes[i], 'car', 0, 0)
						tmpObj.type = 'car'
						tmpObj.width = 39
						tmpObj.height = 48
						temparr.push(tmpObj)
					}
					this.covers = temparr
				}
				if (!!res.parks) {
					console.log(5555555)
					var circles = []
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
						// tmpObjs.iconPath = '../../static/mapicon/stop_0.png'
						var bikenum = parseInt(res.parks[j].capacity) - parseInt(res.parks[j].bike_count)
						tmpObjs.iconPath = this.$imagepath(res.parks[j], 'stop', bikenum, res.parks[j].grade)
						tmpObjs.type = 'stop'
						tmpObjs.bickcount = res.parks[j].bike_count
						tmpObjs.allkcount = res.parks[j].capacity
						tmpObjs.radius = res.parks[j].radius
						tmpObjs.remark = res.parks[j].remark
						tmpObjs.grade = res.parks[j].grade
						tmpObjs.width = 39
						tmpObjs.height = 48
						tmpObjs.parkid = res.parks[j].id
						temparr.push(tmpObjs)
						circles.push(circlesObj)
					}
					this.circles = circles
				}
				
				
			},
			startmoveallclick() {
				if (this.dispatchbtn == '开始派单') {
					this.listenorder()
				} else if (this.dispatchbtn == '开始挪车') {
					if (this.plncble(0) == 1) {
						uni.showToast({
							title: '未有可操作车辆！'
						});
						return
					}
					if (this.isclick == 0) {
						this.isclick = 1
						uni.showLoading({

						})
						this.startmoveall()
					}
				} else {
                    uni.showLoading({
                    
                    })
					if (this.type == 101) {
						if (this.blueconectstate == 1) {

						}
						var isslectcar = false
						// 找到第一个选中的索引
						for (var i = 0; i < this.switchdatatotal.length; i++) {
							if (this.switchdatatotal[i].isselect) {
								this.endcarindex = i
								isslectcar = true
								break
							}
						}
						// 都没选中挪车车辆
						if (isslectcar == false) {
							uni.showToast({
								title: '请选择车辆！'
							});
						} else {
							if (this.isclick == 1) {
								uni.showToast({
									title: '正在提交订单'
								});
								return
							}
							var _self = this
							var endcar = _self.plncble(1)
							ble.initBluetooth(endcar, (res) => {
								res.carinfo = endcar.sn
								_self.setBlueres(res)
								// console.log('bleinfo',_self.blueres,_self.switchdatatotal,_self.endcarindex)
								_self.openOrClose = 10
							})
							this.endmovecars(parkid, endcar.orderid)
						}
					} else {
						this.endmovecars(parkid)
					}

				}

			},
			scanCode(type) {
				if (type == 1) {
					wx.scanCode({
						onlyFromCamera: true, //只允许相机扫码
						success: res => {
							console.log('saoma', res)
							var bikesn = res.result.match(/\?bikesn=(.*)/)[1]
							this.inputval = bikesn
							console.log(this.inputval, 555)
							this.setSn(bikesn)
							this.setBikeid('*')
							this.getcarinfo()
						},
						fail: res => {},
						complete: res => {}
					});
				} else {
					uni.navigateTo({
						url: `/pageA/manualscan/manualscan?urls=${this.urls}&&type=${this.type}`
					})
				}

			},
			startmoveall() {
				var _self = this
				_self.openOrClose = 11
				var movecar = this.plncble(0)
				if (movecar == 1) {
					uni.showToast({
						title: '未有可操作车辆！'
					});
					return
				}
				this.bikeid = this.switchdatatotal[0].id
				setTimeout(() => {
					if (this.blueconectstate == 1) {
						this.premovecar()
					} else {
						this.setSn("*")
						this.bikeid = movecar.id
						if (movecar != 1) {
							console.log('woshi5', movecar)
							this.opercar(allmovetype, 1, 0, '', movecar.id)
						}
						// this.getmovingbike()
					}
				}, 2000)
				this.getmovingbike()
				ble.initBluetooth(movecar, (res) => {
					res.carinfo = movecar.sn
					_self.setBlueres(res)
				})
				ble.onBluetoothAdapterStateChange(function(res) {
					if (res.available == true && res.discovering == false && _self.bluestate == false) {
						ble.initBluetooth(movecar, (res) => {
							_self.setBlueres(res)
						})
					}
				})
			},
			startmove() {
				if (this.switchdatatotal.length == 0) {
					uni.showToast({
						title: '请选择车辆!'
					});
					return
				}
				uni.navigateTo({
					url: '/pageB/movecarPage/checkupcar/checkupcar?type=101',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			checkboxchange(e) {
				this.isallselect = !this.isallselect
				if (this.isallselect) {
					for (var k = 0; k < this.switchdatatotal.length; k++) {
						this.switchdatatotal[k].isselect = true
					}
				} else {
					for (var k = 0; k < this.switchdatatotal.length; k++) {
						this.switchdatatotal[k].isselect = false
					}
				}
			},
			itemclick(i, isselect) {
				this.switchdatatotal[i].isselect = !isselect
				var allselect = true
				for (var k = 0; k < this.switchdatatotal.length; k++) {
					if (this.switchdatatotal[k].isselect == false) {
						this.isallselect = false
						allselect = false
						break
					}
				}
				if (allselect) {
					this.isallselect = true
				}
			},
			manualsgo() {
				this.getcarinfo()
			},
			goNewPage(item) {
				this.setSn(item)
				this.getcarinfo(item)
			},
			// 挪车中的订单列表
			movingbike() {
				console.log(555)
				// this.setBikeid('*')
				let options = {
					url: '/rporder/list',
					method: 'POST',
					data: {
						"user_id": this.userinfo.userinfo.id,
						"pno": 1,
						"psize": 100,
						"sk": '',
						"is_order_finished": 0
					}
				}
				this.$httpReq(options).then((res) => {
					console.log(666)
					console.log('挪车中的订单', res)
					if (res.status == 0) {
						for (var i = 0; i < res.list.length; i++) {
							this.switchdatatotal.push({
								sn: res.list[i].bike_sn,
								id: res.list[i].bike_id,
								state: res.list[i].is_online == 0 ? '离线' : '在线',
								charge: res.list[i].battery_level + '%',
								isselect: true,
								// is_defend_on:res.list[i].is_defend_on,
								is_moved: true,
								imei: res.list[i].imei,
								orderid: res.list[i].id,
								startindex: 0,
								endindex: 0,
							})
							// this.moveorder.push(res.list[i].id)
							// this.setMovebikearr(this.switchdatatotal)
						}

					}
				})
			},
			// 刷新车辆信息
			refreshinfo() {
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
				if (this.switchdatatotal) {
					console.log(777, this.sn, this.switchdatatotal)
					for (var i = 0; i < this.switchdatatotal.length; i++) {
						if (this.sn == this.switchdatatotal[i].sn) {
							uni.showToast({
								title: '该车已在列表中',
								mask: false,
								icon: 'none',
								duration: 1500
							});
							return
						}
					}
				}
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
						if (this.type == 101) {
							// this.setBikeid('*')
							if (res.info.bus_state != 0) {
								uni.showToast({
									title: '该车不可挪',
									mask: false,
									icon: 'none',
									duration: 1500
								});
								return
							}
							this.isclick = 0
							this.switchdatatotal.push({
								sn: res.info.sn,
								id: res.info.id,
								state: res.info.is_online == 0 ? '离线' : '在线',
								charge: res.info.battery_level + '%',
								isselect: true,
								// is_defend_on:res.info.is_defend_on,
								is_moved: false,
								ecu_model: res.info.ecu_model,
								bluetooth_token: res.info.bluetooth_token,
								ecu_sn: res.info.ecu_sn,
								imei: res.info.imei,
								bluetooth_name: res.info.bluetooth_name,
								startindex: 0,
								endindex: 0,
							})
							console.log(666, this.switchdatatotal)
						} else {
							this.setBikeinfo(res.info)
						}


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
					this.dispatchbtn = '开始挪车'
					this.switchdatatotal = []
					this.bikeorder.forEach((item, index) => {
						if (item.end_park_id == e.markerId) {
							var bikeitem = {
								end_park_id: item.end_park_id,
								dispatcher_name: item.dispatcher_name,
								end_park_name: item.end_park_name,
								sn: item.bike_sn,
								id: item.bike_id,
								isselect: true,
								is_moved: false,
								startindex: 0,
								endindex: 0,
							}
							this.switchdatatotal.push(bikeitem)
						}
					})
					// uni.showModal({
					// 	title: '确定挪到以下车站吗？',
					// 	content: pointname,
					// 	showCancel: true,
					// 	cancelText: '取消',
					// 	confirmText: '确定',
					// 	success: res => {
					// 		if (res.confirm) {
					// 			if(this.type==101){
					// 				if(this.blueconectstate == 1){

					// 				}
					// 				var isslectcar=false
					// 				// 找到第一个选中的索引
					// 				for(var i=0;i<this.switchdatatotal.length;i++){
					// 					if(this.switchdatatotal[i].isselect){
					// 						this.endcarindex=i
					// 						isslectcar=true
					// 						break
					// 					}
					// 				}
					// 				// 都没选中挪车车辆
					// 				if(isslectcar==false){
					// 					uni.showToast({
					// 						title: '请选择车辆！'
					// 					});
					// 				}else{
					// 					if(this.isclick==1){
					// 						uni.showToast({
					// 							title: '正在提交订单'
					// 						});
					// 						return
					// 					}
					// 					var _self=this
					// 					var endcar=_self.plncble(1)
					// 					ble.initBluetooth(endcar, (res) => {
					// 						res.carinfo=endcar.sn
					// 						_self.setBlueres(res) 
					// 						// console.log('bleinfo',_self.blueres,_self.switchdatatotal,_self.endcarindex)
					// 						_self.openOrClose = 10								
					// 					})										
					// 					this.endmovecars(parkid,endcar.orderid)
					// 				}																											
					// 			}else{
					// 				this.endmovecars(parkid)
					// 			}					
					// 		} else if (res.cancel) {
					// 			console.log('用户点击取消');
					// 		}
					// 	},
					// 	fail: () => {},
					// 	complete: () => {}
					// });
				}
			},
			// 蓝牙预结束挪车处理
			presubmit(parkid) {
				this.setSn('*')
				this.openOrClose = 10
				var orderid = this.ids
				// console.log(222,this.switchdatatotal,this.switchdatatotal[this.endcarindex])
				if (this.type == 101) {
					// orderid=this.switchdatatotal[this.endcarindex].orderid
					orderid = this.plncble(1).orderid
				}
				uni.getLocation({ //获取当前的位置坐标
					type: 'gcj02',
					success: (res) => {
						var options = {
							url: '/rporder/pre_finish', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"order_id": orderid,
								"user_coordinate": [
									res.longitude, res.latitude
								],
								"park_id": parkid
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('预结束挪车', res)
							if (res.status == 0) {
								var bluetooth_token = this.bikeinfo.bluetooth_token
								// 有token并且蓝牙已经连接
								if (this.type == 101) {
									// bluetooth_token=this.switchdatatotal[this.endcarindex].bluetooth_token
									bluetooth_token = this.plncble(1).bluetooth_token
								}
								if (!!bluetooth_token && this.blueconectstate == 1) {
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
											this.endmoveopr(parkid, 1, loadtime, '无特征值返回')
										} else {
											var _self = this
											this.endmoveopr(parkid, 0, loadtime, 'success')
											if (!!this.blueres.deviceId) {
												uni.closeBLEConnection({
													deviceId: this.blueres.deviceId,
													success(res) {
														console.log('断开蓝牙连接成功', res)
													}
												})
											}
										}
									}, 3000)
								}
								// uni.showToast({
								// 	title: '挪车成功',
								// 	mask: false,
								// 	duration: 3000
								// });
								if (this.type != 101) {
									setTimeout(() => {
										uni.navigateBack({
											delta: 2
										});
									}, 2500)
								}

							} else {
								// uni.showToast({
								// 	title: res.message ? res.message : '挪车失败',
								// 	mask: false,
								// 	icon: 'none',
								// 	duration: 3000
								// });
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
			endmovecars(parkid, orderid) {
				var bluetooth_token = this.bikeinfo.bluetooth_token
				if (this.type == 101) {
					// bluetooth_token=this.switchdatatotal[this.endcarindex].bluetooth_token
					bluetooth_token = this.plncble(1).bluetooth_token
				}
				setTimeout(() => {
					if (!!bluetooth_token && this.blueconectstate == 1) {
						this.presubmit(parkid)
						if (!!bluetooth_token && this.blueconectstate == 1 && this.type != 32) {
							var str1 = ble.doCmd('32', '', bluetooth_token)
							this.uploadflag = true
							setTimeout(() => {
								ble.openLock(str1, 'gps', function(ress) {
									console.log('蓝牙操作', ress)
								})
							}, 4000);
						}
					} else {
						console.log('qhs', orderid)
						this.endmoveopr(parkid, 1, '', '', orderid)
					}
				}, 3000)

			},
			// 结束挪车核心逻辑
			endmoveopr(parkid, successorfail, time, errmess, orderid) {
				this.setSn('*')
				this.openOrClose = 10
				var orderids = this.ids
				if (this.type == 101) {
					// orderids=this.switchdatatotal[this.endcarindex].orderid
					var endmovecar = this.plncble(1)
					orderids = endmovecar.orderid
					ble.initBluetooth(endmovecar, (res) => {
						res.carinfo = endmovecar.sn
						_self.setBlueres(res)
					})
				}
				console.log('id', this.switchdatatotal, orderids, successorfail)
				uni.getLocation({ //获取当前的位置坐标
					type: 'gcj02',
					success: (res) => {
						var options = {
							url: '/rporder/finish', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"order_id": orderids,
								"park_id": parkid,
								"bluetooth": this.blueconectstate,
								"bleinfo": {
									"success": successorfail,
									"cost": time,
									"error_msg": errmess
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

								if (this.type == 101) {
									for (var i = 0; i < this.switchdatatotal.length; i++) {
										if (this.switchdatatotal[i].sn == res.info.bike_sn) {

											this.switchdatatotal.splice(i, 1)
											console.log(4444, this.switchdatatotal)
										}
									}
									if (this.plncble(1) != 1) {
										console.log(11111)
										this.endmoveopr(parkid, 1, '', '', this.plncble(1).orderid)
									}else{
										uni.hideLoading()
										this.dispatchbtn='开始派单'
									}

								}
								uni.showToast({
									title: '挪车成功',
									mask: false,
									duration: 3000
								});
								if (this.type != 101) {
									setTimeout(() => {
										uni.navigateBack({
											delta: 2
										});
									}, 4500)
								}

							} else {
								uni.showToast({
									title: res.message ? res.message : '挪车失败',
									mask: false,
									icon: 'none',
									duration: 3000
								});
								if (this.type == 101) {
									if (this.plncble(1) != 1) {
										this.endmoveopr(parkid, 1, '', '', this.plncble(1).orderid)
									}

								}
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
					// url: '/pages/carBigCenter/carcenter/carcenter',
					url: '/pageB/swapbattery/swapbattery',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			//上报蓝牙操作
			reportblue(type, state, loadtime, errname) {
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
				var bikeid = this.bikeid
				if (this.type == 101) {
					bikeid = this.plncble(0).id
				}
				var options = {
					url: '/rporder/pre_submit', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"bike_id": bikeid,
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('预处理订单-------》', res)
					this.showmap = true
					if (res.status == 0) {
						// 批量挪车
						if (this.type == 101) {
							var str1 = ble.doCmd('20', '00', this.plncble(0).bluetooth_token)
							ble.openLock(str1, 'open', function(res) {
								console.log('蓝牙操作', res)
							})
							setTimeout(() => {
								if (blueWriteState == 0) {
									console.log('blueWriteState2', blueWriteState)
									if (!this.plncble(0).is_moved) {
										console.log('woshi6')
										this.opercar(allmovetype, 1, 0, '', this.plncble(0).id)
									}
								} else {
									var _self = this
									if (!!this.blueres.deviceId) {
										uni.closeBLEConnection({
											deviceId: this.blueres.deviceId,
											success(res) {
												console.log('断开蓝牙连接成功', res)
											}
										})
									}
								}
							}, 3000)
						}
						// 单个挪车
						else {
							try {
								if (!!this.bikeinfo.bluetooth_token && type == 1) {
									var str1 = ble.doCmd('20', '00', this.bikeinfo.bluetooth_token)
									ble.openLock(str1, 'open', function(res) {
										console.log('蓝牙操作', res)
									})
									blueWriteState = 0
									setTimeout(() => {
										if (blueWriteState == 0) {
											console.log('blueWriteState2', blueWriteState)
											// this.reportblue(this.openOrClose, 1, loadtime,'无特征值返回')
											console.log('woshi7')
											this.opercar(allmovetype, 1, loadtime, '无特征值返回')
										} else {
											this.opercar(allmovetype, 0, loadtime, 'success')
										}
									}, 3000)
								} else {
									this.opercar(allmovetype, 1, loadtime, '无特征值返回')
								}
								this.getmovingbike()
							} catch (e) {
								//TODO handle the exception
								this.opercar(allmovetype, 1, loadtime, '无特征值返回')
							}

						}
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
				allmovetype = type
				this.showshartmove = false
				this.showendmove = false
				this.openOrClose = 11
				if (!!this.bikeinfo.bluetooth_token && this.blueconectstate == 1 && type == 1) {
					this.premovecar(type)
				} else {
					console.log('woshi8')
					this.opercar(type, '', '', '')
				}

			},
			// 筛选出正在挪车和需要结束订单的车
			plncble(type) {
				// type=0 开始挪车type=1结束挪车
				var carstate = 1
				for (var i = 0; i < this.switchdatatotal.length; i++) {
					if (type == 0 && !this.switchdatatotal[i].is_moved && this.switchdatatotal[i].isselect && this
						.switchdatatotal[i].startindex < 10) {
						carstate = this.switchdatatotal[i]
						console.log(55555, carstate)
						this.switchdatatotal[i].startindex += 1
						return carstate
					}
					if (type == 1 && !!this.switchdatatotal[i].orderid && this.switchdatatotal[i].isselect && this
						.switchdatatotal[i].endindex < 10) {
						carstate = this.switchdatatotal[i]
						this.switchdatatotal[i].endindex += 1
						return carstate
					}
				}
				return carstate
			},
			// 挪车具体操作
			opercar(type, successorfail, time, errmess, snid) {
				var _self = this
				var types = type
				uni.getLocation({ //获取当前的位置坐标
					type: 'gcj02',
					success: (res) => {
						var bleinfo = {}
						if (successorfail === '') {
							bleinfo = '*'
						} else {
							bleinfo = {
								"success": successorfail,
								"cost": time,
								"error_msg": errmess
							}
						}
						var id = _self.bikeid
						if (_self.type == 101) {
							id = this.plncble(0).id
							types = 0
						}
						var options = {
							url: '/rporder/submit', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"bike_id": id,
								"user_coordinate": [res.longitude, res.latitude],
								"channel": "xxx",
								"bluetooth": _self.blueconectstate,
								'unlock': types,
								// 执行成功传的值不成功不传
								"bleinfo": bleinfo
							}
						}
						_self.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('开始订单', res)
							_self.showmap = true
							// 这里逻辑很复杂还需要处理
							setTimeout(() => {
								if (this.type == 101) {
									if (this.plncble(0) != 1) {
										this.startmoveall()
									} else {
										this.isclick = 0
										uni.hideLoading()
										this.dispatchbtn='结束挪车'
									}
								}

							}, 3000)
							if (res.status == 0) {
								if (_self.type == 101) {
									for (var i = 0; i < _self.switchdatatotal.length; i++) {
										if (res.info.bike_sn == _self.switchdatatotal[i].sn) {
											_self.switchdatatotal[i].is_moved = true
											_self.switchdatatotal[i].orderid = res.info.id
											console.log(9999, _self.switchdatatotal[i])
											return
										}
									}

								}

								_self.ids = res.info.id
								_self.setOrderid(res.info.id)
								_self.getmovingbike()
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
						url: '/pageA/carBigCenter/breakdowncar/breakdowncar',
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
				var bike_ids=[]
				this.switchdatatotal.forEach((item,index)=>{
					bike_ids.push(item.id)
				})
				var options = {
					// url: '/bike/coord_and_park_nearby', //请求接口
					url: '/bike/info_by_ids', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						bike_ids:bike_ids
						// bike_id: this.bikeid,
						// user_coordinate: [this.longitude, this.latitude],
						// park_visitable_flag: 2
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					// console.log('正在挪车辆信息', res)
					if (res.status == 0) {
						this.drawingicon(res)
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

		.moveview {
			margin-top: 30upx;
			text-align: center;

			.startmove {
				height: 90upx;
				line-height: 90upx;
				border: 1upx solid black;
				border-radius: 6upx;
				background-color: rgb(26, 173, 25);
				color: white;
				border-color: white;
			}

			.grayclass {
				background-color: gray;
				color: black;
			}
		}

		.moving-view {
			margin-top: 12upx;

			.view-commons {
				position: relative;
				background-color: white;

				.switch-head {
					height: 90upx;
					line-height: 90upx;
				}

				.center-box {
					width: 500upx;
					height: 350upx;
					text-align: left;
					margin: 40upx;

					.list-item {
						height: 70upx;
						line-height: 70upx;

						.second-text {
							margin-left: 24upx
						}
					}
				}

				.flexd-posion {
					background-color: rgb(225, 225, 225);
				}

				.view-border-bottom {
					border-bottom: 1upx solid rgb(235, 235, 235);
				}

				.view-flexs {
					display: flex;
					// left: 0;
					width: 100%;
					text-align: center;
					align-items: center;

					// justify-content: center;
					.view-border-letf {
						border-left: 1upx solid rgb(235, 235, 235);
					}

					view {
						width: 30%;
					}
				}
			}
		}


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
			/* height: 98vh; */
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
