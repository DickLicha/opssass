<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="swapdata" type='4' :border='borders' @itemclick='gocarcenter'></item-cell>
			<view v-show="showdetil">
				<item-cell :itemdata="swapbatterydata" type='2' :border='borders'></item-cell>
				<view class='check-bottom-view'>
					<view class='checkup-text'><text>安全检查项目:</text></view>
					<view class='checkup-text' v-for="(item,i) in checkupdata"><text>{{item}}</text></view>
				</view>
				<view class='change-battery-button'>
					<button class='share-button-default checkup-button' type="primary" @click='changbattery(0)'>车辆故障</button>
					<button class='share-button-default checkup-button' type='primary' @click='changbattery(1)'>车辆正常</button>
				</view>
			</view>


			<view v-show=''>
				<map class='base-map-view' :show-location='true' v-show='showmap' @markertap='markclick' :scale="scale" :latitude="latitude"
				 :longitude="longitude" :markers="covers" :circles="circles">
				</map>
			</view>

			<!-- <view v-show="showshartmove" class='end-move-button'>
				<button class='share-button-default margin-topbtn' @click='startmovecar'>开始挪车</button>
			</view> -->

			<view v-show="showendmove" class='end-move-button'>
				<button class='share-button-default margin-topbtn' type='primary' @click='endmovecar'>开始挪车</button>
			</view>

		</view>
	</view>
</template>

<script>
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
			}
		},
		components: {
			itemCell
		},
		computed: mapState(['bikeinfo','blueres','bluestate','baseurl']),
		onLoad(e) {
			if(e.type!=100){
				var _self = this
				var name = _self.bikeinfo.bluetooth_name
				ble.onBLECharacteristicValueChange(function(res) {
					console.log('特征值返回', res)
					var gps=res.slice(0,2)
					console.log(gps,'gps')
					if(gps==32){
						gpsSb=res
						var str1 = ble.doCmd('21', '', _self.bikeinfo.bluetooth_token)
						ble.openLock(str1, _self.blueres.deviceId, _self.blueres.serviceId, _self.blueres.characterId, function(res) {
							console.log('蓝牙操作', res)													
						})
					}
					if(gps==21){
						stateSb=res
						var options = {
							url: '/bike/report_bike_gps', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								bike_id: _self.bikeinfo.id,
								stat: stateSb,
								gps: gpsSb
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
					
				})			
				ble.initBluetooth(name, (res) => {
					_self.setBlueres(res)
						var str1 = ble.doCmd('32', '', _self.bikeinfo.bluetooth_token)
						ble.openLock(str1, _self.blueres.deviceId, _self.blueres.serviceId, _self.blueres.characterId, function(res) {
							console.log('蓝牙操作', res)
							
						})			
				})
				ble.onBluetoothAdapterStateChange(function(res) {
					console.log('回调', res)
					if (res.available == true && res.discovering == false && _self.bluestate == false) {
						console.log(66666)
						ble.initBluetooth(name, (res) => {
							_self.setBlueres(res)
						})
					}
				})
			}
			
			console.log('type',e.type)
			if (e.type == 99) {
				this.showdetil = false
				this.showmap = true
				// this.showendmove = true
				this.bikeid = e.bikeid
				this.ids = e.orderid
				this.setSn(e.bikeid.slice(6,14))
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

			this.swapdata[0].val = this.bikeid
		},
		onUnload() {
			clearInterval(this.timmer)
			this.timmer = null
			uni.closeBluetoothAdapter({
				success(res) {
					console.log('关闭蓝牙',res)
				}
			})
		},
		methods: {
			...mapMutations(['setEndmove', 'setOrderid', 'setSn','setBlueres']),
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
					pointname = '',
					parkid = ""

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
			// 结束挪车
			endmovecars(parkid) {
				console.log('this.blueres',this.blueres)
				var str1 = ble.doCmd('20', '01', this.bikeinfo.bluetooth_token)
				ble.openLock(str1, this.blueres.deviceId, this.blueres.serviceId, this.blueres.characterId, function(res) {
					console.log('蓝牙操作', res)
				})
				this.setSn('*')
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
								"user_coordinate": [
									res.longitude, res.latitude
								]
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('挪车', res)
							if (res.status == 0) {
								uni.showToast({
									title: '挪车成功',
									mask: false,
									duration: 3000
								});
								setTimeout(() => {
									uni.navigateBack({
										delta: 2
									});
								}, 2000)
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
			// 开始挪车生成订单
			endmovecar() {
				this.startmovecar()
			},
			// 开始挪车
			startmovecar() {
				this.showshartmove = false
				this.showendmove = false
				var str1 = ble.doCmd('20', '00', this.bikeinfo.bluetooth_token)
				console.log('开始挪车=-----》',this.blueres)
				ble.openLock(str1, this.blueres.deviceId, this.blueres.serviceId, this.blueres.characterId, function(res) {
					console.log('蓝牙操作', res)
				})
				// this.showendmove = true
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
								"channel": "xxx"
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('开始订单', res)
							if (res.status == 0) {
								// this.orderid = res.info.id
								// this.setEndmove(true)
								this.ids = res.info.id
								this.setOrderid(res.info.id)
								this.showmap = true

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
					console.log('正在挪车辆信息', res)
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
							tmpObjs.iconPath = this.$imagepath(res.parks[j], 'stop', bikenum)
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

		.end-move-button {
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
