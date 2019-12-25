<template>
	<view class='wrap'>
		<view class='view-common'>
			<view v-if="type!=14&&type!=99" class='common-item' v-for="(item,i) in repairlist" @click="go(item)">
				<text>{{item.name}}</text>
			</view>
			
			<view v-if="type==14 ||type==99" style='margin-top: 10upx;'>
				<base-input @scanCode='scanCodes()' @goPage='goNewPage' :title='inputval' @hidekeygo='manualsgo'></base-input>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import baseInput from '@/components/baseinput/baseinput.vue'
	export default {
		data() {
			return {
				inputval:"",
				repairlist: [],
				order: {
					length: ''
				},
				type: '',
				userinfo: {},
			}
		},
		components:{
			baseInput
		},
		methods: {
			...mapMutations(['setOrderfirstid', 'setOrderinfo', 'setSn', 'setBikeid', 'setBikeinfo']),
			goNewPage(item){
				this.setSn(item)
				this.getcarinfo()
			},
			manualsgo() {
				this.getcarinfo()
			},
			// 投放市场
			throwin(id) {
				this.setBikeid('*')
				this.setSn('*')
				var options = {
					url: '/binv/launch', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"bike_id": id
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('投放信息', res)
					if (res.status == 0) {
						uni.showToast({
							title: '投放成功',
							mask: false,
							duration: 2500
						});
					} else {
						uni.showToast({
							title: res.message ? res.message : '投放失败',
							mask: false,
							icon: 'none',
							duration: 2500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			scanCodes(){
				this.setBikeid('*')
				console.log('type',this.type)
				wx.scanCode({
					onlyFromCamera: true,
					success: res => {
						console.log('saoma', res)
						var bikesn = res.result.match(/\?bikesn=(.*)/)[1]
						this.setSn(bikesn)
						this.inputval=bikesn
						if(this.type==99){
							if (this.type == '99') {
								uni.navigateTo({
									url: "/pages/violations/reportViolations/reportViolations",
									success: res => {},
									fail: () => {},
									complete: () => {}
								});
								return
							}
						}
						setTimeout(()=>{
							this.getcarinfo()
						},500)
					
					},
					fail: res => {
								 
					}
				})
			},
			// 获取二级菜单权限
			geturl() {
				var templist = []
				var acl = this.userinfo.acl.children
				for (let i = 0; i < acl.length; i++) {
					var type = acl[i].uri
					var chids = acl[i].children
					var tempobj = {}
					if (this.type == type) {
						switch (type) {
							case '1':
								for (let j = 0; j < chids.length; j++) {
									console.log('debugger', j, this.repairlist)
									if (chids[j].visitable == 1) {
										tempobj = {}
										switch (chids[j].uri) {
											case '1.0':
												tempobj = {
													name: '维修入库',
													val: '',
													url: '/pages/map/map?text=全部故障车辆&type=1.1&name=维修',
												}
												templist.push(tempobj)
												break
											case '1.1':
												tempobj = {
													name: '修车',
													val: '',
													// url: '/pages/map/map?text=全部故障车辆&type=1.3&name=维修',
													url: '/pages/repairPage/repairenter/repairenter',
												}
												templist.push(tempobj)
												break
										}

									}
								}
								break
							case '3':
								for (let j = 0; j < chids.length; j++) {
									if (chids[j].visitable == 1) {
										tempobj = {}
										switch (chids[j].uri) {
											case '3.0':
												tempobj = {
													name: '车站挪车',
													val: '',
													url: '/pages/map/map?text=全部车站&type=3.1&name=挪车',
												}
												templist.push(tempobj)
												break
											case '3.1':
												tempobj = {
													name: '挪车记录',
													val: '',
													url: '/pages/movecarPage/removecarrecord/removecarrecord',
												}
												templist.push(tempobj)
												break
										}

									}
								}
								break
							case '8':
								for (let j = 0; j < chids.length; j++) {
									if (chids[j].visitable == 1) {
										tempobj = {}
										switch (chids[j].uri) {
											case '8.0':
												tempobj = {
													name: '入库',
													val: '',
													url: `/pages/stockPage/putstorage/putstorage?type=0`,
												}
												templist.push(tempobj)
												break
											case '8.1':
												tempobj = {
													name: '投放',
													val: '',
													url: '/pages/map/map?text=全部故障车辆&type=1.1&name=维修',
												}
												templist.push(tempobj)
												break
										}
									}
								}
								tempobj = {
									name: '发货',
									val: '',
									url: '',
								}
								templist.push(tempobj)
								tempobj = {
									name: '车辆列表',
									val: '',
									url: '/pages/stockPage/bikelist/bikelist',
								}
								templist.push(tempobj)
								tempobj = {
									name: '删除',
									val: '',
									url: '/pages/stockPage/bikelist/bikelist',
								}
								templist.push(tempobj)
								break
							case '10':
								for (let j = 0; j < chids.length; j++) {
									if (chids[j].visitable == 1) {
										tempobj = {}
										switch (chids[j].uri) {
											case '10.1':
												tempobj = {
													name: '举报',
													val: '',
													url: '/pages/violations/reportViolations/reportViolations',
												}
												templist.push(tempobj)
												break
											case '10.2':
												tempobj = {
													name: '处理',
													val: '',
													url: '/pages/violations/reportViolationsList/reportViolationsList?type=0',
												}
												templist.push(tempobj)
												break
											case '10.3':
												tempobj = {
													name: '违章审核',
													val: '',
													url: '/pages/violations/reportViolationsList/reportViolationsList?type=10',
												}
												templist.push(tempobj)
												break	
										}
									}
								}
								// tempobj = {
								// 	name: '违章审核',
								// 	val: '',
								// 	url: '/pages/violations/reportViolationsList/reportViolationsList?type=10',
								// }
								// templist.push(tempobj)
								break
							case '11':
								for (let j = 0; j < chids.length; j++) {
									if (chids[j].visitable == 1) {
										tempobj = {}
										switch (chids[j].uri) {
											case '11.0':
												tempobj = {
													name: '车辆疑似被盗',
													val: '',
													url: '/pages/investCarPage/investview/investview?type=0',
												}
												templist.push(tempobj)
												break
											case '11.1':
												tempobj = {
													name: '车辆疑似报修',
													val: '',
													url: '/pages/investCarPage/investview/investview?type=1',
												}
												templist.push(tempobj)
												break
											case '11.2':
												tempobj = {
													name: '车辆疑似失联',
													val: '',
													url: '/pages/investCarPage/investview/investview?type=2',
												}
												templist.push(tempobj)
												break
										}
									}
								}
								break
							case '12':
								templist = [{
									name: '扫码输入',
									val: '',
									url: '',
								}]
								break
							case '13':
								templist = [{
										name: '换二维码',
										val: '1',
										url: '',
									},
									{
										name: '换ecu',
										val: '2',
										url: '',
									},
								]
								break
							case '14':
								templist = [{
										name: '手动输入',
										val: '',
										url: '/pages/manualscan/manualscan?urls=/pages/endOrder/endorder/endorder&type=14',
									},
									{
										name: '扫码输入',
										val: '',
										url: '',
									},
								]
								break
						}
					}
				}
				this.repairlist = templist
			},
			// 获取车辆信息
			getcarinfo(id,name) {
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
						if (this.type == '99') {
							uni.navigateTo({
								url: "/pages/violations/reportViolations/reportViolations",
								success: res => {},
								fail: () => {},
								complete: () => {}
							});
						}
						else if(this.type=='14'){
							uni.navigateTo({
								url: "/pages/endOrder/endorder/endorder",
								success: res => {},
								fail: () => {},
								complete: () => {}
							});
						}else if(this.type=='8'){
							if(name=='发货'){
								this.setSn('*')
								this.setBikeid('*')
								this.deliver(res.info.id)
							}else if(name=='删除'){
								this.setSn('*')
								this.delbike(res.info.id)
							}
							else {
								this.throwin(res.info.id)
							}
							
						}
						 
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
			// 发货
			deliver(id) {
				var options = {
					url: '/binv/deliver', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						bike_id:id
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					if (res.status == 0) {
						uni.showToast({
							title: '车辆运输中',
							duration:1500
						});
					} else {
						uni.showToast({
							title: res.message ? res.message : '失败',
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
			go(item) {
				console.log('type', this.type)
				if (this.type == '8') {
					if(item.name=='发货'){
						wx.scanCode({
							onlyFromCamera: true, //只允许相机扫码
							success: res => {
								var bikesn = res.result.match(/\?bikesn=(.*)/)[1]
								this.setSn(bikesn)
								this.setBikeid('*')
								this.getcarinfo(bikesn,item.name)								
							},
							fail: res => {
						
							}
						})
					}
					else if(item.name=='投放'){
						wx.scanCode({
							onlyFromCamera: true, //只允许相机扫码
							success: res => {
								var bikesn = res.result.match(/\?bikesn=(.*)/)[1]
								// this.throwin(bikesn)
								this.setSn(bikesn)
								this.getcarinfo()
							},
							fail: res => {
						
							}
						})
					}
					else if (item.name=='删除'){
						wx.scanCode({
							onlyFromCamera: true, //只允许相机扫码
							success: res => {
								var bikesn = res.result.match(/\?bikesn=(.*)/)[1]
								// this.throwin(bikesn)
								this.setSn(bikesn)
								this.getcarinfo(bikesn,item.name)
								// this.delbike(bikesn)
							},
							fail: res => {
						
							}
						})
					}
					else{
						uni.navigateTo({
							url: item.url,
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
					}					
					
				} else if (this.type == '10' && item.name == '举报') {
					this.type=99
					// this.repairlist = [{
					// 		name: '手动输入',
					// 		val: '',
					// 		url: `/pages/manualscan/manualscan?urls=/pages/violations/reportViolations/reportViolations&&type=10`
					// 	},
					// 	{
					// 		name: '扫码输入',
					// 		val: '',
					// 		url: `/pages/manualscan/manualscan?urls=/pages/violations/reportViolations/reportViolations&&type=10`
					// 	},
					// ]
				} else if (this.type == '10' && item.name == '扫码输入') {
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

				} else if (this.type == '12') {
					wx.scanCode({
						onlyFromCamera: true, //只允许相机扫码
						success: res => {
							console.log(res, 'res')
							var result = res.result.split(' ')
							console.log(result, 'result')
							var imei = result[0].split(':')[1]
							uni.navigateTo({
								url: `/pages/ecutest/ecutest?imei=${imei}`,
								success: res => {},
								fail: () => {},
								complete: () => {}
							});
						},
						fail: res => {},
						complete: res => {}
					});
				} else if (this.type == '13') {
					uni.navigateTo({
						url: `/pages/stockPage/putstorage/putstorage?type=${item.val}`,
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}else if (this.type == '14' && item.name == '扫码输入') {
				 	wx.scanCode({
				 		onlyFromCamera: true,
				 		success: res => {
				 			console.log('saoma', res)
				 			var bikesn = res.result.match(/\?bikesn=(.*)/)[1]
				 			this.setSn(bikesn)
							this.setBikeid('*')
				 			this.getcarinfo()
				 		},
				 		fail: res => {
				 
				 		}
				 	})
				 } 
				 else {
					uni.navigateTo({
						url: item.url,
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}

			},
			delbike(item){
				uni.showModal({
					title: '删除车辆',
					content: `确认删除车${item}`,
					// showCancel: false,
					cancelText: '取消',
					confirmText: '确认',
					success: res => {
						if(res.confirm){
							this.setBikeid(item)
							var options = {
								url: '/binv/del', //请求接口
								method: 'POST', //请求方法全部大写，默认GET
								context: '',
								data: {
								}
							}
							this.$httpReq(options).then((res) => {
								// 请求成功的回调
								// res为服务端返回数据的根对象
								console.log('车辆列表', res)
								this.allnumber=res.total
								if (res.status == 0) {
									uni.showToast({
										title: '删除成功'
									});
								} else {
									uni.showToast({
										title: '删除失败'
									});
								}
							}).catch((err) => {
								// 请求失败的回调
								console.error(err, '捕捉')
							})
						}
					},
					fail: () => {},
					complete: () => {}
				});
				
			},
			// ecu解绑
			ecuunbind(id) {
				var options = {
					url: '/bike/unbind_ecu', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						sk:id,
						// "bike_id": id,
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('ecu解绑', res)
					if (res.status == 0) {
						uni.showToast({
							title: '解绑成功',
							mask: false,
							icon: 'none',
							duration: 3000
						});
						this.stoplist(this.longitude, this.latitude, '*')
					} else {
						uni.showToast({
							title: res.message ? res.message : '解绑失败',
							mask: false,
							icon: 'none',
							duration: 3000
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			requestorder(data, item) {
				let options = {
					url: '/brorder/list',
					method: 'POST',
					data: data
				}
				this.$httpReq(options).then((res) => {
					console.log('订单列表', res, res.list.length)
					if (res.status == 0 && res.list.length != 0) {
						this.setOrderfirstid(res.list[0].id)
						this.setOrderinfo(res.list[0])
						uni.navigateTo({
							url: item.url,
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
						this.order = {
							length: res.list.length,
							id: res.list[0].id
						}
					} else {
						uni.showToast({
							title: '查询订单失败！'
						});
					}
				})
			},
		},
		onLoad(e) {
			wx.setNavigationBarTitle({
				title: e.name
			})
			try {
				const value = uni.getStorageSync('userinfo');
				if (value) {
					this.userinfo = value
				}
			} catch (e) {
				// error
			}
			this.type = e.type
			switch (e.type) {
				case '1':
					this.repairlist = [{
							name: '维修入库',
							val: '',
							url: '/pages/map/map?text=全部故障车辆&type=1.1&name=维修',
						},
						{
							name: '修车',
							val: '',
							// url: '/pages/map/map?text=全部故障车辆&type=1.3&name=维修',
							url: '/pages/repairPage/repairenter/repairenter',
						},
					]
					break;
				case '3':
					this.repairlist = [{
							name: '车站挪车',
							val: '',
							url: '/pages/map/map?text=全部车站&type=3.1&name=挪车',
						},
						{
							name: '挪车记录',
							val: '',
							url: '/pages/movecarPage/removecarrecord/removecarrecord',
						}
					]
					break;
				case '8':
					this.repairlist = [{
							name: '手动输入',
							val: '',
							url: `/pages/manualscan/manualscan?urls=/pages/stockPage/stockmanage/stockmanage&&type=8`,
						},
						{
							name: '扫码投放',
							val: '',
							url: '/pages/movecarPage/removecarrecord/removecarrecord',
						}
					]
					break;
				case '10':
					this.repairlist = [{
							name: '违章骑行',
							val: '',
						},
						{
							name: '举报',
							val: '',
							url: '/pages/violations/reportViolations/reportViolations',
						},
						{
							name: '处理',
							val: '',
							url: '/pages/violations/reportViolationsList/reportViolationsList',
						}
					]
					break;
				case '11':
					this.repairlist = [{
							name: '车辆疑似被盗',
							val: '',
							url: '/pages/investCarPage/investview/investview?type=0',
						},
						{
							name: '车辆疑似报修',
							val: '',
							url: '/pages/investCarPage/investview/investview?type=1',
						},
						{
							name: '车辆疑似失联',
							val: '',
							url: '/pages/investCarPage/investview/investview?type=2',
						}
					]
					break;
			}

			this.geturl()
		}
	}
</script>

<style lang='scss'>
	.wrap {
		background-color: rgb(245, 245, 245);
		padding-top: 1upx;
		padding-bottom: 1upx;
		/* height: 100vh; */
		overflow: hidden;

		/* margin-bottom: 20upx; */
		.view-common {
			margin: 30upx 22upx;
			height: 98vh;
			position: relative;

			.common-item {
				background-color: white;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				margin-bottom: 20upx;
			}
		}
	}
</style>
