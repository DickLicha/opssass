<template>
	<view class='wrap'>
		<view class='view-common'>
			<view class='common-item' v-for="(item,i) in repairlist" @click="go(item)">
				<text>{{item.name}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				repairlist: [{
						name: '手动输入',
						val: '0',
						url: '/pages/manualscan/manualscan?type=1.3&&urls=/pages/repairPage/repaircar/repaircar'
					},
					{
						name: '扫码输入',
						val: '1',
						url: ''
					},
				],
				order: {
					length: ''
				}
			}
		},
		methods: {
			...mapMutations(['setSn', 'setOrderfirstid', 'setOrderinfo','setBikeid','setBikeinfo']),
			requestorder(data) {
				let options = {
					url: '/brorder/list',
					method: 'POST',
					data: data
				}
				this.$httpReq(options).then((res) => {
					console.log('订单列表', res)
					if (res.status == 0 && res.list.length != 0) {
						this.setOrderfirstid(res.list[0].id)
						this.setOrderinfo(res.list[0])
						uni.navigateTo({
							url: `/pages/repairPage/repaircar/repaircar`,
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
					}else{
						uni.showToast({
							title: '订单不存在',
							duration: 2000
						});
					}
				})
			},			
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
						this.setSn("*")
						this.setBikeid("*")
						this.setBikeinfo(res.info)
						var datas = {
							"is_order_finished": 0,
							"bike_id":res.info.id,
							"pno": 1,
							"psize": 100,
						}
						this.requestorder(datas)
					} else {
						uni.showToast({
							title: res.message ? res.message : '获取车辆信息失败',
							mask: false,
							icon:'none',
							duration: 1500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			go(item) {
				if (item.val == 0) {
					uni.navigateTo({
						url: item.url,
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				} else {
					wx.scanCode({
						onlyFromCamera: true,
						success: (res) => {
							var bikesn=res.result.match(/\?bikesn=(.*)/)[1]
							this.setSn(bikesn)
							// this.setSn(res.result)
							this.getcarinfo()
						},
						fail: (res) => {
							console.log('fail', res)
						}
					})
				}

			},
		},
		onLoad(e) {}
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
			margin: 30upx 22upx;
			height: 98vh;
			position: relative;

			.common-item {
				background-color: white;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				margin-bottom: 20upx;
			}
		}
	}
</style>
