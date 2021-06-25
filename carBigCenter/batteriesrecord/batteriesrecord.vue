<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="carcenterdata1" :type='2' :border='true' @itemclick='callphone'></item-cell>
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	import {mapState} from 'vuex'
	export default {
		components: {
			itemCell
		},
		computed:mapState(['bikeinfo']),
		data() {
			return {
				carcenterdata1: [{
						name: '换电时间:',
						val: ''
					},
					{
						name: '换电人:',
						val: ''
					},
					{
						name: '手机号码:',
						val: '',
						click: true
					},
					{
						name: '换电前电量:',
						val: ''
					},
					{
						name: '换点后电量:',
						val: ''
					},
				]
			}
		},
		onLoad(){
			this.getconfinfo()
		},
		methods: {
			gocarcenter(e) {
				// 				uni.navigateTo({
				// 					url: '/pages/map/map',
				// 					success: res => {},
				// 					fail: () => {},
				// 					complete: () => {}
				// 				});
			},
			// 获取配置信息
			getconfinfo() {
				var id=''
				try {
					const value = uni.getStorageSync('userinfo');
					if (value) {
						token=value.userinfo.userinfo.id
					}
				} catch (e) {
					// error
				}
				var options = {
					url: '/bcorder/list', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"pno": 1,
						"psize": 1,
						"sk": "",
						"bike_id": this.bikeinfo.id,
						// "user_id": id
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('换电的订单', res)
					if (res.status==0) {
						this.carcenterdata1[0].val=res.list[0].create_time
						this.carcenterdata1[1].val=res.list[0].user_name
						this.carcenterdata1[2].val=res.list[0].user_phone
						this.carcenterdata1[3].val=res.list[0].battery_level_before+'%'
						this.carcenterdata1[4].val=res.list[0].battery_level_after+'%'
					}else{
						uni.showToast({
							icon:'none',
							title: res.message?res.message:'获取换电信息失败'
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			callphone(item) {
				if (item.name == '手机号码:') {
					uni.showModal({
						title: '',
						content: item.val,
						// showCancel: false,
						cancelText: '取消',
						confirmText: '拨打',
						success: res => {
							if (res.confirm) {
								uni.makePhoneCall({
									phoneNumber: item.val
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}

						},
						fail: () => {},
						complete: () => {}
					});
				}
			}
		}
	}
</script>

<style lang='scss' scoped>
	.wrap {
		background-color: rgb(245, 245, 245);
		height: calc(100vh - 11upx);
		padding-top: 1upx;
		overflow: hidden;

		/* padding-bottom: 1upx; */
		.view-common {
			margin: 10upx 22upx 0 22upx;
		}
	}
</style>
