<template>
	<view class='wrap'>	
		<view class='view-common'>
			<view class='ecutitle'>
				<text>当前车辆编号:</text>
				<!-- <input type="text" v-model="imei"> -->
				<text>{{imei}}</text>
			</view>
			<!-- <view class="uni-list">
				<view class="uni-list-cell uni-list-cell-pd base-tarbar">
					<view class="uni-list-cell-db">{{bleornet}}</view>
					<switch @change="switch1Change" checked />
				</view>
			</view> -->
			
			<view >
				<view class="uni-list-cell uni-list-cell-pd">
					<view class='but-border' :class="{'selecttype':bleornet=='网络开'}"><text @click="changetype('网络开')" >网络</text></view>
					<view class='but-border' :class="{'selecttype':bleornet=='蓝牙开'}"><text @click="changetype('蓝牙开')" >蓝牙</text></view>	
				</view>
			</view>
			
			<view class='common-item' v-for="(item,i) in repairlist" @click="go(item)">
				<text>{{item.name}}</text>
			</view>
			<button type='primary' class='share-button-default' @click="scancode">扫码</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import ble from '@/common/xa-bluetooth.js'
	export default {
		data() {
			return {
				bleornet: '网络开',
				repairlist: [{
						name: '开锁',
						val: '0',
						url: '/ecutest/unlock',
						oper: 'dmopen',
						xiao1:'20',
						xiao2:'01'
					},
					{
						name: '关锁',
						val: '1',
						url: '/ecutest/lock',
						oper: 'close',
						xiao1:'20',
						xiao2:'00'
					},
					{
						name: '关电门',
						val: '2',
						url: '/ecutest/acc_off',
						oper: 'dmclose',
						xiao1:'27',
						xiao2:'00'
					},
					{
						name: '开电门',
						val: '3',
						url: '/ecutest/acc_on',
						oper: 'open',
						xiao1:'27',
						xiao2:'01'
					},
					{
						name: '开电池锁',
						val: '4',
						url: '/ecutest/battery_unlock',
						oper: 'dianchisuo',
						xiao1:'34',
						xiao2:'01'
					},
					{
						name: '播放语音',
						val: '5',
						url: '/ecutest/voice',
						oper: 'ring',
						xiao1:'28',
						xiao2:'09'
					},
					{
						name: '重启',
						val: '5',
						url: '/ecutest/voice',
						oper: 'reboot',
						xiao1:'26',
						xiao2:''
					},
					// {
					// 	name: '批量测试',
					// 	val: '6',
					// 	url: '/ecutest/bat',
					// 	oper: 'other',
					// },
				],
				order: {
					length: ''
				},
				type: '',
				userinfo: {},
				imei: '',
				isble: false,
				// 通过ecu码规则判断类型
				ecutype: '',
				bikeinfo:'',
			}
		},
		methods: {
			...mapMutations(['setOrderfirstid', 'setOrderinfo', 'setSn', 'setBikeid', 'setBikeinfo']),
			changetype(type){
				this.bleornet = type
				if(type=='蓝牙开'){
					if(this.blueconectstate!=1){
						if(!!this.bikeinfo){
							this.initble(this.bikeinfo)
						}						
					}
				}
			},
			// 通过sn获取车辆信息
			getbikeinfobysn(sn) {
				this.setSn('*')
				this.setBikeid('*')
				var options = {
					url: '/ecutest/info', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"sk":sn,
						// "imei": '',
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('车辆信息', res)
					if (res.status == 0 && !!res.info.bluetooth_token) {
						this.isble = true
						this.bikeinfo=res.info
						this.initble(res.info)
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			//上报蓝牙操作
			reportblue(state, loadtime, errname) {
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						var options = {
							url: '/bike/report_bluetooth_oper', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								// "token": "xxx",
								"bike_id": this.bikeinfo.id,
								"bound_order_type": "BIKE_BATTERY_RECHANGE", //绑定订单类型， USER_RIDE =用户骑行订单，BIKE_REPARK=挪车订单，BIKE_BATTERY_RECHANGE=换电订单，
								"bound_order_id": this.orderid,
								"bound_order_op": "换电开锁", //骑行开锁，骑行关锁，挪车开锁，挪车关锁，换电开锁 。。。,
								"type": 21, //10=关锁，11=开锁，21=开电池锁,
								"result": { //操作结果
									"success": state, //0=成功， 其他值失败
									"cost": loadtime, //耗时 1000毫秒
									"error_msg": errname //错误信息
								},
								"user_coordinate": [res.longitude, res.latitude]
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('上报接口', res)
							if (res.status == 0) {}
						}).catch((err) => {
							// 请求失败的回调
							console.error(err, '捕捉')
						})
					},
					fail: () => {},
					complete: () => {
						uni.hideLoading()
					}
				});
			},
			// 初始化蓝牙
			initble(bikeinfo) {
				var _self = this
				// 初始化
				ble.initBluetooth(bikeinfo, (res) => {
					// _self.setBlueres(res)
					if (!!bikeinfo.bluetooth_token) {
						var str1 = ble.doCmd('32', '', bikeinfo.bluetooth_token)
						setTimeout(() => {
							// ble.openLock(str1, res.deviceId, res.serviceId, res.characterId, function(ress) {
							ble.openLock(str1, '', function(ress) {
								console.log('蓝牙操作', ress)
							})
						}, 0);
					}
				})
				ble.onBluetoothAdapterStateChange(function(res) {
					console.log('回调', res)
					if (res.available == true && res.discovering == false && _self.bluestate == false) {
						ble.initBluetooth(bikeinfo, (res) => {
							// _self.setBlueres(res)
						})
					}
				})
				ble.onBLEConnectionStateChange(function(res){
					console.log('蓝牙连接状态变化回调', res)
					if(res.connected==false){
						uni.showToast({
							title: '连接断开请重连',
							duration: 2000,
						})
					}
				})
				if (this.isble) {
					ble.onBLECharacteristicValueChange((res) => {
						console.log('特征值返回', res)
						// 泰币特类型
						if (_self.bikeinfo.ecu_model == "WA-209D") {
							if (res.name == '连接成功') {

							} else if (res.name == '开锁成功') {
								// blueWriteState = 1
								// _self.reportblue(0, loadtime, '')
							} else if (res.name == '上锁成功') {
								// blueWriteState = 1
								// _self.reportblue(0, loadtime, '')
							} else if (res.name == '电池锁打开成功') {
								// blueWriteState = 1
								// _self.reportblue(0, loadtime, '')
							}

						}
					})
				}
			},
			go(item) {
				if (this.imei == '') {
					uni.showToast({
						title: '请先扫码',
						duration: 2000,
					})
					return
				}
				uni.showLoading({
					title: `${item.name}中`
				});
				var index = '*'
				// 播放语音
				if (item.val == '5') {
					index = 1
				}
				// 走网络
				if (this.bleornet=='网络开') {
					var datas = {}
					if (this.ecutype == 'WA-209D') {
						datas = {
							imei: '',
							sn: this.imei,
							index: index,
							ecu_model:this.ecutype
						}
					} else {
						datas = {
							imei: this.imei,
							sn: '',
							index: index,
							ecu_model:this.ecutype
						}
					}
					let options = {
						url: item.url,
						method: 'POST',
						data: datas
					}
					this.$httpReq(options).then((res) => {
						console.log('测试', res)
						uni.hideLoading()
						if (res.status == 0) {
							uni.showToast({
								title: `成功`,
								icon: 'none',
								duration: 3000
							});
						} else {
							uni.showToast({
								title: res.message ? res.message : '失败',
								icon: 'none',
								duration: 3000
							});
						}
					})
				}
				// 走蓝牙
				else {
					setTimeout(() => {
						uni.hideLoading()
					}, 2000)
					if(this.ecutype == 'WA-209D'){
						console.log('dowhat',item.oper)
						ble.openLock('', item.oper, function(res) {
							console.log('蓝牙操作', res)
							// loadtime = res.loadtime
						})
					}else{
						console.log('this.bikeinfo.bluetooth_token',this.bikeinfo.bluetooth_token)
						var str1 = ble.doCmd(item.xiao1, item.xiao2, this.bikeinfo.bluetooth_token)
						ble.openLock(str1, '', function(res) {
							console.log('蓝牙操作', res)
							// loadtime = res.loadtime
						})
					}
					
				}

			},
			scancode() {
				wx.scanCode({
					onlyFromCamera: true,
					success: res => {
						console.log('shaoma', res)
						if (res.result.match(/\?bikesn=(.*)/)) {
							uni.showToast({
								title: '请扫描正确的ecu码',
								icon: 'none',
								duration: 2000,
							});
							return
						}
						// else if(res.result.indexOf(' ')==-1){
						// 	this.swapdata[1].val = res.result
						// }
						else if (res.result.indexOf(' ') != -1) {
							var result = res.result.split(' ')
							var imei = result[0].split(':')[1]
							this.imei = imei
							this.ecutype = 'AT-MX3F'
							this.getbikeinfobysn(this.imei)
						} else {
							this.imei = res.result
							this.ecutype = 'WA-209D'
							this.getbikeinfobysn(this.imei)
						}
					},
					fail: res => {

					}
				})
			}
		},
		computed: mapState(['bluestate', 'blueconectstate', ]),
		onLoad(e) {
			console.log('eeee', e)
			// this.getbikeinfobysn('003451386')
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
		.but-border{
			border: 2upx solid rgb(246,199,0);
			width: 200upx;
			height: 80upx;
			text-align: center;
			border-radius: 12upx;
			line-height: 80upx;
			font-size: 40upx;
			color:rgb(100,100,100);
		}
		.base-tarbar{
			
		}
        .selecttype{
			/* color:rgb(4,190,2); */
			color:white;
			background-color: rgb(0,122,255);
			/* font-size: 40upx; */
		}
		/* margin-bottom: 20upx; */
		.view-common {
			margin: 30upx 22upx;
			height: 98vh;
			position: relative;
			.ecutitle{
				font-size: 34upx;
				margin-bottom: 30upx;
			}

			.common-item {
				background-color: white;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				margin-bottom: 20upx;
				margin-top: 30upx;
			}
		}
	}
</style>
