<template>
	<view class='wrap'>
		<view class='view-common'>
			<view class="uni-common-mt input-place">
				<view class="uni-form-item uni-column">
					<input class="uni-input letter-spacings" maxlength="8" v-model="carnum" @input="hideKeyboard" type="number"
					 placeholder="请输入编号" />
				</view>
				<button class='share-button-default sure-btn' type='primary' @click='go'>完成</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				title: 'input',
				focus: false,
				inputValue: '',
				changeValue: '',
				carnum: '',
				urls: '',
				type: '',
			}
		},
		methods: {
			...mapMutations(['setBikeid', 'setSn', 'setBikeinfo', 'setOrderfirstid', 'setOrderinfo', 'setBaseurl']),
			onKeyInput() {
				this.inputValue = event.target.value
			},
			replaceInput(event) {
				var value = event.target.value;
				if (value === '11') {
					this.changeValue = '2';
				}
			},
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
							url: this.urls,
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
						this.order = {
							length: res.list.length,
							id: res.list[0].id
						}
					} else {
						uni.showToast({
							title: '订单不存在'
						});
					}
				})
			},
			go() {
				this.setBikeid('*')
				this.setSn(this.carnum)
				this.carinfo()
				// if(this.type=='8'){
				// 	this.throwin(this.carnum)
				// }else{
				// 	this.carinfo()
				// }								
			},
			// 投放市场
			throwin(id) {
				this.setBikeid('*')
				this.setSn('*')
				var options = {
					url: '/binv/launch', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"bike_id": id,
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('投放信息', res)
					if (res.status == 0) {
						uni.showToast({
							title: '投放成功',
							// mask: false,
							duration: 2500
						});
					} else {
						uni.showToast({
							title: res.message ? res.message : '投放失败',
							icon: 'none',
							// mask: false,
							duration: 2500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 车辆信息
			carinfo() {
				var options = {
					url: '/bike/info', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"bike_sn": this.carnum
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('bikeinfo', res)
					if (res.status == 0) {
						this.setBikeid("*")
						this.setSn("*")
						// this.setBikeid(res.info.id)
						this.setBikeinfo(res.info)
						// 入库和维修要先请求订单信息
						if (this.type == '1.1' || this.type == '1.3') {
							var datas = {}
							if (this.type == '1.1') {
								datas = {
									"is_order_finished": 0, //车子处于报修状态包括入库和未入库
									"pno": 1,
									"psize": 100,
									"bike_id": res.info.id,
									"order_state": 0, //刚报修未入库，没有这个值表示已入库
								}
							} else {
								datas = {
									"is_order_finished": 0,
									"pno": 1,
									"psize": 100,
									"bike_id": res.info.id,
								}
							}
							this.requestorder(datas)
						} else {
							// 投放市场
							if (this.type == '8') {
								// 判断车辆是否已经投放市场
								if (res.info.inv_state == 99) {
									this.throwin(res.info.id)
								} else {
									uni.showToast({
										title: '该车已经投放市场'
									});
								}

							} else {
								if (this.type == '14' && res.info.bus_state == 0) {
									uni.showToast({
										title: '无正在进行中订单',
										icon: 'none'
									});
									return
								}
								uni.navigateTo({
									url: this.urls,
									success: res => {},
									fail: () => {},
									complete: () => {}
								});
							}
						}
					} else {
						uni.showToast({
							title: '该编号不存在！',
							mask: false,
							duration: 1500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			hideKeyboard(event) {
				if (this.carnum.length === 8) {
					if (this.carnum == '86350001') {
						try {
							uni.removeStorageSync('userinfo');
						} catch (e) {
							// error
						}
						this.setBaseurl('https://api.test.lexiangys.top')
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
					if (this.carnum == '86350000') {
						this.setBaseurl('https://api.lexiangys.top')
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
					this.setBikeid('*')
					this.setSn(this.carnum)
					uni.hideKeyboard();
					this.carinfo()
				}
			}
		},
		onLoad(e) {
			console.log('e', e)
			this.urls = e.urls
			this.type = e.type
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

			.letter-spacings {
				/* letter-spacing:40upx; */
			}

			.sure-btn {
				position: fixed;
				bottom: 20upx;
				width: calc(100% - 44upx);
			}

			.input-place {
				margin: 100upx 0;
			}
		}
	}
</style>
