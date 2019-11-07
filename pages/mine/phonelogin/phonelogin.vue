<template>

	<view class="contant-view">
		<input class="input-text phone-text" type="number" v-model="phone" placeholder="请输入手机号码" focus="true" maxlength="11"/>
		<view class="line-view"></view>
		<view class="verification-view">
			<input class="code-text" type="password" v-model="pwd" placeholder="请输入密码" />
		</view>
		<view class="line-view"></view>
		<view class="login" @click="loginBtn">登录</view>
	</view>

</template>

<script>
	// import md5 from 'js-md5';
	import {hex_md5} from '../../../common/md5.js'
	export default {
		onUnload() {
			// clearInterval(this.countD);
		},
		data() {
			return {
				phone: '',
				pwd: '',
			}
		},
		onLoad(e) {},
		methods: {
			loginBtn() {
				console.log('hex_md5',hex_md5(this.pwd))
				var options = {
					url: '/staff/ops_login_by_pwd', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						phone: this.phone,
						passwd: hex_md5(this.pwd)
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('手机登录', res)
					if (res.status == 0) {
						uni.setStorage({
							key: 'userinfo',
							data: res,
							success: res => {
								console.log('success')
							},
							fail: res => {

							}
						})
						// this.setUserinfo(res)
						uni.showToast({
							title: '登录成功',
							mask: false,
							duration: 1500,
							icon: 'none',
							// icon:"success"
						})
						setTimeout(() => {
							uni.switchTab({
								url: "/pages/tabbar/index/index",
							}, 2000)
						})
					} else {
						uni.showToast({
							title: res.message ? res.message : '登录失败',
							icon: 'none',
							duration: 2000
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

<style lang="scss">
	.contant-view {
		background-color: white;
		width: 100%;
		height: 100vh;
	}

	.input-text {
		height: 70upx;
		font-size: 30upx;
		margin-left: 5%;
		margin-top: 140upx;
		width: 90%;
	}

	.line-view {
		margin-left: 4%;
		margin-top: 20upx;
		width: 92%;
		height: 2upx;
		background-color: lightgray;
	}

	.verification-view {
		display: flex;
		width: 100%;
		height: 70upx;
		margin-top: 40upx;

		.code-text {
			height: 70upx;
			font-size: 30upx;
			margin-left: 5%;
			width: 300upx;
			flex-grow: 1;

		}

		.verification-btn {
			margin-left: 5%;
			margin-right: 4%;
			width: 35%;
			text-align: center;
			line-height: 70upx;
			background-color: #FFB400;
			border-radius: 10upx;
		}
	}

	.login {
		margin-top: 80upx;
		margin-left: 12%;
		height: 88upx;
		width: 76%;
		border-radius: 6upx;
		background-color: #FFB400;
		text-align: center;
		line-height: 88upx;
	}
</style>
