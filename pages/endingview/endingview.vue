<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="carcenterdata1" :type='2' :border='true'></item-cell>
			<map class='base-map-view' :latitude="latitude" :longitude="longitude" :markers="covers">
			</map>
			<button class='share-button-default end-btn' type='primary' @click="go">{{buttonname}}</button>
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
		components: {
			itemCell
		},
		onLoad(e) {
			this.carcenterdata1[0].val = e.bikeid
			this.type = e.type
			this.bikeid = e.bikeid
			// this.orderid = e.orderid
			this.setOrderid(e.orderid)
			var name = ''
			if (this.type == '0') {
				this.buttonname = '结束换电'
				name = '换电'
			} else {
				this.buttonname = '开始挪车'
				name = '挪车'
			}
			this.carcenterdata1[1].val = name
		},
		computed: mapState(['directinfo', 'bikeinfo', 'orderid', 'endmove']),
		data() {
			return {
				carcenterdata1: [{
						name: '车辆编号:',
						val: ''
					},
					{
						name: '类型:',
						val: '挪车'
					}
				],
				type: '',
				buttonname: '',
				bikeid: '',
				latitude: 39.909,
				longitude: 116.39742,
				covers: [{
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: '../../../static/location.png'
				}, {
					latitude: 39.90,
					longitude: 116.39,
					iconPath: '../../../static/location.png'
				}]
				// orderid: ''
			}
		},
		methods: {
			...mapMutations(['setSn', 'setOrderid', 'setEndmove']),
			gocarcenter(item) {
				uni.navigateTo({
					url: item.url,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			go() {
				if (this.type == 0) {
					this.closebattery()
				} else {
					this.setEndmove(true)
					uni.navigateBack({
						delta: 2
					});
					// uni.navigateTo({
					// 	url: `/pages/map/map?type=3.1&&name=挪车&&text=全部车站&&endmove=true&&orderid=${this.orderid}`,
					// 	success: res => {},
					// 	fail: () => {},
					// 	complete: () => {}
					// });
				}
			},
			closebattery() {
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						this.setSn('*')
						var options = {
							url: '/bcorder/finish', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"order_id": this.orderid,
								"user_coordinate": [
									res.longitude, res.latitude
								]
							},
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('关锁完成订单电池锁', res)
							if (res.status == 0) {
								this.buttonname = '更换电池'
								uni.showToast({
									title: '关成功!',
									icon: 'none',
									duration: 2000
								})
								setTimeout(() => {
									uni.navigateBack({
										delta: 2
									});
								}, 2000)
							} else {
								uni.showToast({
									title: res.message ? res.message : '关锁失败!',
									duration: 2000
								})
							}
						}).catch((err) => {
							// 请求失败的回调
							console.error(err, '捕捉')
						})
					},
					fail: () => {},
					complete: () => {}
				});

			},
		}
	}
</script>

<style lang='scss' scoped>
	.wrap {
		background-color: rgb(245, 245, 245);
		padding-top: 1upx;
		padding-bottom: 1upx;

		.view-common {
			margin: 10upx 22upx;
			height: 100vh;
			.base-map-view {
				width: 100%;
				height: 700upx;
				margin-top: 30upx;
			}
		}

		.end-btn {
			width: calc(100% - 44upx);
			position: fixed;
			bottom: 20upx;
		}
	}
</style>
