<template>
	<view class='wrap'>
		<view class='common-base-view'>
			<view class='task-view' v-for="(item,i) in taskdata" @click='go(item,i)'>
				<!-- <view class='task-view-img'><i class="iconfont icondanche" style='font-size: 70upx;'></i></view> -->
				<view class='task-view-img'>
					<image class="" style='width:120upx;height: 120upx;' :src='item.src'></image>
					</view>
				<view class='task-view-text'><text>{{item.name}}</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default {
		onLoad(){
			this.getconfinfo()
			this.getdirectinfo()
			},
		data() {
			return {
				taskdata: [{
						name: '换电',
						url: '/pages/map/map',
						text:'全部待换电',
						src:'../../../static/image/huan_dian.png',
						index:0
					},
					{
						name: '维修',
						url: '/pages/repairlist/repairlist',
						text:'全部故障车辆',
						src:'../../../static/image/wei_xiu.png',
						index:1
					},
					{
						name: '保养',
						url: '/pages/repairlist/repairlist',
						text:'待保养车辆',
						src:'../../../static/image/bao_yang.png',
						index:2
					},
					{
						name: '单个挪车',
						url: '/pages/repairlist/repairlist',
						text:'全部车站',
						src:'../../../static/image/nuo_che.png',
						index:3
					},
					{
						name: 'ECU换绑',
						url: '/pages/map/map',
						text:'',
						src:'../../../static/image/ecu_huanban.png',
						index:4
					},
					{
						name: 'ECU绑定',
						url: '/pages/map/map',
						text:'',
						src:'../../../static/image/ban_ding.png',
						index:5,
					},
					{
						name: '找不到车',
						url: '/pages/map/map',
						text:'',
						src:'../../../static/image/zhao_budao.png',
						index:6
					},
					{
						name: '批量开关锁',
						url: '/pages/map/map',
						text:'',
						src:'../../../static/image/kai_guan.png',
						index:7
					},
					{
						name: '库存管理',
						url: '/pages/repairlist/repairlist',
						text:'',
						src:'../../../static/image/ku_cun.png',
						index:8
					},
					{
						name: '车站',
						url: '/pages/map/map',
						text:'全部车站',
						src:'../../../static/image/che_zhan.png',
						index:9
					},
					{
						name: '违章',
						url: '/pages/map/map',
						text:'',
						src:'../../../static/image/wei_zhang.png',
						index:10
					},
					{
						name: '车辆排查',
						url: '/pages/map/map',
						text:'',
						src:'../../../static/image/pai_cha.png',
						index:11
					},
					{
						name: '车辆换绑',
						url: '/pages/map/map',
						text:'',
						src:'../../../static/image/huan_ban.png',
						index:12
					},
				]

			};
		},
		methods: {
			...mapMutations(['setDirectinfo','setSoftconf']),
			// 获取字典配置信息
			getdirectinfo() {
				var options = {
					url: '/config/direct', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data:''
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('字典信息',res)
					if(res.status==0){
						this.setDirectinfo(res.direct)
					}					
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 扫码
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
			go(item,i) {
				uni.navigateTo({
					// url: '/pages/map/map?name=' + name
					url: `${item.url}?name=${item.name}&type=${item.index}&text=${item.text}`
				});
			},
			test() {
				let nameinfo = {
					name: 'qhs',
					age: 18
				}
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
					console.log('用户信息', typeof(res),res)
					if (res.status==0) {
						this.setSoftconf(res.data)
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
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
