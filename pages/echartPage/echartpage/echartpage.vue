<template>
	<view class="qiun-columns">
		<!-- <view class="qiun-bg-white qiun-title-bar qiun-common-mt">
			<view class="qiun-title-dot-light">用户订单图</view>
		</view> -->
		<view class='timeselect'>
			<!-- <view>开始时间:</view> -->
			<view class='timedetil' @tap="toggleTab(1)">
				<view class='wenzi'>开始</view>
				<view>{{start_time}}</view>
			</view>
			<yu-datetime-picker @confirm="onConfirm" startYear="2015" ref="dateTime" value="2020-01-01 00:00:00" :isAll="true"
			 :current="false"></yu-datetime-picker>
			<view class='timedetil' @tap="toggleTab(2)">
				<view class='wenzi'>结束</view>
				<view>{{end_time}}</view>
			</view>
			<!-- <calendar @change="change" :startDate="initStartDate" :endDate="initEndDate" :daysCount="daysCount"></calendar> -->
		</view>
		<view class="qiun-charts">
			<!--#ifndef MP-ALIPAY -->
			<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchstart="touchLineA"></canvas>
			<!--#endif-->
		</view>
		<view><span class='aver-view'>平均车效:</span>{{avercarratio}}<span class='aver-view' v-if='chartlimits'>平均金额:</span><span v-if='chartlimits'>{{avermoney}}</span></view>
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
	import yuDatetimePicker from "@/components/yu-datetime-picker.vue"
	var _self;
	var canvaLineA = null;
	export default {
		data() {
			return {
				orderlist: [],
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				textarea: '',
				start_time:'2020-03-01 00:03:11',
				end_time:"2020-03-20 00:03:11",
				timeflag:0,
				avercarratio:'',
				avermoney:'',
				chartlimits:0,
			}
		},
		components: {
			yuDatetimePicker,
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
			var date = new Date()
			var seperator1 = "-";
			var seperator2 = ":";
			var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
			var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
			var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
				" " + date.getHours() + seperator2 + date.getMinutes() +
				seperator2 + date.getSeconds()
			var fmonuth=month-1<10?'0'+(month-1):month-1
			this.start_time=date.getFullYear() + seperator1 + fmonuth + seperator1 + strDate +
				" " + '00' + seperator2 + '00' +
				seperator2 + '00'
			this.end_time=date.getFullYear() + seperator1 + month + seperator1 + strDate +
				" " + '23' + seperator2 + '59' +
				seperator2 + '59'
			var acl = []																
			uni.getStorage({
				key: 'userinfo',
				success: res => {
					acl = res.data.acl.children
					var onlyid = '',
						tempobj = {},
						src = '',
						name = '',
						url = '',
						text = ''
					for (let i = 0; i < acl.length; i++) {
						if (acl[i].visitable == 1) {
							onlyid = parseInt(acl[i].uri)
							switch (onlyid) {
								case 15:
									if(!!acl[i].children){
										for(var j=0;j<acl[i].children.length;j++){
											if(acl[i].children[j].uri==15.2 && acl[i].children[j].visitable){
												this.chartlimits=1							
											}
										}
										
									}
									this.getServerData();
									break
							}
						}
					}
				},
				fail:res=>{
					console.log('fail',res)
					uni.reLaunch({
						url: '/pages/mine/loginView/loginView',
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}
			})	
		},
		methods: {
			getServerData() {
				var options = {
					url: '/city/monitor', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						start_time:this.start_time,
						end_time:this.end_time,
					},
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
						var allbikeeffic=0
						var allmoney=0
						this.orderlist = []
						for (var i in res.user_growth) {
							var formatetime = i.split('-')
							var newtimes = formatetime[1] + '-' + formatetime[2]
							datatimes.push(newtimes)
							var orderobj = {
								time: '',
								num: '',
								money: '',
								bikeper: ''
							}						
							// 订单数
							user_order_growth.push(res.user_order_growth[i])
							// user_scan_qdcode.push(res.user_scan_qdcode[i])
							// 车效
							var bikepers = ''
							if (res.user_order_growth[i] == 0 || res.bike_count_daily[i] == 0) {
								bikepers = 0
							} else {
								bikepers = parseFloat(res.user_order_growth[i] / res.bike_count_daily[i]).toFixed(1)

							}
							// console.log('bikepers',bikepers,typeof(bikepers))
							allbikeeffic+=parseFloat(bikepers)
							allmoney+=parseFloat(res.user_order_amount_growth[i] / 100)
							bike_count_daily.push(bikepers)
							if(this.chartlimits){
								// 订单金额
								user_order_amount_growth.push(res.user_order_amount_growth[i] / 100)
								orderobj.money = res.user_order_amount_growth[i] / 100
							}else{
								user_order_amount_growth.push(0)
								orderobj.money = 0
							}
							
							// 下方表格使用数据
							orderobj.time = newtimes
							orderobj.num = res.user_order_growth[i]
							
							orderobj.bikeper = bikepers
							this.orderlist.push(orderobj)
						}
						// console.log('allbikeeffic',allbikeeffic,typeof(allmoney),Object.keys(res.user_growth).length)
						this.avercarratio=(allbikeeffic/Object.keys(res.user_growth).length).toFixed(2)
						this.avermoney=(allmoney/Object.keys(res.user_growth).length).toFixed(2)
						// 倒序
						// this.orderlist.reverse()
						orderNum.data = user_order_growth.reverse()
						orderMoney.data = user_order_amount_growth.reverse()
						bikeeffic.data = bike_count_daily.reverse()
						let LineA = {
							categories: [],
							series: []
						};
						//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
						LineA.categories = datatimes.reverse();
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
						type: 'calibration',
						gridColor: '#CCCCCC',
						gridType: 'dash',
						dashLength: 8,
						labelCount: 4,
						// rotateLabel:true
						// fontSize:8
					},
					yAxis: {
						gridType: 'dash',
						gridColor: '#CCCCCC',
						dashLength: 8,
						splitNumber: 5,
						// min: 10,\\\
						// max: 180,
						format: (val) => {
							// return val.toFixed(0) + '元'
							return val.toFixed(0)
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
			
			toggleTab(item) {
				this.timeflag=item
			    this.$refs.dateTime.show();  
			},  
			onConfirm(val) {  
				  if(this.timeflag==1){
					  this.start_time=val.selectRes
				  }else{
					  this.end_time=val.selectRes
				  }
				  this.getServerData()
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
	.aver-view{
		margin-left: 14upx;
		font-size: 22upx;
		color: rgb(80,80,80);
	}

	.timeselect {
		.wenzi {
			font-size: 22upx;
			color: rgb(80, 80, 80);
			margin-right: 40upx;
			line-height: 40upx;
		}

		display: flex;
		justify-content: space-around;
		height: 50upx;

		.timedetil {
			display: flex;
			justify-content: space-around;
		}
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
