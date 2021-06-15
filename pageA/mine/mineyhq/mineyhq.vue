<template>
	<view class='wrap'>
		<view class='out-margin'>
			<view class="base-input">
				<view class="flewd">
					<input class="uni-input letter-spacings input-width base-inputh" maxlength="11" v-model="phonenumber" @input="hideKeyboard(0)"
					 type="number" placeholder="用户手机号" />
				</view>
				<!-- <button class='share-button-default sure-btn' type='primary' @click='go'>完成</button> -->
			</view>
			<view class="base-input">
				<view class="flewd">
					<input class="uni-input letter-spacings input-width base-inputh" maxlength="8" v-model="username" 
					 type="text" placeholder="证件姓名" />
				</view>
				<!-- <button class='share-button-default sure-btn' type='primary' @click='go'>完成</button> -->
			</view>
			<view class="base-input">
				<view class="flewd">
					<input class="uni-input letter-spacings input-width base-inputh" maxlength="18" v-model="userid" 
					 type="idcard" placeholder="证件号码" />
				</view>
				<!-- <button class='share-button-default sure-btn' type='primary' @click='go'>完成</button> -->
			</view>
		</view>
		<button class='recognize-btn' type='primary' @click='go'>立即认证</button>
	</view>
</template>

<script>
	import baseInput from '@/components/baseinput/baseinput.vue'
	export default {
		data() {
			return {
              user_id:''
			};
			
		},
		methods:{
			hideKeyboard(type){
				if(type==0){
					if(this.phonenumber.length==11){
						this.getuserid()
					}
				}
			},
			getuserid() {
					var options = {
					url: '/user/list_by_sk', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						sk:this.phonenumber,
						pno:1,
						psize:10
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('获取用户编号成功',res)	
					if (res.status == 0 && !!res.list[0]) {
                        	this.user_id=res.list[0].id				
					} else {
						uni.showToast({
							title: res.message ? res.message : '改用户不存在',
							mask: false,
							icon:'none',
							duration: 1500
						});
						this.phonenumber=''
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			go(){
				var options = {
					url: '/user/real_name_auth', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						idcno:this.userid,
						name:this.username,
						user_id:this.user_id
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象						
					if (res.status == 0) {
				       console.log('认证成功',res) 	
						uni.showToast({
							title: res.message ? res.message : '认证成功',
							mask: false,
							icon:'none',
							duration: 1500
						});			   
					} else {
						uni.showToast({
							title: res.message ? res.message : '认证失败',
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

<style lang="scss" scoped>
	.wrap {
		background-color: rgb(245, 245, 245);
		padding-top: 1upx;
		padding-bottom: 1upx;
		height: 100vh;
		.recognize-btn{
			margin:50upx 24upx;
		}
		.out-margin{
			margin-top: 100upx;
		}
	}

	.base-input {
		// background-color: #007AFF;
		height: 8vh;
		margin: 0 24upx;

		.sure-btn {
			margin: 10upx 20upx;
		}

		.base-inputh {
			height: 5vh
		}

		.flewd {
			// display: flex;
			// flex-wrap:nowrap ;
			background-color: white;
			margin-top: 30upx;

			.input-width {
				// width:70%;
			}
		}

		.base-img {
			width: 48upx;
			height: 48upx;
			margin-top: 20upx;
			margin-right: 30upx;
		}
	}
</style>
