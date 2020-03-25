<template>
	<view class='wrap'>
		<view class='allselect'>
			<view class='timeselect'>
				<view class='timedetil' @tap="toggleTab(1)">
					<view class='wenzi'>开始</view>
					<view>{{start_time}}</view>
				</view>
				<yu-datetime-picker @confirm="onConfirm" startYear="2015" ref="dateTime" value="2020-01-01 00:00:00" :isAll="false"
				 :current="false"></yu-datetime-picker>
				<view class='timedetil' @tap="toggleTab(2)">
					<view class='wenzi'>结束</view>
					<view>{{end_time}}</view>
				</view>
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
					<view>{{item.tm}}</view>
					<view class='view-border-letf'>{{item.ecu_brand}}</view>
					<view class='view-border-letf'>{{item.event_name}}</view>
					<view class='view-border-letf'>{{JSON.stringify(item.desc)}}</view>
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
	import eculog from '@/common/ecu.util.js'
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
				start_time: '2020-03-20 00:00:00',
				end_time: "2020-03-20 23:00:00",
				inputval: '',
				timeflag: 0
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
		computed: mapState(['bikeinfo', 'sn']),
		methods: {
			...mapMutations(['setSn']),
			togglePopup(type) {
				this.type = type

			},
			toggleTab(item) {
				this.timeflag=item
			    this.$refs.dateTime.show();  
			}, 
			// 日志信息
			getuploadlog(sn, page, num) {
				var options = {
					url: '/bike/ecu_callback_logs', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"start_time": this.start_time,
						"end_time": this.end_time,
						"pno": page,
						"psize": num,
						"sn": sn
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('日志信息', res)
					if (res.status == 0) {
						for (var i = 0; i < res.list.length; i++) {
							this.allnumber = res.total
							console.log(333, eculog.parseBody(res.list[i]))
							this.switchloockdata = this.switchloockdata.concat(eculog.parseBody(res.list[i]))
						}

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
						// this.openbattery(this.pageindex, this.pagenum)
						this.pageindex += 1
						this.getuploadlog(this.sn, this.pageindex, this.pagenum)

					} else {
						// this.resquestState = res.data.list.length == 10 ? 0 : 2
						this.resquestState = 2
						console.log('到底了！！！！')
					}

				}
			},
			manualsgo() {
				this.getuploadlog(this.sn, this.pageindex, this.pagenum)
			},
			goNewPage(item) {

			},
			scanCode() {
					wx.scanCode({
						onlyFromCamera: true, //只允许相机扫码
						success: res => {
							console.log('saoma', res)
							var bikesn = res.result.match(/\?bikesn=(.*)/)[1]
							this.inputval = bikesn
							this.switchloockdata = []
							this.setSn(bikesn)
							this.getuploadlog(bikesn, this.pageindex, this.pagenum)
						},
						fail: res => {},
						complete: res => {}
					});
			},
			onConfirm(val) {
				console.log(val);
				if (this.timeflag == 1) {
					this.start_time = val.selectRes
				} else {
					this.end_time = val.selectRes
				}
				if (!!this.sn) {
					this.switchloockdata = []
					this.getuploadlog(this.sn, this.pageindex, this.pagenum)
				}
			},
		},
		onLoad() {
			var date = new Date()
			var seperator1 = "-";
			var seperator2 = ":";
			var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
			var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
			var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
				" " + date.getHours() + seperator2 + date.getMinutes() +
				seperator2 + date.getSeconds()
			this.start_time = date.getFullYear() + seperator1 + month + seperator1 + strDate +
				" " + '00' + seperator2 + '00' +
				seperator2 + '00'
			this.end_time = date.getFullYear() + seperator1 + month + seperator1 + strDate +
				" " + '23' + seperator2 + '59' +
				seperator2 + '59'
			// this.getuploadlog()	
			this.setSn('')
			try {
				var value = uni.getStorageSync('userinfo');
				if (value) {
					this.userid = value.userinfo.id
					// this.openbattery(this.pageindex, this.pagenum)
				}
			} catch (e) {
				// error
			}

		}
	}
</script>

<style lang="scss" scoped>
	.listscrow {
		height: calc(75vh);
	}

	.right-view {
		color: green
	}

	.wrong-view {
		color: red
	}

	.wrap {
		// padding-top: 4upx;
		font-size: 24upx;
		height: 100vh;
		background-color: rgb(245, 245, 245);

		.allselect {
			// position: relative;
			// top:4upx;
			// left:0upx;
			// height: 15vh;

			.timeselect {
				.wenzi {
					font-size: 18upx;
					color: rgb(80, 80, 80);
					margin-right: 20upx;
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
