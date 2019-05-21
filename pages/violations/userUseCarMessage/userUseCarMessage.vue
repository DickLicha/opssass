<template>
	<view class="containt-view">
		<view class="msg-view">
			<view class="msg-list-view" v-for="(item, index) in msgList" :key="index">
				<view class="msg-item">{{item}}</view>
			</view>
		</view>
		<view class="tip-view">{{distantStr}}</view>
		<map class="map-view" id="userMap" :latitude="26.3" :longitude="119.7"></map>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msgList: [
					// "姓名：彭志飞",
					// "手机号码：138****8250", 
					// "开始时间：2019-05-17 06:13:29",
					// "结束时间：2019-05-17 06:36:49"
				],
				distantStr : "还车位置距离车辆位置15米",
				markers: [
					
				],
			}
		},
		onLoad(e) {
			console.log(e);
			var options = {
				url: '/urorder/info', //请求接口
				method: 'POST', //请求方法全部大写，默认GET
				context: '',
				data: {
					"order_id": e.order_id,
				}
			}
			var _this = this;
			this.$httpReq(options).then((res) => {
				// 请求成功的回调
				// res为服务端返回数据的根对象
				console.log('数据列表：',res);
				if (res.status == 0) {
					_this.msgList.push("姓名：" + res.info.user_name);
					_this.msgList[0] = "姓名：" + res.info.user_name;
					_this.msgList[1] = "手机号码：" + res.info.user_phone;
					_this.msgList[2] = "开始时间：" + res.info.start_time;
					_this.msgList[3] = "结束时间：" + res.info.end_time;
					console.log(_this.msgList);
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
				height: 100upx;
				border-bottom: 2upx solid #d8d8d8;
				.msg-item{
					margin-left: 30upx;
					height: 100upx;
					width: calc(100vw - 40upx);
					line-height: 100upx;
					font-size: 28upx;
				}
			}
		}
		.tip-view{
			width: 100%;
			height: 70upx;
			background-color: orange;
			text-align: center;
			line-height: 70upx;
			font-size: 26upx;
		}
		.map-view{
			width: 100%;
			height: calc(100vh - 470upx);
		}
	}
</style>
