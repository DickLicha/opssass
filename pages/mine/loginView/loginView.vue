<template>
	<view>
		<image class="img-view" src='/static/login.png'></image>
		<!-- <button class="login-view" open-type="getUserInfo" type="primary" @getuserinfo="getuserinfo">授权</button> -->
		<button class="login-view" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信用户快速登录</button>
		<view class='login-pwd' @click="loginbypwd">账号密码登录</view>
		<view class="bottom-view">
			<!-- <view class="bottom-text">登录即代表同意</view>
			<view class="click-text">《柚达电单车用户协议》</view> -->
			<view class='bottom-span'>该程序为单车内部运维人员使用，使用前必须先登录</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				wxLoginCode: "",
				showCodeDialog: false,
				user_info_data: "",
				user_info_iv: "",
				user_phone_data: "",
				user_phone_iv: "",
				phoneNumber: "",
			}
		},
		onLoad() {			
			this.getLoginData();
			this.getdirectinfo()
			// this.getsysversion()
		},
		computed: mapState(['userinfo']),
		methods: {
			...mapMutations(['setUserinfo', 'setDirectinfo','setGobelrelogin','setBaseurl']),
			loginbypwd(){
				uni.navigateTo({
					url: '/pages/mine/phonelogin/phonelogin',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			// 获取字典配置信息
			getdirectinfo() {
				var options = {
					url: '/config/direct', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						version:'1.0.71',
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('字典信息', res)
					if (res.status == 0) {
						this.setDirectinfo(res.direct)
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 获取体验版还是正式版
			getsysversion() {
				var options = {
					url: '/config/wxmpenv', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {						
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('获取系统版本（体验/正式）', res)
					if(res.status==0){
						try {
						    var realuser = uni.getStorageSync('realuser');
						    if(res.env=='exp' && realuser){
						    	this.loginbyphone()
						    }
						    else{							
						    	try {
						    		const value = uni.getStorageSync('userinfo');
						    		console.log('value', value)
						    		if (value.status == 0) {
						    			uni.switchTab({
						    				url: '/pages/tabbar/index/index',
						    				success: res => {},
						    				fail: () => {},
						    				complete: () => {}
						    			});
						    		}
						    	} catch (e) {
						    		// error
						    		console.log('e', e)
						    	}
						    }
						} catch (e) {
						    // error
						}
						
						
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 手机方式登录
			loginbyphone() {
				var options = {
					url: '/staff/ops_login_by_pwd', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						phone: "15515318202",
						passwd: "e10adc3949ba59abbe56e057f20f883e"
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
					}else{
						uni.showToast({
							title: res.message?res.message:'登录失败',
							icon: 'none',
							duration:2000
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 获取微信信息
			getLoginData() {
				var _this = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRse) {
						_this.wxLoginCode = loginRse.code;
						console.log(33333,loginRse)
						uni.getUserInfo({
							success: (res) => {
								_this.user_info_data = res.encryptedData;
								_this.user_info_iv = res.iv;
							}
						});
					},
				});
			},
			// 获取手机号码
			getPhoneNumber(e) {
				console.log(e.detail.errMsg)
				if (e.detail.errMsg == "getPhoneNumber:ok") {
					this.user_phone_data = e.detail.encryptedData;
					this.user_phone_iv = e.detail.iv;
					var options = {
						url: '/staff/ops_login_by_wxmp', //请求接口
						method: 'POST', //请求方法全部大写，默认GET
						context: '',
						data: {
							"appid": "wxmpops",
							"code": this.wxLoginCode,
							"user_info_data": this.user_info_data,
							"user_info_iv": this.user_info_iv,
							"user_phone_data": this.user_phone_data,
							"user_phone_iv": this.user_phone_iv,
						}
					}
					this.$httpReq(options).then((res) => {
						if (res.status == 0) {
							this.setGobelrelogin(false);
							console.log('登录成功', res)
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
								duration: 1500,
							});
						}
					}).catch((err) => {
						// 请求失败的回调
						console.error(err, '捕捉')
					})
				} else {
					uni.showToast({
						title: '获取手机失败'
					});
				}
			},
			// 手动授权
			getuserinfo(e) {
				console.log(e);
				if (e.detail.errMsg == "getPhoneNumber:ok") {
					_this.user_info_data = e.detail.encryptedData;
					_this.user_info_iv = e.detail.iv;
				} else {

				}
			},
		}
	}
</script>

<style lang="scss">
	.img-view {
		width: 100%;
		height: 400upx;
		background-color: orangered;
	}

	.login-view {
		margin: 80upx 10% 0 10%;
		background-color: greenyellow;
		height: 88upx;
	}
	.login-pwd{
		margin: 40upx 0;
		text-align: center;
		font-size: 34upx;
		color: rgba(70,70,70,.8);
	}

	.phone-login-view {
		margin-top: 30upx;
		width: 100%;
		height: 88upx;
		text-align: center;
		line-height: 88upx;
	}

	.bottom-view {
		display: flex;
		justify-content: center;
		position: absolute;
		bottom: 40upx;
		width: 100%;
		height: 88upx;
		.bottom-span{
			color:rgb(50,50,50)
		}

		.bottom-text {
			left: 20upx;
			height: 88upx;
			line-height: 88upx;
			font-size: 22upx;
		}

		.click-text {
			height: 88upx;
			line-height: 88upx;
			font-size: 22upx;
			color: #FFB400;
		}
	}
</style>
