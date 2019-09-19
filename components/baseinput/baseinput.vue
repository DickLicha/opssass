<template>
	<view>
		<view class="base-input">
			<view class="flewd">
				<input class="uni-input letter-spacings input-width base-inputh"  maxlength="8" v-model="title" @input="hideKeyboard" type="number"
				 placeholder="请输入编号" />
				 <img  src="../../static/image/scan2x.png" class='base-img' @click='scancode'  alt="">
			</view>
			<!-- <button class='share-button-default sure-btn' type='primary' @click='go'>完成</button> -->
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		name: "Headers",
		props: {
			title: {
				default: ''
			},
			hasBack: {
				default: false
			},
			hasright: {
				default: false
			},
			rightTitle: {
				default: ''
			},
			xialajiantou: {
				default: false
			}
		},
		data(){
			return{
				titles:''
			}
		},
		methods: {
			...mapMutations(['setSn','setBikeid','setBaseurl']),
			messagecenter() {
				this.$emit("messCenter")
			},
			scancode(){
				this.$emit('scanCode')
			},
			go(){			
				this.$emit('goPage',this.title)
			},
			showmapcoverview() {
				this.$emit("show")
			},
			goback() {
				uni.navigateBack({
					delta: 1
				});
			},
			hideKeyboard(event) {
					if (this.title.length === 8) {
						if (this.title == '86350001') {
							try {
								uni.removeStorageSync('userinfo');
							} catch (e) {
								// error
							}
							try {
							    uni.setStorageSync('baseurl', 'https://api.test.lxys3344.xyz');
							} catch (e) {
							    // error
							}
							// this.setBaseurl('https://api.dd-test.ildjoy.com')
							uni.showToast({
								title: '已切换到测试环境',
								icon: 'none',
								duration: 2000,
							});
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/mine/loginView/loginView',
									success: res => {},
									fail: () => {},
									complete: () => {}
								});
							}, 2000)
							return
						}
						if (this.title == '86350000') {
							// this.setBaseurl('https://api.dd.ildjoy.com')
							try {
							    uni.setStorageSync('baseurl', 'https://api.test.lxys3344.xyz');
							} catch (e) {
							    // error
							}
							try {
								uni.removeStorageSync('userinfo');
							} catch (e) {
								// error
							}
							uni.showToast({
								title: '已切换到线上环境',
								icon: 'none',
								duration: 2000,
							});
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/mine/loginView/loginView',
									success: res => {},
									fail: () => {},
									complete: () => {}
								});
							}, 2000)
							return
						}
						uni.hideKeyboard();
						this.setBikeid('*')
						this.setSn(this.title)
						this.$emit('hidekeygo')												
						// this.carinfo()
					}
				},
			gosuchview() {
				uni.navigateTo({
					url: '../searchview/searchview',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		},
	}
</script>

<style scoped lang="scss">
	.base-input{
		// background-color: #007AFF;
		height:8vh;
		.sure-btn{
			margin: 10upx 20upx;
		}
		.base-inputh{
			height:5vh
		}
		.flewd{
			display: flex;
			flex-wrap:nowrap ;
			background-color:white;
			.input-width{
				// width:70%;
			}
		}
		.base-img{
			width:48upx;
			height:48upx;
			margin-top: 20upx;
			margin-right: 30upx;
		}
	}
</style>
