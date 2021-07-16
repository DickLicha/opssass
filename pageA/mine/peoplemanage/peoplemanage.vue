<template>
	<view class='wrap'>
		<view class='view-commons'>
			<view v-if="isselect==1">
				<view class='flexd-posion'>
					<view class='view-flexs switch-head'>
						<view>姓名</view>
						<view class='view-border-letf'>运营角色</view>
						<view class='view-border-letf'>运维角色</view>
						<view class='view-border-letf'>创建人</view>
					</view>
				</view>
				<scroll-view>
					<view class='view-flexs view-border-bottom' v-for="(item,i) in switchdatatotal" :key='i'>
						<view>{{item.date}}</view>
						<view class='view-border-letf'>{{item.total_count}}</view>
						<view class='view-border-letf'>{{item.valid_count}}</view>
						<view class='view-border-letf'>{{item.offic}}%</view>
					</view>
					<!-- <uni-load-more :loadingType="resquestState"></uni-load-more> -->
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

				<view class='bottom-view'>
					<view class='create-ops' @tap='createops(2)'><text>创建运维人员</text></view>
				</view>
			</view>

			<view v-if='isselect==2'>
				<view>
					<view>
						<text>员工姓名</text>
						<input type="text">
					</view>
					<view>
						<text>身份证号</text>
						<input type="text">
					</view>
					<view>
						<text>手机号码</text>
						<input type="text">
					</view>
					<view>
						<text>运营角色</text>
						<input type="text">
					</view>
					<view>
						<text>运维角色</text>
						<input type="text">
					</view>
					<view>
						<text>账号状态</text>
					</view>
					<view class='bottom-view'>
						<view class='create-ops' @tap='createops(1)'><text>立即提交</text></view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import UniLoadMore from '@/components/load-more.vue'
	import itemCell from '@/components/item-cell/item-cell.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				isselect: 1,
				switchdatatotal: [],
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
				]
			}
		},
		components: {
			UniLoadMore,
			itemCell,
			uniPopup
		},
		computed: mapState(['bikeinfo']),
		methods: {
			...mapMutations(['setSn']),
			togglePopup(type) {
				this.type = type

			},
			createops(index) {
				this.isselect = index
			},
			detilpop(item, i, type) {
				this.type = type
				this.itemcells[0].val = item.time
				this.itemcells[1].val = item.netstatus
				this.itemcells[2].val = item.username
				this.itemcells[3].val = item.phone
				this.itemcells[4].val = item.errormsg
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
			// 运维人员列表
			openbattery(page, num) {
				this.setSn('*')
				var options = {
					url: '/staff/list', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						// "type": 10,
						// "bike_id":'test0001',
						"pno": page,
						// "bike_id":this.bikeinfo.id,
						"psize": num
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('运维人员', res)
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
			// 运维人员列表
			add() {
				var options = {
					url: '/staff/add', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						cc_role_id:'',
						idcno: '',
						ops_role_id:'',
						phone: ''
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					
					if (res.status == 0) {
						
					} else {
						uni.showToast({
							title: res.message?res.message:'添加失败'
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 运维角色
			rolelist(type) {
				var options = {
					url: '/role/list', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						// "type": 10,
						// "bike_id":'test0001',
						"pno": 1,
						// "bike_id":this.bikeinfo.id,
						"psize": 1000,
						"type": type
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('角色列表', res)
					if (res.status == 0) {

					} else {
						uni.showToast({
							title: res.message ? res.message : '列表为空'
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			}
	},
	onLoad() {
		this.openbattery(this.pageindex, this.pagenum)
		this.rolelist('CC')
		this.rolelist('OPS')
	}
	}
</script>

<style lang="scss" scoped>
	.listscrow {
		height: calc(100vh - 100upx);
	}

	.right-view {
		color: green
	}

	.wrong-view {
		color: red
	}

	.wrap {
		padding-top: 1upx;
		// height: 100vh;
		background-color: rgb(245, 245, 245);

		.sechead {
			margin-top: 8upx;
			display: flex;
			justify-content: space-around;

			.sectitle {
				border: 2upx solid black;
				border-radius: 6upx;
				height: 70upx;
				line-height: 70upx;
				width: 120upx;
				text-align: center;
				color: rgb(50, 50, 50);
				border-color: rgb(50, 50, 50);
			}

			.selectclass {
				background-color: rgb(26, 173, 25);
				color: white;
				border-color: white;
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

	.bottom-view {
		position: fixed;
		bottom: 20px;
		text-align: center;
		width: 100%;

		.create-ops {
			border-radius: 10upx;
			background-color: rgb(57, 164, 241);
			color: white;
			text-align: center;
			width: 80%;
			height: 80upx;
			line-height: 80upx;
			margin-left: calc(10% - 22upx);
		}
	}
</style>
