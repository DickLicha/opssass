<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="swapdata" type='4' :border='borders' @itemclick='gocarcenter'></item-cell>
			<view class='title-text'>选择仓库</view>
			<item-cell :itemdata="swapbatterydata1" type='4' :border='borders' @itemclick='chosestorage'></item-cell>
			<view class='title-text'>报修</view>
			<item-cell :itemdata="swapbatterydata2" type='2' :border='borders'></item-cell>
			<view class='change-battery-button'>
				<button class='share-button-default' @click='putstorage'>入库</button>
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
				borders: true,
				swapdata: [{
					name: '车辆编号:',
					val: ''
				}],
				orderid: '',
				swapbatterydata1: [{
					name: '仓库:',
					val: '请选择'
				}],
				swapbatterydata2: [{
						name: '时间:',
						val: 'xxx',
					},
					{
						name: '故障现象:',
						val: '其他',
					},
					{
						name: '提交:',
						val: 'xxx',
					},
				],
			}
		},
		components: {
			itemCell
		},
		// computed:mapState(['orderfirstid']),
		computed: mapState(['bikeinfo', 'bikeid', 'orderfirstid', 'putstorageindex', 'warehoselist']),
		onLoad() {
			// this.getcarinfo()
			// 车辆编码
			this.swapdata[0].val = this.bikeinfo.id
			this.warehostlist()
		},
		onShow() {
			console.log(33, this.warehoselist[this.putstorageindex])
			this.swapbatterydata1[0].val = this.warehoselist[this.putstorageindex].name
		},
		methods: {
			...mapMutations(['setWarehoselist']),
			gocarcenter() {
				uni.navigateTo({
					url: '/pages/carcenter/carcenter',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			// 仓库列表
			warehostlist() {
				var options = {
					url: '/warehouse/list', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"state": 0,
						"#start_time": "",
						"#end_time": "",
						"#sk": "",
						"pno": 0,
						"psize": 10
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('仓库列表', res)
					if (res.status == 0) {
						this.setWarehoselist(res.list)
					} else {
						uni.showToast({
							title: res.message ? res.message : '获取仓库列表失败！',
							mask: false,
							duration: 2500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			chosestorage() {
				uni.navigateTo({
					url: '/pages/warehoselist/warehoselist',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			putstorage() {
				var options = {
					url: '/brorder/recall', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"order_id": this.orderfirstid,
						"warehouse_id": this.warehoselist[this.putstorageindex].id
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('入库状态', res)
					if (res.status == 0) {
						uni.showToast({
							title: '入库成功！',
							mask: false,
							duration: 2500
						});
					} else {
						uni.showToast({
							title: res.message ? res.message : '入库失败！',
							mask: false,
							duration: 2500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
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

		/* margin-bottom: 20upx; */
		.view-common {
			margin: 10upx 22upx;
			height: 98vh;
			position: relative;

			.title-text {
				margin: 20upx 0 0 0;
				color: rgb(100, 100, 100)
			}

			.change-battery-button {
				position: fixed;
				bottom: 3vh;
				width: 706upx;
			}
		}
	}
</style>
