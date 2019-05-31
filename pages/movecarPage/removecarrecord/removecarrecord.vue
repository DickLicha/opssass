<template>
	<view class='wrap'>
		<view class='view-commons'>
			<view class='flexd-posion'>
				<view class='view-flexs switch-head'>
					<view class='view-border-letf'>日期</view>
					<view class='view-border-letf'>挪车数</view>
					<view class='view-border-letf'>有效数</view>
					<!-- <view>合格数</view> -->
					<view>总绩效</view>
				</view>
			</view>
			<scroll-view class='listscrow' lower-threshold='50' scroll-y @scrolltolower="loadMore">
				<view class='view-flexs view-border-bottom' v-for="(item,i) in switchloockdata" @click="gocarinfo(item)">
					<view>{{item.date}}</view>
					<view class='view-border-letf'>{{item.total_count}}</view>
					<view class='view-border-letf'>{{item.valid_count}}</view>
					<view class='view-border-letf'>{{item.grade_sum}}</view>
					<!-- <view class='view-border-letf'>{{item.jxnum}}</view> -->
				</view>
				<view class='bottom-state'>无数据了！</view>
				<!-- <uni-load-more :loadingType="resquestState" ></uni-load-more> -->
			</scroll-view>

		</view>
	</view>
</template>

<script>
	import UniLoadMore from '@/components/load-more.vue'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				switchloockdata: [],
				pageindex: 1,
				pagenum: 20,
				allnumber: 100,
				resquestState: 0,
				userinfo: {},
			}
		},
		components: {
			UniLoadMore
		},
		methods: {
			gocarinfo(item) {
				uni.navigateTo({
					url: `/pages/movecarPage/movecarinfo/movecarinfo?date=${item.date}`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			loadMore() {
				// if (this.resquestState < 2) {
				// 	console.log(33,this.pageindex,parseInt(parseInt(this.allnumber)/this.pageindex)+1)
				// 	if(this.pageindex<parseInt(parseInt(this.allnumber)/this.pageindex)+1){
				// 		// this.getartlist(this.pageindex, 10, 'add')
				// 		this.openbattery(this.pageindex,this.pagenum)
				// 		this.pageindex += 1
				// 	}else{
				// 		// this.resquestState = res.data.list.length == 10 ? 0 : 2
				// 		this.resquestState=2
				// 		console.log('到底了！！！！')
				// 	}					
				// }
			},
			// 挪车记录
			openbattery(page, num) {
				var options = {
					url: '/rporder/user_monthly_stat', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"user_id": this.userinfo.userinfo.id
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('挪车记录', res)
					this.allnumber = res.total
					if (res.status == 0) {
						this.switchloockdata = res.info
					} else {
						uni.showToast({
							title: res.message ? res.message : "获取挪车记录失败"
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
		},
		onLoad() {
			this.openbattery(this.pageindex, this.pagenum)
			try {
				const value = uni.getStorageSync('userinfo');
				if (value) {
					this.userinfo = value
				}
			} catch (e) {
				// error
			}
		}
	}
</script>

<style lang="scss" scoped>
	.listscrow {
		height: calc(100vh - 100upx);
	}

	.right-view {
		color: green
	}

	.wrong-view {
		color: red
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

			.bottom-state {
				text-align: center;
				margin-top: 10upx;
				font-size: 30upx;
				color: rgb(100, 100, 100)
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
