<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="carcenterdata1" :type='2' :border='true'></item-cell>
			<item-cell :itemdata="carcenterdata2" :type='2' :border='true'></item-cell>
			<item-cell :itemdata="carcenterdata3" :type='4' :border='true' @itemclick='gocarcenter'></item-cell>
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	export default {
		components: {
			itemCell
		},
		onLoad() {
			console.log(555)
			this.getcarinfo()
		},
		data() {
			return {
				carcenterdata1: [{
						name: '车型:',
						val: '6.0'
					},
					{
						name: '库存状态:',
						val: '已投放'
					},
					{
						name: '车辆状态:',
						val: '正常'
					},
					{
						name: '车辆位置:',
						val: '车站外'
					},
				],
				carcenterdata2: [{
						name: '使用状态:',
						val: '空闲'
					},
					{
						name: '运行状态状态:',
						val: '禁止不止10分钟'
					},
					{
						name: '网络状态:',
						val: '在线'
					},
					{
						name: 'GPS状态:',
						val: '可用'
					},
					{
						name: 'SIM卡状态:',
						val: '可用'
					},
					{
						name: '车锁状态:',
						val: '关闭'
					},
					{
						name: '车把状态:',
						val: '可用'
					},
				],
				carcenterdata3: [{
						name: '订单',
						val: '',
						url: '/pages/carorder/carorder'
					},
					{
						name: '开关锁记录',
						val: '',
						url: '/pages/switchloockinfo/switchloockinfo'
					},
					{
						name: '换电记录',
						val: '',
						url: '/pages/batteriesrecord/batteriesrecord'
					},
					{
						name: '维修记录',
						val: '',
						url: '/pages/carorbit/carorbit'
					},
					{
						name: '车辆轨迹',
						val: '',
						url: '/pages/map/map?type=0.1'
					},
					{
						name: '最后一次扫码时手机位置',
						val: '',
						url: '/pages/map/map?type=0.2'
					},
					{
						name: 'ECU',
						val: '',
						url: '/pages/ecuview/ecuview'
					},
					{
						name: '电池',
						val: '',
						url: '/pages/batteryview/batteryview'
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
			// 获取车辆信息
			getcarinfo() {
				var options = {
					url: '/bike/info', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"token": "xxxx",
						"id": "test0001"
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('车辆信息',res)
					if (res.status == 0) {
						// 车辆编码
						this.carcenterdata1[0].val = res.info.id

						// 车型
						this.carcenterdata1[1].val = res.info.model

						// 车辆状态
						let health_state =this.$faulttype(res.info.health_state)
						console.log(333,health_state)
						this.carcenterdata1[2].val = health_state
						

						// 电池锁状态
						let is_battery_locked = ''
						if (res.info.is_on_battery == 0) {
							is_battery_locked = '开'
						} else if (res.info.is_on_battery == 1) {
							is_battery_locked = '关'
						}
						this.carcenterdata1[3].val = is_battery_locked

						// 电池电压
						this.carcenterdata1[4].val = res.info.battery_volt

						// 剩余容量
						this.carcenterdata1[5].val = '未接入'

						// 剩余寿命
						this.carcenterdata1[6].val = '未接入'

						// 网络状态
						let is_online = ''
						if (res.info.is_on_battery == 0) {
							is_online = '在线'
						} else if (res.info.is_on_battery == 1) {
							is_online = '离线'
						}
						this.carcenterdata1[7].val = is_online

						// gps状态
						this.carcenterdata1[8].val = '未接入'

						// sim卡状态
						let sim_state = ''
						if (res.info.is_on_battery == 0) {
							sim_state = '在线'
						} else if (res.info.is_on_battery == 1) {
							sim_state = '离线'
						}
						this.carcenterdata1[9].val = sim_state

					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
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
		}
	}
</style>
