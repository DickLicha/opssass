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
					{name:'IMEI:',val:''},
					{name:'ECUsn产品码:',val:'777039046'},
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
						// SIM卡号码
						this.carcenterdata1[0].val = res.info.imei			
						// ECUsn
						this.carcenterdata1[1].val = res.info.ecu_sn						             
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
							if(res.confirm){
								uni.makePhoneCall({
									phoneNumber:item.val
								})
							}							
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
