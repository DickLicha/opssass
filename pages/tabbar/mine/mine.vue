<template>
	<view class='wrap'>
		<view class='mine-common'>
			<view class='mine-title'>
				<view class='mine-img-view'></view>
				<text class='mine-phone'>13043**7040</text>
				<i class="iconfont iconjiantou"></i>
			</view>
			<view class='mine-body'>
					<view class="uni-flex uni-column">
						<view class="flex-item-mine"  v-for="item in mineitem"  :class="{'mine-border-top':item.margintop}" @click='go(item.gopage)'>
							<i class="iconfont flexone" :class='item.icon'></i>
							<text class='flextwo'>{{item.title}}</text>
							<text class='flextree'>{{item.info}}</text>
							<i class="iconfont iconjiantou flewfour"></i>
						</view>
					</view>
				<!-- </view> -->
			</view>
		</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mineitem:[
					{title:'余额',icon:'iconziyuan',info:'0元',margintop:false,gopage:'/pages/mine/mineye/mineye'},
					{title:'优惠券',icon:'iconyouhuiquan',info:'3张',margintop:true,gopage:'/pages/mine/mineyhq/mineyhq'},
					{title:'我的卡',icon:'iconqia',info:'0张',margintop:true,gopage:'/pages/mine/minecard/minecard'},
					{title:'押金',icon:'iconyajin',info:'0元',margintop:true,gopage:'/pages/mine/mineyj/mineyj'},
					{title:'账户明细',icon:'iconzhanghu',info:'未缴纳',margintop:true,gopage:'/pages/mine/minezhmx/minezhmx'},
					{title:'test',icon:'iconzhanghu',info:'未缴纳',margintop:true,gopage:'/pages/swapbattery/swapbattery'},
					{title:'testitemcell',icon:'iconzhanghu',info:'未缴纳',margintop:true,gopage:'/pages/test/test'},									]
			};
		},
		methods:{
			go(urls){
				uni.navigateTo({
					url: urls
				});
			}
		}
	}
	
</script>

<style lang="scss" scoped>
	.wrap {
		position: relative;
		height: calc(100vh);
		background-color: rgb(245, 245, 245);
		padding-top: 20upx;

		.mine-common {
			margin: 20upx 22upx;

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
				margin-top: 40upx;
				.flex-item-mine{
					display: flex;
					height: 80upx;
					margin:0 40upx;
					line-height: 80upx;
					align-items: center;
					.flexone{
						width:10%;
					}
					.flextwo{
						width:75%;
					}
					.flextree{
						width:20%;
						text-align: right
					}
					.flexfour{
						width:10%;
						text-align: right
					}
				}
				.mine-border-top{
					border-top: 1upx solid rgb(215,215,215);
				}
			}
		}
	}
</style>
