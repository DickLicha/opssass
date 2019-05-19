<template>
	<view class='wrap'>
		<view class='view-common'>
			<view class='common-item' v-for="(item,i) in repairlist" @click="go(item)">
				<text>{{item.name}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				repairlist: [],
				order: {
					length: ''
				},
				type:'',
			}
		},
		methods: {
			...mapMutations(['setOrderfirstid', 'setOrderinfo','setSn','setBikeid','setBikeinfo']),
			// 投放市场
			throwin(id) {
				var options = {
					url: '/binv/launch', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"bike_id":id 
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('投放信息',res)
					if (res.status == 0) {
						uni.showToast({
							title: '投放成功',
							mask: false,
							duration: 1500
						});
					} else {
						uni.showToast({
							title: res.message?res.message:'投放失败',
							mask: false,
							duration: 1500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
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
							url: "/pages/stockPage/stockmanage/stockmanage",
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
					} else {
						uni.showToast({
							title: res.message ? res.message : '获取车辆信息失败',
							mask: false,
							duration: 1500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			go(item) {
				if(this.type=='8' && item.name=='扫码输入'){				
					uni.scanCode({
						onlyFromCamera: true, //只允许相机扫码
						success:res=>{
							var bikesn=res.result.match(/\?bikesn=(.*)/)[1]
							this.throwin(bikesn)
						},
						fail:res=>{
							
						}
					})
					
				}else{
					uni.navigateTo({
						url: item.url,
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}
				
			},
			requestorder(data, item) {
				let options = {
					url: '/brorder/list',
					method: 'POST',
					data: data
				}
				this.$httpReq(options).then((res) => {
					console.log('订单列表', res)
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
					}
				})
			},
		},
		onLoad(e) {
			wx.setNavigationBarTitle({
				title: e.name
			})
			this.type=e.type
			switch (e.type) {
				case '1':
					this.repairlist = [{
							name: '维修入库',
							val:'',
							url: '/pages/map/map?text=全部故障车辆&type=1.1&name=维修',
						},
						// {
						// 	name: '报修',
						// 	url: '/pages/carBigCenter/breakdowncar/breakdowncar',
						// },
						{
							name: '修车',
							val:'',
							// url: '/pages/map/map?text=全部故障车辆&type=1.3&name=维修',
							url: '/pages/repairPage/repairenter/repairenter',
						},
					]
					break;
				case '2':
					this.repairlist = [{
							name: '常规保养',
							val: '',
							url:'',
						},
						{
							name: '异常保养',
							val: '',
							url:''
						}
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
							name: '扫码输入',
							val: '',
							url: '/pages/movecarPage/removecarrecord/removecarrecord',
						}
					]
					break;
			}
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
