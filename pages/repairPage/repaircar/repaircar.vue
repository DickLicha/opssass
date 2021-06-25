<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="swapdata" type='4' :border='borders' @itemclick='gocarcenter'></item-cell>
			<item-cell :itemdata="swapbatterydata" type='2' :border='borders'></item-cell>
			<item-cell :itemdata="faulttype" type='4' :border='borders' @itemclick='gofaultinfo'></item-cell>
			<view class='fault-view'>
				<view class='fault-list-view' v-for="(item,i) in faultdata" @click="faultpop('middle-list',item)">
					<text>{{item.name}}</text>
				</view>
			</view>
			<uni-popup :show="type ==='middle-list'" position="middle" mode="fixed" @hidePopup="togglePopup('')">
				<!-- <view class='cancel-view'><img src="/static/image/quxiao.png" alt="" class='pop-cancels' @click="togglePopup('')"></view>			 -->
				<view class='cancel-view'><text class='pop-cancels' @click="togglePopup('')">取消</text></view>
				<scroll-view :scroll-y="true" class="uni-center center-box">
					<view v-for="(item, index) in list" :key="index" @click="getfaulttype(item)" class="uni-list-item">
						{{ item.name }}
					</view>
				</scroll-view>
			</uni-popup>

			<view class='change-battery-button'>
				<button class='share-button-default bottom-button' type='primary' @click='changbattery(0)'>误报</button>
				<button class='share-button-default bottom-button' type='primary' @click='changbattery(1)'>处理完成</button>
			</view>
		</view>
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
		data() {
			return {
				type: '',
				temparr: [],
				list: [],
				borders: true,
				swapdata: [{
					name: '车牌编号',
					val: ''
				}],
				swapbatterydata: [{
						name: '当前状态:',
						val: '未入库'
					},
					{
						name: 'SIM卡状态:',
						val: '使用'
					},
				],
				faulttype: [{
					name: '故障类型:',
					val: '请在下面选择'
				}],
				faulttypeall: '',
				// selectfaultobj:[],
				faultdata: [{
						name: '控制器故障',
						id: 1
					},
					{
						name: '电机故障',
						id: 2
					},
					{
						name: '刹车故障',
						id: 3
					},
					{
						name: '车灯故障',
						id: 4
					},
					{
						name: '刹把断电',
						id: 5
					},
					{
						name: '转把故障',
						id: 6
					},
					{
						name: '车把故障',
						id: 7
					},
					{
						name: '控制器故障',
						id: 8
					},
				]
			}
		},
		components: {
			itemCell,
			uniPopup
		},
		computed: mapState(['faultinfo', 'orderfirstid', 'selectfaultobj', 'bikeinfo']),
		onLoad(e) {
			this.setFaultinfo('')
			this.swapdata[0].val = this.bikeinfo.sn
			this.swapdata[1].val = this.$invstate(this.bikeinfo.inv_state)
			let sim_state = ''
			if (this.bikeinfo.is_on_battery == 0) {
				sim_state = '在线'
			} else if (this.bikeinfo.is_on_battery == 1) {
				sim_state = '离线'
			}
			this.swapdata[2].val = sim_state
		},
		onShow() {
			let faultresult = ''
			for (let i = 0; i < this.faultinfo.length; i++) {
				faultresult += this.faultinfo[i] + '/'
			}
			this.setFaultinfo(faultresult)
			this.faulttype[0].val = this.faultinfo
		},
		methods: {
			...mapMutations(['setFaultinfo', 'setSelectfaultobj']),
			getfaulttype(item) {
				this.temparr.push(item)
				this.setSelectfaultobj(this.temparr)
				if (this.faultinfo == '') {
					this.setFaultinfo(item.name)
				} else if (this.faultinfo.indexOf(item.name) == '-1') {
					let temp = this.faultinfo
					temp += '/' + item.name
					this.setFaultinfo(temp)
				}
				this.faulttype[0].val = this.faultinfo
				this.type = ''
			},
			faultpop(types, item) {
				this.type = types
				switch (item.id) {
					case 1:
						this.list = [{
								name: '进水短路',
								val: 1001
							},
							{
								name: '功能故障',
								val: 1002
							},
						]
						break;
					case 2:
						this.list = [{
								name: '电机线被剪',
								val: 2001
							},
							{
								name: '电机端盖裂',
								val: 2002
							},
							{
								name: '功能故障',
								val: 3000
							},
						]
						break;
					default:
						this.list = [{
							name: '其他',
							val: 9000
						}, ]
				}
			},
			gocarcenter() {
				uni.navigateTo({
					url: '/carBigCenter/carcenter/carcenter',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			togglePopup(type) {
				this.type = type
			},
			gofaultinfo() {
				if (this.faultinfo == '') {
					return
				}
				this.setFaultinfo(this.faultinfo.split('/'))
				uni.navigateTo({
					url: '/pages/repairPage/faulttypeview/faulttypeview',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			changbattery(type) {
				// fault_type=0代表误报
				uni.showModal({
					title: '确认操作',
					content: '提交信息',
					showCancel: true,
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						if (res.confirm) {
							uni.getLocation({ //获取当前的位置坐标
								type: 'gcj02',
								success: (res) => {
									let faultType = []
									let faultDesc = []
									let faultSubtype = []
									if (type == 0) {
										faultType = [0]
										faultDesc = ['误报']
										faultSubtype = []
									} else {
										faultType = [1]
										for (let i = 0; i < this.selectfaultobj.length; i++) {
											faultSubtype.push(this.selectfaultobj[i].val)
											faultDesc.push(this.selectfaultobj[i].name)
										}
									}
									let options = {
										url: '/brorder/repair', //请求接口
										method: 'POST', //请求方法全部大写，默认GET
										context: '',
										data: {
											"user_coordinate": [res.longitude, res.latitude],
											"order_id": this.orderfirstid,
											"fault_types": faultType,
											"fault_subtypes": faultSubtype,
											"fault_descs": faultDesc
										}
									}
									this.$httpReq(options).then((res) => {
										if (res.status == 0) {
											uni.showToast({
												title: '处理成功',
												mask: false,
												duration: 3000
											});
											setTimeout(() => {
												uni.switchTab({
													url: '/pages/tabbar/index/index'
												});
											}, 2500)

										} else {
											uni.showToast({
												title: res.message ? res.message : '处理失败',
												mask: false,
												icon:'none',
												duration: 3000
											});
										}
									}).catch((err) => {
										// 请求失败的回调
										console.error(err, '捕捉')
									})
								},
								fail: (res) => {

								},
							})

						}
					},
					fail: () => {},
					complete: () => {}
				});
			}
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

		.center-box {
			width: 500upx;
			height: 500upx;
		}

		.cancel-view {
			position: relative;
			text-align: left;
			width: 100%;

			.pop-cancels {
				width: 30upx;
				height: auto;
				position: relative;
				/* right:50upx; */
			}

		}

		.uni-list-item {
			text-align: center;
			line-height: 70upx;
			/* border-bottom: 1px #f5f5f5 solid; */
			background-color: rgb(222, 222, 222);
			margin-bottom: 20upx;
			margin-top: 10upx;
		}

		.uni-list-item:last-child {
			border: none;
		}

		/* margin-bottom: 20upx; */
		.view-common {
			margin: 10upx 22upx;
			height: 98vh;
			position: relative;

			.fault-view {
				margin: 20upx 0;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				align-items: center;

				.fault-list-view {
					background-color: white;
					width: calc(50% - 50upx);
					margin-bottom: 20upx;
					height: 70upx;
					line-height: 70upx;
					text-align: center;
				}
			}

			.change-battery-button {
				position: fixed;
				bottom: 3vh;
				width: 706upx;
				display: flex;

				.bottom-button {
					margin: 0 40upx;
					width: 50%
				}
			}

		}
	}
</style>
