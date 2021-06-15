<template>
	<view class='wrap'>	
		<view class='view-common'>
			<!-- <item-cell :itemdata="swapdata" type='4' :border='borders' @itemclick='gocarcenter'></item-cell> -->
			<!-- <item-cell :itemdata="swapbatterydata" type='2' :border='borders'></item-cell> -->
			<item-cell :itemdata="swapbatterydata1" type='2' :border='borders'></item-cell>
			<view class='collview'>						
				<uni-collapse  accordion="true">
				    <uni-collapse-item v-for="(i,item) in collapseData" :title="i.name" :key='i'>
				        <uni-list>
				            <uni-list-item @click='go(j.url)' v-for="(j,jtem) in i.data" :key="j" :title='j.name' thumb="https://img-cdn-qiniu.dcloud.net.cn/new-page/hx.png"><text>{{j.val}}</text></uni-list-item>												
				        </uni-list>
				    </uni-collapse-item>
				</uni-collapse>				
			</view>
			
			
			<view class='change-battery-button' v-if='showBatteryBtn==true'>
				<button type='primary' class='share-button-default' @click='changbattery(buttonname)'>{{buttonname}}</button>
			</view>
			<uni-popup :show="poptype ==='middle-list'" position="middle" mode="fixed" @hidePopup="togglePopup('')">
				<view :scroll-y="true" class="uni-center center-box">
					<view><text>换电前电量：</text><text>{{beforeelec}}</text></view>
					<view><text>换电后电量：</text><text>{{afterelect}}</text></view>
					<view><text>电量增长：</text><text>{{addelect}}</text></view>
				</view>
			</uni-popup>
			<uni-popup :show="poptypes ==='battery-model'" position="middle" mode="fixed" @hidePopup="togglePopup('')">
				<view :scroll-y="true" class="uni-center center-box">
					<view class='battery-title'><text>请选择电池型号：</text></view>
					<view class='battery-view'>
						<view class='detil-view' :class="{'batteryactive':activeclass==item}" v-for="(i,item) in batterymodel" :key='i' @click="chosebattery(item,i)"><text>{{i[0]}}</text></view>
					</view>
					<view><view class='battery-view'>
						<view class='detil-view sure-btn' @click='surechosebtn'><text>确定</text></view>
						<view class='detil-view cancel-btn' @click="togglePopup('')"><text>取消</text></view>
					</view></view>		
					<view></view>
				</view>
			</uni-popup>
			<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction"
			 @trigger="trigger" />
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'	
	import uniFab from '@/components/uni-fab/uni-fab.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import {getcarinfodetil,getheaderinfo} from '@/common/conf.js'
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
		loadtime = 1000,
		changetype=0//0有订单开电池锁，1无订单开电池锁
	export default {
		data() {
			return {
				activeclass:0,
				batterymodel:[],
				batterym:'',
				poptypes:1,
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
					{
						text: '开锁',
						val: '-1',
						active: false
					},
					{
						text: '关锁',
						val: '0',
						active: false
					},
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
					// {
					// 	text: '测试',
					// 	val: '6',
					// 	active: false
					// },
					{
						text: '刷新',
						val: '7',
						active: false
					},
				],
				borders: true,
				buttonname: '更换电池',
				// buttonname: '结束换电',
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
						{name:'用户订单',val:'',url:'/pageA/carBigCenter/carorder/carorder'},
						{name:'车辆操作记录',val:'',url:'/pageB/switchloockinfo/switchloockinfo'},
						{name:'换电记录',val:'',url:'/pageA/carBigCenter/batteriesrecord/batteriesrecord'},
						{name:'维修记录',val:'',url:'/pageA/carBigCenter/carorbit/carorbit'},
						{name:'订单轨迹',val:'',url:'/pageA/map/map?type=0.1&&name=用户骑行轨迹'},
						{name:'车辆轨迹',val:'',url:'/pageA/map/map?type=0.4&&name=车辆轨迹'},
						{name:'最后一次扫码手机位置',val:'',url:'/pageA/map/map?type=0.2&&name=最后扫码位置'},
						{name:'车辆当前位置',val:'',url:'/pageA/map/map?type=0.3&&name=车辆当前位置'},
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
						name: '车型:',
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
				ids:'',
				uploadflag:true
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
			try {
				const value = uni.getStorageSync('userinfo');
				if (value) {
					this.batterymodel =value.city.battery_models
				}
			} catch (e) {
				// error
			}
			if (e.type != 99) {
				var _self = this
				var name = _self.bikeinfo.bluetooth_name
				var devcode=_self.bikeinfo.ecu_sn
				console.log(6666,name,_self.bikeinfo.ecu_model)
				if ((!!name && !!_self.bikeinfo.bluetooth_token)) {
					var headerinfo={}
					this.uploadflag=true
					ble.onBLECharacteristicValueChange((res)=> {
						console.log('特征值返回', res)
						// 泰币特类型
						if(_self.bikeinfo.ecu_model == "WA-209D"){							
							if(res.name=='连接成功'){
								headerinfo=getheaderinfo(res)					
								if(res.val.indexOf('8102')>-1){
									
								}								
							}else if(res.name=='开锁成功'){
								blueWriteState = 1
								// _self.reportblue(0, loadtime,'')
								// _self.operbattery(0,loadtime,'')
								_self.opercar(1,0,loadtime,res)
							}else if(res.name=='上锁成功'){
								blueWriteState = 1
								// _self.reportblue(0, loadtime,'')
								// _self.operbattery(0,loadtime,'')
								_self.endmoveopr('',0,'','')	
							}else if(res.name=='电池锁打开成功'){
								blueWriteState = 1
								if(changetype==0){
									_self.operbattery(0,loadtime,'success')
								}			
							}else if(res.name=='心跳包'){
								console.log('uploadflag--->',this.uploadflag)
								if(this.uploadflag){
									this.uploadflag=false
									var cc=getcarinfodetil(res)
										console.log('headerinfo',headerinfo)
										var options = {
											url: '/bike/ble_report_gpsv2', //请求接口
											method: 'POST', //请求方法全部大写，默认GET
											context: '',
											data: {
												"bike_id": _self.bikeinfo.id,
												"gsm_signal_strength" : cc.gsm_signal_strength,//gsm信号强度
												"satellite" : cc.satellite, //卫星数量
												"is_online" : 1, //是否在线
												"battery_volt" : cc.battery_volt, //电压
												"is_defend_on" : headerinfo.is_defend_on, //设防
												"is_acc_on" : 1,	//电门
												"is_wheel_locked" : 1, //车轮锁
												"is_sleeping" : headerinfo.is_sleeping,		//是否休眠
												"is_in_motion" : headerinfo.is_in_motion,		//是否运动
												"trip_miles" : cc.trip_miles,		//里程
												"gps_flag" : cc.gps_flag,			//0=定位失败，1=定位成功，2=缓存定位
												"locate_type" : cc.locate_type, 	//定位类型 gps lbs
												"gps" :
													{
														"gps_update_time" : "2020-07-07 07:00:00",
														"coordinate" : cc.coordinate,
														"speed" : cc.speed,
														"course" : cc.course,
														"hdop" : ''
													},
												"lbs" :{"cellid":cc.cellid,"lac":cc.lac,"mcc":cc.mcc,"mnc":cc.mnc}
											}
										}
										_self.$httpReq(options).then((res) => {
											// 请求成功的回调
											// res为服务端返回数据的根对象
											console.log('上报gpsv2', res)
										}).catch((err) => {
											// 请求失败的回调
											console.error(err, '捕捉')
										})
									}
								}									
							
						}else{
						var gps = res.slice(0, 2)
						var blestate=res.slice(-3, -2)
						// 开电池锁
						if (gps == 34) {
							if (blestate == 0) {
								blueWriteState = 1
								// _self.reportblue(0, loadtime,'')
								_self.operbattery(0,loadtime,'success')
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
								// _self.reportblue(1, loadtime,bleerrstate)
								_self.operbattery(1,loadtime,bleerrstate)
							}
						}
						if (gps == 20) {
							if (blestate == 0) {
								blueWriteState = 1
								console.log('biaozhiwei',_self.openOrClose)
								// _self.reportblue(_self.openOrClose, 0, loadtime,'')
								// 挪车开锁
								if(_self.openOrClose == 11){
									console.log(2222)
									_self.opercar(1,0,loadtime,'')
								}else{
									_self.endmoveopr('',0,loadtime,res)
								}
								
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
								console.log('caozuo蓝牙失败',bleerrstate)
								// _self.reportblue(_self.openOrClose, 1, loadtime,bleerrstate)
								if(_self.openOrClose == 11){
									console.log(3333)
									_self.opercar(1,1,loadtime,bleerrstate)
								}else{
									_self.endmoveopr(parkid,1,loadtime,bleerrstate)
								}
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
						}
						}
						

					})
					// 初始化
					ble.initBluetooth(_self.bikeinfo, (res) => {
						_self.setBlueres(res)
						if (!!_self.bikeinfo.bluetooth_token) {
							_self.uploadflag=true
							var str1 = ble.doCmd('32', '', _self.bikeinfo.bluetooth_token)
							setTimeout(() => {
								ble.openLock(str1,'gps', function(ress) {
									console.log('蓝牙操作', ress)
								})
							}, 4000);
						}
					})
					ble.onBluetoothAdapterStateChange(function(res) {
						console.log('回调', res)
						// if (res.available == true && res.discovering == false && _self.bluestate == false) {
						// 	ble.initBluetooth(_self.bikeinfo, (res) => {
						// 		_self.setBlueres(res)
						// 	})
						// }
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

			// 车型
			this.swapbatterydata[0].val = this.bikeinfo.model

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
			...mapMutations(['setSn', 'setBlueres','setBikeid']),
			chosebattery(i,item){
				this.activeclass=i
				this.batterym=item[1]	
			},
			surechosebtn(){
				uni.showLoading({
					title: '关锁中'
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
								],
								"battery_model":this.batterym
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
			setbikedata(bikeinfo){
				// 车辆id
				this.swapbatterydata1[0].val=bikeinfo.sn
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
					this.swapbatterydata1[7].val = this.directinfo.bike_bus_state_enum[this.bikeinfo.bus_state]
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
					url: '/pageA/carBigCenter/carcenter/carcenter',
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
				this.poptypes = 1
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
						// this.openlock()
						this.startmovecar(1)
						break
					case '0':
						this.endmovecars('')
						break
					case '1':
						this.openring()
						break
					case '3':
						uni.navigateTo({
							url: `/pageB/movecarPage/checkupcar/checkupcar?type=100`,
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
						break
					case '4':
						uni.navigateTo({
							url: '/pageB/repairlist/repairlist?type=10&&name=违章骑行',
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
					case '7':
						this.getcarinfo()
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
						// this.getcarinfo()
						// 车辆编码
						this.swapdata[0].val = this.bikeinfo.id
						
						// 车型
						this.swapbatterydata[0].val = this.bikeinfo.model
						
						// 剩余电量
						this.swapbatterydata[1].val = this.bikeinfo.battery_level + '%'
						
						// 电池状态
						let is_on_battery = ''
						if (this.bikeinfo.is_on_battery == 0) {
							is_on_battery = '空置'
						} else if (this.bikeinfo.is_on_battery == 1) {
							is_on_battery = '装入'
						}
						this.swapbatterydata[2].val = is_on_battery
						
						// 电池锁状态
						let is_battery_locked = ''
						if (this.bikeinfo.is_on_battery == 0) {
							is_battery_locked = '开'
						} else if (this.bikeinfo.is_on_battery == 1) {
							is_battery_locked = '关'
						}
						this.swapbatterydata[3].val = is_battery_locked
						
						// 电池电压
						this.swapbatterydata[4].val = this.bikeinfo.battery_volt / 1000 + 'V'
						
						// 剩余容量
						this.swapbatterydata[5].val = this.bikeinfo.battery_capacity / 1000 + 'Ah'
						
						
						// 网络状态
						let is_online = ''
						if (this.bikeinfo.is_online == 0) {
							is_online = '离线'
						} else if (this.bikeinfo.is_online == 1) {
							is_online = '在线'
						}
						this.swapbatterydata[6].val = is_online
						
						// gps更新时间
						this.swapbatterydata[7].val = this.bikeinfo.gps_update_time
						
						// sim卡状态
						let sim_state = ''
						if (this.bikeinfo.is_defend_on == 1) {
							sim_state = '是'
						} else if (this.bikeinfo.is_defend_on == 0) {
							sim_state = '否'
						}
						this.swapbatterydata[8].val = sim_state
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
				changetype=1
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
			// 蓝牙预结束挪车处理
			presubmit(parkid) {
				this.setSn('*')
				this.openOrClose = 10
				uni.getLocation({ //获取当前的位置坐标
					type: 'gcj02',
					success: (res) => {
						var options = {
							url: '/rporder/pre_finish', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
							    "order_id":this.ids,
								"user_coordinate": [
									res.longitude, res.latitude
								],
								"park_id":parkid
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('预结束挪车', res)
							if (res.status == 0) {
								// 有token并且蓝牙已经连接
								if (!!this.bikeinfo.bluetooth_token && this.blueconectstate == 1) {
									var str1 = ble.doCmd('20', '01', this.bikeinfo.bluetooth_token)
									ble.openLock(str1, 'close', function(res) {
										console.log('蓝牙操作', res)
										loadtime = res.loadtime							
									})
									blueWriteState = 0
									setTimeout(() => {
										if (blueWriteState == 0) {
											console.log('蓝牙写入失败', blueWriteState)
											// this.reportblue(this.openOrClose, 1, loadtime,'无特征值返回')
											this.endmoveopr('',1,loadtime,'无特征值返回')
										}
									}, 5000)
								}
								uni.showToast({
									title: '关锁成功',
									mask: false,
									duration: 3000
								});
								// setTimeout(() => {
								// 	uni.navigateBack({
								// 		delta: 2
								// 	});
								// }, 2500)
							} else {
								uni.showToast({
									title: res.message ? res.message : '挪车失败',
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
					fail: (res) => {
				
					},
				})				
			},
			startmovecar(type) {
				this.showshartmove = false
				this.showendmove = false
				this.openOrClose = 11
				if (!!this.bikeinfo.bluetooth_token && this.blueconectstate==1 && type==1) {
					this.premovecar(type)
				}else{
					console.log(5555)
					this.opercar(type,1,100,'')
				}
				
			},
			// 挪车预处理
			premovecar(type) {
				var options = {
					url: '/rporder/pre_submit', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"bike_id": this.bikeinfo.id,
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('预处理订单', res)
					this.showmap = true
					if (res.status == 0) {
						if (!!this.bikeinfo.bluetooth_token && this.blueconectstate==1 && type==1) {
							var str1 = ble.doCmd('20', '00', this.bikeinfo.bluetooth_token)
							ble.openLock(str1, 'open', function(res) {
								console.log('蓝牙操作', res)
							})
							blueWriteState = 0
							setTimeout(() => {
								if (blueWriteState == 0) {
									console.log('blueWriteState2', blueWriteState)
									// this.reportblue(this.openOrClose, 1, loadtime,'无特征值返回')
									console.log(4444)
									this.opercar(1,1,loadtime,'无特征值返回')
								}
							}, 5000)
						}							
					} else {
						uni.showToast({
							title: res.message ? res.message : '该车不可挪',
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
			// 挪车具体操作
			opercar(type,successorfail,time,errmess){
				uni.getLocation({ //获取当前的位置坐标
					type: 'gcj02',
					success: (res) => {
						console.log('位置信息', res.longitude, res.latitude)
						var options = {
							url: '/rporder/submit', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"bike_id": this.bikeinfo.id,
								"user_coordinate": [res.longitude, res.latitude],
								"channel": "xxx",
								"bluetooth": this.blueconectstate,
								'unlock':type,
								// 执行成功传的值不成功不传
								"bleinfo": {
								  "success": successorfail,
								  "cost": time,
								  "error_msg": errmess
								 },
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('开始订单', res)
							this.showmap = true
							if (res.status == 0) {							
								this.ids = res.info.id
								// this.setOrderid(res.info.id)						
								// this.getmovingbike()
								// if (this.timmer == null) {
								// 	this.timmer = setInterval(() => {
								// 		this.getmovingbike()
								// 	}, 3000)
								// }
				
								// uni.navigateBack({
								// 	delta: 1
								// });
							} else {
								uni.showToast({
									title: res.message ? res.message : '不可开锁',
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
					fail: (res) => {
						console.log('fail', res)
					}
				});
			},
			// 结束挪车
			endmovecars(parkid) {
				if (!!this.bikeinfo.bluetooth_token && this.blueconectstate == 1) {
					this.presubmit(parkid)
					}else{
					this.endmoveopr(parkid,1,'','')	
					}				
			},
			// 开锁预操作
			openpre() {		
				var options = {
					url: '/bcorder/pre_submit', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"bike_id": this.bikeinfo.id,
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('预开锁', res)
					if (res.status == 0) {
						uni.showLoading({
							title: '开锁中'
						});
						if (!!this.bikeinfo.bluetooth_token && this.blueconectstate==1) {
							var str1 = ble.doCmd('34', '01', this.bikeinfo.bluetooth_token)
							ble.openLock(str1,'dianchisuo',function(res) {
								console.log('蓝牙操作', res)
								loadtime = res.loadtime
							})
							blueWriteState = 0
							setTimeout(() => {
								console.log(77777,blueWriteState)
								if (blueWriteState == 0) {
									this.operbattery(1,loadtime,'无特征值返回')
								}else{
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
								}
								uni.hideLoading()
							}, 5000)
						}												
						// this.orderid = res.info.id
						
							
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
			// 打开电池锁
			openbattery() {
				
                if(!!this.bikeinfo.bluetooth_token && this.blueconectstate==1){
					this.openpre()
				}else{
					this.operbattery(2,1000,'')
				}
				
			},
			// 网络开锁
			operbattery(state,time,mess) {
				uni.showLoading({
					title: '开锁中'
				});
				var bleinfo={}
				bleinfo={
					"success": state,
					"cost": time,
					"error_msg":mess
				}
				if(state==2){
					bleinfo='*'
				}
			    console.log(99999,state,time,mess)
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
								"bluetooth": this.blueconectstate,
								"bleinfo":bleinfo,
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('打开电池锁', res)
							if (res.status == 0) {																		
								this.orderid = res.info.id
								if(state!=0){
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
										complete: () => {
											// setTimeout(()=>{
											// 	uni.navigateBack()
											// },2000)											
										}
									});
								}	
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
				if(this.batterymodel.length<2){
					uni.showLoading({
						title: '关锁中'
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
									],
									"battery_model":this.batterym
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
				}else{
					this.poptypes='battery-model'
				}
				// if (!!this.bikeinfo.bluetooth_token && this.blueconectstate == 1) {
				// 	var str1 = ble.doCmd('32', '', this.bikeinfo.bluetooth_token)
				// 	this.uploadflag=true
				// 	setTimeout(() => {
				// 		ble.openLock(str1,'gps', function(ress) {
				// 			console.log('蓝牙操作', ress)
				// 		})
				// 		}, 1);
				// 	}			
			
			},
			// 获取车辆信息
			getcarinfo() {
				this.setBikeid(this.bikeinfo.id)
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
						this.swapbatterydata[1].val = res.info.battery_level + '%'
												
						// 电池状态
						let is_on_battery = ''
						if (res.info.is_on_battery == 0) {
							is_on_battery = '空置'
						} else if (res.info.is_on_battery == 1) {
							is_on_battery = '装入'
						}
						this.swapbatterydata[2].val = is_on_battery
						
						// 电池锁状态
						let is_battery_locked = ''
						if (res.info.is_on_battery == 0) {
							is_battery_locked = '开'
						} else if (res.info.is_on_battery == 1) {
							is_battery_locked = '关'
						}
						this.swapbatterydata[3].val = is_battery_locked
						
						// 电池电压
						this.swapbatterydata[4].val = res.info.battery_volt / 1000 + 'V'
						
						// 剩余容量
						this.swapbatterydata[5].val = res.info.battery_capacity / 1000 + 'Ah'
						
						
						// 网络状态
						let is_online = ''
						if (res.info.is_online == 0) {
							is_online = '离线'
						} else if (res.info.is_online == 1) {
							is_online = '在线'
						}
						this.swapbatterydata[6].val = is_online
						
						// gps更新时间
						this.swapbatterydata[7].val = res.info.gps_update_time
						
						// sim卡状态
						let sim_state = ''
						if (res.info.is_defend_on == 1) {
							sim_state = '是'
						} else if (res.info.is_defend_on == 0) {
							sim_state = '否'
						}
						this.swapbatterydata[8].val = sim_state
						uni.showToast({
							title: res.message ? res.message : '刷新成功!',
							icon: 'none',
							duration: 2000
						})
					}
					else{
						uni.showToast({
							title: res.message ? res.message : '刷新失败!',
							icon: 'none',
							duration: 2000
						})
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 开始挪车
			// startmovecar() {
			// 	this.showshartmove = false
			// 	this.showendmove = false
			// 	this.openOrClose = 11
			// 	// this.showendmove = true
			// 	uni.getLocation({ //获取当前的位置坐标
			// 		type: 'gcj02',
			// 		success: (res) => {
			// 			console.log('位置信息', res.longitude, res.latitude)
			// 			var options = {
			// 				url: '/rporder/submit', //请求接口
			// 				method: 'POST', //请求方法全部大写，默认GET
			// 				context: '',
			// 				data: {
			// 					"bike_id": this.bikeinfo.id,
			// 					"user_coordinate": [res.longitude, res.latitude],
			// 					"channel": "xxx",
			// 					"bluetooth": this.blueconectstate,
			// 					'unlock':1,
			// 				}
			// 			}
			// 			this.$httpReq(options).then((res) => {
			// 				// 请求成功的回调
			// 				// res为服务端返回数据的根对象
			// 				console.log('开始订单', res)
			// 				this.showmap = true
			// 				if (res.status == 0) {
			// 					uni.showToast({
			// 						title: '开锁成功',
			// 						mask: false,
			// 						icon: 'none',
			// 						duration: 2500
			// 					});
			// 					if (!!this.bikeinfo.bluetooth_token && this.blueconectstate==1 && type==1) {
			// 						var str1 = ble.doCmd('20', '00', this.bikeinfo.bluetooth_token)
			// 						ble.openLock(str1, 'open', function(res) {
			// 							console.log('蓝牙操作', res)
			// 						})
			// 						blueWriteState = 0
			// 						setTimeout(() => {
			// 							if (blueWriteState == 0) {
			// 								console.log('blueWriteState2', blueWriteState)
			// 								this.reportblue(this.openOrClose, 1, loadtime,'无特征值返回')
			// 							}
			// 						}, 5000)
			// 					}													
			// 				} else {
			// 					uni.showToast({
			// 						title: res.message ? res.message : '开锁失败',
			// 						mask: false,
			// 						icon: 'none',
			// 						duration: 2500
			// 					});
			// 				}
			// 			}).catch((err) => {
			// 				// 请求失败的回调
			// 				console.error(err, '捕捉')
			// 			})
			// 		},
			// 		fail: (res) => {
			// 			console.log('fail', res)
			// 		}
			// 	});
			// },
			// 结束挪车
			// 结束挪车核心逻辑
			endmoveopr(parkid,successorfail,time,errmess){
				this.setSn('*')
				this.openOrClose = 10
				uni.getLocation({ //获取当前的位置坐标
					type: 'gcj02',
					success: (res) => {
						var options = {
							url: '/rporder/finish', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"order_id": this.ids,
								"park_id": parkid,
								"bluetooth": this.blueconectstate,
								"bleinfo":{
								  "success": successorfail,
								  "cost": time,
								  "error_msg":errmess
								},
								"user_coordinate": [
									res.longitude, res.latitude
								]
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('挪车333333', res)
							if (res.status == 0) {					
								uni.showToast({
									title: '关锁成功',
									mask: false,
									duration: 3000
								});
							} else {
								uni.showToast({
									title: res.message ? res.message : '挪车失败',
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
					fail: (res) => {
				
					},
				})
			},
			
			// endmoveopr() {
			// 	var options = {
			// 		url: '/bike/info', //请求接口
			// 		method: 'POST', //请求方法全部大写，默认GET
			// 		context: '',
			// 		data: {}
			// 	}
			// 	this.$httpReq(options).then((res) => {
			// 		// 请求成功的回调
			// 		// res为服务端返回数据的根对象
			// 		console.log('车辆信息', typeof(res), res)
			// 		if (res.status == 0) {
			// 			var bikeids=res.info.last_repark_order_id
			// 			this.setSn('*')
			// 			this.openOrClose = 10
			// 			uni.getLocation({ //获取当前的位置坐标
			// 				type: 'gcj02',
			// 				success: (res) => {
			// 					var options = {
			// 						url: '/rporder/finish', //请求接口
			// 						method: 'POST', //请求方法全部大写，默认GET
			// 						context: '',
			// 						data: {
			// 							"order_id": bikeids,
			// 							"park_id": '',
			// 							"bluetooth": this.blueconectstate,
			// 							"user_coordinate": [
			// 								res.longitude, res.latitude
			// 							]
			// 						}
			// 					}
			// 					this.$httpReq(options).then((res) => {
			// 						// 请求成功的回调
			// 						// res为服务端返回数据的根对象
			// 						console.log('挪车', res)
			// 						if (res.status == 0) {
			// 							// 有token并且蓝牙已经连接
			// 							if (!!this.bikeinfo.bluetooth_token && this.blueconectstate == 1) {
			// 								var str1 = ble.doCmd('20', '01', this.bikeinfo.bluetooth_token)
			// 								ble.openLock(str1, 'close', function(res) {
			// 									console.log('蓝牙操作', res)
			// 									loadtime = res.loadtime							
			// 								})
			// 								blueWriteState = 0
			// 								setTimeout(() => {
			// 									if (blueWriteState == 0) {
			// 										console.log('蓝牙写入失败', blueWriteState)
			// 										this.reportblue(this.openOrClose, 1, loadtime,'无特征值返回')
			// 									}
			// 								}, 5000)
			// 							}
			// 							uni.showToast({
			// 								title: '锁车成功',
			// 								mask: false,
			// 								duration: 3000
			// 							});
			// 						} else {
			// 							uni.showToast({
			// 								title: res.message ? res.message : '锁车失败',
			// 								mask: false,
			// 								icon: 'none',
			// 								duration: 3000
			// 							});
			// 						}
			// 					}).catch((err) => {
			// 						// 请求失败的回调
			// 						console.error(err, '捕捉')
			// 					})
			// 				},
			// 				fail: (res) => {
									
			// 				},
			// 			})
			// 		}
			// 	}).catch((err) => {
			// 		// 请求失败的回调
			// 		console.error(err, '捕捉')
			// 	})
				
			// },
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
			height: 270upx;
			width: 320upx;
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
			.battery-title{
				font-size: 28upx;
			}
			.battery-view{
				margin-top: 20upx;
				display: flex;
				justify-content: space-between;
				.detil-view{
					border: 1upx solid rgb(80,80,80);
					border-radius: 10upx;
					width: 30%;
					height: 80upx;
					line-height: 80upx;
					color: rgb(80,80,80);		
				}
				.sure-btn{
					background-color:rgb(0,122,255) ;
					color: white;
					width: 45%;
				}
				.cancel-btn{
					width: 45%;
				}
				.batteryactive{
					/* color:white ; */
					/* background-color: rgb(0,122,255); */
					width: 32%;
					line-height: 74upx;
					/* border-color: rgb(246,199,0); */
					border: 4upx solid rgb(246,199,0);
				}
			}
		}
	}
</style>
