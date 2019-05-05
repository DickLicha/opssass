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
	import {mapState,mapMutations} from 'vuex'
	export default {
		components: {
			itemCell
		},
		onLoad() {
			this.getcarinfo()
		},
		computed: mapState(['directinfo']),
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
					{
						name: 'SIM卡状态:',
						val: ''
					},
					{
						name: '车锁状态:',
						val: ''
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
				let options = {
					url: '/bike/info', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {						
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('车辆信息2',res)
					console.log('direct',this.directinfo)
					if (res.status == 0) {
						// 车型
						this.carcenterdata1[0].val = res.info.model

						// 库存状态
						this.carcenterdata1[1].val = this.$invstate(res.info.inv_state)
                         
						// 车辆状态
						let health_state =''
						if (res.info.health_state == 0) {
							health_state = '健康'
						} else{
							health_state = '故障'
						}
						this.carcenterdata1[2].val = health_state
						
						// 位置
						this.carcenterdata1[3].val = this.$parkstate(res.info.park_state)
						
						// 车辆业务状态
						if(res.info.bus_state){
							this.carcenterdata2[0].val = this.directinfo.bike_bus_state_enum[res.info.bus_state]
						}
																 
						// 车辆运行状态
						let is_battery_locked = ''
						if (res.info.is_on_battery == 0) {
							is_battery_locked = '开'
						} else if (res.info.is_on_battery == 1) {
							is_battery_locked = '关'
						}
						this.carcenterdata2[1].val = '未接'

						// 网络状态
						let is_online=''
						if(res.info.is_on_battery==0){
							is_online='在线'
						}else if(res.info.is_on_battery==1){
							is_online='离线'
						}
						this.carcenterdata2[2].val = is_online

						// GPS更新时间
						this.carcenterdata2[3].val = res.info.gps_update_time

						// SIM卡状态
						let sim_state=''
						if(res.info.is_on_battery==0){
							sim_state='在线'
						}else if(res.info.is_on_battery==1){
							sim_state='离线'
						}
						this.carcenterdata2[4].val = sim_state

						// 车锁状态
						let is_wheel_locked = ''
						if (res.info.is_wheel_locked == 0) {
							is_wheel_locked = '开'
						} else if (res.info.is_wheel_locked == 1) {
							is_wheel_locked = '关'
						}
						this.carcenterdata2[5].val = is_wheel_locked
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
