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
			// this.getcarinfo()
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
			console.log('this.directinfo.bike_bus_state_enum',this.directinfo,this.bikeinfo.bus_state)
			// 车辆业务状态
			if(this.bikeinfo.bus_state){
				this.carcenterdata2[0].val = this.directinfo.bike_bus_state_enum[this.bikeinfo.bus_state]
			}
													 
			// 车辆运行状态
			let is_battery_locked = ''
			if (this.bikeinfo.is_on_battery == 0) {
				is_battery_locked = '开'
			} else if (this.bikeinfo.is_on_battery == 1) {
				is_battery_locked = '关'
			}
			this.carcenterdata2[1].val = '未接'
			
			// 网络状态
			let is_online=''
			if(this.bikeinfo.is_on_battery==0){
				is_online='在线'
			}else if(this.bikeinfo.is_on_battery==1){
				is_online='离线'
			}
			this.carcenterdata2[2].val = is_online
			
			// GPS更新时间
			this.carcenterdata2[3].val = this.bikeinfo.gps_update_time
			
			// SIM卡状态
			let sim_state=''
			if(this.bikeinfo.is_on_battery==0){
				sim_state='在线'
			}else if(this.bikeinfo.is_on_battery==1){
				sim_state='离线'
			}
			this.carcenterdata2[4].val = sim_state
			
			// 车锁状态
			let is_wheel_locked = ''
			if (this.bikeinfo.is_wheel_locked == 0) {
				is_wheel_locked = '开'
			} else if (this.bikeinfo.is_wheel_locked == 1) {
				is_wheel_locked = '关'
			}
			this.carcenterdata2[5].val = is_wheel_locked
			
			// 异常状态
			this.carcenterdata2[6].val = this.bikeinfo.alert_state_desc
			// var ss=this.parseBitsPosition(parseInt(this.bikeinfo.alert_state))
			// console.log(33,ss)
		},
		computed: mapState(['directinfo','bikeinfo']),
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
						name: '开关锁记录',
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
						url: '/pages/carBigCenter/ecuview/ecuview'
					},
					{
						name: '电池',
						val: '',
						url: '/pages/carBigCenter/batteryview/batteryview'
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
