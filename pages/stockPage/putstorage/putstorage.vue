<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="swapdata" type='2' :border='borders' @itemclick='gocarcenter'></item-cell>
			<view class='change-battery-button'>
				<button type='primary' class='share-button-default' @click='scan(0)'>扫码获取</button>
			</view>
			<item-cell :itemdata="swapbatterydata" type='2' :border='borders'></item-cell>
			<view class='change-battery-button'>
				<button type='primary' class='share-button-default' @click='scan(1)'>扫码获取</button>
			</view>
			<view class='change-battery-bottom'>
				<button type='primary' class='share-button-default' @click='intostorage'>{{btnname}}</button>
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
				title: 'uni-fab',
				poptype: '',
				borders: true,
				buttonname: '更换电池',
				swapdata: [{
						name: 'IMEI:',
						val: '',
					},
					{
						name: 'SN:',
						val: '',
					},
				],
				orderid: '',
				type: '',
				swapbatterydata: [{
					name: 'BIKE-SN:',
					val: ''
				}],
				btnname: '',
			}
		},
		components: {
			itemCell,
		},
		computed: mapState(['bikeinfo', 'bikeid']),
		onLoad(e) {
			this.type = e.type
			if (this.type == 0) {
				this.btnname = '入库'
			} else {
				this.btnname = 'ecu绑定'
			}
		},
		methods: {
			...mapMutations(['setSn', 'setBikeid']),
			// ecu绑定
			ecubind() {
				var options = {
					url: '/bike/bind_ecu', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						// "bike_id": '',
						"imei": this.swapdata[0].val,
						"ecu_sn": this.swapdata[1].val
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('ecu綁定', res)
					if (res.status == 0) {
						uni.showToast({
							title: 'ecu绑定成功',
							mask: false,
							icon: 'none',
							duration: 3000
						});
						this.stoplist(this.longitude, this.latitude, '*')
					} else {
						uni.showToast({
							title: res.message ? res.message : 'ecu绑定失败',
							mask: false,
							icon: 'none',
							duration: 3000
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			scan(type) {
				wx.scanCode({
					onlyFromCamera: true, //只允许相机扫码
					success: res => {
						console.log('saoma', res)
						if (type == 0) {
							var result = res.result.split(' ')
							this.swapdata[0].val = result[0].split(':')[1]
							this.swapdata[1].val = result[1].split(':')[1]
						} else {
							var bikesn = res.result.match(/\?bikesn=(.*)/)[1]
							this.setSn(bikesn)
							this.setBikeid('*')
							this.swapbatterydata[0].val = bikesn
						}
					},
					fail: res => {},
					complete: res => {}
				});
			},
			// 入库
			rukustate() {
				var options = {
					url: '/binv/import', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"imei": this.swapdata[0].val,
						"ecu_sn": this.swapdata[1].val
					}
				}
				this.$httpReq(options).then((res) => {
					console.log(111, res)
					if (res.status == 0) {
						uni.showToast({
							title: '入库成功',
							duration: 2000,
						});
						this.swapdata[0].val = ''
						this.swapdata[1].val = ''
						this.swapbatterydata[0].val = ''
						this.setSn('*')
					} else {
						uni.showToast({
							title: res.message ? res.message : '入库失败',
							icon: 'none',
							duration: 2000,
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			intostorage() {
				if (this.swapdata[0].val == '' || this.swapdata[1].val == '' || this.swapbatterydata[0].val == '') {
					uni.showToast({
						title: '信息不能为空，请完善',
						icon: 'none',
						duration: 3000
					});
					return
				}
				if (this.type == 0) {
					this.rukustate()
				} else {
					this.ecubind()
				}
			},
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

		.center-box {
			font-size: 34upx;
			height: 140upx;
			width: 240upx;
		}

		/* margin-bottom: 20upx; */
		.view-common {
			margin: 10upx 22upx;
			height: 98vh;
			position: relative;

			.change-battery-button {
				/* position: fixed; */
				/* bottom: 3vh; */
				width: 706upx;
				margin-top: 10upx;
				margin-bottom: 30upx;
			}

			.change-battery-bottom {
				position: fixed;
				bottom: 3vh;
				width: 706upx;
			}
		}
	}
</style>
