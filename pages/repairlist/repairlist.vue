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
				repairlist: [],
				order: {
					length: ''
				}
			}
		},
		methods: {
			...mapMutations(['setOrderfirstid']),
			go(item) {
				console.log('order', this.order, item)
							
				if (item.name == '修车') {
					let data = {
						"is_order_finished": 0,
						"pno": 1,
						"psize": 100,
					}
					this.requestorder(data,item)
				} else {
					if (this.order.length) {
						let data = {
							"is_order_finished": 0,
							"pno": 1,
							"psize": 100,
							"order_state": 0,
						}
						this.requestorder(data,item)					
					} else {
						uni.showToast({
							title: '无报修订单',
							mask: false,
							duration: 2500
						});
					}
				}
			},
			requestorder(data,item) {
				let options = {
					url: '/brorder/list',
					method: 'POST',
					data: data
				}
				this.$httpReq(options).then((res) => {
					console.log('订单列表', res)
					if (res.status == 0 && res.list.length != 0) {
						this.setOrderfirstid(res.list[0].id)
						uni.navigateTo({
							url: item.url,
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
						this.order = {
							length: res.list.length,
							id: res.list[0].id
						}
					}
				})
			}
		},
		onLoad(e) {
			wx.setNavigationBarTitle({
				title: e.name
			})
		
			switch (e.type) {
				case '1':
					this.repairlist = [{
							name: '维修入库',
							url: '/pages/map/map?text=全部故障车辆&type=1.1&name=维修',
						},
						// {
						// 	name: '转库',
						// 	url: ''
						// },
						{
							name: '修车',
							url: '/pages/map/map?text=全部故障车辆&type=1.3&name=维修',
						},
					]
					break;
				case '2':
					this.repairlist = [{
							name: '常规保养',
							val: '',
						},
						{
							name: '异常保养',
							val: '',
						}
					]
					break;
				case '3':
					this.repairlist = [{
							name: '车站挪车',
							val: '',
							url: '/pages/map/map?text=全部车站&type=3.1&name=挪车',
						},
						{
							name: '机动挪车',
							val: '',
							url: '/pages/map/map?text=全部车站&type=3.1&name=挪车',
						},
						{
							name: '挪车记录',
							val: '',
							url: '/pages/removecarrecord/removecarrecord',
						}
					]
					break;
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
