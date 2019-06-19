<template>
	<view class='wrap'>
		<view class='view-common'>
			<view class='now-city'>
				<text>当前城市：</text>
				<text>{{city[0].name}}</text>
			</view>
			<view class='now-city margintops'>
				<text>切换城市</text>
			</view>
			<view class='city-base'>
				<view class='city-view' v-for="(item,i) in city" :key="i" @click="go(item)">
					<view class='city-inner'>{{item.name}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				borders: true,
				swapdata: [{
					name: '',
					val: '',
					url: '/pages/mine/minecard/minecard'
				}],
				userinfo:{},
				city: [
				]
			}
		},
		onLoad() {
			try {
				this.city = uni.getStorageSync('userinfo').cities;
				if (value) {
					// this.userinfo = value
				}
			} catch (e) {
				// error
			}

		},
		components: {
			itemCell
		},
		methods: {
			go(item) {
				uni.showModal({
					title: '切换城市',
					content: `您确定切换到${item.name}吗？`,
					// showCancel: false,
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						if(res.confirm){
							this.changcity(item.id)
						}
					},
					fail: () => {},
					complete: () => {}
				});
				// uni.navigateTo({
				// 	url: item.url,
				// 	success: res => {},
				// 	fail: () => {},
				// 	complete: () => {}
				// });
			},
			changcity(id) {
					var options = {
					url: '/staff/switch_city', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						city_id:id
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
						setTimeout(()=>{
							uni.switchTab({
								url: '/pages/tabbar/index/index',
							})
						},2000)		
						
					} else {
						uni.showToast({
							title: res.message ? res.message : '切换城市失败',
							mask: false,
							icon:'none',
							duration: 1500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
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
			margin: 10upx 22upx;
			height: 98vh;
			position: relative;
            .now-city{
				margin: 8upx 10upx;
			}
			.margintops{
				margin-top: 50upx;
			}
			.city-base {
				display: flex;
				flex-wrap: wrap;
				text-align: center;
				align-items: center;
				.city-view {
					width: 30%;
					background-color: white;
					height: 100upx;
					margin: 8upx 10upx;
                    border-radius: 8uxp;
					/* border: 1upx solid rgb(245,245,245); */
					.city-inner {
						margin-top: 30upx;
					}
				}
			}
		}


	}
</style>
