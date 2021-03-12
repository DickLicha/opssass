<template>
	<view>
		<view class="index-top">
			<view class="index-top-bg theme-bg" :style="'height:'+bgheight">

			</view>
			<view class="index-top-box">
				<view style='margin-top: 50upx;'>
					<view class="nav nav-head">
						<navigator class="store" @click="showbotpop" url="../selectStore/selectStore">{{citylist[0].name||'未知城市'}}<text
							 class="iconfont icon-xiajian"></text></navigator>
						<view>
							<text class="address">{{locaplace||'未获取'}}</text>
							<view class='weather-view' v-if="!!weather">
								<img class='img-view' :src="weather.weather_day_pic" alt="">
								<view>
									<text>{{weather.weather_day}}</text>
									<text>{{weather.temperature_day}}°c</text>
								</view>
							</view>
						</view>
						<!-- <text class="address">{{locaplace||'未获取'}}</text> -->
					</view>
				</view>
				<!-- 暂时移除 -->
				<!-- <view class="nav flex-box">
					<view class="flex" v-for="(i,item) in qxmenudata" @tap="scaninto(i.val,i.url)" :key='item'>
						<view class="nav-ct">{{i.name}}</view>
					</view>
				</view> -->

				<!-- 财务汇总 -->
				<view class='timeselect-view' v-if="limitorder.czje||limitorder.hykje||limitorder.all||limitorder.qxddf">
					<view class='box-title'>财务汇总</view>
					<!-- 新增 -->
					<view class='timeselect' v-if="limitorder.all && isActive1==-1">
						<!-- <view>开始时间:</view> -->
						<view class='timedetil' @tap="toggleTab1(1)">
							<view class='wenzi'>开始</view>
							<view>{{start_time}}</view>
						</view>
						<yu-datetime-picker @confirm="onConfirm1" @canCel='onCancel' @clickOther='onClickother' startYear="2015" ref="dateTime1"
						 :value=value :isAll="true" :current="false"></yu-datetime-picker>
						<view class='timedetil' @tap="toggleTab1(2)">
							<view class='wenzi'>结束</view>
							<view>{{end_time}}</view>
						</view>

					</view>

					<!-- <view class='timeselect-detil'>
						<view class='timeselect-inner' @click="active(i,item,1)" :class="{'borderrights':i.val==isActive1}" v-for="(i,item) in timeselect1"
						 :key='item'>{{i.name}}</view>
					</view> -->
					<view class='timeselect-detil'>
						<view class='timeselect-inner' @click="active(i,item,1)" :class="{'borderrights':i.val==isActive1}" v-for="(i,item) in timeselect1"
						 :key='item'>{{i.name}}</view>
					</view>
					<!-- 自定义 -->
					<view class="data-box">
						<!-- <view class='box-titles'>自定义</view> -->
						<view class="data-item" v-if="limitorder.czje">
							<view class="data-item-ct1">{{timestate==1?monitorv2.user_charge_amount_total/100:monitorv3data.opt_sum_date.user_charge_amount/100}}</view>
							<view class="data-item-ct2">充值总金额</view>
						</view>
						<view class="data-item" v-if="limitorder.hykje">
							<view class="data-item-ct1">{{timestate==1?monitorv2.user_membership_amount_total/100:monitorv3data.opt_sum_date.user_membership_amount/100}}</view>
							<view class="data-item-ct2">会员总金额</view>
						</view>
						<view class="data-item" v-if="limitorder.all">
							<view class="data-item-ct1">{{timestate==1?monitorv2.urorder_paid_amount_total/100:monitorv3data.opt_sum_date.urorder_paid_amount/100}}</view>
							<view class="data-item-ct2">订单总金额</view>
						</view>
						<view class="data-item" v-if="limitorder.qxddf">
							<view class="data-item-ct1">{{timestate==1?monitorv2.urorder_repark_amount_total/100:monitorv3data.opt_sum_date.urorder_repark_amount/100}}</view>
							<view class="data-item-ct2">订单调度总金额</view>
						</view>
						<view class="data-item" v-if="limitorder.all">
							<view class="data-item-ct1">{{timestate==1?monitorv2.user_count_total:monitorv3data.opt_sum_date.user_count}}</view>
							<view class="data-item-ct2">总用户数</view>
						</view>
						<view class="data-item" v-if="limitorder.all">
							<view class="data-item-ct1">{{timestate==1?monitorv2.urorder_count_per_bike_avg:monitorv3data.opt_sum_date.urorder_count_per_bike_avg}}</view>
							<view class="data-item-ct2">平均车效</view>
						</view>
					</view>
				</view>


				<!-- 换电挪车 -->
				<view class="data-box timeselect-view">
					<view class='box-title'>换电挪车</view>
					<view class='out-box'>
						<view class='inner-box' v-for="(i,item) in bigcontdetil" :key='item'>
							<view class='inner-head'>
								<view class='inner-head-left'>{{i.lefttitle}}</view>
								<view class='inner-head-right'>{{i.righttitle}}</view>
							</view>
							<view class='inner-line'></view>
							<view class='inner-son'>
								<view class='inner-son-detil' v-for="(j,items) in i.dataarr" :key='items' @click='gonewpage(item,j,items)'><text>{{j.name}}</text><text></text><text
									 style='font-size: 20px;'>{{j.val}}</text></view>
							</view>
						</view>
					</view>
				</view>

				<!-- 运维数据 -->
				<view class='data-box timeselect-view'>
					<view class='box-title'>运维数据</view>
					<view class='data-item' v-for="(i,item) in boxdata" :key='item' @click='gourl(i.url)'>
						<view class="data-item-ct1">{{i.val}}</view>
						<view class="data-item-ct2">{{i.name}}</view>
					</view>

					<view class="qiun-charts" v-show="limitorder.ddqst && showtx">
						<text class='titleSpan'>订单趋势图</text>
						<!--#ifndef MP-ALIPAY -->
						<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" @touchstart="touchLineA"></canvas>
						<!--#endif-->
					</view>

					<!-- 站点排行 -->
					<view class='stop-list'>
						<view class='titleSpan'>站点排行</view>
						<view class='list-title'>
							<view class="data-item-ct1">#</view>
							<view class="data-item-ct2">站点名称</view>
							<view class="data-item-ct3">订单数量(单)</view>
							<!-- <view>排名变化</view> -->
						</view>
						<view class='falther-view' v-for="(i,item) in ranklist" :key='item'>
							<view class='list-inner'>
								<view class="data-item-ct1">{{item+1}}</view>
								<view class="data-item-ct2">{{i.park_name}}</view>
								<view class="data-item-ct3">{{i.order_count}}</view>
							</view>
							<view class='ranklist-line'></view>
							<!-- <view class="data-item-ct2">{{i.name}}</view> -->
						</view>

					</view>

				</view>

				<!-- 订单车效 -->
				<view class='timeselect-view' v-if="(limitorder.ddjet || limitorder.cxt)">
					<view class='box-title'>订单车效</view>
					<!-- 新增 -->
					<view class='timeselect' v-if="isActive==-1">
						<!-- <view>开始时间:</view> -->
						<view class='timedetil' @tap="toggleTab(1)">
							<view class='wenzi'>开始</view>
							<view>{{start_time}}</view>
						</view>
						<yu-datetime-picker @confirm='onConfirm' @canCel='onCancel' @clickOther='onClickother' startYear="2015" ref="dateTime"
						 :value=value :isAll="true" :current="false"></yu-datetime-picker>
						<view class='timedetil' @tap="toggleTab(2)">
							<view class='wenzi'>结束</view>
							<view>{{end_time}}</view>
						</view>

					</view>

					<view class='timeselect-detil'>
						<view class='timeselect-inner' @click="active(i,item,0)" :class="{'borderrights':i.val==isActive}" v-for="(i,item) in timeselect"
						 :key='item'>{{i.name}}</view>
					</view>
					<view class="qiun-charts" v-show="limitorder.ddjet && showtx">
						<!-- <text class='titleSpan'>订单金额图</text> -->
						<!--#ifndef MP-ALIPAY -->
						<canvas canvas-id="canvasLineC" id="canvasLineC" class="charts" @touchstart="touchLineC"></canvas>
						<!--#endif-->
					</view>
					<view class="qiun-charts" v-show="limitorder.cxt && showtx">
						<!-- <text class='titleSpan'>车效图</text> -->
						<!--#ifndef MP-ALIPAY -->
						<canvas canvas-id="canvasLineB" id="canvasLineB" class="charts" @touchstart="touchLineB"></canvas>
						<!--#endif-->
					</view>
				</view>

			</view>
		</view>
		<!-- <uni-load-more :status="loadStatus"></uni-load-more> -->
		<uni-popup :show="type ==='middle-list'" position="bottom" mode="fixed" @hidePopup="togglePopup('')">
			<view :scroll-y="true" class="uni-center center-box" style="height:350upx;overflow-y: auto;">
				<item-cell :itemdata="citylist" type='4' @itemclick='go'></item-cell>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import yuDatetimePicker from "@/components/yu-datetime-picker.vue"
	// import yuDatetimePicker1 from "@/components/yu-datetime-picker1.vue"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import itemCell from '@/components/item-cell/item-cell.vue'
	import uCharts from '@/common/u-charts.min.js';
	import {
		timefn
	} from '@/common/conf.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	// const app = getApp()
	var _self;
	var canvaLineA = null,
		canvaLineB = null,
		canvaLineC = null
	export default {
		components: {
			uniPopup,
			itemCell,
			yuDatetimePicker
		},
		data() {
			return {
				bgheight: '170upx',
				weather: "",
				ranklist: [],
				// tab: 1,
				timeflag: 0,
				value: '',
				monitorv3data: {},
				testdata: [111, 222, 333, 444, 555],
				bigcontdetil: [{
						lefttitle: '换电',
						righttitle: '待换电数量：117',
						dataarr: [{
								name: '电量10%以下:',
								val: 10
							},
							{
								name: '电量20%以下:',
								val: 10
							},
							{
								name: '电量30%以下:',
								val: 10
							},
							{
								name: '电量40%以下:',
								val: 10
							},
						],
					},
					{
						lefttitle: '挪车',
						righttitle: '待挪车数量：117',
						dataarr: [{
								name: '1+:',
								val: 10
							},
							{
								name: '2+:',
								val: 10
							},
							{
								name: '3+:',
								val: 10
							},
							{
								name: '4+:',
								val: 10
							},
						],
					},
				],
				qxmenudata: [{
					name: '车辆扫码',
					url: '',
					val: 0
				}],
				start_time: '',
				end_time: '',
				boxdata: [],
				userInfo: null,
				top: null,
				list: [],
				pno: 1,
				psize: 20,
				loadStatus: 'more',
				checkSaleData: null,
				type: '',
				citylist: [],
				locaplace: '',
				carinfo: {
					shortelec: 3,
					fault: 4,
					lostcar: 3,
					stolencar: 7,
					repaircar: 1,
					kzcar: 5
				},
				tempobj: {
					chexiao: 0,
					dingdan: 0
				},
				showtx: true,
				monitorv2: {},
				dailydata: {},
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				monitorv2m: {},
				limitorder: {
					all: 0,
					mon: 0,
					day: 0,
					yesterday: 0,
					aweekago: 0,
					ddqst: 0, //订单趋势图
					ddjet: 0, //订单金额图
					cxt: 0, //车效图
					qxddf: 0, //骑行调度费
					czje: 0, //充值金额
					hykje: 0, //会员卡金额
				},
				timeselect: [{
						name: '自定义',
						val: -1
					},
					{
						name: '当月',
						val: 0
					},
					{
						name: '上个月',
						val: 1
					},
					{
						name: '三个月',
						val: 3
					},
					{
						name: '半年',
						val: 6
					},
				],
				timeselect1: [],
				isActive: 0,
				isActive1: 0,
				timestate: 0,
			}
		},
		onLoad() {
			var _this = this
			_self = this;
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(350);
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
		},
		onShow() {
			this.getweather()
			this.timecalc(0)
			this.stopranklist()
			var date = new Date()
			var seperator1 = "-";
			var seperator2 = ":";
			var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
			var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
			var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
				" " + date.getHours() + seperator2 + date.getMinutes() +
				seperator2 + date.getSeconds()
			var fmonuth = month - 1 < 10 ? '0' + (month - 1) : month - 1
			// 上个月的天数
			var day = new Date(date.getFullYear(), date.getMonth(), 0)
			var times = date.getFullYear() + seperator1 + fmonuth + seperator1 + day.getDate()
			this.getmonitorv3()
			// this.getmonitorv2(1)
			this.getmonitorv2('today')
			this.getmonitorv2('all')
			// this.getmonitorv2('mon')
			this.getHourly017(times)
			setTimeout(() => {
				console.log(6666, this.timeselect1[0], this.timeselect[0])
				if (this.timeselect1.length > 1) {
					this.isActive1 = this.timeselect1[0].val
				}
				if (this.timeselect[0] > 1) {
					this.isActive = this.timeselect[0].val
				}
			}, 1000)
			try {
				this.citylist = uni.getStorageSync('userinfo').cities;
				var acl = []
				this.showtx = true
				this.qxmenudata = [{
					name: '车辆扫码',
					url: '',
					val: 0
				}]
				uni.getStorage({
					key: 'userinfo',
					success: res => {
						acl = res.data.acl.children
						var onlyid = '',
							tempobjs = {},
							url = '',
							name = '',
							val = ''
						for (let i = 0; i < acl.length; i++) {
							if (acl[i].visitable == 1) {
								onlyid = parseInt(acl[i].uri)
								switch (onlyid) {
									case 0:
										tempobjs = {
											name: '附近换电',
											url: '/pages/map/map?name=换电&text=全部换电&type=0',
											val: 1
										}
										this.qxmenudata.push(tempobjs)
										break
									case 3:
										tempobjs = {
											name: '单个挪车',
											url: '/pages/map/map?text=全部车站&type=3.1&name=挪车',
											val: 2
										}
										this.qxmenudata.push(tempobjs)
										break
									case 10:
										tempobjs = {
											name: '违章举报',
											url: '/pages/repairlist/repairlist?type=10',
											val: 3
										}
										this.qxmenudata.push(tempobjs)
										break
									case 15:
										for (let j = 0; j < acl[i].children.length; j++) {
											if (acl[i].children[j].uri == 15.1 && acl[i].children[j].visitable) {
												this.tempobj.chexiao = 1
											}
											if (acl[i].children[j].uri == 15.2 && acl[i].children[j].visitable) {
												this.tempobj.dingdan = 1
											}
										}
										break
									case 16:
										this.timeselect1 = []
										for (let j = 0; j < acl[i].children.length; j++) {
											if (acl[i].children[j].uri === '16.1' && acl[i].children[j].visitable) {
												this.limitorder.all = 1
												this.timeselect1.push({
													name: '自定义',
													val: -1
												})
											}
											if (acl[i].children[j].uri === "16.2" && acl[i].children[j].visitable) {
												this.limitorder.mon = 1
												this.timeselect1.push({
													name: '当月',
													val: 0
												})
											}
											if (acl[i].children[j].uri === '16.3' && acl[i].children[j].visitable) {
												this.limitorder.day = 1
												this.timeselect1.push({
													name: '当日',
													val: 10
												})
											}
											if (acl[i].children[j].uri === '16.4' && acl[i].children[j].visitable) {
												this.limitorder.ddqst = 1
											}
											if (acl[i].children[j].uri === '16.5' && acl[i].children[j].visitable) {
												this.limitorder.ddjet = 1
											}
											if (acl[i].children[j].uri === '16.6' && acl[i].children[j].visitable) {
												this.limitorder.cxt = 1
											}
											if (acl[i].children[j].uri === '16.7' && acl[i].children[j].visitable) {
												this.limitorder.qxddf = 1
											}
											if (acl[i].children[j].uri === '16.8' && acl[i].children[j].visitable) {
												this.limitorder.czje = 1
											}
											if (acl[i].children[j].uri === '16.9' && acl[i].children[j].visitable) {
												this.limitorder.hykje = 1

											}
											if (acl[i].children[j].uri === '16.10' && acl[i].children[j].visitable) {
												this.limitorder.yesterday = 1
												this.timeselect1.push({
													name: '昨天',
													val: 11
												})

											}
											if (acl[i].children[j].uri === '16.11' && acl[i].children[j].visitable) {
												this.limitorder.aweekago = 1
												this.timeselect1.push({
													name: '一周前',
													val: 12
												})
											}
											if (acl[i].children[j].uri === '16.12' && acl[i].children[j].visitable) {
												this.limitorder.aweekago = 1
												this.timeselect1.push({
													name: '上个月',
													val: 1
												})
											}
										}
										break
								}

							}
						}
					},
					fail: res => {
						console.log('fail', res)
						uni.reLaunch({
							url: '/pages/mine/loginView/loginView',
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
					}
				})
				if (value) {
					// this.userinfo = value
				}
			} catch (e) {
				// error
			}
			wx.getLocation({
				type: 'wgs84',
				success(res) {
					console.log('位置信息', res)
					const requestTask3 = uni.request({
						url: "https://apis.map.qq.com/ws/geocoder/v1/?location=" + res.latitude + "," + res.longitude +
							"&key=ZVNBZ-ACB3S-UOEO5-6JMQK-4EMKT-XZBUX&get_poi=1",
						data: {},
						method: "GET",
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						success: function(res) {
							console.log('weizhi', res.data);
							_self.locaplace = res.data.result.formatted_addresses.recommend
						}
					});

				}
			})
		},
		onPullDownRefresh() {
			// this.getList(true)
			// this.getServerData()
		},
		onReachBottom() {
			// this.getList()
		},
		methods: {
			...mapMutations(['setSn', 'setBikeid']),
			gonewpage(index, item, indexs) {
				console.log(888, index, item)
				var battery_level_max = '',
					battery_level_min = '',
					spliturl = ''
				switch (index) {
					case 0:
						let temparr = item.name.split('-')
						battery_level_min = temparr[0]
						battery_level_max = temparr[1].split('%')[0]
						spliturl = `&battery_level_max=${battery_level_max}&battery_level_min=${battery_level_min}`
						break;
					case 1:
						spliturl = `&repark_index=${indexs+1}&flag=1`
						if(indexs==4){
							spliturl = `&park_state=21&flag=1`
						}
						if(indexs==5){
							spliturl = `&park_state=11&flag=1`
						}
						break
					case 2:
						spliturl = `&alert_state=${item.alert_state}`
						break
					case 3:
						spliturl = `&inv_state=${item.inv_state}&health_state=1`
						break
					case 4:
						spliturl = `&bus_state=${item.bus_state}`
						if(indexs==2){
							spliturl = `&is_online=0`
						}
						break
				}
				uni.navigateTo({
					// url: '/pages/map/map?text=234&type=10&name=车辆监控' + spliturl,
					url: `/pages/map/map?text=${item.name}&type=10&name=车辆监控${spliturl}`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			toggleTab(item) {
				setTimeout(() => {
					this.showtx = false
				}, 0)
				this.timeflag = item
				this.$refs.dateTime.show();
			},
			toggleTab1(item) {
				setTimeout(() => {
					this.showtx = false
				}, 0)
				this.timeflag = item
				this.$refs.dateTime1.show();
			},
			onCancel() {
				console.log(6666)
				setTimeout(() => {
					this.showtx = true
				}, 0)
			},
			onClickother() {
				console.log(4444)
				this.showtx = setTimeout(() => {
					this.showtx = true
				}, 0)
			},
			onConfirm(val) {
				setTimeout(() => {
					this.showtx = true
				}, 0)
				if (this.timeflag == 1) {
					this.start_time = val.selectRes
				} else {
					this.end_time = val.selectRes
				}
				this.getmonitorv2('all')
			},
			onConfirm1(val) {
				setTimeout(() => {
					this.showtx = true
				}, 0)
				if (this.timeflag == 1) {
					this.start_time = val.selectRes
				} else {
					this.end_time = val.selectRes
				}
				this.timestate = 0
				this.getmonitorv3()
			},
			gourl(url) {
				if (!!url) {
					uni.navigateTo({
						url: url,
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}
			},
			timecalc(type) {
				if (type == -1) {
					return
				}
				var date = new Date()
				var seperator1 = "-";
				var seperator2 = ":";
				var daygetday = date.getDate()
				// var daygetday=5
				var month0 = date.getMonth() + 1 - type < 10 ? "0" + (date.getMonth() + 1 - type) : date.getMonth() + 1 - type;
				var startyear = date.getFullYear()
				if (month0 == '00' || month0 == '0-1' || month0 == '0-2' || month0 == '0-3' || month0 == '0-4' || month0 == '0-5') {
					month0 = date.getMonth() + 13 - type < 10 ? "0" + (date.getMonth() + 13 - type) : date.getMonth() + 13 - type;
					startyear = startyear - 1
				}
				var month1 = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
				var strDate = daygetday < 10 ? "0" + daygetday : daygetday;
				// 上个月的天数
				var day = new Date(date.getFullYear(), date.getMonth(), 0)
				console.log(999, type)
				if (type == 10 || type == 11 || type == 12 || type == 1) {
					var month01 = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
					// 当日
					if (type == 10) {
						var strDate0 = daygetday < 10 ? "0" + daygetday : daygetday;
						this.start_time = startyear + seperator1 + month01 + seperator1 + strDate0
						this.end_time = date.getFullYear() + seperator1 + month01 + seperator1 + strDate0
					}
					// 昨天
					if (type == 11) {
						var strDate0 = daygetday - 1 < 10 ? "0" + (daygetday - 1) : daygetday - 1;
						var strDate1 = daygetday - 1 < 10 ? "0" + (daygetday - 1) : daygetday - 1;
						var month02 = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
						// 如果是这个月1号
						if (strDate1 == '00') {
							strDate0 = day.getDate()
							strDate1 = day.getDate()
							// 月份减1
							month02 = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
							console.log(7777, month02)
							// 月份减一,如果是一月份年份在减一
							if (month02 == '00') {
								startyear = startyear - 1
								month02 = 12
							}
						}
						this.end_time = startyear + seperator1 + month02 + seperator1 + strDate1
						this.start_time = startyear + seperator1 + month02 + seperator1 + strDate0
					}
					// 一周前
					if (type == 12) {
						var strDate0 = daygetday - 7 < 10 ? "0" + (daygetday - 7) : daygetday - 7;
						var strDate1 = daygetday < 10 ? "0" + daygetday : daygetday;
						this.end_time = date.getFullYear() + seperator1 + month01 + seperator1 + strDate1
						var month02 = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
						if (daygetday < 7) {
							strDate0 = day.getDate() + daygetday - 6
							month02 = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
							console.log(6666, day.getDate() + daygetday, strDate0)
							if (month01 == '01') {
								startyear = startyear - 1
								month01 = 12
							}
						}
						this.start_time = startyear + seperator1 + month02 + seperator1 + strDate0

					}
					if (type == 1) {
						var month03 = date.getMonth() < 10 ? "0" + (date.getMonth()) : date.getMonth();
						this.start_time = startyear + seperator1 + month03 + seperator1 + '01'
						this.end_time = date.getFullYear() + seperator1 + month03 + seperator1 + day.getDate()
					}

				} else {
					this.start_time = startyear + seperator1 + month0 + seperator1 + "01"
					if (type == 0) {
						this.end_time = date.getFullYear() + seperator1 + month1 + seperator1 + strDate
					} else {
						this.end_time = date.getFullYear() + seperator1 + month1 + seperator1 + "01"
					}
				}

				this.value = date.getFullYear() + seperator1 + month1 + seperator1 + '01' +
					" " + '00' + seperator2 + '00' +
					seperator2 + '00'
				console.log('time', this.start_time)
			},
			active(i, item, type) {
				if (type == 0) {
					this.isActive = i.val
					console.log(3333, this.isActive)
					this.timecalc(i.val)
					this.getmonitorv2('all')
					// this.isActive = item
				} else {
					this.isActive1 = i.val
					this.timecalc(i.val)
					this.getmonitorv3()
				}
			},
			touchLineA(e) {
				canvaLineA.touchLegend(e);
				canvaLineA.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
			},
			touchLineB(e) {
				canvaLineB.touchLegend(e);
				canvaLineB.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
			},
			touchLineC(e) {
				canvaLineC.touchLegend(e);
				canvaLineC.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
			},
			scaninto(type, url) {
				if (type == 0) {
					wx.scanCode({
						onlyFromCamera: true, //只允许相机扫码
						success: res => {
							console.log('saoma', res)
							var bikesn = res.result.match(/\?bikesn=(.*)/)[1]
							this.setSn(bikesn)
							this.setBikeid('*')
							this.getcarinfo()
						},
						fail: res => {},
						complete: res => {}
					});
				} else {
					uni.navigateTo({
						url: url,
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}

			},
			// 获取车辆信息
			getcarinfo() {
				var options = {
					url: '/bike/info', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					if (res.status == 0) {
						// this.setSn(this.carnum)
						this.setBikeid(res.info.id)
						this.setBikeinfo(res.info)
						uni.navigateTo({
							url: '/pages/swapbattery/swapbattery?type=0',
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
					} else {
						uni.showToast({
							title: res.message ? res.message : '获取车辆信息失败',
							mask: false,
							icon: 'none',
							duration: 1500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 站点排行
			stopranklist() {
				var options = {
					url: '/park/ranklist', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"start_date": timefn(1),
						"end_date": timefn(0)
					},
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('站点排行信息', res)
					if (res.status == 0) {
						this.ranklist = res.list
					} else {
						uni.showToast({
							title: res.message ? res.message : '获取站点排行失败',
							mask: false,
							icon: 'none',
							duration: 1500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 获取天气
			getweather() {
				var options = {
					url: '/city/weather', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {},
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('天气信息', res)
					if (res.status == 0) {
						this.weather = res.info
						if (!!res.info) {
							this.bgheight = '100px'
						} else {
							this.bgheight = '85px'
						}
					} else {
						uni.showToast({
							title: res.message ? res.message : '获取天气失败',
							mask: false,
							icon: 'none',
							duration: 1500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			getHourly017(time) {
				var options = {
					url: '/urorder/hourly017', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						date: time,
					},
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('订单信息', res)
					if (res.status == 0) {
						// for()
						//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
						let xdata = 0
						var datatimea = []
						let todayNum = []
						let todayData = {
							name: '今天',
							data: []
						}
						let yesterdayData = {
							name: '昨天',
							data: [],

						}
						let aweekagoData = {
							name: '一周前',
							data: []
						}
						var sortyesterday = []
						var sorttoday = []
						var sortaweekago = []
						for (var i in res.yesterday) {
							// datatimea.push(xdata+'时')	
							sortyesterday.push(i)
							// xdata+=1						
						}
						for (var s = 0; s < 24; s++) {
							datatimea.push(s + '时')
						}
						sortyesterday = sortyesterday.sort()
						for (var j = 0; j < sortyesterday.length; j++) {
							yesterdayData.data.push(res.yesterday[sortyesterday[j]])
						}
						for (var i in res.today) {
							sorttoday.push(i)
						}
						sorttoday = sorttoday.sort()
						for (var j = 0; j < sorttoday.length; j++) {
							todayData.data.push(res.today[sorttoday[j]])
						}
						for (var i in res.aweekago) {
							sortaweekago.push(i)
						}
						sortaweekago = sortaweekago.sort()
						for (var j = 0; j < sortaweekago.length; j++) {
							aweekagoData.data.push(res.aweekago[sortaweekago[j]])
						}
						let LineA = {
							categories: [],
							series: []
						};
						LineA.categories = datatimea;
						LineA.series.push(todayData)
						LineA.series.push(yesterdayData)
						LineA.series.push(aweekagoData)
						// if(!!todayData.data.length && !!yesterdayData.data.length && !!aweekagoData.data.length){
						// 	_self.showLineA("canvasLineA", LineA);
						// }
						_self.showLineA("canvasLineA", LineA);
						console.log('LineA', LineA)

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
			// v3接口
			getmonitorv3(type) {
				var options = {
					url: '/city/monitorv3', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						yesterday: 1,
						bike: 1,
						aweek: 1,
						opt_sum_start_time: this.start_time,
						opt_sum_end_time: this.end_time,
						opt_sum_date: 1
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					if (res.status == 0) {
						this.monitorv3data = res
						this.monitorv3data.opt_sum_date.urorder_count_per_bike_avg = this.monitorv3data.opt_sum_date.urorder_count_per_bike_avg
							.toFixed(2)
						console.log(2222, res)
					} else {
						uni.showToast({
							title: res.message ? res.message : '获取信息失败',
							mask: false,
							icon: 'none',
							duration: 1500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			getmonitorv2(type) {
				if (type == 1) {
					var options = {
						url: '/city/monitorv2', //请求接口
						method: 'POST', //请求方法全部大写，默认GET
						context: '',
						data: {
							total: 1
							// start_time:this.start_time,
							// end_time:this.end_time,
						},
					}
				} else if (type == 'today') {
					var options = {
						url: '/city/monitorv2', //请求接口
						method: 'POST', //请求方法全部大写，默认GET
						context: '',
						data: {
							today: 1,
						},
					}
				} else if (type == 'mon') {
					var options = {
						url: '/city/monitorv2', //请求接口
						method: 'POST', //请求方法全部大写，默认GET
						context: '',
						data: {
							tomonth: 1,
						},
					}
				} else {
					var options = {
						url: '/city/monitorv2', //请求接口
						method: 'POST', //请求方法全部大写，默认GET
						context: '',
						data: {
							daily: 1,
							start_time: this.start_time,
							end_time: this.end_time,
						},
					}
				}

				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					// console.log('monitorv2', res)
					if (res.status == 0) {
						if (type == 1) {
							this.monitorv2 = res
							this.monitorv2.urorder_count_per_bike_avg = res.urorder_count_per_bike_avg.toFixed(2)
						} else if (type == 'today') {
							var battery = res.bike_stat.battery_dist
							var electarr = []
							for (let l in battery) {
								var temp = {
									name: `${l}%: `,
									val: battery[l]
								}
								electarr.push(temp)
							}
							console.log(444, electarr)
							var allmovecar = res.bike_stat.repark_index_4 + res.bike_stat.repark_index_1 + res.bike_stat.repark_index_2 +
								res.bike_stat.repark_index_3
							this.dailydata = res
							this.bigcontdetil = [{
									lefttitle: '换电',
									righttitle: '待换电数量：' + res.bike_stat.battery_to_change_count,
									dataarr: electarr
								},
								{
									lefttitle: '挪车',
									righttitle: '待挪车数量：' + allmovecar,
									dataarr: [{
											name: '差1+: ',
											val: res.bike_stat.repark_index_1
										},
										{
											name: '差2+: ',
											val: res.bike_stat.repark_index_2
										},
										{
											name: '差3+: ',
											val: res.bike_stat.repark_index_3
										},
										{
											name: '差4+: ',
											val: res.bike_stat.repark_index_4
										},
										{
											name: '服务区外: ',
											val: res.bike_stat.out_svca_count
										},
										{
											name: '禁停区内: ',
											val: res.bike_stat.in_npa_count
										},
									],
								},
								{
									lefttitle: '预警',
									righttitle: '预警总条数：' + res.bike_stat.alert_dist.total,
									dataarr: [{
											name: '电池空置',
											val: res.bike_stat.alert_dist.no_battery,
											alert_state: 512
										},
										{
											name: '欠压',
											val: res.bike_stat.alert_dist.under_volt,
											alert_state: 2
										},
										{
											name: '无人扫码',
											val: res.bike_stat.alert_dist.no_scaned,
											alert_state: 0b1000000000000000000000
										},
										{
											name: '无定位',
											val: res.bike_stat.alert_dist.no_gps,
											alert_state: 0b100000000000000000000
										},
										{
											name: '无业务',
											val: res.bike_stat.alert_dist.no_bus,
											alert_state: 0b10000000000000000000000
										},
										{
											name: '疑似被盗',
											val: res.bike_stat.alert_dist.stolen,
											alert_state: 32
										},
									]
								},
								{
									lefttitle: '故障',
									righttitle: '故障总数量：' + res.bike_stat.fault_dist.total,
									dataarr: [
										{
										name: '已入库',
										val: res.bike_stat.fault_dist.recalled,
										inv_state:2
									},
									{
										name: '未入库',
										val: res.bike_stat.fault_dist.total-res.bike_stat.fault_dist.recalled,
										inv_state:0
									},
									]
								},
								{
									lefttitle: '其他',
									righttitle: '车辆总数量：' + res.bike_stat.total,
									dataarr: [{
											name: '骑行',
											val: res.bike_stat.ridden_count,
											bus_state: 11
										},
										{
											name: '空闲',
											val: res.bike_stat.idle_count,
											bus_state: 0
										},
										{
											name: '离线',
											val: res.bike_stat.offline_count,
											is_online: 0
										},
									]
								},
							]

							this.boxdata = [
								// {name:'预警车辆',val:res.bike_stat.alert_count,url:'/pages/map/map?name=车辆监控&text=预警车辆&type=10&alert_state=-1'},
								// {name:'待排查车辆',val:res.bike_stat.to_check_count,url:'/pages/repairlist/repairlist?type=11'},
								// {name:'缺电车辆',val:res.bike_stat.under_volt_count,url:'/pages/map/map?name=换电&text=全部换电&type=0'},
								// {name:'离线车辆',val:res.bike_stat['24h_offline_count'],url:'/pages/map/map?name=车辆监控&text=离线车辆&type=10&is_online=0'},
								// {name:'疑似故障车辆',val:res.bike_stat.alert_fault_count,url:'/pages/map/map?name=车辆监控&text=疑似故障&type=10&&alert_state=16'},
								// {name:'报修车辆',val:res.bike_stat.fault_count,url:'/pages/map/map?name=维修&text=全部故障车辆&type=1.1'},
								// {name:'挪车数',val:res.rporder_ok_count,url:''},
								// {name:'换电数',val:res.bcorder_ok_count,url:''},
								{
									name: '预警车辆',
									val: res.bike_stat.alert_count,
									url: ''
								},
								{
									name: '待排查车辆',
									val: res.bike_stat.to_check_count,
									url: ''
								},
								{
									name: '缺电车辆',
									val: res.bike_stat.under_volt_count,
									url: '/pages/map/map?name=换电&text=全部换电&type=0'
								},
								{
									name: '离线车辆',
									val: res.bike_stat['24h_offline_count'],
									url: ''
								},
								{
									name: '疑似故障车辆',
									val: res.bike_stat.alert_fault_count,
									url: ''
								},
								{
									name: '报修车辆',
									val: res.bike_stat.fault_count,
									url: '/pages/map/map?name=维修&text=全部故障车辆&type=1.1'
								},
								{
									name: '挪车数',
									val: res.rporder_ok_count,
									url: ''
								},
								{
									name: '换电数',
									val: res.bcorder_ok_count,
									url: ''
								},
							]
						} else if (type == 'mon') {
							this.monitorv2m = res
							this.monitorv2m.urorder_count_per_bike_avg = res.urorder_count_per_bike_avg.toFixed(2)
						} else {
							var datatimes = []
							var user_growth = []
							var user_order_growth = []
							var bike_count_daily = []
							var urorder_paid_amount_daily = []
							var bikeeffic = {
								name: '车效',
								data: []
							}
							var ddje = {
								name: '订单金额',
								data: []
							}
							this.orderlist = []
							var temptime = []
							for (var i in res.bcorder_ok_count_daily) {
								temptime.push(i)
							}
							temptime = temptime.sort()
							for (var l = 0; l < temptime.length; l++) {
								var formatetime = temptime[l].split('-')
								var newtimes = formatetime[1] + '-' + formatetime[2]
								datatimes.push(newtimes)
								var bikepers = ''
								if (res.urorder_count_daily[temptime[l]] == 0 || res.bike_count_daily[temptime[l]] == 0) {
									bikepers = 0
								} else {
									bikepers = parseFloat(res.urorder_count_daily[temptime[l]] / res.bike_count_daily[temptime[l]]).toFixed(1)
								}
								bike_count_daily.push(bikepers)
								urorder_paid_amount_daily.push(res.urorder_paid_amount_daily[temptime[l]] / 100)
							}
							bikeeffic.data = bike_count_daily
							ddje.data = urorder_paid_amount_daily
							let LineB = {
								categories: [],
								series: []
							};
							let LineC = {
								categories: [],
								series: []
							};
							//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
							LineB.categories = datatimes
							LineB.series.push(bikeeffic)
							_self.showLineA("canvasLineB", LineB);

							LineC.categories = datatimes
							LineC.series.push(ddje)
							_self.showLineA("canvasLineC", LineC);

						}
					} else {
						uni.showToast({
							title: res.message ? res.message : 'monitorv2'
						});
					}

				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})

			},
			go(item) {
				uni.showModal({
					title: '切换城市',
					content: `您确定切换到${item.name}吗？`,
					// showCancel: false,
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						if (res.confirm) {
							this.changcity(item.id)
						}
					},
					fail: () => {},
					complete: () => {}
				});
			},
			changcity(id) {
				this.showtx = true
				var options = {
					url: '/staff/switch_city', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						city_id: id
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					if (res.status == 0) {
						this.citylist = res.cities

						var acl = res.acl.children
						var onlyid = '',
							tempobjs = {},
							url = '',
							name = '',
							val = ''
						this.qxmenudata = []
						for (let i = 0; i < acl.length; i++) {
							if (acl[i].visitable == 1) {
								onlyid = parseInt(acl[i].uri)
								switch (onlyid) {
									case 0:
										tempobjs = {
											name: '附近换电',
											url: '/pages/map/map?name=换电&text=全部换电&type=0',
											val: 1
										}
										this.qxmenudata.push(tempobjs)
										break
									case 3:
										tempobjs = {
											name: '单个挪车',
											url: '/pages/map/map?text=全部车站&type=3.1&name=挪车',
											val: 2
										}
										this.qxmenudata.push(tempobjs)
										break
									case 10:
										tempobjs = {
											name: '违章举报',
											url: '/pages/repairlist/repairlist?type=10',
											val: 3
										}
										this.qxmenudata.push(tempobjs)
										break
									case 15:
										this.tempobj = {
											chexiao: 0,
											dingdan: 0
										}
										for (let j = 0; j < acl[i].children.length; j++) {
											if (acl[i].children[j].uri == 15.1 && acl[i].children[j].visitable) {
												this.tempobj.chexiao = 1
											}
											if (acl[i].children[j].uri == 15.2 && acl[i].children[j].visitable) {
												this.tempobj.dingdan = 1
											}
										}
										break
									case 16:
										console.log(16)
										this.limitorder = {
											all: 0,
											mon: 0,
											day: 0,
											yesterday: 0,
											aweekago: 0,
											ddqst: 0, //订单趋势图
											ddjet: 0, //订单金额图
											cxt: 0, //车效图
											qxddf: 0, //骑行调度费
											czje: 0, //充值金额
											hykje: 0, //会员卡金额
										}
										this.timeselect1 = []
										for (let j = 0; j < acl[i].children.length; j++) {
											if (acl[i].children[j].uri === '16.1' && acl[i].children[j].visitable) {
												this.limitorder.all = 1
												this.timeselect1.push({
													name: '自定义',
													val: -1
												})
											}
											if (acl[i].children[j].uri === "16.2" && acl[i].children[j].visitable) {
												this.limitorder.mon = 1
												this.timeselect1.push({
													name: '当月',
													val: 0
												})
											}
											if (acl[i].children[j].uri === '16.3' && acl[i].children[j].visitable) {
												this.limitorder.day = 1
												this.timeselect1.push({
													name: '当日',
													val: 10
												})
											}
											if (acl[i].children[j].uri === '16.4' && acl[i].children[j].visitable) {
												this.limitorder.ddqst = 1
											}
											if (acl[i].children[j].uri === '16.5' && acl[i].children[j].visitable) {
												this.limitorder.ddjet = 1
											}
											if (acl[i].children[j].uri === '16.6' && acl[i].children[j].visitable) {
												this.limitorder.cxt = 1
											}
											if (acl[i].children[j].uri === '16.7' && acl[i].children[j].visitable) {
												this.limitorder.qxddf = 1
											}
											if (acl[i].children[j].uri === '16.8' && acl[i].children[j].visitable) {
												this.limitorder.czje = 1
											}
											if (acl[i].children[j].uri === '16.9' && acl[i].children[j].visitable) {
												this.limitorder.hykje = 1

											}
											if (acl[i].children[j].uri === '16.10' && acl[i].children[j].visitable) {
												this.limitorder.yesterday = 1
												this.timeselect1.push({
													name: '昨天',
													val: 11
												})

											}
											if (acl[i].children[j].uri === '16.11' && acl[i].children[j].visitable) {
												this.limitorder.aweekago = 1
												this.timeselect1.push({
													name: '一周前',
													val: 12
												})
											}
											if (acl[i].children[j].uri === '16.12' && acl[i].children[j].visitable) {
												this.limitorder.aweekago = 1
												this.timeselect1.push({
													name: '上个月',
													val: 1
												})
											}
										}
										console.log(333, this.limitorder)
										break
								}

							}
						}





						var date = new Date()
						var seperator1 = "-";
						var seperator2 = ":";
						var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
						var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
						var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
							" " + date.getHours() + seperator2 + date.getMinutes() +
							seperator2 + date.getSeconds()
						var fmonuth = month - 1 < 10 ? '0' + (month - 1) : month - 1
						// 上个月的天数
						var day = new Date(date.getFullYear(), date.getMonth(), 0)
						var times = date.getFullYear() + seperator1 + fmonuth + seperator1 + day.getDate()
						// this.getmonitorv2(1)
						this.getmonitorv2('today')
						this.getmonitorv2('all')
						// this.getmonitorv2('mon')
						this.getHourly017(times)
						this.getmonitorv3()
						try {
							uni.removeStorageSync('userinfo');
							uni.setStorage({
								key: 'userinfo',
								data: res,
								success: res => {
									console.log('success')
									this.stopranklist()
									this.getweather()
								},
								fail: res => {

								}
							})
						} catch (e) {
							// error
						}

						uni.showToast({
							title: '切换成功',
							duration: 1500
						});
						this.type = ''
						// setTimeout(() => {
						// 	uni.redirectTo({
						// 		url: '/pages/tabbar/platform/platform',
						// 		success: res => {},
						// 		fail: () => {},
						// 		complete: () => {}
						// 	});
						// }, 2000)

					} else {
						uni.showToast({
							title: res.message ? res.message : '切换城市失败',
							mask: false,
							icon: 'none',
							duration: 1500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			showbotpop() {
				this.type = 'middle-list'
				this.showtx = false
			},
			togglePopup(type) {
				this.type = type
				this.showtx = true
			},
			getList(reset = false) {
				if (reset) {
					this.pno = 1
					this.psize = 20
					this.loadStatus = 'more'
					this.list = []
				}
				let {
					pno,
					psize,
					loadStatus,
					list
				} = this
				if (loadStatus == 'loading' || loadStatus == 'noMore') {
					return
				}
				this.loadStatus = 'loading'
				this.$request({
					url: '/merchant/control/index',
					data: {
						pno,
						psize
					},
					hideLoad: !reset
				}).then((res) => {
					reset && uni.stopPullDownRefresh()
					let {
						list: data,
						top,
						user_info
					} = res.data
					if (top) {
						this.top = top
					}
					if (user_info) {
						this.userInfo = user_info
					}
					if (data.length < psize) {
						this.loadStatus = 'noMore'
					} else {
						this.loadStatus = 'more'
						this.pno++
					}
					this.list = [...list, ...data]
				})
			},
			showLineA(canvasId, chartData) {
				if (canvasId == 'canvasLineA') {
					canvaLineA = new uCharts({
						$this: _self,
						canvasId: canvasId,
						type: 'area',
						fontSize: 11,
						padding: [15, 15, 0, 15],
						// legend: {
						// 	show: true,
						// 	padding: 5,
						// 	lineHeight: 11,
						// 	margin: 0,
						// },
						dataLabel: false,
						dataPointShape: false,
						// dataPointShapeType: 'hollow',
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
							rotateLabel: true
							// rotateLabel:true
							// fontSize:8
						},
						yAxis: {
							gridType: 'dash',
							gridColor: '#CCCCCC',
							dashLength: 8,
							// splitNumber: 5,
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
				} else if (canvasId == 'canvasLineB') {
					canvaLineB = new uCharts({
						$this: _self,
						canvasId: canvasId,
						title: {
							name: '趋势图',
							fontSize: 20
						},
						type: 'area',
						fontSize: 11,
						padding: [15, 15, 0, 15],
						legend: {
							show: true,
							padding: 5,
							lineHeight: 11,
							margin: 0,
						},
						dataLabel: false,
						dataPointShape: false,
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
							rotateLabel: true,
							scrollShow: true,
						},
						yAxis: {
							gridType: 'dash',
							gridColor: '#CCCCCC',
							dashLength: 8,
							splitNumber: 5,
							min: 0,
							// min: 10,\\\
							// max: 180,
							format: (val) => {
								// return val.toFixed(0) + '元'
								return val.toFixed(1)
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
				} else {
					canvaLineC = new uCharts({
						$this: _self,
						canvasId: canvasId,
						title: {
							name: '趋势图',
							fontSize: 20
						},
						type: 'area',
						fontSize: 11,
						padding: [15, 15, 0, 15],
						legend: {
							show: true,
							padding: 5,
							lineHeight: 11,
							margin: 0,
						},
						dataLabel: false,
						dataPointShape: false,
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
							rotateLabel: true,
							scrollShow: true,
						},
						yAxis: {
							gridType: 'dash',
							gridColor: '#CCCCCC',
							dashLength: 8,
							splitNumber: 5,
							min: 0,
							// min: 10,\\\
							// max: 180,
							// disabled:true,
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
				}


			},
			scanCode() {
				uni.scanCode({
					onlyFromCamera: true,
					success: (res) => {
						let {
							result: code
						} = res
						this.$request({
							url: '/merchant/operation/write_off_detail',
							data: {
								code
							},
							loadTitle: '请稍候'
						}).then((res) => {
							let data = res.data
							if (data) {
								this.checkSaleData = data
								this.$refs.checkSale.open()
							}
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box-title {
		text-align: center;
		font-size: 40upx;
		font-weight: 500;
	}

	.qiun-charts {
		// width: 750upx;
		// height: 350upx;
		text-align: center;
		background-color: #FFFFFF;

		.charts {
			width: 750upx;
			height: 350upx;
			background-color: #FFFFFF;
		}
	}

	.index-top {
		position: relative;
		padding-top: 10rpx;

		.index-top-bg {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			// height: 400rpx;
			height: 170rpx;
			background-color: #0050b3;
		}

		.index-top-box {
			position: relative;
			z-index: 1;

			.timeselect-view {
				margin: 4upx;
				border: 2upx solid black;
				border-radius: 8upx;

				// 新增
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

				// margin: 0 6upx;
				// border: 2upx solid red;
				// border-radius: 10upx;
				.timeselect-detil {
					display: flex;
					justify-content: space-around;
					margin-top: 4upx;

					.timeselect-inner {
						// border: 2upx solid black;
						border-radius: 12upx;
						width: 110upx;
						height: 54upx;
						line-height: 54upx;
						text-align: center;
						// background-color: #1aad19;
						// color: white // height: 80upx;
						background-color: #D9D9D9;
						color: rgb(80, 80, 80);
					}

					.borderrights {
						// color: #F5A623 !important;
						color: white !important;
						// background-color: white;
						background-color: #096dd9;
						// border: 2upx solid #F5A623;
					}
				}
			}



		}

		.theme-bg {
			border-radius: 0 0 50rpx 50rpx;
		}
	}

	.store {
		width: 200rpx;
		padding-left: 20rpx;
		margin: 0 26rpx 10rpx 26rpx;
		background-color: rgba($color: #fff, $alpha: 0.1);
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
		border-radius: 20rpx;
		color: #fff;
	}

	.flex-box {
		display: flex;
		justify-content: space-around;
	}

	.nav {
		padding: 24rpx 0;
		text-align: center;
		color: #fff;

		.nav-icon {
			font-size: 50rpx;
			margin-bottom: 6rpx;
		}
	}

	.nav-head {
		font-size: 24rpx;
		display: flex;
		justify-content: space-between;

		.weather-view {
			height: 60upx;
			display: flex;

			.img-view {
				height: 46upx;
				width: 46upx;
			}

			view {
				margin-top: -6upx;
				margin-left: 16upx;
			}

			text {
				margin-left: 12upx;
			}
		}

		.address {
			width: 460rpx;
			margin-right: 20rpx;
			height: 60rpx;
			line-height: 60rpx;

			.bottompop {
				height: 70upx;

				.bottomline {
					height: 1upx;
					background-color: rgb(120, 120, 120);
				}
			}
		}
	}

	.data-box {
		font-size: 0;
		margin: 14rpx 26rpx;
		background-color: #fff;
		box-shadow: 0 10rpx 10rpx #ddd;
		border-radius: $uni-border-radius-sm;

		.stop-list {
			margin: 8upx;

			// 新增
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

			.titleSpan {
				text-align: center;
				font-size: 30upx;
				font-weight: 700;
			}

			.list-title {
				font-size: 28upx;
				font-weight: 650;
				display: flex;

				// justify-content: space-around;
				.data-item-ct1 {
					width: 20%
				}

				.data-item-ct2 {
					width: 50%
				}

				.data-item-ct3 {
					width: 30%
				}
			}

			.falther-view {
				height: 72upx;
				line-height: 72upx;
			}

			.list-inner {
				display: flex;

				// justify-content: space-around;
				.data-item-ct1 {
					width: 20%
				}

				.data-item-ct2 {
					width: 50%
				}

				.data-item-ct3 {
					width: 30%
				}
			}

			.ranklist-line {
				height: 2upx;
				background-color: rgb(200, 200, 200);
			}
		}

		.out-box {
			margin-top: 20upx;

			.inner-box {
				// margin: 10upx;
				border: soild white 2upx;
				border-radius: 6upx;
				background-color: #fffafa;
				margin-top: 20upx;

				.inner-head {
					font-size: 32upx;
					font-weight: 500;
					display: flex;
					justify-content: space-between;

					.inner-head-left {}

					.inner-head-right {}
				}

				.inner-line {
					width: 100%;
					height: 2upx;
					border-top: solid #ACC0D8 2upx;
					margin-top: 8upx;
				}

				.inner-son {
					margin-top: 10upx;
					display: flex;
					// justify-content: center;
					flex-wrap: wrap;
					text-align: center;

					.inner-son-detil {
						text-align: center;
						width: 32%;
						line-height: 70upx;
						height: 70upx;
						border-radius: 8upx;
						border: solid white 2upx;
						background-color: #1890ff;
						color: white;
						margin: 2upx;
					}
				}
			}
		}

		.box-title {
			text-align: center;
			font-size: 40upx;
			font-weight: 500;
		}

		.box-titles {
			text-align: center;
			font-size: 36upx;
			font-weight: 400;
		}

		.data-item {
			display: inline-block;
			width: 32%;
			text-align: center;
			padding: 14rpx 0;

			.data-item-ct1 {
				font-size: 28rpx;

				text {
					font-weight: 800;
					font-size: 32rpx;
				}
			}

			.data-item-ct2 {
				margin-top: 6rpx;
				font-size: 28rpx;
				color: $uni-text-color-grey;
			}
		}

		.data-line {
			margin: 0 84rpx;
			height: 0;
			border-bottom: $uni-border-color 2rpx solid;
		}
	}

	.index-tab {
		margin-top: 50rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: center;
		color: $uni-text-color-grey;

		.act {
			color: #000;

			text {
				border-bottom: $uni-theme-color 4rpx solid;
			}
		}
	}
</style>
