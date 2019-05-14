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
					{name:'报修',val:''},
					{name:'时间:',val:'2019-04-16 09：31：17'},
					{name:'故障现象:',val:'无法开锁',click:false},
					{name:'提交:',val:'王光华'},
					{name:'维修入库',val:'2019-04-16 09：31：17'},
					{name:'仓库:',val:'乐平仓库'},
					{name:'提交:',val:'谢志宏'},
					{name:'处理完成',val:''},
					{name:'时间:',val:'2019-04-16 09：31：17'},
					{name:'故障类型:',val:'其他故障'},
					{name:'提交:',val:'谢志宏'},
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
