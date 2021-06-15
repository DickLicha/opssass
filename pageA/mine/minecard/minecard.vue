<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="carcenterdata1" :type='2' :border='true'></item-cell>
			<!-- <item-cell :itemdata="carcenterdata2" :type='4' :border='true' @itemclick='molidpwd'></item-cell> -->
			<button class='share-button-default login-out' type='primary' @click="loginout">退出登录</button>
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
		onLoad() {
			try {
				const value = uni.getStorageSync('userinfo');
				if (value) {
					this.userinfo = value
				}
			} catch (e) {
				// error
			}
			// 车型
			this.carcenterdata1[0].val = this.userinfo.userinfo.name

			// 库存状态
			this.carcenterdata1[1].val = this.userinfo.userinfo.phone

		},
		data() {
			return {
				carcenterdata1: [{
						name: '姓名:',
						val: ''
					},
					{
						name: '手机号:',
						val: ''
					}
				],
				userinfo:{},
				carcenterdata2: [{
					name: '修改登录密码',
					val: ''
				}]
			}
		},
		methods: {
			gocarcenter(item) {
				uni.navigateTo({
					url: item.url,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			molidpwd() {
				uni.navigateTo({
					url: '/pageA/mine/changepwd/changepwd',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			loginout() {
				uni.showModal({
					title: '退出登录',
					content: '确认退出登录？',
					// showCancel: false,
					cancelText: '取消',
					confirmText: '退出登录',
					success: res => {
						try {
							uni.removeStorageSync('userinfo');
						} catch (e) {
							// error
						}
						uni.showToast({
							title: '退出登录成功！',
							duration: 1500,
						});
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/mine/loginView/loginView',
								success: res => {},
								fail: () => {},
								complete: () => {}
							});
						}, 2000)
					},
					fail: () => {},
					complete: () => {}
				});
			}
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

			.login-out {
				position: fixed;
				bottom: 20upx;
				width: calc(100% - 44upx)
			}
		}
	}
</style>
