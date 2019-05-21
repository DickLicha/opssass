<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="swapdata" type='4' :border='borders' @itemclick='gocarcenter'></item-cell>
			<item-cell :itemdata="swapbatterydata" type='2' :border='borders'></item-cell>
			<view class='change-battery-button'>
				<button class='share-button-default' @click='changbattery(buttonname)'>{{buttonname}}</button>
			</view>
			<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction"
			 @trigger="trigger" />
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	import uniFab from '@/components/uni-fab/uni-fab.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				title: 'uni-fab',
				directionStr: '垂直',
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'vertical',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF'
				},
				content: [{
						// iconPath: '/static/component.png',
						// selectedIconPath: '/static/componentHL.png',
						text: '关锁',
						val: '0',
						active: false
					},
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
						name: 'SIM卡状态:',
						val: ''
					},
				]
			}
		},
		components: {
			itemCell,
			uniFab
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
			if (this.bikeinfo.is_on_battery == 0) {
				is_online = '在线'
			} else if (this.bikeinfo.is_on_battery == 1) {
				is_online = '离线'
			}
			this.swapbatterydata[6].val = is_online

			// gps更新时间
			this.swapbatterydata[7].val = this.bikeinfo.gps_update_time

			// sim卡状态
			let sim_state = ''
			if (this.bikeinfo.is_on_battery == 0) {
				sim_state = '在线'
			} else if (this.bikeinfo.is_on_battery == 1) {
				sim_state = '离线'
			}
			this.swapbatterydata[8].val = sim_state
		},
		methods: {
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
							title: res.message ? res.message : '开启寻车铃失败'
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
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
				console.log(e)
				this.content[e.index].active = !e.item.active
				switch (e.item.val) {
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
									this.openbattery()
								}
							},
							fail: () => {},
							complete: () => {}
						});
						break
				}

				// uni.showModal({
				// 	title: '提示',
				// 	content: `您${this.content[e.index].active ? '选中了' : '取消了'}${e.item.text}`,
				// 	success: function(res) {
				// 		if (res.confirm) {
				// 			console.log('用户点击确定')
				// 		} else if (res.cancel) {
				// 			console.log('用户点击取消')
				// 		}
				// 	}
				// })
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
							}
						},
						fail: () => {},
						complete: () => {}
					});
				} else {
					this.closebattery()
				}

			},
			// 打开电池锁
			openbattery() {
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						var options = {
							url: '/bcorder/submit', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"channel": "WXMP",
								"bike_id": this.bikeid,
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
										this.buttonname = '关闭电池锁'
									},
									fail: () => {},
									complete: () => {}
								});
							} else {
								uni.showToast({
									title: res.message?res.message:'开锁失败!',
									duration: 2000
								})
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
			// 关闭电池锁完成订单
			closebattery() {
				uni.getLocation({
					type: 'wgs84',
					success: res => {
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
								this.buttonname = '更换电池'
								uni.showToast({
									title: '关成功!',
									duration: 2000
								})
							} else {
								uni.showToast({
									title: res.message ? res.message : '关锁失败!',
									duration: 2000
								})
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
						// 车辆编码
						this.swapdata[0].val = res.info.id

						// 车型
						this.swapbatterydata[0].val = res.info.model

						// 剩余电量
						this.swapbatterydata[1].val = res.info.battery_level + '%'

						// 电池状态
						let is_on_battery = ''
						if (res.info.is_on_battery == 0) {
							is_on_battery = '空置'
						} else if (res.info.is_on_battery == 1) {
							is_on_battery = '装入'
						}
						this.swapbatterydata[2].val = is_on_battery

						// 电池锁状态
						let is_battery_locked = ''
						if (res.info.is_on_battery == 0) {
							is_battery_locked = '开'
						} else if (res.info.is_on_battery == 1) {
							is_battery_locked = '关'
						}
						this.swapbatterydata[3].val = is_battery_locked

						// 电池电压
						this.swapbatterydata[4].val = res.info.battery_volt / 1000 + 'V'

						// 剩余容量
						this.swapbatterydata[5].val = res.info.battery_capacity / 1000 + 'Ah'

						// 网络状态
						let is_online = ''
						if (res.info.is_on_battery == 0) {
							is_online = '在线'
						} else if (res.info.is_on_battery == 1) {
							is_online = '离线'
						}
						this.swapbatterydata[6].val = is_online

						// gps更新时间
						this.swapbatterydata[7].val = res.info.gps_update_time

						// sim卡状态
						let sim_state = ''
						if (res.info.is_on_battery == 0) {
							sim_state = '在线'
						} else if (res.info.is_on_battery == 1) {
							sim_state = '离线'
						}
						this.swapbatterydata[8].val = sim_state

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
