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
					{name:'SIM卡号码:',val:'1440323872857'},
					{name:'ECUsn产品码:',val:'777039046'},
				]		
			}
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
