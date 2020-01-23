<template>
	<view class="containt-view">
		
		<scroll-view class='listscrow' lower-threshold='20' scroll-y @scrolltolower="loadMore">
			<view class="msg-view">
				<view class="msg-list-view" v-for="(item, index) in vioList" :key="index" @click="cellClick(index)">
					<view class="msg-item">{{getNewTime(item.create_time)}}</view>
					<view class="msg-item">id:{{item.bike_id.substring(6,14)}}</view>
					<view class="reason-view">{{item.violation_remark}}</view>
					<image class="arrow-view" src="/static/image/right_arrow.png" mode=""></image>
				</view>
				<view class='no-data' v-if="shownodata"><text>到底了！</text></view>
			</view>
			<!-- <uni-load-more :loadingType="resquestState"></uni-load-more> -->
		</scroll-view>
		
		<!-- <view class="msg-view">
			<view class="msg-list-view" v-for="(item, index) in vioList" :key="index" @click="cellClick(index)">
				<view class="msg-item">{{getNewTime(item.create_time)}}</view>
				<view class="reason-view">{{item.violation_remark}}</view>
				<image class="arrow-view" src="/static/image/right_arrow.png" mode=""></image>
			</view>
			<view class='no-data' v-if="shownodata"><text>暂无数据！</text></view>
		</view> -->
	</view>
</template>

<script>
	import UniLoadMore from '@/components/load-more.vue'
	export default {
		data() {
			return {
				vioList: [
				],
				shownodata:false,
				type:0,
				pageindex:1,
				pagenum:20,
				allnumber:100,
				resquestState: 0,
			}
		},
		components: {
			UniLoadMore
		},
		onLoad(e) {
			console.log('ee',e)
			this.type=e.type
			// this.openbattery(this.pageindex,this.pagenum)
			
		},
		onShow(){
			// this.getList()
			this.vioList=[]
			this.pageindex=1
			console.log(222,this.pageindex,this.pagenum)
			this.openbattery(this.pageindex,this.pagenum)
		},
		methods: {
			loadMore() {
				if (this.resquestState < 2) {
					if(this.pagenum<parseInt(parseInt(this.allnumber)/this.pageindex)+1){
						// this.getartlist(this.pageindex, 10, 'add')
						this.pageindex += 1
						this.openbattery(this.pageindex,this.pagenum)
						
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
						url: '/urviolation/list', //请求接口
						method: 'POST', //请求方法全部大写，默认GET
						context: '',
						data: {
							"order_state": parseInt(this.type),
							"pno": page,
							"psize": num
						}
					}
					this.$httpReq(options).then((res) => {
						// 请求成功的回调
						// res为服务端返回数据的根对象
						console.log('数据列表：',res);
						if (res.status == 0) {
							this.allnumber=res.total
							if(!!res.list){
								this.shownodata=false
								this.vioList=this.vioList.concat(res.list)
								
								// this.vioList = res.list;
							}else{
								this.shownodata=true
								// this.vioList = []
							}
						}else{
							this.shownodata=true
							uni.showToast({
								title: res.message,
								icon: "none"
							})
						}
					}).catch((err) => {
						// 请求失败的回调
						console.error(err, '捕捉')
					})
			},
			cellClick(e){
				var d = this.vioList[e];
				uni.navigateTo({
					url: `../reportViolationsDetail/reportViolationsDetail?data=${JSON.stringify(d)}&type=${this.type}`
				})
			},
			getNewTime(e){
				return e.substr(5,11);
			},
			getList(){
				var options = {
					url: '/urviolation/list', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"order_state": parseInt(this.type),
						"pno": page,
						"psize": number
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('数据列表：',res);
					if (res.status == 0) {
						if(!!res.list){
							this.shownodata=false
							this.vioList = res.list;
						}else{
							this.shownodata=true
							this.vioList = []
						}
					}else{
						this.shownodata=true
						uni.showToast({
							title: res.message,
							icon: "none"
						})
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			}
		}
	}
</script>

<style lang="scss">
	.listscrow {
		height: calc(100vh - 40upx);
	}
	.containt-view{
		width: 100%;
		height: calc(100vh);
		padding-top: 1upx;
		.no-data{
			text-align: center;
			margin-top: 50upx;
			color: rgb(220,220,220)
		}
		.msg-view{
			width: 100%;
			height: auto;
			.msg-list-view{
				width: 100%;
				height: 80upx;
				border-bottom: 2upx solid #D8D8D8;
				padding-left: 30upx;
				display: flex;
				.msg-item{
					height: 80upx;
					width: 25%;
					line-height: 80upx;
					font-size: 28upx;
				}
				.reason-view{
					height: 80upx;
					width: 50%;
					line-height: 80upx;
					font-size: 28upx;
					text-align: center;
				}
				.arrow-view{
					margin-top: 25upx;
					height: 30upx;
					width: 30upx;
				}
			}
		}
	}
</style>
