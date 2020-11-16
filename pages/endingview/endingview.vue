<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="carcenterdata1" :type='2' :border='true'></item-cell>
			<!-- <map class='base-map-view' :latitude="latitude" :longitude="longitude" :markers="covers">
			</map> -->
			<button class='share-button-default end-btn' type='primary' @click="go">{{buttonname}}</button>
		</view>
		<uni-popup :show="poptypes ==='battery-model'" position="middle" mode="fixed" @hidePopup="togglePopup('')">
			<view :scroll-y="true" class="uni-center center-box">
				<view class='battery-title'><text>请选择电池型号：</text></view>
				<view class='battery-view'>
					<view class='detil-view' :class="{'batteryactive':activeclass==item}" v-for="(i,item) in batterymodel" :key='i' @click="chosebattery(item,i)"><text>{{i[0]}}</text></view>
				</view>
				<view><view class='battery-view'>
					<view class='detil-view sure-btn' @click='surechosebtn()'><text>确定</text></view>
					<view class='detil-view cancel-btn' @click="togglePopup('')"><text>取消</text></view>
				</view></view>		
				<view></view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		components: {
			itemCell
		},
		onLoad(e) {
			this.carcenterdata1[0].val = e.bikeid
			this.type = e.type
			this.bikeid = e.bikeid
			// this.orderid = e.orderid
			this.setOrderid(e.orderid)
			var name = ''
			try {
				const value = uni.getStorageSync('userinfo');
				if (value) {
					this.batterymodel =value.city.battery_models
				}
			} catch (e) {
				// error
			}
			if (this.type == '0') {
				this.buttonname = '结束换电'
				name = '换电'
			} else {
				this.buttonname = '开始挪车'
				name = '挪车'
			}
			this.carcenterdata1[1].val = name
		},
		computed: mapState(['directinfo', 'bikeinfo', 'orderid', 'endmove']),
		data() {
			return {
				activeclass:0,
				batterym:'',
				batterymodel:[],
				poptypes:'',
				carcenterdata1: [{
						name: '车辆编号:',
						val: ''
					},
					{
						name: '类型:',
						val: '挪车'
					}
				],
				type: '',
				buttonname: '',
				bikeid: '',
				// latitude: 39.909,
				// longitude: 116.39742,
				// covers: [{
				// 	latitude: 39.909,
				// 	longitude: 116.39742,
				// 	iconPath: '../../../static/location.png'
				// }, {
				// 	latitude: 39.90,
				// 	longitude: 116.39,
				// 	iconPath: '../../../static/location.png'
				// }]
				// orderid: ''
			}
		},
		methods: {
			...mapMutations(['setSn', 'setOrderid', 'setEndmove']),
			chosebattery(i,item){
				this.activeclass=i
				this.batterym=item[1]	
			},
			togglePopup() {
				this.poptypes = 1
			},
			gocarcenter(item) {
				uni.navigateTo({
					url: item.url,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			go() {
				if (this.type == 0) {
					this.closebattery()
				} else {
					// this.setEndmove(true)
					uni.navigateBack({
						delta: 2
					});
					// uni.navigateTo({
					// 	url: `/pages/map/map?type=3.1&&name=挪车&&text=全部车站&&endmove=true&&orderid=${this.orderid}`,
					// 	success: res => {},
					// 	fail: () => {},
					// 	complete: () => {}
					// });
				}
			},
			surechosebtn(){
				uni.showLoading({
					title: '关锁中'
				});
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						this.setSn('*')
						var options = {
							url: '/bcorder/finish', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"order_id": this.orderid,
								"user_coordinate": [
									res.longitude, res.latitude
								],
								"battery_model":this.batterym
							},
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('关锁完成订单电池锁', res)
							if (res.status == 0) {
								this.buttonname = '更换电池'
								uni.showToast({
									title: '关成功!',
									icon: 'none',
									duration: 2000
								})
								setTimeout(() => {
									uni.navigateBack({
										delta: 2
									});
								}, 2000)
							} else {
								uni.showToast({
									title: res.message ? res.message : '关锁失败!',
									duration: 2000
								})
							}
						}).catch((err) => {
							// 请求失败的回调
							console.error(err, '捕捉')
						})
					},
					fail: () => {},
					complete: () => {}
				});
			},
			closebattery() {				
				if(this.batterymodel.length<2){
					uni.showLoading({
						title: '关锁中'
					});
					uni.getLocation({
						type: 'wgs84',
						success: res => {
							this.setSn('*')
							var options = {
								url: '/bcorder/finish', //请求接口
								method: 'POST', //请求方法全部大写，默认GET
								context: '',
								data: {
									"order_id": this.orderid,
									"user_coordinate": [
										res.longitude, res.latitude
									],
									"battery_model":this.batterym
								},
							}
							this.$httpReq(options).then((res) => {
								// 请求成功的回调
								// res为服务端返回数据的根对象
								console.log('关锁完成订单电池锁', res)
								if (res.status == 0) {
									this.buttonname = '更换电池'
									uni.showToast({
										title: '关成功!',
										icon: 'none',
										duration: 2000
									})
									setTimeout(() => {
										uni.navigateBack({
											delta: 2
										});
									}, 2000)
								} else {
									uni.showToast({
										title: res.message ? res.message : '关锁失败!',
										duration: 2000
									})
								}
							}).catch((err) => {
								// 请求失败的回调
								console.error(err, '捕捉')
							})
						},
						fail: () => {},
						complete: () => {}
					});
				}else{
					this.poptypes='battery-model'
				}
			},
		}
	}
</script>

<style lang='scss'>
	.wrap {
		background-color: rgb(245, 245, 245);
		padding-top: 1upx;
		padding-bottom: 1upx;

		.view-common {
			margin: 10upx 22upx;
			height: 100vh;			
			.base-map-view {
				width: 100%;
				height: 700upx;
				margin-top: 30upx;
			}
		}
        .center-box {
        	font-size: 34upx;
        	height: 270upx;
        	width: 320upx;				
        }
        .battery-title{
        	font-size: 28upx;
        }
        .battery-view{
        	margin-top: 20upx;
        	display: flex;
        	justify-content: space-between;
        	.detil-view{
        		border: 1upx solid rgb(80,80,80);
        		border-radius: 10upx;
        		width: 30%;
        		height: 80upx;
        		line-height: 80upx;
        		color: rgb(80,80,80);		
        	}
        	.sure-btn{
        		background-color:rgb(0,122,255) ;
        		color: white;
        		width: 45%;
        	}
        	.cancel-btn{
        		width: 45%;
        	}
        	.batteryactive{
        		/* color:white ;
        		background-color: rgb(0,122,255); */
        		width: 32%;
        		line-height: 74upx;
        		border: 4upx solid rgb(246,199,0);       		
        	}
        }
		.end-btn {
			width: calc(100% - 44upx);
			position: fixed;
			bottom: 20upx;
		}
	}
</style>
