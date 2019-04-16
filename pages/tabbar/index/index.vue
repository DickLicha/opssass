<template>
	<view class='wrap'>
		<view class='map-view-button'>
			<text @click='goMap'>请勿骑出服务区，否则会断电</text>
		</view>
		<view class='scan-code' @click='scanCode'>
			<view class='scan-code-view'><text>扫码用车</text></view>
		</view>
		<view class='scan-code' @click='test'>
			<view class='scan-code-view'><text>test</text></view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		methods: {
			goMap() {
				uni.navigateTo({
					url: '/pages/map/map'
				});
				// uni.navigateTo({ url: '/pages/quotes_sub/open_close/open_close?pinkaiC='+val+'&code='+this.resObj.stockCode})
			},
			scanCode() {
				uni.scanCode({
					onlyFromCamera: true, //只允许相机扫码
					success: function(res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
					},
					fail: function(res) {

					},
					complete: function(res) {

					}
				});
			},
			test() {
				let nameinfo={
					name:'qhs',
					age:18
				}
				console.log(33333,nameinfo)
				// #ifdef APP-PLUS
				// 监听plusready事件  
				// document.addEventListener("plusready", function() {
				// 扩展API加载完毕，现在可以正常调用扩展API
				plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function(addressbook) {
					// 可通过addressbook进行通讯录操作
					// 向通讯录中添加联系人
					var contact = addressbook.create();
					contact.name = {
						givenName: "啊啊"
					};
					contact.phoneNumbers = [{
						type: "手机",
						value: "88888888",
						preferred: true
					}];
					contact.save();
					console.log('addressbook', addressbook)
				}, function(e) {
					console.log("Get address book failed: " + e.message);
				});
				// }, false);
				// #endif
				// 				uni.navigateTo({
				// 					url: '/pages/test/test'
				// 				});
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		position: relative;
		height: calc(100vh - 30upx);
		background-color: rgb(245, 245, 245);
		padding-top: 30upx;

		.map-view-button {
			color: rgb(246, 199, 0);
			text-align: center;
			width: 90%;
			height: 80upx;
			margin: 0upx 5% 10px 5%;
			line-height: 80upx;
			background-color: white;
		}

		.scan-code {
			margin-top: 80upx;
			text-align: center;
			display: flex;
			justify-content: center;

			.scan-code-view {
				width: 80%;
				border-radius: 20upx;
				background-color: #F6C700;
				height: 80upx;
				line-height: 80upx;
			}
		}
	}
</style>
