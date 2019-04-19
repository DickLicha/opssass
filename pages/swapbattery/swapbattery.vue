<template>
	<view class='wrap'>
		<view class='mine-common'>
			<view class='mine-body'>
				<!-- <view class="uni-padding-wrap uni-common-mt"> -->
					<view class="uni-flex uni-column">
						<view class="flex-item-mine ">
							<view class='flex-item-left' @click="gocarcenter">
								<text class='flextwo'>车牌型号:</text>
								<text class='flextree'>801312465</text>
							</view>							
							<i class="iconfont iconjiantou flewfour"></i>
						</view>
					</view>
				<!-- </view> -->
			</view>
			<view class='mine-body'>
				<!-- <view class="uni-padding-wrap uni-common-mt"> -->
					<view class="uni-flex uni-column">
						<view class="flex-item-mine "  v-for="(item,i) in swapbatterydata"  :class="{'mine-border-top':i!=0}">
							<text class='flextwo'>{{item.name}}</text>
							<text class='flextree'>{{item.val}}</text>
						</view>
					</view>
				<!-- </view> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swapbatterydata:[
					{name:'车型:',val:'6.0'},
					{name:'剩余电量:',val:'39%'},
					{name:'电池状态:',val:'装入'},
					{name:'电池锁状态:',val:'关闭'},
					{name:'电池电压:',val:'49.23v'},
					{name:'剩余容量:',val:'4.93Ah'},
					{name:'剩余寿命:',val:'96%'},
					{name:'网络状态:',val:'在线'},
				]
				
			}
		},
		methods: {
			gocarcenter(){
				uni.navigateTo({
					url: '/pages/carcenter/carcenter',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style lang='scss' >
   .wrap {
   	position: relative;
   	height: calc(100vh);
   	background-color: rgb(245, 245, 245);
   	padding-top: 1upx;
   
   	.mine-common {
   		margin: 10upx 22upx;
   
   		.mine-title {
   			display: flex;
   			align-items: center;
   
   			.mine-phone {
   				width: 80%;
   				margin-left: 40upx;
   			}
   
   			.mine-img-view {
   				width: 100upx;
   				height: 100upx;
   				border-radius: 50%;
   				background-color: yellow;
   			}
   		}
   
   		;
   
   		.mine-body {
   			// height: 420upx;
   			background-color: white;
   			border-radius: 20upx;
   			margin-top: 20upx;
   			.flex-item-mine{
   				display: flex;
   				height: 80upx;
   				margin:0 40upx;
   				line-height: 80upx;
   				align-items: center;
				text:nth-child(2){
					margin-left: 20upx;
				}
				.flex-item-left{
					width: 97vw;
					.flextwo{
						/* width:25%; */
					}
					.flextree{
						/* width:20%; */
						margin-left: 20upx;
						/* width: 70%; */
					}
				}
   				.flexfour{
   					/* text-align: right;				 */
   				}
   			}
   			.mine-border-top{
   				border-top: 1upx solid rgb(245,245,245);
   			}
   		}
   	}
   }
</style>
