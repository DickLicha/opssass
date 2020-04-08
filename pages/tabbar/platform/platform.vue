<template>
	<view>
		<view class="index-top">
			<view class="index-top-bg theme-bg"></view>
			<view class="index-top-box">
				<view style='margin-top: 100upx;'>
					<view class="nav nav-head" >
						<navigator class="store" @click="showbotpop" url="../selectStore/selectStore">{{citylist[0].name||'未知城市'}}<text class="iconfont icon-xiajian"></text></navigator>
						<text class="address">{{locaplace||'未获取'}}</text>
					</view>
				</view>
				<view class="nav flex-box">
					<view class="flex" @tap="scaninto(0)">
						<!-- <view class="nav-icon iconfont icon-saoma"></view> -->
						<view class="nav-ct">车辆扫码</view>
					</view>
					<navigator class="flex" url="../code/code" @tap="scaninto(1,'/pages/map/map?text=全部车站&type=3.1&name=挪车')">
						<!-- <view class="nav-icon iconfont iconyonghu"></view> -->
						<view class="nav-ct">附近挪车</view>
					</navigator>
					<navigator class="flex" url="../checkSale/list" @tap="scaninto(2,'/pages/map/map?name=换电&text=全部换电&type=0')">
						<!-- <view class="nav-icon iconfont icon-jilu"></view> -->
						<view class="nav-ct">附近换电</view>
					</navigator>
					<navigator class="flex" url="../balance/index" @tap="scaninto(3,'/pages/repairlist/repairlist?type=10')">
						<!-- <view class="nav-icon iconfont icon-yk_jiesuantai"></view> -->
						<view class="nav-ct">违章举报</view>
					</navigator>
				</view>
				<view class="data-box">
					<view class="data-item">
						<view class="data-item-ct1"><text>{{top.all_product_view_sum}}</text>{{carinfo.alert_count}}辆</view>
						<view class="data-item-ct2">预警车辆</view>
					</view>
					<view class="data-item">
						<view class="data-item-ct1"><text>{{top.all_profit_sum}}</text>{{carinfo.to_check_count}}辆</view>
						<view class="data-item-ct2">待排查车辆</view>
					</view>
					<view class="data-line"></view>
					<view class="data-item">
						<view class="data-item-ct1"><text>{{top.all_sales_sum}}</text>{{carinfo.under_volt_count}}辆</view>
						<view class="data-item-ct2">缺电车辆</view>
					</view>
					<view class="data-item">
						<view class="data-item-ct1"><text>{{top.all_sales_write_off}}</text>{{carinfo['24h_offline_count']}}辆</view>
						<view class="data-item-ct2">离线车辆</view>
					</view>

					<view class="data-item">
						<view class="data-item-ct1"><text>{{top.all_product_view_sum}}</text>{{carinfo.alert_fault_count}}辆</view>
						<view class="data-item-ct2">疑似故障车辆</view>
					</view>
					<view class="data-item">
						<view class="data-item-ct1"><text>{{top.all_profit_sum}}</text>{{carinfo.ops_count}}辆</view>
						<view class="data-item-ct2">报修车辆</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <uni-load-more :status="loadStatus"></uni-load-more> -->
		<uni-popup :show="type ==='middle-list'" position="bottom" mode="fixed" @hidePopup="togglePopup('')">
			<view :scroll-y="true" class="uni-center center-box" style="height:350upx">
				<item-cell :itemdata="citylist" type='4' @itemclick='go'></item-cell>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import itemCell from '@/components/item-cell/item-cell.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	// const app = getApp()
	export default {
		components: {
			uniPopup,
			itemCell
		},
		data() {
			return {
				// tab: 1,
				userInfo: null,
				top: null,
				list: [],
				pno: 1,
				psize: 20,
				loadStatus: 'more',
				checkSaleData: null,
				type: '',
				citylist: [],
				locaplace:'',
				carinfo: {
					shortelec: 3,
					fault: 4,
					lostcar: 3,
					stolencar: 7,
					repaircar: 1,
					kzcar: 5
				},
			}
		},
		onLoad() {
			var _this=this
			wx.getLocation({
				type: 'wgs84',
				success(res) {
					console.log('位置信息', res)			
					const requestTask3 = uni.request({
						url: "https://apis.map.qq.com/ws/geocoder/v1/?location=" + res.latitude + "," + res.longitude +
							"&key=ZVNBZ-ACB3S-UOEO5-6JMQK-4EMKT-XZBUX&get_poi=1",
						data: {},
						method: "GET",
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						success: function(res) {
							console.log('weizhi', res.data);
							_this.locaplace=res.data.result.formatted_addresses.recommend
						}
					});

				}
			})

		},
		onShow() {
			try {
				this.citylist = uni.getStorageSync('userinfo').cities;
				if (value) {
					// this.userinfo = value
				}
			} catch (e) {
				// error
			}
			this.getServerData()
		},
		onPullDownRefresh() {
			// this.getList(true)
			this.getServerData()
		},
		onReachBottom() {
			// this.getList()
		},
		methods: {
			...mapMutations([ 'setSn', 'setBikeid']),
			scaninto(type,url) {
				if(type==0){
					wx.scanCode({
						onlyFromCamera: true, //只允许相机扫码
						success: res => {
							console.log('saoma', res)
							var bikesn = res.result.match(/\?bikesn=(.*)/)[1]
							this.setSn(bikesn)
							this.setBikeid('*')
							this.getcarinfo()
						},
						fail: res => {},
						complete: res => {}
					});
				}else{
					uni.navigateTo({
						url: url,
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}
				
			},
			// 获取车辆信息
			getcarinfo() {
				var options = {
					url: '/bike/info', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					if (res.status == 0) {
						// this.setSn(this.carnum)
						this.setBikeid(res.info.id)
						this.setBikeinfo(res.info)
						uni.navigateTo({
							url: '/pages/swapbattery/swapbattery?type=0',
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
					} else {
						uni.showToast({
							title: res.message ? res.message : '获取车辆信息失败',
							mask: false,
							icon: 'none',
							duration: 1500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			getServerData() {
				var options = {
					url: '/city/monitor', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						// start_time:this.start_time,
						// end_time:this.end_time,
					},
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('订单信息', res)
					if (res.status == 0) {
						this.carinfo = res.bike_stat
					} else {
						uni.showToast({
							title: res.message ? res.message : '获取订单信息失败'
						});
					}

				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})

			},
			go(item) {
				uni.showModal({
					title: '切换城市',
					content: `您确定切换到${item.name}吗？`,
					// showCancel: false,
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						if (res.confirm) {
							this.changcity(item.id)
						}
					},
					fail: () => {},
					complete: () => {}
				});
			},
			changcity(id) {
				var options = {
					url: '/staff/switch_city', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						city_id: id
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					if (res.status == 0) {
						try {
							uni.removeStorageSync('userinfo');
							uni.setStorage({
								key: 'userinfo',
								data: res,
								success: res => {
									console.log('success')
								},
								fail: res => {

								}
							})
						} catch (e) {
							// error
						}

						uni.showToast({
							title: '切换成功',
							duration: 1500
						});
						this.type = ''
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabbar/index/index',
							})
						}, 2000)

					} else {
						uni.showToast({
							title: res.message ? res.message : '切换城市失败',
							mask: false,
							icon: 'none',
							duration: 1500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			showbotpop() {
				this.type = 'middle-list'
			},
			togglePopup(type) {
				this.type = type

			},
			getList(reset = false) {
				if (reset) {
					this.pno = 1
					this.psize = 20
					this.loadStatus = 'more'
					this.list = []
				}
				let {
					pno,
					psize,
					loadStatus,
					list
				} = this
				if (loadStatus == 'loading' || loadStatus == 'noMore') {
					return
				}
				this.loadStatus = 'loading'
				this.$request({
					url: '/merchant/control/index',
					data: {
						pno,
						psize
					},
					hideLoad: !reset
				}).then((res) => {
					reset && uni.stopPullDownRefresh()
					let {
						list: data,
						top,
						user_info
					} = res.data
					if (top) {
						this.top = top
					}
					if (user_info) {
						this.userInfo = user_info
					}
					if (data.length < psize) {
						this.loadStatus = 'noMore'
					} else {
						this.loadStatus = 'more'
						this.pno++
					}
					this.list = [...list, ...data]
				})
			},
			scanCode() {
				uni.scanCode({
					onlyFromCamera: true,
					success: (res) => {
						let {
							result: code
						} = res
						this.$request({
							url: '/merchant/operation/write_off_detail',
							data: {
								code
							},
							loadTitle: '请稍候'
						}).then((res) => {
							let data = res.data
							if (data) {
								this.checkSaleData = data
								this.$refs.checkSale.open()
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index-top {
		position: relative;
		padding-top: 10rpx;

		.index-top-bg {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			height: 512rpx;
			background-color: rgb(0, 120, 245);
		}

		.index-top-box {
			position: relative;
			z-index: 1;
		}

		.theme-bg {
			border-radius: 0 0 50rpx 50rpx;
		}
	}

	.store {
		width: 200rpx;
		padding-left: 20rpx;
		margin: 0 26rpx 10rpx 26rpx;
		background-color: rgba($color: #fff, $alpha: 0.1);
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 20rpx;
		color: #fff;
	}

	.flex-box {
		display: flex;
		justify-content: space-around;
	}

	.nav {
		padding: 24rpx 0;
		text-align: center;
		color: #fff;

		.nav-icon {
			font-size: 50rpx;
			margin-bottom: 6rpx;
		}
	}

	.nav-head {
		font-size: 24rpx;
		display: flex;
		justify-content: space-between;

		.address {
			width: 460rpx;
			margin-right: 20rpx;
			height: 60rpx;
			line-height: 60rpx;

			.bottompop {
				height: 70upx;

				.bottomline {
					height: 1upx;
					background-color: rgb(120, 120, 120);
				}
			}
		}
	}

	.data-box {
		font-size: 0;
		margin: 0 26rpx;
		background-color: #fff;
		box-shadow: 0 10rpx 10rpx #ddd;
		border-radius: $uni-border-radius-sm;

		.data-item {
			display: inline-block;
			width: 50%;
			text-align: center;
			padding: 40rpx 0;

			.data-item-ct1 {
				font-size: 28rpx;

				text {
					font-weight: 600;
					font-size: 32rpx;
				}
			}

			.data-item-ct2 {
				margin-top: 6rpx;
				font-size: 28rpx;
				color: $uni-text-color-grey;
			}
		}

		.data-line {
			margin: 0 84rpx;
			height: 0;
			border-bottom: $uni-border-color 2rpx solid;
		}
	}

	.index-tab {
		margin-top: 50rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		color: $uni-text-color-grey;

		.act {
			color: #000;

			text {
				border-bottom: $uni-theme-color 4rpx solid;
			}
		}
	}
</style>
