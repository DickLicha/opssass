<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="carcenterdata1" :type='2' :border='true'></item-cell>
			<item-cell :itemdata="carcenterdata2" :type='2' :border='true'></item-cell>
			<item-cell :itemdata="carcenterdata3" :type='4' :border='true' @itemclick='gocarcenter'></item-cell>
			<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction"
			 @trigger="trigger" />
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	import uniFab from '@/components/uni-fab/uni-fab.vue'
	import {mapState,mapMutations} from 'vuex'
	import ble from '../../../common/xa-bluetooth.js'
	// import {doCmd} from '../../../common/strdel.js'
	export default {
		components: {
			itemCell,
			uniFab
		},
			onUnload() {
			// uni.closeBluetoothAdapter({
			// 	success(res) {
			// 		console.log(res)
			// 	}
			// })
		},
		onLoad() {
			try{
				// 车型
				this.carcenterdata1[0].val = this.bikeinfo.model
				
				// 库存状态
				this.carcenterdata1[1].val = this.$invstate(this.bikeinfo.inv_state)
				 
				// 车辆状态
				let health_state =''
				if (this.bikeinfo.health_state == 0) {
					health_state = '健康'
				} else{
					health_state = '故障'
				}
				this.carcenterdata1[2].val = health_state
				
				// 位置
				this.carcenterdata1[3].val = this.$parkstate(this.bikeinfo.park_state)
				// 车辆业务状态
				console.log('this.directinfo.bike_bus_state_enum',this.directinfo.bike_bus_state_enum,this.bikeinfo.bus_state)
				this.carcenterdata2[0].val = this.directinfo.bike_bus_state_enum[this.bikeinfo.bus_state]
				if(this.bikeinfo.bus_state){
					this.carcenterdata2[0].val = this.directinfo.bike_bus_state_enum[0]
				}
														 
				// 车辆运行状态
				let is_battery_locked = ''
				if (this.bikeinfo.is_in_motion == 0) {
					is_battery_locked = '静止'
				} else if (this.bikeinfo.is_in_motion == 1) {
					is_battery_locked = '运动'
				}
				this.carcenterdata2[1].val = is_battery_locked
				
				// 网络状态
				let is_online=''
				if(this.bikeinfo.is_online==1){
					is_online='在线'
				}else if(this.bikeinfo.is_online==0){
					is_online='离线'
				}
				this.carcenterdata2[2].val = is_online
				
				// GPS更新时间
				this.carcenterdata2[3].val = this.bikeinfo.gps_update_time
				
				// SIM卡状态
				// let sim_state=''
				// if(this.bikeinfo.is_on_battery==0){
				// 	sim_state='在线'
				// }else if(this.bikeinfo.is_on_battery==1){
				// 	sim_state='离线'
				// }
				// this.carcenterdata2[4].val = sim_state
				
				// 车锁状态
				let is_wheel_locked = ''
				if (this.bikeinfo. is_defend_on == 1) {
					is_wheel_locked = '设防'
				} else if (this.bikeinfo. is_defend_on == 0) {
					is_wheel_locked = '撤防'
				}
				this.carcenterdata2[4].val = is_wheel_locked
				
				// 异常状态
				this.carcenterdata2[5].val = this.bikeinfo.alert_state_desc
				
			}catch(e){
				//TODO handle the exception
			}
			
		},
		computed: mapState(['directinfo','bikeinfo','blueres']),
		data() {
			return {
				carcenterdata1: [{
						name: '车型:',
						val: ''
					},
					{
						name: '库存状态:',
						val: ''
					},
					{
						name: '车辆状态:',
						val: ''
					},
					{
						name: '车辆位置:',
						val: ''
					},
				],
				carcenterdata2: [{
						name: '使用状态:',
						val: ''
					},
					{
						name: '运行状态:',
						val: ''
					},
					{
						name: '网络状态:',
						val: ''
					},
					{
						name: 'GPS状态:',
						val: ''
					},
					// {
					// 	name: 'SIM卡状态:',
					// 	val: ''
					// },
					{
						name: '车锁状态:',
						val: ''
					},
					{
						name: '异常状态:',
						val: ''
					},
				],
				carcenterdata3: [{
						name: '订单',
						val: '',
						url: '/pages/carBigCenter/carorder/carorder'
					},
					{
						name: '车辆操作记录',
						val: '',
						url: '/pages/switchloockinfo/switchloockinfo'
					},
					{
						name: '换电记录',
						val: '',
						url: '/pages/carBigCenter/batteriesrecord/batteriesrecord'
					},
					{
						name: '维修记录',
						val: '',
						url: '/pages/carBigCenter/carorbit/carorbit'
					},
					{
						name: '车辆轨迹',
						val: '',
						url: '/pages/map/map?type=0.1&&name=用户骑行轨迹'
					},
					{
						name: '最后一次扫码时手机位置',
						val: '',
						url: '/pages/map/map?type=0.2&&name=最后扫码位置'
					},
					{
						name: '车辆当前位置',
						val: '',
						url: '/pages/map/map?type=0.3&&name=车辆当前位置'
					},
					{
						name: 'ECU',
						val: '',
						url: '/pages/carBigCenter/ecuview/ecuview'
					},
					{
						name: '电池',
						val: '',
						url: '/pages/carBigCenter/batteryview/batteryview'
					},
				],
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
			}
		},
		methods: {
			gocarcenter(item) {
				uni.navigateTo({
					url: item.url,
					success: res => {},
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
			// 寻车铃
			openring() {	
				var options = {
					url: '/bike/ring', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						id:this.bikeinfo.id
					}
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
		}
	}
</script>

<style lang='scss' scoped>
	.wrap {
		background-color: rgb(245, 245, 245);
		padding-top: 1upx;
		padding-bottom: 1upx;

		.view-common {
			margin: 10upx 22upx;
			padding-bottom: 40upx;
		}
	}
</style>
