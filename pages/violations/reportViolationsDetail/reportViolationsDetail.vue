<template>
	<view>
		<view class="main-view">
			<view class="head-view" @click="headClick()">
				<view class="head-name">{{headTitle}}</view>
				<image class="head-arrow" src="/static/image/right_arrow.png" mode=""></image>
			</view>
			<view class="violations-view" v-for="(item, index) in violationsList" :key="index">{{item}}</view>
			<view class="white-view"></view>
			<view class="user-msg-view" v-for="(item, index) in userMsgList" :key="index">
				<view class="user-msg-item">{{item}}</view>
				<image class="arrow" src="/static/image/right_arrow.png" mode="" v-show="index == 0"></image>
			</view>
			<view v-if="ordertype==10" class="user-msg-view" v-for="(item, index) in laheList" :key="index">
				<view class="user-msg-item">{{item}}</view>
				<image class="arrow" src="/static/image/right_arrow.png" mode="" v-show="index == 0"></image>
			</view>
			<view class="line-view"></view>
			<image class="image-view" :src="item" v-for="(item, index) in imgArr" :key="index" mode="" @click="imageClick(index)"></image>
			<view class="violations-view" v-for="(item, index) in findList" :key="index">{{item}}</view>
		</view>
		<view class="bottom-view">
			<view class="noPulish" @click="publish()">不处罚</view>
			<view class="pulish" @click="togglePopup('violation')">处罚</view>
		</view>
		<uni-popup :show="type === 'violation'" position="middle" mode="fixed" @hidePopup="togglePopup('')">
			 <view class="uni-center violationView">
				<view class="title-view">违章处罚标准</view>
				<view class="time-view">
					<view class="t-view">禁用时间</view>
					<view class="f-view" v-for="(item, index) in blacklistedArr" :key="index" :class="{'f-select-view': blacklistedSelect == index}" @click="blackBtnClick(index)">
						{{item}}天
					</view>
				</view>
				<view class="time-view">
					<view class="t-view">罚金</view>
					<view class="f-view" :class="{'f-select-view': fineSelect == index}" v-for="(item, index) in fineArr" :key="index" @click="fBtnClick(index)">
						{{item}}元
					</view>
				</view>
				<view class="time-view">
					<view class="np-view" @click="togglePopup('')">取消</view>
					<view class="p-view" @click="publish()">处罚</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				lahestate:false,
				faqianstate:false,
				headTitle : "用户还车位子吻合",
				violationsList: [
					"违章时间：2019-05-17 09:11:23",
					"违章类型：其他（？？）",
					"违章影响："
				],
				userMsgList: [
					"用户姓名：王建立",
					"用户手机号码：13900008888",
					"车辆编号：801313560"
				],
				laheList: [
				],
				imgArr: [
					
				],
				findList: [
					"发现时间：",
					"发现地点：",
					"备注："
				],
				type: "",
				//  违章数据
				orderData: "",
				//  处罚天数
				blacklisted: 0,
				blacklistedSelect: 20,
				blacklistedArr: [
					"3",
					"7",
					"30",
				],
				//  处罚金额
				fine: 0,
				fineSelect: 20,
				fineArr: [
					"3",
					"5",
				],
				ordertype:0,
				faqianjine:0,
				laheitime:0
			}
		},
		onLoad(e) {
			console.log( "detail：", e);
			var data = JSON.parse(e.data)
			console.log('black',data.blacklisted)
			this.laheList[0]='拉黑时间:'+data.blacklisted/3600/24+'天'
			this.ordertype=e.type
			this.orderData = data;
			
			this.violationsList[0] = "违章时间：" + data.create_time;
			this.violationsList[1] = "违章类型：" + data.violation_remark;
			
			this.userMsgList[0] = "用户姓名：" + data.violator_name;
			this.userMsgList[1] = "用户手机号码：" + data.violator_phone;
			this.userMsgList[2] = "车辆编号：" + data.bike_id;
			
			this.imgArr = data.imgs;
			
			this.findList[0] = "发现时间：" + data.create_time;
			this.findList[1] = "发现地点：" + data.address;
			
			this.geturorder(data.bound_order_id)
		},
		methods: {
			// 用户订单信息
			geturorder(id) {
				var options = {
					url: '/urorder/info', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						order_id:id
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('用户订单信息',res)
					if (res.status == 0) {
						// 订单被举报过										
						if(!!res.info.violation_blacklisted){
							this.lahestate=true
							this.laheitime=res.violation_blacklisted
						}
						if(!!res.info.violation_fine){
							this.faqianstate=true
							this.faqianjine=res.info.violation_fine
						}
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			headClick(){
				console.log("this.orderData.bound_order_id: ", this.orderData.bound_order_id);
				uni.navigateTo({
					url: "../userUseCarMessage/userUseCarMessage?order_id=" + this.orderData.bound_order_id,
				})
			},
			publish(){
				// 不拉黑
				if(this.ordertype==10){
					this.agreelahe(0)
					return
				}
				var agreestate=1
				if (this.blacklistedSelect != 20) {
					this.blacklisted = this.blacklistedArr[this.blacklistedSelect] * 24 * 3600;
					if(this.blacklisted!=0){
						agreestate=10
					}
				}
				if (this.fineSelect != 20) {
					this.fine = this.fineArr[this.fineSelect] * 100;
				}
				this.dealorder(agreestate,this.fine,this.blacklisted)			
			},
			// 处理举报信息
			dealorder(agreestate,fine,blacklisted){
				var options = {
					url: '/urviolation/punish', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"order_id": this.orderData.id,
						"fine": fine,
						"blacklisted": blacklisted,
						"agree":agreestate
					}
				}
				var _this = this;
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('数据列表：',res);
					if (res.status == 0) {
						uni.showToast({
							title: "处理成功",
							icon: "success",
							duration:2000, 
						})
						uni.navigateBack({
							
						});
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
			// 同意拉黑
			agreelahe(state){
				var options = {
					url: '/urviolation/audit', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"order_id": this.orderData.id,
						"agreed":state
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('拉黑：',res);
					if (res.status == 0) {
						uni.showToast({
							title: "处理成功",
							icon: "success"
						})
						uni.navigateBack({
							
						});
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
			imageClick(e){
				uni.previewImage({
					count: this.imgArr[e],
					urls: this.imgArr,
					success() {
						
					}
				})
			},
			togglePopup(e){
				if(this.ordertype==10){
					// this.dealorder(1,this.faqianjine,this.laheitime)
					this.agreelahe(1)
					return
				}
				this.type = e;
			},
			blackBtnClick(e){
				console.log(e);
				if(this.lahestate){
					uni.showToast({
						title: '该订单已拉黑！',
						icon:'none',
						duration:2000
					});
					return
				}
				if (this.blacklistedSelect == e) {
					this.blacklistedSelect = 20;
				}else{
					this.blacklistedSelect = e;
				}
			},
			fBtnClick(e){
				console.log(e);
				if(this.faqianstate){
					uni.showToast({
						title: '该订单已罚钱！',
						icon:'none',
						duration:2000
					});
					return
				}
				if (this.fineSelect == e) {
					this.fineSelect = 20;
				}else{
					this.fineSelect = e;
				}
			}
		}
	}
</script>

<style lang="scss">
	.main-view{
		width: 100%;
		height: calc(100vh - 160upx);
		overflow-y: auto;
		.head-view{
			background-color: orange;
			width: 100%;
			height: 88upx;
			line-height: 88upx;
			display: flex;
			align-items: center;
			justify-items: center;
			.head-name{
				margin-left: 20upx;
				width: calc(100vw - 30upx - 60upx);
			}
			.head-arrow{
				margin-right: 20upx;
				width: 30upx;
				height: 30upx;
			}
		}
		.violations-view{
			margin-left: 30upx;
			margin-top: 20upx;
			width: calc(100% - 60upx);
			height: 40upx;
		}
		.white-view{
			width: 100%;
			height: 30upx;
		}
		.user-msg-view{
			width: 100%;
			height: auto;
			display: flex;
			align-items: center;
			border-top: 2upx solid #D8D8D8;
			.user-msg-item{
				margin-left: 30upx;
				width: calc(100vw - 100upx);
				height: 88upx;
				line-height: 88upx;
			}
			.arrow{
				margin-right: 20upx;
				width: 30upx;
				height: 30upx;
			}
		}
		.line-view{
			width: 100%;
			height: 2upx;
			background-color: #D8D8D8;
		}
		.image-view{
			margin-left: 30upx;
			margin-top: 30upx;
			width: 140upx;
			height: 140upx;
		}
	}
	.bottom-view{
		display: flex;
		height: 160upx;
		width: 100%;
		background-color: lightgray;
		justify-content: center;
		align-items: center;
		.noPulish{
			margin-left: 30upx;
			margin-right: 30upx;
			height: 88upx;
			width: calc(50vw - 60upx);
			border: 2upx solid #F5A623;
			color: #F5A623;
			border-radius: 10upx;
			text-align: center;
			line-height: 100upx;
			font-size: 36upx;
			background-color: white;
		}
		.pulish{
			background-color: #F5A623;
			margin-left: 30upx;
			margin-right: 30upx;
			height: 100upx;
			width: calc(50vw - 60upx);
			border-radius: 10upx;
			text-align: center;
			line-height: 100upx;
			font-size: 36upx;
		}
	}
	.violationView{
		width: 600upx;
		height: 500upx;
		.title-view{
			text-align: center;
			margin-top: 30upx;
			width: 100%;
			height: 88upx;
			font-size: 38upx;
		}
		.time-view{
			display: flex;
			margin-top: 30upx;
			margin-left: 20upx;
			margin-right: 20upx;
			height: 88upx;
			.t-view{
				width: 130upx;
				height: 70upx;
				line-height: 70upx;
			}
			.f-view{
				margin-left: 20upx;
				width: 120upx;
				height: 70upx;
				line-height: 70upx;
				border: 2upx solid #D8D8D8;
				border-radius: 16upx;
			}
			.f-select-view{
				margin-left: 20upx;
				width: 120upx;
				height: 70upx;
				line-height: 70upx;
				color: #F5A623;
				border: 2upx solid #F5A623;
			}
			.np-view{
				height: 70upx;
				width: calc(50% - 30upx);
				border: 2upx solid #F5A623;
				color: #F5A623;
				border-radius: 10upx;
				text-align: center;
				line-height: 70upx;
				font-size: 36upx;
			}
			.p-view{
				margin-left: 60upx;
				background-color: #F5A623;
				height: 70upx;
				width: calc(50% - 30upx);
				border-radius: 10upx;
				text-align: center;
				line-height: 70upx;
				font-size: 36upx;
			}
		}
	}
</style>
