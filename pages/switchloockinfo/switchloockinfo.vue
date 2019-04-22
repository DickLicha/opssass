<template>
	<view class='wrap'>
		<view class='view-commons'>

			<view class='flexd-posion'>
				<view class='view-flexs switch-head'>
					<view>时间</view>
					<view class='view-border-letf'>动作</view>
					<view class='view-border-letf'>渠道</view>
					<view class='view-border-letf'>结果</view>
				</view>
			</view>

			<scroll-view class='listscrow' lower-threshold='20' scroll-y @scrolltolower="loadMore">

				<view class='view-flexs view-border-bottom' v-for="(item,i) in switchloockdata">
					<view>{{item.time}}</view>
					<view class='view-border-letf'>{{item.action}}</view>
					<view class='view-border-letf'>{{item.qudao}}</view>
					<view class='view-border-letf' :class="{'right-view':item.status=='正常','wrong-view':item.status=='异常'}">{{item.status}}</view>
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
				for (let i = 0; i < 10; i++) {
					datainfo.time = '2019-04-19-15:15:26'
					datainfo.action = '开锁'
					datainfo.qudao = 'APP下单'
					datainfo.status = '异常'
					this.switchloockdata.push(datainfo)
				}
			},
		},
		onLoad() {
			let datainfo = {}
			for (let i = 0; i < 12; i++) {
				datainfo.time = '2019-04-19-15:15:26'
				datainfo.action = '关锁'
				datainfo.qudao = '系统下发'
				datainfo.status = '正常'
				this.switchloockdata.push(datainfo)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.listscrow {
		height: 620px;
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
				// 				position: fixed;
				// 				top:0;
				background-color: rgb(225, 225, 225);
			}

			.view-border-bottom {
				border-bottom: 1upx solid rgb(235, 235, 235);
			}

			.view-flexs {
				display: flex;
				// left: 0;
				width: 100%;
				text-align: center;
				align-items: center;
				// justify-content: center;
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
