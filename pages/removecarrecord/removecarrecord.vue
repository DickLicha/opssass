<template>
	<view class='wrap'>
		<view class='view-commons'>
			<view class='flexd-posion'>
				<view class='view-flexs switch-head'>
					<view class='view-border-letf'>日期</view>
					<view class='view-border-letf'>挪车数</view>
					<view class='view-border-letf'>有效数</view>
					<view>合格数</view>
					<view>总绩效</view>
				</view>
			</view>
			<scroll-view class='listscrow' lower-threshold='50' scroll-y @scrolltolower="loadMore">
				<view class='view-flexs view-border-bottom' v-for="(item,i) in switchloockdata">
					<view>{{item.time}}</view>
					<view class='view-border-letf'>{{item.movenum}}</view>
					<view class='view-border-letf'>{{item.yxnum}}</view>
					<view class='view-border-letf'>{{item.hgnum}}</view>
					<view class='view-border-letf'>{{item.jxnum}}</view>
				</view>
				<uni-load-more :loadingType="resquestState" ></uni-load-more>
			</scroll-view>

		</view>
	</view>
</template>

<script>
	import UniLoadMore from '@/components/load-more.vue'
	export default {
		data() {
			return {
				switchloockdata: [],
				resquestState: 0
			}
		},
		components:{
			UniLoadMore
		},
		methods: {
			loadMore() {
				if (this.resquestState < 2) {
					this.pageindex += 1
					this.getartlist(this.pageindex, 10, 'add')
				}
			},
			getartlist(){
				let datainfo = {}
				for (let i = 0; i < 20; i++) {
					datainfo.time = '4-20'
					datainfo.movenum = '2'
					datainfo.yxnum = '1'
					datainfo.hgnum = '0'
					datainfo.jxnum = '0'
					this.switchloockdata.push(datainfo)
				}
			},
		},
		onLoad() {
			let datainfo = {}
			for (let i = 0; i < 20; i++) {
				datainfo.time = '4-21'
				datainfo.movenum = '1'
				datainfo.yxnum = '1'
				datainfo.hgnum = '1'
				datainfo.jxnum = '1'
				this.switchloockdata.push(datainfo)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.listscrow {
		height: calc(100vh - 100upx);
	}
	.right-view{
		color: green
	}
	.wrong-view{
		color:red
	}

	.wrap {
		padding-top: 1upx;
		// height: 100vh;
		background-color: rgb(245, 245, 245);

		.view-commons {
			margin: 10upx 22upx;
			position: relative;
			background-color: white;

			.switch-head {
				height: 90upx;
				line-height: 90upx;
			}
			.flexd-posion {
				background-color: rgb(225, 225, 225);
			}

			.view-border-bottom {
				border-bottom: 1upx solid rgb(235, 235, 235);
			}
			.view-flexs {
				display: flex;
				width: 100%;
				text-align: center;
				align-items: center;
				height: 80upx;
				.view-border-letf {
					border-left: 1upx solid rgb(235, 235, 235);
				}
				view {
					width: 30%;
				}
			}
		}
	}
</style>
