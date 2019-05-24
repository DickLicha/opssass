<template>
	<view class='wrap'>
		<view class='view-commons'>

			<view class='flexd-posion'>
				<view class='view-flexs switch-head'>
					<view>名称</view>
					<view class='view-border-letf'>电量</view>
					<view class='view-border-letf'>位置</view>
					<view class='view-border-letf'>排查内容</view>
				</view>
			</view>

			<scroll-view class='listscrow' lower-threshold='20' scroll-y @scrolltolower="loadMore">
				<view class='view-flexs view-border-bottom' v-for="(item,i) in switchloockdata" :key=i @click="detilpop(item)" :class="[item.order_state == '1'? 'wrong-view' : 'right-view']">
					<view>{{item.bike_id}}</view>
					<view class='view-border-letf'>{{item.battery_level}}</view>
					<view class='view-border-letf'>{{item.address}}</view>
					<view class='view-border-letf'>{{item.alert_content}}</view>
				</view>
				<!-- <uni-load-more :loadingType="resquestState"></uni-load-more> -->
				<view class='list-desc' v-if="nolist">{{listdes}}</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import UniLoadMore from '@/components/load-more.vue'
	import itemCell from '@/components/item-cell/item-cell.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		data() {
			return {
				switchloockdata: [],
				resquestState: 0,
				pageindex:1,
				pagenum:20,
				allnumber:100,
				type:'',
				types:'',
				list:[1,2,3,4],
				nolist:true,
				listdes:'无数据！',
				faulttype:'',
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
		methods: {
			togglePopup(type) {
				this.type = type			
			},
			detilpop(item){
				uni.showModal({
					title: '车辆异常',
					content: '异常确认',
					// showCancel: false,
					cancelText: '取消',
					confirmText: '异常确认',
					success: res => {
						if(res.confirm){
							console.log('item',item.id)
							this.balertconfirm(item.id)
						}else{
							
						}
					},
					fail: () => {},
					complete: () => {}
				});
			},
			loadMore() {
				// if (this.resquestState < 2) {
				// 	console.log(33,this.pageindex,parseInt(parseInt(this.allnumber)/this.pageindex)+1)
				// 	if(this.pageindex<parseInt(parseInt(this.allnumber)/this.pageindex)+1){
				// 		// this.getartlist(this.pageindex, 10, 'add')
				// 		this.openbattery(this.pageindex,this.pagenum)
				// 		this.pageindex += 1
				// 	}else{
				// 		// this.resquestState = res.data.list.length == 10 ? 0 : 2
				// 		this.resquestState=2
				// 		console.log('到底了！！！！')
				// 	}
				// 	
				// }
			},
			// 车辆异常列表
			openbattery(type) {
				var options = {
					url: '/balert/list', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"type": type,//1048576车辆失联、16车辆故障、32车辆疑似被盗
						"pno": 1,
						"psize": 100
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('车辆异常列表', res)
					this.allnumber=res.total
					if (res.status == 0) {
						if(res.list.length>0){
							this.nolist=false
						}
						this.switchloockdata=res.list
					} else {
						uni.showToast({
							title: res.message?res.message:'获取列表失败'
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 车辆异常确认
			balertconfirm(id) {
				var options = {
					url: '/balert/confirm', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"id":id
					}
				}
				this.$httpReq(options).then((res) => {
					this.allnumber=res.total
					if (res.status == 0) {
						uni.showToast({
							title:'车辆异常确认成功'
						});
						this.openbattery(this.faulttype)
					} else {
						uni.showToast({
							title: res.message?res.message:'车辆异常确认失败'
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
		},
		onLoad(e) {
			this.types=e.type
			if(this.types==0){
				this.faulttype=32
			}else if(this.types==1){
				this.faulttype=16
			}else{
				this.faulttype=1048576
			}
			this.openbattery(this.faulttype)
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
            .list-desc{
				text-align: center;
				color: rgb(200,200,200);
				margin-top: 30upx;
			}
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
