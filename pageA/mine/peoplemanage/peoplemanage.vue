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
					<view class='view-flexs view-border-bottom' v-for="(item,i) in switchdatatotal" :key='i'
						@tap="detilpop(item,i,'middle-list')">
						<view>{{item.name}}</view>
						<view class='view-border-letf'>{{item.cc_role_name}}</view>
						<view class='view-border-letf'>{{item.ops_role_name}}</view>
						<view class='view-border-letf'>{{item.creator_name}}</view>
					</view>
					<!-- <uni-load-more :loadingType="resquestState"></uni-load-more> -->
				</scroll-view>

				<uni-popup :show="type ==='middle-list'" position="middle" mode="fixed" @hidePopup="togglePopup('')">
					<!-- <uni-popup :show="type ==='middle-list'" position="insert"   @hidePopup="togglePopup('')"> -->
					<view :scroll-y="true" class="uni-center center-box">
						<view class='btn-view'>
							<view class='pop-btn edit-btn' @tap='edituser'><text>编辑</text></view>
							<view class='pop-btn del-btn' @tap='deluser'><text>删除</text></view>
						</view>
					</view>
				</uni-popup>

				<view class='bottom-view'>
					<view class='create-ops' @tap='createops(2)'><text>创建运维人员</text></view>
				</view>
			</view>

			<view v-if='isselect==2'>
				<view>
					<view class='add-info'>
						<text>员工姓名：</text>
						<input placeholder="请输入用户姓名" v-model="username" type="text">
					</view>
					<view class='add-info'>
						<text>身份证号：</text>
						<input placeholder="请输入身份证号" type="text" v-model="idcard">
					</view>
					<view class='add-info'>
						<text>手机号码：</text>
						<input type="number" placeholder="请输入手机号" v-model="phonenumber">
					</view>
					<view class='add-info'>
						<text>运营角色：</text>
						<view class='base-line' @tap='showpops(1)'>
							<view>{{ccrole}}</view>
							<img src="../../../static/image/isxiala.png" alt="">
						</view>
						<!-- <input type="text" v-model="ccrole"> -->
					</view>
					<view class='add-info'>
						<text>运维角色：</text>
						<view class='base-line' @tap='showpops(2)'>
							<view>{{opsrole}}</view>
							<img src="../../../static/image/isxiala.png" alt="">
						</view>
						<!-- <input type="text" v-model="opsrole"> -->
					</view>
					<view class='add-info'>
						<text>账号状态：</text>
						<view class='openstate'>
							<text>关闭</text>
							<switch :checked="!states" @change="changes" />
							<text>开启</text>
						</view>

					</view>
					<view class='bottom-view'>
						<view class='create-ops' @tap='createops(1)'><text>立即提交</text></view>
					</view>
					<!-- cc角色 -->
					<wzp-picker mode='one' ref='wzpPicker2' :defaultIndex='defaultIndex' :pickerList="popData2"
						@onConfirm="onConfirm2"></wzp-picker>
					<!-- ops角色 -->
					<wzp-picker mode='one' ref='wzpPicker1' :defaultIndex='defaultIndex' :pickerList="popData1"
						@onConfirm="onConfirm1"></wzp-picker>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import UniLoadMore from '@/components/load-more.vue'
	import itemCell from '@/components/item-cell/item-cell.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import wzpPicker from '@/components/wzpPicker.vue';
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				isadd:true,
				userinfo: {},
				defaultIndex: [0],
				popData1: [],
				popData2: [],
				username: '',
				idcard: '',
				phonenumber: '',
				ccrole: '不授权',
				opsrole: '不授权',
				ccroleid: '',
				opsroleid: '',
				isselect: 1,
				states: 0,
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
			uniPopup,
			wzpPicker
		},
		computed: mapState(['bikeinfo']),
		methods: {
			...mapMutations(['setSn', 'setBikeid','setOpsinfo']),
			showpops(type) {
				if (type == 1) {
					this.$refs.wzpPicker1.showPicker();
				} else {
					this.$refs.wzpPicker2.showPicker();
				}
			},
			// 编辑用户
			edituser() {
				this.type=''
				this.isadd=false
				uni.navigateTo({
					url: '/pageA/editaddops/editaddops?type=2',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
				// this.isselect = 2
				// this.username =this.userinfo.name
				// this.idcard =this.userinfo.idcno
				// this.phonenumber =this.userinfo.phone
				// this.ccrole =this.userinfo.cc_role_name
				// this.opsrole =this.userinfo.ops_role_name
				// this.states =this.userinfo.state
				// this.ccroleid =this.userinfo.cc_role_id
				// this.opsroleid =this.userinfo.ops_role_id
			},
			//删除用户
			deluser() {
				uni.showModal({
					title: '删除',
					content: '确认删除该用户？',
					showCancel: true,
					cancelText: '取消',
					confirmText: '删除',
					success: res => {
						if (res.confirm) {
							this.setBikeid(this.userinfo.id)
							var options = {
								url: '/staff/del', //请求接口
								method: 'POST', //请求方法全部大写，默认GET
								context: '',
								data: {
									// "id": this.userinfo.id,
								}
							}
							this.$httpReq(options).then((res) => {
								// 请求成功的回调
								// res为服务端返回数据的根对象
								console.log('删除信息', res)
								this.setBikeid('*')
								if (res.status == 0) {
									uni.showToast({
										title: '删除用户成功'
									});
									this.type = ''
									this.openbattery(this.pageindex, this.pagenum)
								} else {
									uni.showToast({
										title: '删除失败'
									});
								}
							}).catch((err) => {
								// 请求失败的回调
								console.error(err, '捕捉')
							})
						} else {

						}
					},
					fail: () => {},
					complete: () => {}
				});

			},
			togglePopup(type) {
				this.type = type

			},
			createops(index) {//2是创建运维人员，1是执行add
				//add接口
				if (index == 1) {
					var showtoasts = ''
					if (this.username == '') {
						uni.showToast({
							title: '请输入姓名'
						})
						return
					} else if (this.idcard == '') {
						uni.showToast({
							title: '请输入身份证号'
						})
						return
					} else if (this.phonenumber == '') {
						uni.showToast({
							title: '请输入手机号'
						})
						return
					} else {
						this.add()
					}
				}
				if(index==2){
					// 1
                    uni.navigateTo({
                    	url: '/pageA/editaddops/editaddops?type=1',
                    	success: res => {},
                    	fail: () => {},
                    	complete: () => {}
                    });
				}	
			},
			detilpop(item, i, type) {
				this.type = type
				this.userinfo = item
				this.setOpsinfo(item)
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
						"pno": 1,
						"psize": 1000
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('运维人员', res)
					this.allnumber = res.total
					if (res.status == 0) {
						// this.switchdatatotal = this.switchdatatotal.concat(res.list)
						this.switchdatatotal = res.list
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
		},
		onLoad() {
			this.openbattery(this.pageindex, this.pagenum)
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
				// height: 350upx;
				text-align: left;
				margin: 40upx;

				.btn-view {
					display: flex;
					justify-content: space-between;
					text-align: center;
					color: white;

					.edit-btn {
						background-color: #2479b7;
					}

					.del-btn {
						background-color: #9c2323;
					}

					.pop-btn {
						// background-color: green;
						border: 1px solid white;
						border-radius: 10upx;
						height: 70upx;
						width: 40%;
						line-height: 70upx;
					}
				}


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

	.add-info {
		display: flex;
		margin-top: 24upx;

		text {
			font-size: 34upx;
			// color: $erji-biaoti-color;
		}

		input {
			margin-left: 30upx;
		}

		.openstate {
			margin-left: 30upx;

			text {
				font-size: 28upx;
				color: $erji-biaoti-color;
			}
		}

		.base-line {
			color: #515151;
			display: flex;
			justify-content: space-between;
			margin-left: 30upx;
			border-bottom: solid 1px #515151;
			width: 200upx;

			image {
				width: 34upx;
				height: 34upx;
			}
		}
	}
</style>
