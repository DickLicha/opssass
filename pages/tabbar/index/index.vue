<template>
	<view class='wrap'>
		<!-- <baseheader title="餐厅"></baseheader> -->
		<!-- <view class='map-view-button'>
			<text @click='goMap'>请勿骑出服务区，否则会断电</text>
		</view>
		<view class='scan-code' @click='scanCode'>
			<view class='scan-code-view'><text>扫码用车</text></view>
		</view>
		<view class='scan-code' @click='test'>
			<view class='scan-code-view'><text>test</text></view>
		</view> -->
		<view class='common-base-view'>
			<view class='task-view' v-for="item in taskdata" @click='go(item.url,item.name)'>
				<view class='task-view-img'><i class="iconfont icondanche"></i></view>
				<view class='task-view-text'><text>{{item.name}}</text></view>
			</view>
		</view>

	</view>
</template>

<script>
	import baseheader from '@/components/baseheadview/baseheadview.vue'
	export default {
		components: {
			baseheader
		},
		onLoad(){
			this.getconfinfo()
			},
		data() {
			return {
				taskdata: [{
						name: '换电',
						img: '',
						url: ''
					},
					{
						name: '维修',
						img: '',
						url: ''
					},
					{
						name: '保养',
						img: '',
						url: ''
					},
					{
						name: '单个挪车',
						img: '',
						url: ''
					},
					{
						name: '批量挪车',
						img: '',
						url: ''
					},
					{
						name: 'ECU换绑',
						img: '',
						url: ''
					},
					{
						name: 'ECU绑定',
						img: '',
						url: ''
					},
					{
						name: '换电批次',
						img: '',
						url: ''
					},
					{
						name: '找不到车',
						img: '',
						url: ''
					},
					{
						name: '批量开关锁',
						img: '',
						url: ''
					},
					{
						name: '库存管理',
						img: '',
						url: ''
					},
					{
						name: '车站',
						img: '',
						url: ''
					},
					{
						name: '违章',
						img: '',
						url: ''
					},
					{
						name: '车辆排查',
						img: '',
						url: ''
					},
					{
						name: '车辆换绑',
						img: '',
						url: ''
					},
				]

			};
		},
		methods: {
			goMap(url, name) {
				uni.navigateTo({
					url: '/pages/map/map'
				});
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
			go(url, name) {
				uni.navigateTo({
					url: '/pages/map/map?name=' + name
				});
			},
			test() {
				let nameinfo = {
					name: 'qhs',
					age: 18
				}
				console.log(33333, nameinfo)
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
			},
			// 获取配置信息
			getconfinfo() {
				var options = {
					url: '/svcarea/list', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"token": "xxxx",
						"city_id": "35000",
						// "state": -1,
						"pno": 0,
						"psize": 10,
						"sk": ""
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('用户信息', res)
					if (res.status) {
						this.setsoftconf(res.data)
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
		}
	}
</script>

<style lang="scss">
	.wrap {
		position: relative;
		height: calc(200vh);
		background-color: rgb(245, 245, 245);
		padding-top: 1upx;

		.common-base-view {
			display: flex;
			justify-content: space-between;
			padding-top: 15upx;
			flex-wrap: wrap;
			margin: 0 20upx;
			text-align: center;

			.task-view {
				height: 22vh;
				width: 46%;
				background-color: white;
				border-radius: 8upx;
				margin: 15upx 12upx;

				.task-view-img {
					height: 100upx;
					width: 100%;
					margin-top: 50upx;
				}

				.task-view-text {
					margin-top: 24upx;
				}
			}
		}

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
