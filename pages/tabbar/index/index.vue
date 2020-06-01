<template>
	<view class='wrap'>
		<view class='head-view'>
			<image class='scan-img' @click="scaninto" src='/static/image/scan2x.png'></image>
			<text class='head-view-text'>{{headtitle}}</text>
		</view>
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
	import {
		mapState,
		mapMutations
	} from 'vuex'
	// import ble from '../../../common/xa-bluetooth.js'
	export default {
		onLoad() {			
		},
		computed: mapState(['userinfo', 'blueres']),
		onShow() {			
			this.taskdata = []
			var acl = []
			uni.getStorage({
				key: 'userinfo',
				success: res => {
					this.headtitle=res.data.cities[0].name || '未知城市'
					acl = res.data.acl.children
					var onlyid = '',
						tempobj = {},
						src = '',
						name = '',
						url = '',
						text = ''
					for (let i = 0; i < acl.length; i++) {
						if (acl[i].visitable == 1) {
							onlyid = parseInt(acl[i].uri)
							switch (onlyid) {
								case 0:
									src = require('../../../static/image/huan_dian.png')
									name = '换电'
									url = '/pages/map/map'
									text = '全部待换电'
									break
								case 1:
									name = '维修'
									url = '/pages/repairlist/repairlist'
									text = '全部故障车辆'
									src = require('../../../static/image/wei_xiu.png')
									break
								case 2:
									name = '保养'
									url = '/pages/map/map'
									text = '待保养车辆'
									src = require('../../../static/image/bao_yang.png')
									break
								case 3:
									name = '单个挪车'
									// url = '/pages/repairlist/repairlist'
									url = '/pages/map/map?text=全部车辆&type=3.1&name=挪车'
									text = '全部车辆'
									src = require('../../../static/image/nuo_che.png')
									break
								case 8:
									name = '库存管理'
									url = '/pages/repairlist/repairlist'
									text = ''
									src = require('../../../static/image/ku_cun.png')
									break
								case 9:
									name = '车站'
									url = '/pages/map/map'
									text = '全部车站'
									src = require('../../../static/image/che_zhan.png')
									break
								case 10:
									name = '违章'
									url = '/pages/repairlist/repairlist'
									text = ''
									src = require('../../../static/image/wei_zhang.png')
									break
								case 11:
									name = '车辆排查'
									url = '/pages/repairlist/repairlist'
									text = ''
									src = require('../../../static/image/pai_cha.png')
									break
								case 12:
									name = 'ecu检测'
									url = '/pages/ecutest/ecutest'
									text = ''
									src = require('../../../static/image/pai_cha.png')
									break
								case 13:
									name = 'ecu换绑'
									url = '/pages/repairlist/repairlist'
									text = ''
									src = require('../../../static/image/ecu_huanban.png')
									break
								case 14:
									name = '结束订单'
									url = '/pages/repairlist/repairlist'
									text = ''
									src = require('../../../static/image/che_zhan.png')
									break
								case 15:
									name = '仪表盘'
									url = '/pages/echartPage/echartpage/echartpage'
									text = ''
									src = require('../../../static/image/che_zhan.png')
									break	
							}
							tempobj = {
								index: onlyid,
								src: src,
								name: name,
								url: url,
								text: text
							}
							this.taskdata.push(tempobj)
						}
					}
				},
				fail:res=>{
					console.log('fail',res)
					uni.reLaunch({
						url: '/pages/mine/loginView/loginView',
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}
			})
			this.getdirectinfo()	
		},
		data() {
			return {
				taskdata: [],
				headtitle:'首页'
			};
		},
		methods: {
			...mapMutations(['setDirectinfo', 'setSn', 'setBikeid', 'setBikeinfo', 'setBlueres']),
			
			scaninto() {
				wx.scanCode({
					onlyFromCamera: true, //只允许相机扫码
					success: res => {
						console.log('saoma', res)
						var bikesn = res.result.match(/\?bikesn=(.*)/)[1]
						this.setSn(bikesn)
						this.setBikeid('*')
						this.getcarinfo()
					},
					fail: res => {},
					complete: res => {}
				});
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
							url: '/pages/swapbattery/swapbattery?type=0',
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
			// 获取字典配置信息
			getdirectinfo() {
				var options = {
					url: '/config/direct', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						version:'1.0.71',
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('字典信息', res)
					if (res.status == 0) {
						this.setDirectinfo(res.direct)
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			go(item, i) {
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
					console.log('用户信息', typeof(res), res)
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

<style lang="scss" scoped>
	.wrap {
		// position: relative;
		height: calc(160vh);
		background-color: rgb(245, 245, 245);
		padding-top: 1upx;
		overflow-y: hidden;

		.head-view {
			height: 140upx;
			background-color: white;
			position: fixed;
			top: 0;
			width: 100%;

			.scan-img {
				position: absolute;
				top: 70upx;
				left: 40upx;
				height: 44upx;
				width: 44upx;
			}

			.head-view-text {
				position: absolute;
				top: 70upx;
				left: 47%;
			}
		}

		.common-base-view {
			display: flex;
			justify-content: space-between;
			padding-top: 160upx;
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
