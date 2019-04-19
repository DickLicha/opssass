<template>
	<view class='wrap'>
		<view class='mine-common'>
			<!-- <view class="uni-flex uni-column">
				<view class="flex-item-mine ">
					<view @click="gocarcenter">
						<text class='flextwo'>车牌型号:</text>
						<text class='flextree'>801312465</text>
					</view>							
					<i class="iconfont iconjiantou flewfour"></i>
				</view>
			</view> -->
			<!-- </view> -->
			<view class='mine-body'>
				<view class="uni-flex uni-column">
					<view class="flex-item-mine "  v-for="(item,i) in carcenterdata1"  :class="{'mine-border-top':i!=0}">
						<text class='flextwo'>{{item.name}}</text>
						<text class='flextree'>{{item.val}}</text>
					</view>
				</view>
			</view>
			
			<view class='mine-body'>
				<view class="uni-flex uni-column">
					<view class="flex-item-mine "  v-for="(item,i) in carcenterdata2"  :class="{'mine-border-top':i!=0}">
						<text class='flextwo'>{{item.name}}</text>
						<text class='flextree'>{{item.val}}</text>
					</view>
				</view>
			</view>
			
			<view class='mine-body'>
					<view class="uni-flex uni-column">
						<view class="flex-item-mine "  v-for="(item,i) in carcenterdata3"  :class="{'mine-border-top':i!=0}">
							<view class='flex-item-left' @click="gocarcenter" >
								<text class='flextwo'>{{item.name}}</text>
							</view>							
							<i class="iconfont iconjiantou flewfour"></i>
						</view>
					</view>
			</view>

			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				carcenterdata1:[
					{name:'车型:',val:'6.0'},
					{name:'库存状态:',val:'已投放'},
					{name:'车辆状态:',val:'正常'},
					{name:'车辆位置:',val:'车站外'},
				],
				carcenterdata2:[
					{name:'使用状态:',val:'空闲'},
					{name:'运行状态状态:',val:'禁止不止10分钟'},
					{name:'网络状态:',val:'在线'},
					{name:'GPS状态:',val:'可用'},
					{name:'SIM卡状态:',val:'可用'},
					{name:'车锁状态:',val:'关闭'},
					{name:'车把状态:',val:'可用'},
				],
				carcenterdata3:[
					{name:'订单:',val:''},
					{name:'开关锁记录:',val:''},
					{name:'换电记录:',val:''},
					{name:'维修记录:',val:''},
					{name:'车辆轨迹:',val:''},
					{name:'最后一次扫码时手机位置:',val:''},
					{name:'ECU:',val:''},
					{name:'电池:',val:''},
				],
				
			}
		},
		methods: {
			gocarcenter(){
				uni.navigateTo({
					url: '/pages/map/map',
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
   	height: calc(130vh);
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
				.flex-item-left{
					width: 97%;
				}
   				.flextwo{
   					/* width:25%; */
   				}
   				.flextree{
   					/* width:20%; */
					margin-left: 20upx;
					/* width: 70%; */
   				}
   				.flexfour{
   					text-align: right;				
   				}
   			}
   			.mine-border-top{
   				border-top: 1upx solid rgb(245,245,245);
   			}
   		}
   	}
   }
</style>
