<template>
	<view class='wrap'>
		<view class='view-commons'>

			<view class='flexd-posion'>
				<view class='view-flexs switch-head'>
					<view>id</view>
					<view>ecusn</view>
					<view class='view-border-letf'>电量</view>
					<view class='view-border-letf'>设防</view>
					<view class='view-border-letf'>删除</view>
				</view>
			</view>

			<scroll-view class='listscrow' lower-threshold='20' scroll-y @scrolltolower="loadMore">
				<view class='view-flexs view-border-bottom' v-for="(item,i) in switchloockdata" :key='i' >
					<view @click="gobikecenter(item.id)" style='color:green'>{{item.sn}}</view>
					<view @click="gobikecenter(item.id)">{{item.ecu_sn}}</view>
					<view class='view-border-letf'>{{item.battery_level}}%</view>
					<view class='view-border-letf'>{{item.is_defend_on==0?'撤防':'设防'}}</view>
					<!-- <view class='view-border-letf'>{{item.is_online==0?'离线':'在线'}}</view> -->
					<view class='view-border-letf' style='color:red' @click="delbike(item.id)">删除</view>
				</view>
				<uni-load-more :loadingType="resquestState"></uni-load-more>
			</scroll-view>
			
			<uni-popup  :show="type ==='middle-list'" position="middle" mode="fixed" @hidePopup="togglePopup('')">		
				<view :scroll-y="true" class="uni-center center-box">
					<view v-for="(item, index) in itemcells" :key="index"  class="list-item">
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
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				switchloockdata: [],
				resquestState: 0,
				pageindex:1,
				pagenum:20,
				allnumber:100,
				type:'',
				userid:'',
				list:[1,2,3,4],
				itemcells:[
					{name:'时间:',val:''},
					{name:'网络状态:',val:''},
					{name:'用户姓名:',val:''},
					{name:'用户手机:',val:''},
					{name:'失败原因:',val:''},
					]
			}
		},
		components: {
			UniLoadMore,itemCell,uniPopup
		},
		computed:mapState(['bikeinfo']),
		methods: {
			...mapMutations(['setSn','setBikeid','setBikeinfo']),
			togglePopup(type) {
				this.type = type
				
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
							url: '/pages/swapbattery/swapbattery?showBtn=false&type=99',
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
			gobikecenter(id){
				this.setSn(id.slice(6,14))
				this.setBikeid('*')
				this.getcarinfo()
			},
			delbike(item){
				uni.showModal({
					title: '删除车辆',
					content: `确认删除车${item.slice(6,14)}`,
					// showCancel: false,
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						if(res.confirm){
							this.setBikeid(item)
							var options = {
								url: '/binv/del', //请求接口
								method: 'POST', //请求方法全部大写，默认GET
								context: '',
								data: {
								}
							}
							this.$httpReq(options).then((res) => {
								// 请求成功的回调
								// res为服务端返回数据的根对象
								console.log('车辆列表', res)
								this.allnumber=res.total
								if (res.status == 0) {
									this.switchloockdata=[]
									this.openbattery(0,20)
								} else {
									uni.showToast({
										title: '删除失败'
									});
								}
							}).catch((err) => {
								// 请求失败的回调
								console.error(err, '捕捉')
							})
						}
					},
					fail: () => {},
					complete: () => {}
				});
				
			},
			detilpop(item,i,type){
				this.type=type
				this.itemcells[0].val=item.time
				this.itemcells[1].val=item.netstatus
				this.itemcells[2].val=item.username
				this.itemcells[3].val=item.phone
				this.itemcells[4].val=item.errormsg
			},
			loadMore() {
				if (this.resquestState < 2) {
					if(this.pageindex<parseInt(parseInt(this.allnumber)/this.pageindex)+1){
						// this.getartlist(this.pageindex, 10, 'add')
						this.openbattery(this.pageindex,this.pagenum)
						this.pageindex += 1
					}else{
						// this.resquestState = res.data.list.length == 10 ? 0 : 2
						this.resquestState=2
						console.log('到底了！！！！')
					}
					
				}
			},
			// 车辆列表
			openbattery(page,num) {
				this.setSn('*')
				var options = {
					url: '/bike/list', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"pno": page,
						"psize": num
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('车辆列表', res)
					this.allnumber=res.total
					if (res.status == 0) {
						this.switchloockdata=this.switchloockdata.concat(res.list)
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
			try {
				var value = uni.getStorageSync('userinfo');
				if (value) {
					this.userid=value.userinfo.id
					this.openbattery(this.pageindex,this.pagenum)
				}
			} catch (e) {
				// error
			}
			
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
				.list-item{
					height: 70upx;
					line-height: 70upx;
					.second-text{
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
				height: 44px;
                
				view{
				font-size: 20upx!important;	
				}
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
