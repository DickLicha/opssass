<template>
	<view class='wrap'>
		<view class='view-commons'>

			<view class='flexd-posion'>
				<view class='view-flexs switch-head'>
					<view>时间</view>
					<view class='view-border-letf'>动作</view>
					<view class='view-border-letf'>渠道</view>
					<view class='view-border-letf'>结果</view>
				</view>
			</view>

			<scroll-view class='listscrow' lower-threshold='20' scroll-y @scrolltolower="loadMore">
				<view class='view-flexs view-border-bottom' v-for="(item,i) in switchloockdata" :key=i @click="detilpop(item,i,'middle-list')">
					<view>{{item.time}}</view>
					<view class='view-border-letf'>{{item.action}}</view>
					<view class='view-border-letf'>{{item.qudao}}</view>
					<view class='view-border-letf' :class="{'right-view':item.status=='正常','wrong-view':item.status=='异常'}">{{item.status}}</view>
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
	export default {
		data() {
			return {
				switchloockdata: [],
				resquestState: 0,
				pageindex:1,
				pagenum:20,
				allnumber:100,
				type:'',
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
		methods: {
			togglePopup(type) {
				this.type = type
				
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
					console.log(22,this.allnumber,this.pageindex)
					console.log(33,this.pageindex,parseInt(parseInt(this.allnumber)/this.pageindex)+1)
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
			// 开锁记录
			openbattery(page,num) {
				var options = {
					url: '/bike/oper_list', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"city_id": "35000",
						"type": 10,
						"bike_id":'test0001',
						"pno": page,
						"psize": num
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('开锁记录', res)
					this.allnumber=res.total
					if (res.status == 0) {
						let datainfo = {}
						// this.switchloockdatathis.switchloockdata.concat(res.list)
						for (let i = 0; i < res.list.length; i++) {
							datainfo.time = res.list[i].create_time
							datainfo.action = (res.list[i].type==10)?'开锁':'关锁'
							datainfo.qudao = res.list[i].channel?res.list[i].channel:'无'
							datainfo.status = (res.list[i].success==0)?'成功':'失败'
							datainfo.netstatus = (res.list[i].is_online==0)?'在线':'离线'
							datainfo.username = res.list[i].user_name
							datainfo.phone = res.list[i].user_phone
							datainfo.errormsg = res.list[i].error_msg
							this.switchloockdata.push(datainfo)
						}
					} else {
						
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			getartlist() {
				let datainfo = {}
				for (let i = 0; i < 10; i++) {
					datainfo.time = '2019-04-19-15:15:26'
					datainfo.action = '开锁'
					datainfo.qudao = 'APP下单'
					datainfo.status = '异常'
					this.switchloockdata.push(datainfo)
				}
			},
		},
		onLoad() {
			this.openbattery(this.pageindex,this.pagenum)
			// let datainfo = {}
			// for (let i = 0; i < 12; i++) {
			// 	datainfo.time = '2019-04-19-15:15:26'
			// 	datainfo.action = '关锁'
			// 	datainfo.qudao = '系统下发'
			// 	datainfo.status = '正常'
			// 	this.switchloockdata.push(datainfo)
			// }
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
