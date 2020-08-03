<template>
	<view class='wrap'>	
		<view class='view-common'>
			<!-- <item-cell :itemdata="swapdata" type='4' :border='borders' @itemclick='gocarcenter'></item-cell> -->
			<!-- <item-cell :itemdata="swapbatterydata" type='2' :border='borders'></item-cell> -->
			<item-cell :itemdata="swapbatterydata1" type='2' :border='borders'></item-cell>
			<view class='collview'>						
				<uni-collapse  accordion="true">
				    <uni-collapse-item v-for="(i,item) in collapseData" :title="i.name">
				        <uni-list>
				            <uni-list-item @click='go(j.url)' v-for="(j,jtem) in i.data" :title='j.name' thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/hx.png"><text>{{j.val}}</text></uni-list-item>												
				        </uni-list>
				    </uni-collapse-item>
				</uni-collapse>				
			</view>
			
			
			<view class='change-battery-button' v-if='showBatteryBtn==true'>
				<button type='primary' class='share-button-default' @click='changbattery(buttonname)'>{{buttonname}}</button>
			</view>
			<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction"
			 @trigger="trigger" />
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'	
	import uniFab from '@/components/uni-fab/uni-fab.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	// import uniCollapse from '@/components/uni-popup/uni-popup.vue'
	// import uniCollapseItem from '@/components/uni-popup/uni-popup.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import ble from '../../common/xa-bluetooth.js'
	var gpsSb = '',
		stateSb = '',
		openOrCloseLock = 0,
		blueWriteState = 0,
		loadtime = 1000
	export default {
		data() {
			return {
				showBatteryBtn: true,
				beforeelec: 0,
				afterelect: 0,
				addelect: 0,
				title: 'uni-fab',
				directionStr: '垂直',
				horizontal: 'right',
				vertical: 'bottom',
				direction: 'vertical',
				poptype: '',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF'
				},
				content: [
					// {
					// 	// iconPath: '/static/component.png',
					// 	// selectedIconPath: '/static/componentHL.png',
					// 	text: '开锁',
					// 	val: '-1',
					// 	active: false
					// },
					// {
					// 	text: '关锁',
					// 	val: '0',
					// 	active: false
					// },
					{
						text: '寻车铃',
						val: '1',
						active: false
					},
					// {
					// 	text: '找不到车',
					// 	val: '2',
					// 	active: false
					// },
					{
						text: '报修',
						val: '3',
						active: false
					},
					{
						text: '违章举报',
						val: '4',
						active: false
					},
					{
						text: '开电池锁',
						val: '5',
						active: false
					},
					{
						text: '刷新',
						val: '6',
						active: false
					},
					{
						text: '',
						val: '7',
						active: false
					},
				],
				borders: true,
				buttonname: '更换电池',
				swapdata: [{
					name: '车辆编号:',
					val: ''
				}],
				orderid: '',
				swapbatterydata1:[
					{
						name: '车辆编号:',
						val: ''
					},
					{
						name: 'ecusn、imei:',
						val:''
					},
					{
						name: '差车:',
						val:''
					},
					{
						name: '车辆状态:',
						val:''
					},
					{
						name: '设防状态:',
						val:''
					},
					{
						name: '电量:',
						val: '',
						time:''
					},
					{
						name: '在线状态:',
						val: '',
						time:''
					},
					{
						name: '业务状态:',
						val: '',
						time:''
					},
					{
						name: '定位类型:',
						val: '',
						time:''
					},
					{
						name: '最近订单时间:',
						time: ''
					},
					{
						name: '停放信息:',
						val: '',
						time:':1'
					},
				],
				collapseData:[
					{name:'订单信息',data:[
						{name:'用户订单',val:'',url:'/pages/carBigCenter/carorder/carorder'},
						{name:'车辆操作记录',val:'',url:'/pages/switchloockinfo/switchloockinfo'},
						{name:'换电记录',val:'',url:'/pages/carBigCenter/batteriesrecord/batteriesrecord'},
						{name:'维修记录',val:'',url:'/pages/carBigCenter/carorbit/carorbit'},
						{name:'订单轨迹',val:'',url:'/pages/map/map?type=0.1&&name=用户骑行轨迹'},
						{name:'车辆轨迹',val:'',url:'/pages/map/map?type=0.4&&name=车辆轨迹'},
						{name:'最后一次扫码手机位置',val:'',url:'/pages/map/map?type=0.2&&name=最后扫码位置'},
						{name:'车辆当前位置',val:'',url:'/pages/map/map?type=0.3&&name=车辆当前位置'},
						]},
					// {name:'设防信息',data:[
					// 	{name:'是否设防:',val:'',url:''},
					// 	{name:'电池锁:',val:'',url:''},
					// 	]},
					{name:'状态信息',data:[
						// {name:'网络状态:',val:'',url:''},
						{name:'库存状态:',val:'22',url:''},
						{name:'异常状态:',val:'',url:''},
						{name:'电池状态:',val:'',url:''},
						]},				
					],
				swapbatterydata: [{
						name: 'ecusn:',
						val: ''
					},
					{
						name: '剩余电量:',
						val: ''
					},
					{
						name: '电池状态:',
						val: ''
					},
					{
						name: '电池锁状态:',
						val: ''
					},
					{
						name: '电池电压:',
						val: ''
					},
					{
						name: '剩余容量:',
						val: ''
					},
					{
						name: '网络状态:',
						val: ''
					},
					{
						name: 'GPS更新时间:',
						val: ''
					},
					{
						name: '是否设防:',
						val: ''
					},
					// {
					// 	name:'异常状态',
					// 	val:''
					// }
				],
			}
		},
		components: {
			itemCell,
			uniFab,
			uniPopup,
		},
		onBackPress() {
			if (this.$refs.fab.isShow) {
				this.$refs.fab.close()
				return true
			}
			return false
		},
		onUnload() {
			uni.closeBluetoothAdapter({
				success(res) {
					console.log(res)
				}
			})
		},
		computed: mapState(['bikeinfo', 'bikeid', 'blueres', 'bluestate', 'blueconectstate','directinfo']),
		onLoad(e) {
			this.setbikedata(this.bikeinfo)
			if (e.type != 99) {
				var _self = this
				var name = _self.bikeinfo.bluetooth_name
				var devcode=_self.bikeinfo.ecu_sn
				if ((!!name && !!_self.bikeinfo.bluetooth_token)) {
					ble.onBLECharacteristicValueChange((res)=> {
						console.log('特征值返回', res)
						// 泰币特类型
						if(_self.bikeinfo.ecu_model == "WA-209D"){
							if(res=='连接成功'){
								
							}else if(res=='开锁成功'){
								blueWriteState = 1
								_self.reportblue(0, loadtime,'')
							}else if(res=='上锁成功'){
								blueWriteState = 1
								_self.reportblue(0, loadtime,'')
							}else if(res=='电池锁打开成功'){
								blueWriteState = 1
								_self.reportblue(0, loadtime,'')
							}
							
						}else{
						var gps = res.slice(0, 2)
						var blestate=res.slice(-3, -2)
						// 开电池锁
						if (gps == 34) {
							if (blestate == 0) {
								blueWriteState = 1
								_self.reportblue(0, loadtime,'')
							}else{
								var bleerrstate=''
								if(blestate==1){
									bleerrstate='token校验失败'
								}else if(blestate==2){
									bleerrstate='请求内容错误'
								}else if(blestate==3){
									bleerrstate='请求命令错误'
								}else if(blestate==4){
									bleerrstate='操作失败'
								}else if(blestate==5){
									bleerrstate='命令不支持'
								}else if(blestate==6){
									bleerrstate='车辆正在骑行中'
								}else{
									bleerrstate='未知失败'
								}
								_self.reportblue(1, loadtime,bleerrstate)
							}
						}
						// 获取gps数据
						if (gps == 32) {
							gpsSb = res
							var str1 = ble.doCmd('21', '', _self.bikeinfo.bluetooth_token)
							// ble.openLock(str1, _self.blueres.deviceId, _self.blueres.serviceId, _self.blueres.characterId, function(res) {
							ble.openLock(str1,'',function(res) {
								console.log('蓝牙操作', res)
							})
						}
						// 获取车辆当前状态
						if (gps == 21) {
							stateSb = res
							var options = {
								url: '/bike/report_bike_gps', //请求接口
								method: 'POST', //请求方法全部大写，默认GET
								context: '',
								data: {
									bike_id: _self.bikeinfo.id,
									stat: stateSb,
									gps: gpsSb,
									tm:new Date().getTime()/1000
								}
							}
							_self.$httpReq(options).then((res) => {
								// 请求成功的回调
								// res为服务端返回数据的根对象
								console.log('上报', res)
							}).catch((err) => {
								// 请求失败的回调
								console.error(err, '捕捉')
							})
						}}
						

					})
					// 初始化
					ble.initBluetooth(_self.bikeinfo, (res) => {
						_self.setBlueres(res)
						if (!!_self.bikeinfo.bluetooth_token) {
							var str1 = ble.doCmd('32', '', _self.bikeinfo.bluetooth_token)
							setTimeout(() => {
								// ble.openLock(str1, res.deviceId, res.serviceId, res.characterId, function(ress) {
								ble.openLock(str1,'', function(ress) {
									console.log('蓝牙操作', ress)
								})
							}, 0);
						}
					})
					ble.onBluetoothAdapterStateChange(function(res) {
						console.log('回调', res)
						if (res.available == true && res.discovering == false && _self.bluestate == false) {
							ble.initBluetooth(_self.bikeinfo, (res) => {
								_self.setBlueres(res)
							})
						}
					})
				}
			} else {
				console.log('++++蓝牙不可用++++')
			}

			if (e) {
				this.showBatteryBtn = e.showBtn
				wx.setNavigationBarTitle({
					title: '车辆信息'
				})
			}
			this.beforeelec = this.bikeinfo.battery_level + '%'
			// this.getcarinfo()
			// 车辆编码
			// this.swapdata[0].val = this.bikeinfo.id

			// // ecusn
			// this.swapbatterydata[0].val = this.bikeinfo.ecu_sn

			// // 剩余电量
			// this.swapbatterydata[1].val = this.bikeinfo.battery_level + '%'

			// // 电池状态
			// let is_on_battery = ''
			// if (this.bikeinfo.is_on_battery == 0) {
			// 	is_on_battery = '空置'
			// } else if (this.bikeinfo.is_on_battery == 1) {
			// 	is_on_battery = '装入'
			// }
			// this.swapbatterydata[2].val = is_on_battery

			// // 电池锁状态
			// let is_battery_locked = ''
			// if (this.bikeinfo.is_on_battery == 0) {
			// 	is_battery_locked = '开'
			// } else if (this.bikeinfo.is_on_battery == 1) {
			// 	is_battery_locked = '关'
			// }
			// this.swapbatterydata[3].val = is_battery_locked

			// // 电池电压
			// this.swapbatterydata[4].val = this.bikeinfo.battery_volt / 1000 + 'V'

			// // 剩余容量
			// this.swapbatterydata[5].val = this.bikeinfo.battery_capacity / 1000 + 'Ah'
          
			// // 网络状态
			// let is_online = ''
			// if (this.bikeinfo.is_online == 0) {
			// 	is_online = '离线'
			// } else if (this.bikeinfo.is_online == 1) {
			// 	is_online = '在线'
			// }
			// this.swapbatterydata[6].val = is_online

			// // gps更新时间
			// this.swapbatterydata[7].val = this.bikeinfo.gps_update_time

			// // sim卡状态
			// let sim_state = ''
			// if (this.bikeinfo.is_defend_on == 1) {
			// 	sim_state = '是'
			// } else if (this.bikeinfo.is_defend_on == 0) {
			// 	sim_state = '否'
			// }
			// this.swapbatterydata[8].val = sim_state

			// 异常状态
			// this.swapbatterydata[9].val = this.bikeinfo.alert_state_desc
		},
		methods: {
			...mapMutations(['setSn', 'setBlueres','setBikeinfo']),
			setbikedata(bikeinfo){
				// 车辆id
				this.swapbatterydata1[0].val=bikeinfo.id
				// 车辆sn
				this.swapbatterydata1[1].val=bikeinfo.ecu_sn+'、'+bikeinfo.imei
				// 车辆差车等级
				this.swapbatterydata1[2].val=bikeinfo.repark_index?bikeinfo.repark_index+'+':'正常'
				// 车辆健康状态
				this.swapbatterydata1[3].val=bikeinfo.health_state?'故障':'健康'
				// 设防状态1设防0撤防
				var is_defend_on=bikeinfo.is_defend_on?'设防':'撤防'
				var is_acc_on=bikeinfo.is_acc_on?'电门开':'电门关'
				var is_battery_locked=bikeinfo.is_battery_locked?'电池锁关':'电池锁关'
				this.swapbatterydata1[4].val=is_defend_on+'   '+is_acc_on+'    '+is_battery_locked
				// 车辆电量
				this.swapbatterydata1[5].val=bikeinfo.battery_volt / 1000 + 'V'+'    '+bikeinfo.battery_level+'%'
				this.swapbatterydata1[5].time=bikeinfo.battery_update_time
				// 车辆在线状态
				this.swapbatterydata1[6].val=bikeinfo.is_online?'在线':'离线'
				this.swapbatterydata1[6].time=bikeinfo.online_update_time
				// 车辆业务状态
				this.swapbatterydata1[7].val = this.directinfo.bike_bus_state_enum[bikeinfo.bus_state]
				if(this.bikeinfo.bus_state){
					this.swapbatterydata1[7].val = this.directinfo.bike_bus_state_enum[0]
				}
				this.swapbatterydata1[7].time=bikeinfo.bus_update_time
				// 车辆定位类型
				this.swapbatterydata1[8].val=bikeinfo.locate_type
				this.swapbatterydata1[8].time=bikeinfo.gps_update_time
				// 车辆最近订单时间
				this.swapbatterydata1[9].time=bikeinfo.last_order_end_time
				// 车辆停放信息
				var stoparename=''
				if(bikeinfo.park_state==0){
					// stoparename='('+this.bikeinfo.svca_name+')'
				}else if(bikeinfo.park_state==1){
					stoparename='('+bikeinfo.park_name+')'  
				}else if(bikeinfo.park_state==11){
					stoparename='('+bikeinfo.npa_name+')'
				}
				this.swapbatterydata1[10].val=this.$parkstate(bikeinfo.park_state)+stoparename
				this.swapbatterydata1[10].time=bikeinfo.park_update_time
				// 库存状态
				this.collapseData[1].data[0].val=this.$invstate(bikeinfo.inv_state)
				// 异常状态
				this.collapseData[1].data[1].val=bikeinfo.alert_state_desc
				// 电池状态
				this.collapseData[1].data[2].val=bikeinfo.is_on_battery?'装入':'空置'
			},
			openlock() {
				uni.getLocation({
					type: 'wgs84',
					success: ress => {
						var options = {
							url: '/bike/unlock', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"bike_id": this.bikeinfo.id,
								"user_coordinate": [
									ress.longitude,
									ress.latitude
								]
							}
						}
						this.$httpReq(options).then((res) => {
							if (res.status == 0) {
								uni.showToast({
									title: '开锁成功',
									duration: 2000,
								});
							} else {
								uni.showToast({
									title: res.message ? res.message : '开锁失败',
									icon: 'none',
									duration: 2000,
								});
							}
						}).catch((err) => {
							// 请求失败的回调
							console.error(err, '捕捉')
						})
					},
					fail: () => {},
					complete: () => {}
				});
			},
			gocarcenter() {
				uni.navigateTo({
					url: '/pages/carBigCenter/carcenter/carcenter',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			go(url){
				if(!!url){
					uni.navigateTo({
						url: url,
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}	
			},
			// 寻车铃
			openring() {
				if (!!this.bikeinfo.bluetooth_token && this.blueconectstate==1) {
					var str1 = ble.doCmd('28', '09', this.bikeinfo.bluetooth_token)
					ble.openLock(str1,'ring', function(res) {
						console.log('蓝牙操作', res)
					})
				}							
				var options = {
					url: '/bike/ring', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						id: this.bikeinfo.id
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('寻车铃', typeof(res), res)
					if (res.status == 0) {} else {
						uni.showToast({
							icon: 'none',
							title: res.message ? res.message : '开启寻车铃失败'
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			togglePopup() {
				this.poptype = ''
			},
			// 关锁
			closelock() {
				uni.getLocation({
					type: 'wgs84',
					success: ress => {
						var options = {
							url: '/bike/lock', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"bike_id": this.bikeinfo.id,
								"user_coordinate": [
									ress.longitude,
									ress.latitude
								]
							}
						}
						this.$httpReq(options).then((res) => {
							if (res.status == 0) {
								uni.showToast({
									title: '关锁成功',
									duration: 2000,
								});
							} else {
								uni.showToast({
									title: res.message ? res.message : '关锁失败',
									icon: 'none',
									duration: 2000,
								});
							}
						}).catch((err) => {
							// 请求失败的回调
							console.error(err, '捕捉')
						})
					},
					fail: () => {},
					complete: () => {}
				});

			},
			trigger(e) {
				this.content[e.index].active = !e.item.active
				switch (e.item.val) {
					case '-1':
						this.openlock()
						break
					case '0':
						this.closelock()
						break
					case '1':
						this.openring()
						break
					case '3':
						uni.navigateTo({
							url: `/pages/movecarPage/checkupcar/checkupcar?type=100`,
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
						break
					case '4':
						uni.navigateTo({
							url: '/pages/repairlist/repairlist?type=10&&name=违章骑行',
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
						break
					case '5':
						uni.showModal({
							title: '确认打开电池锁',
							content: '',
							// showCancel: false,
							cancelText: '取消',
							confirmText: '打开',
							confirmColor: '#F6C700',
							success: res => {
								if (res.confirm) {
									uni.showLoading({
										title: '开锁中'
									});
									// this.openbattery()
									this.unlockbattery()
								}
							},
							fail: () => {},
							complete: () => {}
						});
						break
					case '6':
						this.refreshinfo()
						break
				}
			},
			// 刷新车辆信息
			refreshinfo(){
				var options = {
					url: '/bike/refresh_info', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('刷新车辆信息', res)
					if (res.status == 0) {
						this.setBikeinfo(res.info)
						this.setbikedata(this.bikeinfo)
						this.beforeelec = this.bikeinfo.battery_level + '%'
						uni.showToast({
							title: '刷新信息成功',
							duration: 2000,
						});
					} else {
			            uni.showToast({
			            	title: '刷新信息失败',
			            	duration: 2000,
			            });
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			switchBtn(hor, ver) {
				if (hor === 0) {
					this.direction = this.direction === 'horizontal' ? 'vertical' : 'horizontal'
					this.directionStr = this.direction === 'horizontal' ? '垂直' : '水平'
				} else {
					this.horizontal = hor
					this.vertical = ver
				}
				this.$forceUpdate()
			},
			changbattery(name) {
				console.log('name', name)
				if (name == '更换电池') {
					uni.showModal({
						title: '确认打开电池锁',
						content: '',
						// showCancel: false,
						cancelText: '取消',
						confirmText: '打开',
						confirmColor: '#F6C700',
						success: res => {
							if (res.confirm) {
								this.openbattery()
								// uni.showLoading({
								// 	title: '开锁中'
								// });
							}
						},
						fail: () => {},
						complete: () => {}
					});
				} else {
					this.closebattery()
				}

			},
			// 单独开锁不产生绩效
			unlockbattery() {
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						var options = {
							url: '/bike/unlock_battery', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"user_coordinate": [
									res.longitude, res.latitude
								],
								id: this.bikeinfo.id
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('打开电池锁', res)
							if (res.status == 0) {
								if (!!this.bikeinfo.bluetooth_token && this.blueconectstate==1) {
									var str1 = ble.doCmd('34', '01', this.bikeinfo.bluetooth_token)
									ble.openLock(str1,'dianchisuo', function(res) {
										console.log('蓝牙操作', res)
									})
								}																
								uni.showModal({
									title: '电池锁已打开，请更换电池',
									content: '电池锁更换完毕后，会自动记录本次操作',
									showCancel: false,
									cancelText: '',
									confirmText: '我知道了',
									success: res => {
										// this.buttonname = '关闭电池锁'
									},
									fail: () => {},
									complete: () => {}
								});
								// setTimeout(()=>{
								// 	uni.navigateBack({
								// 		delta: 1
								// 	});
								// },2000)
							} else {
								uni.showToast({
									title: res.message ? res.message : '开锁失败!',
									icon: 'none',
									duration: 2000
								})
							}
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
			// test
			biketest() {
				this.setSn('*')
				var options = {
					url: '/bike/test', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {

					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('test', res)
					if (res.status == 0) {
						// uni.showToast({
						// 	title: '开锁成功!',
						// 	duration: 2000
						// })
						// this.orderid = res.info.id
						// uni.hideLoading()
						uni.showToast({
							title: 'success'
						});

					} else {
						uni.showToast({
							title: res.message ? res.message : '失败!',
							icon: 'none',
							duration: 2000
						})
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			//上报蓝牙操作
			reportblue(state, loadtime,errname) {
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
			// 打开电池锁
			openbattery() {
				uni.showLoading({
					title: '开锁中'
				});

				uni.getLocation({
					type: 'wgs84',
					success: res => {
						var options = {
							url: '/bcorder/submit', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"channel": "WXMP",
								"bike_id": this.bikeinfo.id,
								"user_coordinate": [
									res.longitude, res.latitude
								],
								"bluetooth": this.blueconectstate
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('打开电池锁', res)
							if (res.status == 0) {
								if (!!this.bikeinfo.bluetooth_token && this.blueconectstate==1) {
									var str1 = ble.doCmd('34', '01', this.bikeinfo.bluetooth_token)
									ble.openLock(str1,'dianchisuo',function(res) {
										console.log('蓝牙操作', res)
										loadtime = res.loadtime
									})
									blueWriteState = 0
									setTimeout(() => {
										if (blueWriteState = 0) {
											this.reportblue(1, loadtime,'无特征值返回')
										}
									}, 5000)
								}												
								this.orderid = res.info.id
								uni.showModal({
									title: '电池锁已打开，请更换电池',
									content: '电池锁更换完毕后，会自动记录本次操作',
									showCancel: false,
									cancelText: '',
									confirmText: '我知道了',
									success: res => {
										this.buttonname = '结束换电'
									},
									fail: () => {},
									complete: () => {}
								});

							} else {
								uni.showToast({
									title: res.message ? res.message : '开锁失败!',
									icon: 'none',
									duration: 2000
								})
							}
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
			// 关闭电池锁完成订单
			closebattery() {
				uni.showLoading({
					title: '开锁中'
				});
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						this.setSn('*')
						var options = {
							url: '/bcorder/finish', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"order_id": this.orderid,
								"user_coordinate": [
									res.longitude, res.latitude
								]
							},
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('关锁完成订单电池锁', res)
							if (res.status == 0) {
								this.poptype = 'middle-list'
								this.buttonname = '更换电池'
								this.afterelect = res.info.battery_level_after + '%'
								this.addelect = res.info.battery_level_after - this.bikeinfo.battery_level + '%'
								setTimeout(()=>{
									uni.navigateBack()
								},2000)			
							} else {
								uni.showToast({
									title: res.message ? res.message : '关锁失败!',
									icon: 'none',
									duration: 2000
								})
							}
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
					console.log('车辆信息', typeof(res), res)
					if (res.status == 0) {
						this.afterelect = res.info.battery_level + '%'
						this.addelect = res.info.battery_level - this.bikeinfo.battery_level + '%'
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
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

		.center-box {
			font-size: 34upx;
			height: 140upx;
			width: 240upx;
		}

		/* margin-bottom: 20upx; */
		.view-common {
			.collview{
				margin-top: 30upx;
			}
			margin: 10upx 22upx;
			height: 150vh;
			position: relative;
            overflow-y: auto;
			.change-battery-button {
				position: fixed;
				bottom: 3vh;
				width: 706upx;
			}
		}
	}
</style>
