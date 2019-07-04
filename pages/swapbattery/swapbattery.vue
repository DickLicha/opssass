<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="swapdata" type='4' :border='borders' @itemclick='gocarcenter'></item-cell>
			<item-cell :itemdata="swapbatterydata" type='2' :border='borders'></item-cell>
			<view class='change-battery-button'>
				<button type='primary' class='share-button-default' @click='changbattery(buttonname)'>{{buttonname}}</button>
			</view>

			<uni-popup :show="poptype ==='middle-list'" position="middle" mode="fixed" @hidePopup="togglePopup('')">
				<view :scroll-y="true" class="uni-center center-box">
					<view><text>换电前电量：</text><text>{{beforeelec}}</text></view>
					<view><text>换电后电量：</text><text>{{afterelect}}</text></view>
					<view><text>电量增长：</text><text>{{addelect}}</text></view>
				</view>
			</uni-popup>

			<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction"
			 @trigger="trigger" />
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	import uniFab from '@/components/uni-fab/uni-fab.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				beforeelec: 0,
				afterelect: 0,
				addelect: 0,
				title: 'uni-fab',
				directionStr: '垂直',
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'vertical',
				poptype: '',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF'
				},
				content: [
					// {
					// 	// iconPath: '/static/component.png',
					// 	// selectedIconPath: '/static/componentHL.png',
					// 	text: '开锁',
					// 	val: '-1',
					// 	active: false
					// },
					// {
					// 	text: '关锁',
					// 	val: '0',
					// 	active: false
					// },
					{
						text: '寻车铃',
						val: '1',
						active: false
					},
					// {
					// 	text: '找不到车',
					// 	val: '2',
					// 	active: false
					// },
					{
						text: '报修',
						val: '3',
						active: false
					},
					{
						text: '违章举报',
						val: '4',
						active: false
					},
					{
						text: '开电池锁',
						val: '5',
						active: false
					},
					{
						text: '测试',
						val: '6',
						active: false
					},
					{
						text: '',
						val: '7',
						active: false
					},
				],
				borders: true,
				buttonname: '更换电池',
				swapdata: [{
					name: '车辆编号:',
					val: ''
				}],
				orderid: '',
				swapbatterydata: [{
						name: '车型:',
						val: ''
					},
					{
						name: '剩余电量:',
						val: ''
					},
					{
						name: '电池状态:',
						val: ''
					},
					{
						name: '电池锁状态:',
						val: ''
					},
					{
						name: '电池电压:',
						val: ''
					},
					{
						name: '剩余容量:',
						val: ''
					},
					{
						name: '网络状态:',
						val: ''
					},
					{
						name: 'GPS更新时间:',
						val: ''
					},
					{
						name: '是否设防:',
						val: ''
					},
					// {
					// 	name:'异常状态',
					// 	val:''
					// }
				]
			}
		},
		components: {
			itemCell,
			uniFab,
			uniPopup
		},
		onBackPress() {
			if (this.$refs.fab.isShow) {
				this.$refs.fab.close()
				return true
			}
			return false
		},
		computed: mapState(['bikeinfo', 'bikeid']),
		onLoad() {
			this.beforeelec = this.bikeinfo.battery_level + '%'
			// this.getcarinfo()
			// 车辆编码
			this.swapdata[0].val = this.bikeinfo.id

			// 车型
			this.swapbatterydata[0].val = this.bikeinfo.model

			// 剩余电量
			this.swapbatterydata[1].val = this.bikeinfo.battery_level + '%'

			// 电池状态
			let is_on_battery = ''
			if (this.bikeinfo.is_on_battery == 0) {
				is_on_battery = '空置'
			} else if (this.bikeinfo.is_on_battery == 1) {
				is_on_battery = '装入'
			}
			this.swapbatterydata[2].val = is_on_battery

			// 电池锁状态
			let is_battery_locked = ''
			if (this.bikeinfo.is_on_battery == 0) {
				is_battery_locked = '开'
			} else if (this.bikeinfo.is_on_battery == 1) {
				is_battery_locked = '关'
			}
			this.swapbatterydata[3].val = is_battery_locked

			// 电池电压
			this.swapbatterydata[4].val = this.bikeinfo.battery_volt / 1000 + 'V'

			// 剩余容量
			this.swapbatterydata[5].val = this.bikeinfo.battery_capacity / 1000 + 'Ah'


			// 网络状态
			let is_online = ''
			if (this.bikeinfo.is_online == 0) {
				is_online = '离线'
			} else if (this.bikeinfo.is_online == 1) {
				is_online = '在线'
			}
			this.swapbatterydata[6].val = is_online

			// gps更新时间
			this.swapbatterydata[7].val = this.bikeinfo.gps_update_time

			// sim卡状态
			let sim_state = ''
			if (this.bikeinfo.is_defend_on == 1) {
				sim_state = '是'
			} else if (this.bikeinfo.is_defend_on == 0) {
				sim_state = '否'
			}
			this.swapbatterydata[8].val = sim_state

			// 异常状态
			// this.swapbatterydata[9].val = this.bikeinfo.alert_state_desc
		},
		methods: {
			...mapMutations(['setSn']),
			openlock() {
				uni.getLocation({
					type: 'wgs84',
					success: ress => {
						var options = {
							url: '/bike/unlock', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"bike_id": this.bikeinfo.id,
								"user_coordinate": [
									ress.longitude,
									ress.latitude
								]
							}
						}
						this.$httpReq(options).then((res) => {
							if (res.status == 0) {
								uni.showToast({
									title: '开锁成功',
									duration: 2000,
								});
							} else {
								uni.showToast({
									title: res.message ? res.message : '开锁失败',
									icon: 'none',
									duration: 2000,
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
			gocarcenter() {
				uni.navigateTo({
					url: '/pages/carBigCenter/carcenter/carcenter',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			// 寻车铃
			openring() {
				var options = {
					url: '/bike/ring', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('寻车铃', typeof(res), res)
					if (res.status == 0) {} else {
						uni.showToast({
							icon: 'none',
							title: res.message ? res.message : '开启寻车铃失败'
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			togglePopup() {
				this.poptype = ''
			},
			// 关锁
			closelock() {
				uni.getLocation({
					type: 'wgs84',
					success: ress => {
						var options = {
							url: '/bike/lock', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"bike_id": this.bikeinfo.id,
								"user_coordinate": [
									ress.longitude,
									ress.latitude
								]
							}
						}
						this.$httpReq(options).then((res) => {
							if (res.status == 0) {
								uni.showToast({
									title: '关锁成功',
									duration: 2000,
								});
							} else {
								uni.showToast({
									title: res.message ? res.message : '关锁失败',
									icon: 'none',
									duration: 2000,
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
			trigger(e) {
				this.content[e.index].active = !e.item.active
				switch (e.item.val) {
					case '-1':
						this.openlock()
						break
					case '0':
						this.closelock()
						break
					case '1':
						this.openring()
						break
					case '3':
						uni.navigateTo({
							url: '/pages/movecarPage/checkupcar/checkupcar',
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
						break
					case '4':
						uni.navigateTo({
							url: '/pages/repairlist/repairlist?type=10&&name=违章骑行',
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
						break
					case '5':
						uni.showModal({
							title: '确认打开电池锁',
							content: '',
							// showCancel: false,
							cancelText: '取消',
							confirmText: '打开',
							confirmColor: '#F6C700',
							success: res => {
								if (res.confirm) {
									uni.showLoading({
										title: '开锁中'
									});
									// this.openbattery()
									this.unlockbattery()
								}
							},
							fail: () => {},
							complete: () => {}
						});
						break
					case '6':
						this.biketest()
						break
				}
			},
			switchBtn(hor, ver) {
				if (hor === 0) {
					this.direction = this.direction === 'horizontal' ? 'vertical' : 'horizontal'
					this.directionStr = this.direction === 'horizontal' ? '垂直' : '水平'
				} else {
					this.horizontal = hor
					this.vertical = ver
				}
				this.$forceUpdate()
			},
			changbattery(name) {
				console.log('name', name)
				if (name == '更换电池') {
					uni.showModal({
						title: '确认打开电池锁',
						content: '',
						// showCancel: false,
						cancelText: '取消',
						confirmText: '打开',
						confirmColor: '#F6C700',
						success: res => {
							if (res.confirm) {
								this.openbattery()
								// uni.showLoading({
								// 	title: '开锁中'
								// });
							}
						},
						fail: () => {},
						complete: () => {}
					});
				} else {
					this.closebattery()
				}

			},
			// 单独开锁不产生绩效
			unlockbattery() {
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						var options = {
							url: '/bike/unlock_battery', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"user_coordinate": [
									res.longitude, res.latitude
								],
								id: this.bikeinfo.id
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('打开电池锁', res)
							if (res.status == 0) {
								// uni.showToast({
								// 	title: '开锁成功!',
								// 	duration: 2000
								// })
								// this.orderid = res.info.id								
								uni.showModal({
									title: '电池锁已打开，请更换电池',
									content: '电池锁更换完毕后，会自动记录本次操作',
									showCancel: false,
									cancelText: '',
									confirmText: '我知道了',
									success: res => {
										// this.buttonname = '关闭电池锁'
									},
									fail: () => {},
									complete: () => {}
								});
								// setTimeout(()=>{
								// 	uni.navigateBack({
								// 		delta: 1
								// 	});
								// },2000)
							} else {
								uni.showToast({
									title: res.message ? res.message : '开锁失败!',
									icon: 'none',
									duration: 2000
								})
							}
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
			// test
			biketest() {
				this.setSn('*')
				var options = {
					url: '/bike/test', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {

					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('test', res)
					if (res.status == 0) {
						// uni.showToast({
						// 	title: '开锁成功!',
						// 	duration: 2000
						// })
						// this.orderid = res.info.id
						// uni.hideLoading()
						uni.showToast({
							title: 'success'
						});

					} else {
						uni.showToast({
							title: res.message ? res.message : '失败!',
							icon: 'none',
							duration: 2000
						})
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 打开电池锁
			openbattery() {
				uni.showLoading({
					title: '开锁中'
				});
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						var options = {
							url: '/bcorder/submit', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"channel": "WXMP",
								"bike_id": this.bikeinfo.id,
								"user_coordinate": [
									res.longitude, res.latitude
								]
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('打开电池锁', res)
							if (res.status == 0) {
								// uni.showToast({
								// 	title: '开锁成功!',
								// 	duration: 2000
								// })
								this.orderid = res.info.id								
								uni.showModal({
									title: '电池锁已打开，请更换电池',
									content: '电池锁更换完毕后，会自动记录本次操作',
									showCancel: false,
									cancelText: '',
									confirmText: '我知道了',
									success: res => {
										this.buttonname = '结束换电'
									},
									fail: () => {},
									complete: () => {}
								});
								// setTimeout(()=>{
								// 	uni.navigateBack({
								// 		delta: 1
								// 	});
								// },2000)
							} else {
								uni.showToast({
									title: res.message ? res.message : '开锁失败!',
									icon: 'none',
									duration: 2000
								})
							}
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
			// 关闭电池锁完成订单
			closebattery() {
				uni.showLoading({
					title: '开锁中'
				});
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						this.setSn('*')
						var options = {
							url: '/bcorder/finish', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"order_id": this.orderid,
								"user_coordinate": [
									res.longitude, res.latitude
								]
							},
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('关锁完成订单电池锁', res)
							if (res.status == 0) {
								this.poptype = 'middle-list'
								this.buttonname = '更换电池'
								this.afterelect = res.info.battery_level_after + '%'
								this.addelect = res.info.battery_level_after - this.bikeinfo.battery_level + '%'
								// this.getcarinfo()
								// uni.showToast({
								// 	title: '关成功!',
								// 	duration: 2000
								// })
							} else {
								uni.showToast({
									title: res.message ? res.message : '关锁失败!',
									icon: 'none',
									duration: 2000
								})
							}
						}).catch((err) => {
							// 请求失败的回调
							console.error(err, '捕捉')
						})
					},
					fail: () => {						
					},
					complete: () => {
						uni.hideLoading()
					}
				});

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
					console.log('车辆信息', typeof(res), res)
					if (res.status == 0) {
						this.afterelect = res.info.battery_level + '%'
						this.addelect = res.info.battery_level - this.bikeinfo.battery_level + '%'
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
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

		.center-box {
			font-size: 34upx;
			height: 140upx;
			width: 240upx;
		}

		/* margin-bottom: 20upx; */
		.view-common {
			margin: 10upx 22upx;
			height: 98vh;
			position: relative;

			.change-battery-button {
				position: fixed;
				bottom: 3vh;
				width: 706upx;
			}
		}
	}
</style>
