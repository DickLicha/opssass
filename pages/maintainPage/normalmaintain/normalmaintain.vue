<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="carcenterdata1" :type='2' :border='true'></item-cell>
			<item-cell :itemdata="carcenterdata2" :type='2' :border='true'></item-cell>
			<!-- <item-cell :itemdata="carcenterdata3" :type='4' :border='true' @itemclick='gocarcenter'></item-cell> -->
			<view class='matain-view'>
				<view class='matain-inner'>
					<view class='matain-title'>保养项目</view>
					<view v-for="(item,i) in maintain" :key="i">{{item.name}}</view>
				</view>
			</view>
			<view class='btn-grop'>
				<button type='primary' class='share-button-default bottom-button' @click='maintainsuccess'>保养完成</button>
				<button type='' class='bottom-button rightbtn' @click='repairebike'>报修</button>
			</view>			
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
			// this.getcarinfo()
			// 车型
			this.carcenterdata1[0].val = this.bikeinfo.id

			// 库存状态
			// this.carcenterdata1[1].val = this.$invstate(this.bikeinfo.inv_state)

			// 车辆状态
			let health_state = ''
			if (this.bikeinfo.health_state == 0) {
				health_state = '健康'
			} else {
				health_state = '故障'
			}
			// this.carcenterdata1[2].val = health_state
			this.carcenterdata2[0].val=this.$bus_state(this.bikeinfo.bus_state)
			this.carcenterdata2[1].val=this.bikeinfo.last_maintain_time
			this.carcenterdata2[2].val=this.bikeinfo.launch_time

		},
		computed: mapState(['directinfo', 'bikeinfo']),
		data() {
			return {
				carcenterdata1: [{
					name: '车辆编号:',
					val: ''
				}],
				carcenterdata2: [{
						name: '当前状态:',
						val: ''
					},
					{
						name: '最近一次保养时间:',
						val: ''
					},
					{
						name: '车辆投放时间:',
						val: ''
					},
				],
				maintain: [{
						name: '1、检查刹车（一指距离刹车）'
					},
					{
						name: '2、检查转吧（转把回弹无卡滞）'
					},
					{
						name: '3、检查曲柄（变形拆除）'
					},
					{
						name: '4、检查前叉（前叉松动换球架）'
					},
					{
						name: '5、检查减震（紧固减震器螺丝）'
					},
					{
						name: '6、检查车座（车座无松动、歪斜）'
					},
					{
						name: '7、检查边撑（螺丝紧固）'
					},
					{
						name: '8、扫码验证'
					},
				]
			}
		},
		methods: {
			repairebike(){
				uni.navigateTo({
					url: '/pages/carBigCenter/breakdowncar/breakdowncar',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},			
			gocarcenter(item) {
				uni.navigateTo({
					url: item.url,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},

			bikemaintain() {
				uni.getLocation({ //获取当前的位置坐标
					type: 'gcj02',
					success: (res) => {
						var options = {
							url: '/bike/maintain', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"bike_id": this.bikeinfo.id,
								"user_coordinate": [res.longitude,res.latitude]
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('保养状态', res)
							if (res.status == 0) {
								uni.showToast({
									title: '保养成功'
								});
								setTimeout(()=>{
									uni.navigateBack({
										delta: 1
									});
								},1000)
							}else{
								uni.showToast({
									icon:'none',
									title: res.message?res.message:'保养失败'
								});
							}
						}).catch((err) => {
							// 请求失败的回调
							console.error(err, '捕捉')
						})
						
					},
					fail: (res) => {
						console.log('fail', res)
					}
				});
				
			},
			maintainsuccess() {
				uni.showModal({
					title: '保养',
					content: '保养完成',
					// showCancel: false,
					cancelText: '取消',
					confirmText: '保养完成',
					success: res => {
						this.bikemaintain()
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
            .btn-grop{
				display: flex;
				margin-top: 20upx;
				.bottom-button {
					/* position: fixed;
					bottom: 20upx; */
					width: calc(50% - 44upx)
				}
				.rightbtn{
					background-color: #939391;
					color: black;
				}
			}			
			.matain-view {
				margin-top: 30upx;
				background-color: white;
				border-radius: 20upx;
				.matain-inner {
					margin-left: 44upx;
					.matain-title {
						font-size: 38upx;
						margin-top: 30upx;
					}
				}
			}
		}
	}
</style>
