<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="swapdata" type='2' :border='borders' @itemclick='gocarcenter'></item-cell>
			<view class='change-battery-button'>
				<button type='primary' class='share-button-default' @click='scan(0)'>{{btn1}}</button>
			</view>
			<item-cell :itemdata="swapbatterydata" type='2' :border='borders'></item-cell>
			<view class='change-battery-button'>
				<button type='primary' class='share-button-default' @click='scan(1)'>{{btn2}}</button>
			</view>
			<view class='change-battery-bottom'>
				<button type='primary' class='share-button-default' @click='intostorage'>{{btnname}}</button>
			</view>

			<view v-if="type==0">
				<text>车辆型号</text>
				<view class='result-fault'>
					<view class='result-fault-view' v-for="(item,i) in faultdata" :key="i" @click='chosefault(item,i,0)' :class="{'borderrights':isActive==i}">
						<text>{{item.name}}</text>
					</view>
				</view>
			</view>
			<!-- c -->
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
				faultdata: [{
						name: 'Q5',
						val: 1,
						select: true
					},
					{
						name: 'Q1',
						val: 1,
						select: false
					},
				],
				models: 'Q5',
				isActive: 0,
				isActives:0,
				title: 'uni-fab',
				poptype: '',
				borders: true,
				buttonname: '更换电池',
				btn1: '',
				btn2: '',
				swapdata: [{
						name: 'ECU-IMEI:',
						val: '',
					},
					{
						name: 'ECU-SN:',
						val: '',
					},
				],
				batterydata:[{name:'12Ah',val:'ZN48V12AH'},{name:'14Ah',val:'XH48V14AH'},{name:'15Ah',val:'VP48V15AH'}],
				orderid: '',
				type: '',
				swapbatterydata: [{
					name: '二维码:',
					val: ''
				}],
				btnname: '',
				batterymodel:'ZN48V12AH',
			}
		},
		components: {
			itemCell,
		},
		computed: mapState(['bikeinfo', 'bikeid']),
		onLoad(e) {
			this.type = e.type
			var title = ''
			if (this.type == 0) {
				this.btnname = '入库'
				title = '入库'
				this.btn1 = "扫ecu码"
				this.btn2 = '扫二维码'
			} else if (this.type == 1) {
				this.btnname = '换二维码'
				title = '换二维码'
				this.btn1 = "扫ecu码"
				this.btn2 = '扫新的二维码'
			} else if (this.type == 2) {
				this.btnname = '换ecu'
				title = '换ecu'
				this.btn1 = "扫新的ecu码"
				this.btn2 = '扫二维码'
			}
			wx.setNavigationBarTitle({
				title: title
			})
		},
		methods: {
			...mapMutations(['setSn', 'setBikeid']),
			chosefault(item,i) {
					this.models = item.name
					this.isActive=i	
			},
			chosebattery(item,i) {				
					this.batterymodel=item.val
					this.isActives=i
			},
			// 换二维码
			changesn() {
				this.setSn("*")
				var options = {
					url: '/bike/change_sn', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						// "bike_id": '',
						"sk": this.swapdata[1].val,
						"new_sn": this.swapbatterydata[0].val
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('换二维码', res)
					if (res.status == 0) {
						uni.showToast({
							title: '换二维码成功',
							mask: false,
							icon: 'none',
							duration: 3000
						});
						// this.stoplist(this.longitude, this.latitude, '*')
					} else {
						uni.showToast({
							title: res.message ? res.message : '换二维码失败',
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
			// 换ecu
			changeecu() {
				var options = {
					url: '/bike/change_ecu', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						// "bike_id": '',
						"new_imei": this.swapdata[0].val,
						"new_ecu_sn": this.swapdata[1].val,
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('换ecu', res)
					if (res.status == 0) {
						uni.showToast({
							title: '换ecu成功',
							mask: false,
							icon: 'none',
							duration: 3000
						});
						// this.stoplist(this.longitude, this.latitude, '*')
					} else {
						uni.showToast({
							title: res.message ? res.message : '换ecu失败',
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
							if(res.result.match(/\?bikesn=(.*)/)){
								uni.showToast({
									title: '请扫描正确的ecu码',
									icon: 'none',
									duration: 2000,
								});
								return
							}
							else if(res.result.indexOf(' ')==-1){								
								this.swapdata[1].val = res.result
							}else{
								var result = res.result.split(' ')
								this.swapdata[0].val = result[0].split(':')[1]
								this.swapdata[1].val = result[1].split(':')[1]
							}							
						} else {
							if(res.result.match(/\?bikesn=(.*)/)){
								var bikesn = res.result.match(/\?bikesn=(.*)/)[1]
								this.setSn(bikesn)
								this.setBikeid('*')
								this.swapbatterydata[0].val = bikesn
							}else{
								uni.showToast({
									title: '请扫描正确的二维码',
									icon: 'none',
									duration: 2000,
								});
							}
							
						}
					},
					fail: res => {},
					complete: res => {}
				});
			},
			// 入库
			rukustate(models) {
				uni.showLoading({
					title: '入库中'
				});
				var options = {
					url: '/binv/import', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"imei": this.swapdata[0].val,
						"ecu_sn": this.swapdata[1].val,
						"model": models,
						// "battery_model":this.batterymodel
					}
				}
				this.$httpReq(options).then((res) => {
					setTimeout(function() {
						uni.hideLoading();
					}, 2000);
					if (res.status == 0) {
						uni.showToast({
							title: '入库成功',
							icon: 'none',
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
				if (this.swapdata[1].val == '' || this.swapbatterydata[0].val == '') {
					uni.showToast({
						title: '信息不能为空，请完善',
						icon: 'none',
						duration: 3000
					});
					return
				}
				if (this.type == 0) {
					this.rukustate(this.models)
				} else if (this.type == 1) {
					this.changesn()
				} else if (this.type == 2) {
					this.changeecu()
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

		.borderrights {
			color: #F6C700;
			border: 1upx solid #F6C700;
		}

		.result-fault {
			margin-top: 20upx;
			display: flex;
			flex-wrap: wrap;

			.result-fault-view {
				width: 40%;
				margin-left: 40upx;
				text-align: center;
				margin-top: 20upx;
				background-color: white;
				height: 80upx;
				line-height: 80upx;
			}
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
