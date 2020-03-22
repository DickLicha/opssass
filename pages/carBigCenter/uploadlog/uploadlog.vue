<template>
	<view class='wrap'>
		<view class='allselect'>
			<view class='timeselect'>
				<!-- <view>开始时间:</view> -->
				<view class='timedetil' @tap="toggleTab()"><view class='wenzi'>开始</view><view>{{starttime}}</view></view>  
				<yu-datetime-picker @confirm="onConfirm" startYear="2015" ref="dateTime" value="2019-11-10 08:30:01" :isAll="false" :current="false"></yu-datetime-picker>
				<view class='timedetil' @tap="toggleTab()"><view class='wenzi'>结束</view><view>{{endtime}}</view></view>
				<!-- <calendar @change="change" :startDate="initStartDate" :endDate="initEndDate" :daysCount="daysCount"></calendar> -->
			</view>
			<view style='margin: 10upx 22upx;'>
				<base-input @scanCode='scanCode(1)' @goPage='goNewPage' :title='inputval' @hidekeygo='manualsgo'></base-input>
			</view>
		</view>
		<view class='view-commons'>			
			<view class='flexd-posion'>
				<view class='view-flexs switch-head'>
					<view>时间</view>
					<view class='view-border-letf'>品牌</view>
					<view class='view-border-letf'>类型</view>
					<view class='view-border-letf'>描述</view>
				</view>
			</view>

			<scroll-view class='listscrow' lower-threshold='20' scroll-y @scrolltolower="loadMore">
				<view class='view-flexs view-border-bottom' v-for="(item,i) in switchloockdata" :key='i'>
					<view>{{item.create_time}}</view>
					<view class='view-border-letf'>{{item.bike_id}}</view>
					<view class='view-border-letf'>{{item.battery_level_before}}%</view>
					<view class='view-border-letf'>{{item.battery_level_after}}%</view>
				</view>
				<uni-load-more :loadingType="resquestState"></uni-load-more>
			</scroll-view>

			<uni-popup :show="type ==='middle-list'" position="middle" mode="fixed" @hidePopup="togglePopup('')">
				<view :scroll-y="true" class="uni-center center-box">
					<view v-for="(item, index) in itemcells" :key="index" class="list-item">
						<!-- <item-cell :itemdata="faulttype" type='4' :border='borders'></item-cell> -->
						<text>{{item.name}}</text>
						<text class='second-text'>{{item.val}}</text>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import UniLoadMore from '@/components/load-more.vue'
	import itemCell from '@/components/item-cell/item-cell.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import calendar from '@/components/date-picker/date-picker'
	import yuDatetimePicker from "@/components/yu-datetime-picker.vue"
	import baseInput from '@/components/baseinput/baseinput.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				switchloockdata: [],
				resquestState: 0,
				pageindex: 1,
				pagenum: 20,
				allnumber: 100,
				type: '',
				userid: '',
				list: [1, 2, 3, 4],
				itemcells: [{
						name: '时间:',
						val: ''
					},
					{
						name: '网络状态:',
						val: ''
					},
					{
						name: '用户姓名:',
						val: ''
					},
					{
						name: '用户手机:',
						val: ''
					},
					{
						name: '失败原因:',
						val: ''
					},
				],
				showCaledar: false,
				dateStr: '',
				daysCount: 130,
				singleDate: true,

				//初始日期
				initStartDate: '2019-12-06',
				initEndDate: '2019-12-07',
			    starttime:'03-20 00:00:00',
				endtime:"03-20 23:00:00",
				inputval: '',
			}
		},
		components: {
			UniLoadMore,
			itemCell,
			uniPopup,
			calendar,
			yuDatetimePicker,
			baseInput
		},
		onBackPress() {
			if (this.showCaledar !== false) {
				this.showCaledar = false;
				return true;
			}
		},
		computed: mapState(['bikeinfo']),
		methods: {
			...mapMutations(['setSn']),
			togglePopup(type) {
				this.type = type

			},
			detilpop(item, i, type) {
				this.type = type
				this.itemcells[0].val = item.time
				this.itemcells[1].val = item.netstatus
				this.itemcells[2].val = item.username
				this.itemcells[3].val = item.phone
				this.itemcells[4].val = item.errormsg
			},
			// 获取车辆信息
			getuploadlog() {
				var options = {
					url: '/bike/ecu_callback_logs', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"start_time": "2020-03-19 00:00:00",
						"end_time": "2020-03-21 00:00:00",
						"pno": 1,
						"psize": 14,
						"sn": this.bikeinfo.sn
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('日志信息', res)
					if (res.status == 0) {


					} else {
						uni.showToast({
							title: res.message ? res.message : '获取日志失败',
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
			loadMore() {
				if (this.resquestState < 2) {
					if (this.pageindex < parseInt(parseInt(this.allnumber) / this.pageindex) + 1) {
						// this.getartlist(this.pageindex, 10, 'add')
						this.openbattery(this.pageindex, this.pagenum)
						this.pageindex += 1
					} else {
						// this.resquestState = res.data.list.length == 10 ? 0 : 2
						this.resquestState = 2
						console.log('到底了！！！！')
					}

				}
			},
			manualsgo() {
				this.getcarinfo()
			},
			goNewPage(item) {
				this.setSn(item)
				this.getcarinfo()
			},	
			scanCode(type) {
				if (type == 1) {
					wx.scanCode({
						onlyFromCamera: true, //只允许相机扫码
						success: res => {
							console.log('saoma', res)
							var bikesn = res.result.match(/\?bikesn=(.*)/)[1]
							this.inputval = bikesn
							this.setSn(bikesn)
							this.setBikeid('*')
							this.getcarinfo()
							// setTimeout(() => {
							// 	this.getcarinfo()
							// }, 1500)
						},
						fail: res => {},
						complete: res => {}
					});
				} else {
					uni.navigateTo({
						url: `/pages/manualscan/manualscan?urls=${this.urls}&&type=${this.type}`
					})
				}
			
			},
			// 换电记录
			openbattery(page, num) {
				this.setSn('*')
				var options = {
					url: '/bcorder/list', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						// "type": 10,
						// "bike_id":'test0001',
						"pno": page,
						"user_id": this.userid,
						// "bike_id":this.bikeinfo.id,
						"psize": num
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('换电记录', res)
					this.allnumber = res.total
					if (res.status == 0) {
						this.switchloockdata = this.switchloockdata.concat(res.list)
					} else {
						uni.showToast({
							title: '无记录'
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			
			
			
			    toggleTab(item, index) {  
			        this.$refs.dateTime.show();  
			    },  
			    onConfirm(val) {  
			        console.log(val);  
			    }, 


			change({
				choiceDate,
				dayCount
			}) {
				//参数解释
				//1.choiceDate 时间区间（开始时间和结束时间）
				//2.dayCount 共多少晚

				// console.log(choiceDate, dayCount);
				console.log('入住从 ' + choiceDate[0].re + '  到 ' + choiceDate[1].re + '  共 ' + dayCount + ' 晚');
			},
			change2({
				choiceDate,
				dayCount
			}) {
				this.dateStr =
					'入住从 ' + choiceDate[0].re + ' (星期' + choiceDate[0].week + ')  到 ' + choiceDate[1].re + '(星期' + choiceDate[1].week +
					')' + '  共 ' + dayCount + ' 晚 ';
			},
			change_single({
				choiceDate,
				dayCount
			}) {
				console.log(choiceDate, dayCount);
			},
			setRandomDate() {
				this.initStartDate = '2019-12-' + parseInt(Math.random() * 29 + 1);
				this.initEndDate = '2019-12-31';
			}
		},
		onLoad() {
			this.getuploadlog()
			try {
				var value = uni.getStorageSync('userinfo');
				if (value) {
					this.userid = value.userinfo.id
					this.openbattery(this.pageindex, this.pagenum)
				}
			} catch (e) {
				// error
			}

		}
	}
</script>

<style lang="scss" scoped>
	.listscrow {
		height: calc(50vh);
	}

	.right-view {
		color: green
	}

	.wrong-view {
		color: red
	}

	.wrap {
		// padding-top: 4upx;
		height: 100vh;
		background-color: rgb(245, 245, 245);
		.allselect {
			position: relative;
			top:4upx;
			left:0upx;
			height: 15vh;
			
		.timeselect{
			.wenzi{
				font-size: 22upx;
				color: rgb(80,80,80);
				margin-right: 40upx;
				line-height: 40upx;
			}
			display: flex;
			justify-content: space-around;
			height: 50upx;
			.timedetil{
				display: flex;
				justify-content: space-around;
			}
		}	
		}

		.view-commons {
			margin: 10upx 22upx;
			position: relative;
			background-color: white;
			.switch-head {
				height: 90upx;
				line-height: 90upx;
			}

			.center-box {
				width: 500upx;
				height: 350upx;
				text-align: left;
				margin: 40upx;

				.list-item {
					height: 70upx;
					line-height: 70upx;

					.second-text {
						margin-left: 24upx
					}
				}
			}

			.flexd-posion {
				background-color: rgb(225, 225, 225);
			}

			.view-border-bottom {
				border-bottom: 1upx solid rgb(235, 235, 235);
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
				}

				view {
					width: 30%;
				}
			}
		}
	}
</style>
