<template>
	<view class="qiun-columns">
		<!-- <view class="qiun-bg-white qiun-title-bar qiun-common-mt">
			<view class="qiun-title-dot-light">用户订单图</view>
		</view> -->
		<view class="qiun-charts">
			<!--#ifndef MP-ALIPAY -->
			<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchstart="touchLineA"></canvas>
			<!--#endif-->
		</view>
		<view class='grid-view'>
			<view class='flexd-posion'>
				<view class='view-flexs switch-head'>
					<view>日期</view>
					<view class='view-border-letf'>订单数</view>
					<view class='view-border-letf'>订单金额</view>
					<view class='view-border-letf'>车效</view>
				</view>
			</view>
			<view class='view-flexs view-border-bottom' v-for="(item,i) in orderlist" :key='i'>
				<view>{{item.time}}</view>
				<view class='view-border-letf'>{{item.num}}</view>
				<view class='view-border-letf'>{{item.money}}</view>
				<view class='view-border-letf'>{{item.bikeper}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uCharts from '@/common/u-charts.min.js';
	// import  { isJSON } from '@/common/checker.js';
	var _self;
	var canvaLineA = null;
	export default {
		data() {
			return {
				orderlist: [{
						time: '08-01',
						num: 300,
						money: 3000,
						bikeper: '45%'
					},
					{
						time: '08-02',
						num: 300,
						money: 3000,
						bikeper: '45%'
					},
					{
						time: '08-03',
						num: 300,
						money: 3000,
						bikeper: '45%'
					},
					{
						time: '08-04',
						num: 300,
						money: 3000,
						bikeper: '45%'
					},
					{
						time: '08-05',
						num: 300,
						money: 3000,
						bikeper: '45%'
					},
					{
						time: '08-06',
						num: 300,
						money: 3000,
						bikeper: '45%'
					},
					{
						time: '08-07',
						num: 300,
						money: 3000,
						bikeper: '45%'
					},
				],
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				textarea: ''
			}
		},
		onLoad() {
			_self = this;
			//#ifdef MP-ALIPAY
			uni.getSystemInfo({
				success: function(res) {
					if (res.pixelRatio > 1) {
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio = 2;
					}
				}
			});
			//#endif
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.getServerData();
		},
		methods: {
			getServerData() {
				var options = {
					url: '/city/monitor', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {},
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('订单信息', res)
					if (res.status == 0) {
						// this.option=res
						var datatimes = []
						var user_charge_order_amount_grouth = []
						var user_growth = []
						var user_order_growth = []
						var user_scan_qdcode = []
						var user_order_amount_growth = []
						var bike_count_daily = []
						var orderNum = {
							name: '订单数',
							data: []
						}
						var orderMoney = {
							name: '订单金额',
							data: []
						}
						var bikeeffic = {
							name: '车效',
							data: []
						}
						this.orderlist=[]
						for (var i in res.user_growth) {
							var formatetime = i.split('-')
							var newtimes = formatetime[1] + '-' + formatetime[2]
							datatimes.push(newtimes)
							var orderobj={time:'',num:'',money:'',bikeper:''}
							// user_charge_order_amount_grouth.push(res.user_charge_order_amount_grouth[i])
							// user_growth.push(res.user_growth[i])
							// 订单数
							user_order_growth.push(res.user_order_growth[i])
							// user_scan_qdcode.push(res.user_scan_qdcode[i])
							// 车效
							var bikepers=''
							if(res.user_order_growth[i]==0 || res.bike_count_daily[i]==0){
								bikepers=0
							}else{
								bikepers=parseFloat(res.user_order_growth[i]/res.bike_count_daily[i]).toFixed(1)
								
							}	
							bike_count_daily.push(bikepers)
							// 订单金额
							user_order_amount_growth.push(res.user_order_amount_growth[i] / 100)
							// 下方表格使用数据
							orderobj.time=newtimes
							orderobj.num=res.user_order_growth[i]
							orderobj.money=res.user_order_amount_growth[i] / 100
							orderobj.bikeper=bikepers
							this.orderlist.push(orderobj)
						}
						orderNum.data = user_order_growth
						orderMoney.data = user_order_amount_growth
						bikeeffic.data=bike_count_daily
						let LineA = {
							categories: [],
							series: []
						};
						//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
						LineA.categories = datatimes;
						LineA.series.push(orderNum)
						LineA.series.push(orderMoney)
						LineA.series.push(bikeeffic)
						console.log('LineA', LineA)
						// _self.textarea = JSON.stringify(res.data.data.LineA);
						_self.showLineA("canvasLineA", LineA);

					} else {
						uni.showToast({
							title: res.message ? res.message : '获取订单信息失败'
						});
					}

				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})

			},
			showLineA(canvasId, chartData) {
				canvaLineA = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'line',
					fontSize: 11,
					padding: [15, 15, 0, 15],
					legend: {
						show: true,
						padding: 5,
						lineHeight: 11,
						margin: 0,
					},
					dataLabel: false,
					dataPointShape: true,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: true,
					xAxis: {
						type: 'grid',
						gridColor: '#CCCCCC',
						gridType: 'dash',
						dashLength: 8
					},
					yAxis: {
						gridType: 'dash',
						gridColor: '#CCCCCC',
						dashLength: 8,
						splitNumber: 5,
						// min: 10,\\\
						// max: 180,
						format: (val) => {
							return val.toFixed(0) + '元'
						}
					},
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						line: {
							type: 'straight'
						}
					}
				});

			},
			touchLineA(e) {
				canvaLineA.touchLegend(e);
				canvaLineA.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
			},

		}
	}
</script>

<style lang="scss" scoped>
	/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.grid-view {
		margin-top: 30upx;

		.flexd-posion {
			background-color: rgb(225, 225, 225);
		}

		.view-border-bottom {
			border-bottom: 1upx solid rgb(235, 235, 235);
		}

		.switch-head {
			height: 90upx;
			line-height: 90upx;
		}

		.view-flexs {
			display: flex;
			// left: 0;
			width: 100%;
			text-align: center;
			align-items: center;

			// justify-content: center;
			.view-border-letf {
				border-left: 1upx solid rgb(235, 235, 235);
				height: 60upx;
			}

			view {
				width: 30%;
			}
		}
	}
</style>
