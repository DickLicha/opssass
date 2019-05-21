<template>
	<view>
		<view class="img-view">
			
		</view>
		<button class="login-view" open-type="getUserInfo" type="primary" @getuserinfo="getuserinfo">授权</button>
		<button class="login-view" type="primary" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">微信用户快速登录</button>			
		<view class="bottom-view">
			<view class="bottom-text">登录即代表同意</view>
			<view class="click-text">《点点出行用户协议》</view>
		</view>
	</view>
</template>

<script>
	import {mapMutations} from 'vuex';
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
		onReady() {
			this.getLoginData();
		},
		methods: {
			...mapMutations(['setUserinfo']),
			// 获取微信信息
			getLoginData(){
				var _this = this;
				uni.login({
					provider: 'weixin',
					success: function (loginRse){
						console.log('login:',loginRse);
						_this.wxLoginCode = loginRse.code;
						uni.getUserInfo({
							success:(res)=>{
								_this.user_info_data = res.encryptedData;
								_this.user_info_iv = res.iv;
							}
						});
					},
				});
			},
			// 获取手机号码
			getPhoneNumber(e){
				console.log(e.detail.errMsg)
				if (e.detail.errMsg == "getPhoneNumber:ok") {
					this.user_phone_data = e.detail.encryptedData;
					this.user_phone_iv = e.detail.iv;
					var options = {
						url: '/staff/login_by_wxmp', //请求接口
						method: 'POST', //请求方法全部大写，默认GET
						context: '',
						data:{
							"appid": "wxmpops",
							"code": this.wxLoginCode,
							"user_info_data": this.user_info_data,
							"user_info_iv": this.user_info_iv,
							"user_phone_data": this.user_phone_data,
							"user_phone_iv": this.user_phone_iv,
						}
					}
					this.$httpReq(options).then((res) => {
						if(res.status==0){
							console.log('登录成功',res)
							this.setUserinfo(res)
							uni.showToast({
								title: '登录成功',
								mask: false,
								duration: 1500,
								icon:"success"
							})
							setTimeout(()=>{
								uni.switchTab({
									url: "/pages/tabbar/index/index",
								},2000)
							})							
						}else{
							uni.showToast({
								title: res.message?res.message:'登录失败',
								duration: 1500,
							});
						}					
					}).catch((err) => {
						// 请求失败的回调
						console.error(err, '捕捉')
					})
				}else{
					uni.showToast({
						title: '获取手机失败'
					});
				}
			},
			// 手动授权
			getuserinfo(e){
				console.log(e);
				if (e.detail.errMsg == "getPhoneNumber:ok") {
					_this.user_info_data = e.detail.encryptedData;
					_this.user_info_iv = e.detail.iv;
				}else{
					
				}
			},
		}
	}
</script>

<style lang="scss">
	.img-view{
		width: 100%;
		height: 400upx;
		background-color: orangered;
	}
	.login-view{
		margin: 80upx 10% 0 10%;
		background-color: greenyellow;
		height: 88upx;
	}
	.phone-login-view{
		margin-top: 30upx;
		width: 100%;
		height: 88upx;
		text-align: center;
		line-height: 88upx;
	}
	.bottom-view{
		display: flex;
		justify-content: center;
		position: absolute;
		bottom: 40upx;
		width: 100%;
		height: 88upx;
		.bottom-text{
			left: 20upx;
			height: 88upx;
			line-height: 88upx;
			font-size: 22upx;
		}
		.click-text{
			height: 88upx;
			line-height: 88upx;
			font-size: 22upx;
			color: #FFB400;
		}
	}
</style>
