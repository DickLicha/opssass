<template>
	<view class='wrap'>
		<view class='view-common'>
			<view class='center-view'>
				<view class='change-view'>
					<input class='old-pwd' type="text" placeholder="请输入原密码">
				</view>
				<view class='change-view'>
					<input class='old-pwd' type="text" placeholder="输入新密码(8-20位密码,需要包含数字,字母')">
				</view>
				<view class='change-view'>
					<input class='old-pwd' type="text" placeholder="重复输入新密码">
				</view>
			</view>
			<button class='share-button-default login-out' type='primary' @click="loginout">确定修改</button>
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
		},
		computed: mapState(['directinfo','bikeinfo']),
		data() {
			return {
				carcenterdata1: [{
						name: '姓名:',
						val: ''
					},
					{
						name: '手机号:',
						val: ''
					}
				],
				carcenterdata2: [{
						name: '修改登录密码',
						val: ''
					}
				]
			}
		},
		methods: {
			molidpwd(){
				uni.navigateTo({
					url: '/pages/mine/changepwd/changepwd',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			loginout(){
				uni.showModal({
					title: '退出登录',
					content: '确认退出登录？',
					// showCancel: false,
					cancelText: '取消',
					confirmText: '退出登录',
					success: res => {
						uni.showToast({
							title: '退出登录成功！'
						});
					},
					fail: () => {},
					complete: () => {}
				});
			}
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
			height:100vh;
			.center-view{
				margin-top: 30upx;
			}
			.change-view{
				margin-top: 28upx;
				border-bottom: 1upx solid rgb(200,200,200);
				height: 70upx;
				/* background-color: white; */
				.old-pwd{
					padding-left: 20upx;
				}
			}
			.login-out{
				position: fixed;
				bottom: 20upx;
				width: calc(100% - 44upx)
			}
		}
	}
</style>
