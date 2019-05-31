<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="swapdata" type='4' :border='borders' @itemclick='gocarcenter'></item-cell>
			<view v-if="showdetil">
				<item-cell :itemdata="swapbatterydata" type='2' :border='borders'></item-cell>
				<view class='check-bottom-view'>
					<view class='checkup-text'><text>安全检查项目:</text></view>
					<view class='checkup-text' v-for="(item,i) in checkupdata"><text>{{item}}</text></view>
				</view>
				<view class='change-battery-button'>
					<button class='share-button-default checkup-button' type="primary" @click='changbattery(0)'>车辆故障</button>
					<button class='share-button-default checkup-button' type='primary' @click='changbattery(1)'>车辆正常</button>
				</view>
			</view>
			<view v-if="showshartmove" class='end-move-button'>
				<button class='share-button-default margin-topbtn' @click='startmovecar'>开始挪车</button>
				<!-- <button class='share-button-default margin-topbtn' @click='cantmovecar'>无法挪车</button> -->
			</view>

			<view v-if="showendmove" class='end-move-button'>
				<button class='share-button-default margin-topbtn' type='primary' @click='endmovecar'>完成挪车</button>
				<!-- <button class='share-button-default margin-topbtn' @click='cantmovecar'>无法挪车</button> -->
			</view>

		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				showshartmove: false,
				showendmove: false,
				showdetil: true,
				borders: true,
				orderid: '',
				swapdata: [{
					name: '车辆编号',
					val: ''
				}],
				swapbatterydata: [{
						name: '最近一次检查时间:',
						val: '04-18 19：10：40'
					},
					{
						name: '最近一次检查人:',
						val: ''
					},
					{
						name: '待安全检查持续时常:',
						val: ''
					}
				],
				checkupdata: [
					'1、转把', '2、车把', '3、刹车', '4、车灯', '5、喇叭', '6、挡泥板'
				]
			}
		},
		components: {
			itemCell
		},
		computed: mapState(['bikeinfo']),
		onLoad() {
			this.swapdata[0].val = this.bikeinfo.id
			this.swapbatterydata[0].val = this.bikeinfo.last_repark_order_end_time
			this.swapbatterydata[1].val = 'xxx'
			this.swapbatterydata[2].val = 'xxx'
		},
		methods: {
			// 车辆安全检查
			checkbike() {
				this.showshartmove = false
				this.showendmove = true
				uni.getLocation({ //获取当前的位置坐标
					type: 'gcj02',
					success: (res) => {
						var options = {
							url: '/bike/check', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"bike_id": this.bikeinfo.id,
								"user_coordinate": [res.longitude, res.latitude],
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('安全检查', res)
							if (res.status == 0) {
								this.showdetil = false
								this.showshartmove = true
							} else {
								uni.showToast({
									title: res.message ? res.message : '安全检查失败',
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
					fail: (res) => {
						console.log('fail', res)
					}
				});
			},
			gocarcenter() {
				uni.navigateTo({
					url: '/pages/carBigCenter/carcenter/carcenter',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			endmovecar() {
				uni.navigateTo({
					url: `/pages/map/map?type=3.1&&name=挪车&&text=全部车站&&endmove=true&&orderid=${this.orderid}`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			// 开始挪车
			startmovecar() {
				console.log('date', this.$formatetimes())
				this.showshartmove = false
				this.showendmove = true
				uni.getLocation({ //获取当前的位置坐标
					type: 'gcj02',
					success: (res) => {
						console.log('位置信息', res.longitude, res.latitude)
						var options = {
							url: '/rporder/submit', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"bike_id": this.bikeinfo.id,
								"user_coordinate": [res.longitude, res.latitude],
								"channel": "xxx"
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('开始订单', res)
							if (res.status == 0) {
								this.orderid = res.info.id
							} else {
								uni.showToast({
									title: res.message ? res.message : '该车不可挪',
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
					fail: (res) => {
						console.log('fail', res)
					}
				});
			},
			changbattery(type) {
				if (type == 1) {
					this.checkbike()
				} else {
					uni.navigateTo({
						url: '/pages/carBigCenter/breakdowncar/breakdowncar',
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}
			}
		}
	}
</script>

<style lang='scss'>
	.wrap {
		background-color: rgb(245, 245, 245);
		padding-top: 1upx;
		padding-bottom: 1upx;
		/* height: 100vh; */
		overflow: hidden;

		.end-move-button {
			position: absolute;
			width: 100%;
			bottom: 40upx;
		}

		/* margin-bottom: 20upx; */
		.view-common {
			margin: 10upx 22upx;
			height: 98vh;
			position: relative;

			.change-battery-button {
				position: fixed;
				bottom: 3vh;
				width: 706upx;
				display: flex;

				.checkup-button {
					width: 50%;
					margin: 0 30upx;
				}
			}

			.margin-topbtn {
				margin: 20upx 0 0 0;
			}

			.check-bottom-view {
				margin-top: 20upx;
				background-color: white;
				border-radius: 20upx;

				.checkup-text {
					margin: 18upx 40upx;
				}
			}
		}
	}
</style>
