<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="carcenterdata1" :type='2' :border='true' @itemclick='callphone' ></item-cell>
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	export default {
		components:{
			itemCell
		},
		data() {
			return {
				carcenterdata1:[
					{name:'剩余电量:',val:'100%'},
					{name:'电池电压:',val:'55.5V'},
					{name:'剩余容量:',val:'3.9Ah'},
					{name:'型号编码:',val:'XH480-14J'},
					{name:'电池状态:',val:'装入'},
					{name:'电池锁状态:',val:'关闭'},
				]		
			}
		},
		onLoad(){
			this.getcarinfo()
		},
		methods: {
			gocarcenter(e){
// 				uni.navigateTo({
// 					url: '/pages/map/map',
// 					success: res => {},
// 					fail: () => {},
// 					complete: () => {}
// 				});
			},
			// 获取车辆信息
			getcarinfo() {
				var options = {
					url: '/bike/info', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {						
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('车辆信息',res)
					if (res.status == 0) {
						// 剩余电量
						this.carcenterdata1[0].val = res.info.battery_level+'%'
			
						// 电池电压V
						this.carcenterdata1[1].val = res.info.battery_volt/1000+'V'
						
						// 剩余容量
						this.carcenterdata1[2].val = res.info.battery_capacity/1000+'Ah'
						
						// 型号编码
						this.carcenterdata1[3].val = res.info.battery_model
						
						// 电池状态
						let is_on_battery=''
						if(res.info.is_on_battery==0){
							is_on_battery='空置'
						}else if(res.info.is_on_battery==1){
							is_on_battery='装入'
						}
						this.carcenterdata1[4].val = is_on_battery
						
						// 电池锁状态
						let is_battery_locked=''
						if(res.info.is_on_battery==0){
							is_battery_locked='开'
						}else if(res.info.is_on_battery==1){
							is_battery_locked='关'
						}
						this.carcenterdata1[5].val = is_battery_locked		             
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			callphone(item){
				if(item.name=='手机号码:'){
					uni.showModal({
						title: '',
						content: item.val,
						// showCancel: false,
						cancelText: '取消',
						confirmText: '拨打',
						success: res => {
							uni.makePhoneCall({
								phoneNumber:item.val
							})
						},
						fail: () => {},
						complete: () => {}
					});
				}			
			}
		}
	}
</script>

<style lang='scss' scoped>
	.wrap{
		background-color: rgb(245,245,245);	
	    height: calc(100vh - 11upx);
		padding-top: 1upx;
		overflow: hidden;
		/* padding-bottom: 1upx; */
		.view-common{
		  margin:10upx 22upx 0 22upx;
		}
	}
	
  
</style>
