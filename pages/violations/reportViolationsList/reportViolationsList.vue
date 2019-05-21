<template>
	<view class="containt-view">
		<view class="msg-view">
			<view class="msg-list-view" v-for="(item, index) in vioList" :key="index" @click="cellClick(index)">
				<view class="msg-item">{{getNewTime(item.create_time)}}</view>
				<view class="reason-view">{{item.violation_remark}}</view>
				<image class="arrow-view" src="/static/image/right_arrow.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				vioList: [
					// {"time":"05-17 09:40", "reason":"其他"},
					// {"time":"05-17 09:40", "reason":"其他"},
					// {"time":"05-17 09:40", "reason":"其他"},
				]
			}
		},
		onLoad() {
			var options = {
				url: '/urviolation/list', //请求接口
				method: 'POST', //请求方法全部大写，默认GET
				context: '',
				data: {
					"order_state": 0,
					"pno": 1,
					"psize": 20
				}
			}
			var _this = this;
			this.$httpReq(options).then((res) => {
				// 请求成功的回调
				// res为服务端返回数据的根对象
				console.log('数据列表：',res);
				if (res.status == 0) {
					this.vioList = res.list;
					// this.vioList.con
					console.log('success：',res.list);
				}else{
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
		methods: {
			cellClick(e){
				console.log("???");
				var d = this.vioList[e];
				console.log("begin push:", d , JSON.stringify(d));
				uni.navigateTo({
					url: "../reportViolationsDetail/reportViolationsDetail?data=" + JSON.stringify(d)
				})
			},
			getNewTime(e){
				return e.substr(5,11);
			}
		}
	}
</script>

<style lang="scss">
	.containt-view{
		width: 100%;
		height: calc(100vh);
		padding-top: 1upx;
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
					width: 30%;
					line-height: 80upx;
					font-size: 28upx;
				}
				.reason-view{
					height: 80upx;
					width: 60%;
					line-height: 80upx;
					font-size: 28upx;
					text-align: right;
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
