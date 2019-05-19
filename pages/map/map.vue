<template>
	<view>
		<!-- <view style='background: #09BB07;height: 50px;width:100%;'>hello</view> -->
		<view v-if="showcorverview.head" style='height: 80upx;width:100%;background-color:rgba(100,100,100,.5);'>
			<baseheader :title="headviewtext" @show='showMapSelect' :hasBack='true' :xialajiantou='true'></baseheader>
		</view>
		<view class="page-body">
			<view class="page-section page-section-gap">
				<map class='map-base-view' :class="{'activemap':actives}" :scale="scale" id='firstmap' :latitude="latitude"
				 :longitude="longitude" :markers="covers" :show-location='showLocation' :polyline="polyline" @markertap='markclick'
				 @regionchange="functionName" @end="functionName">
					<!-- <map class='map-base-view' :class="{'activemap':actives}" :scale="scale" id='firstmap' :latitude="latitude"
				  :longitude="longitude" :markers="covers" :show-location='showLocation' :circles='circles' :polyline="polyline"
				  @regionchange="functionName" @end="functionName" @begin="functionName"> -->
					<cover-image src='../../static/mapicon/center.png' class='cover-imgs'></cover-image>
					<cover-view v-if="showmapselect" class='map-select-view'>
						<cover-view class='select-list'>
							<cover-view v-for="(item,i) in selectcoverdata" @click="active(i,item)" :class="{'borderrights':i==isActive}">{{item.name}}</cover-view>
						</cover-view>
						<cover-view class='select-sure' @click="selectsure">确定</cover-view>
					</cover-view>
					<cover-view class='map-cover-view'>
						<cover-view v-if="showcorverview.bottom" class='scan-button' @click="scanCode(0)">手动输入</cover-view>
						<cover-view v-if="showcorverview.bottom" class='scan-button' @click="scanCode(1)">{{scanbuttonname}}</cover-view>
						<cover-view v-if="!showcorverview.bottom&&!actives" class='scan-button-big' @click="creatStop">{{scanbuttonname}}</cover-view>
					</cover-view>
				</map>
				<view v-if="actives">
					<view class='scroll-viewy'>
						<base-img></base-img>
						<view class='border-view'>
							<input class='normal-input' v-model="stopName" type="text" placeholder="车站名称">
						</view>
						<view class='border-view'>
							<view class='normal-input' @click="choseStopLev('middle-list')">{{defaultLev}}</view>
						</view>
						<view class='border-view'>
							<input class='normal-input' v-model="stopRadius" type="text" placeholder="半径">
						</view>
						<view class='border-view'>
							<input class='normal-input' v-model="stopDesc" type="text" placeholder="描述(限50字)">
						</view>
						<view>
							<button type='primary' class='share-button-default' @click="finshCreat">提交</button>
						</view>
					</view>
					<uni-popup :show="poptype ==='middle-list'" position="middle" mode="fixed" @hidePopup="togglePopup('')">
						<view :scroll-y="true" class="uni-center center-box">
							<view v-for="(item, index) in itemcells" :key="index" @click="selectLev(item)" style="width:180upx;height: 70upx;">
								<text>{{item}}</text>
							</view>
						</view>
					</uni-popup>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import scanbutton from '@/components/scanbutton.vue'
	import baseheader from '@/components/basehead/basehead.vue'
	import baseImg from '@/components/image/image.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'


	export default {
		components: {
			scanbutton,
			baseheader,
			baseImg,
			uniPopup
		},
		computed: mapState(['longitude', 'latitude', 'mapcovers', 'imgarr','bikeinfo']),
		data() {
			return {
				endmove: false,
				isActive: -1,
				selectvals: 100,
				stopName: '',
				defaultLev: '选择等级',
				stopRadius: '',
				stopDesc: '',
				poptype: '',
				itemcells: ['1级', '2级', '3级'],
				actives: false,
				urls: '',
				title: 'map',
				type: '0',
				scanbuttonname: '扫一扫',
				headviewtext: '',
				showcorverview: {
					head: true,
					bottom: true
				},
				// latitude: 26.0527,
				showmapselect: false,
				// longitude: 119.31414,
				mapinfo: null,
				scale: '13', //缩放级别5-18
				showLocation: false,
				selectcoverdata: [{
						name: '全部换电',
						id: '0',
						val: 100,
					},
					{
						name: '所有35%以下',
						id: '1',
						val: 35,
					},
					{
						name: '所有30%以下',
						id: '2',
						val: 30,
					},
					{
						name: '所有20%以下',
						id: '3',
						val: 20,
					},
					{
						name: '所有10%以下',
						id: '4',
						val: 10,
					},
					// {
					// 	name: '低于可用里程',
					// 	id: '5',
					// 	active: false
					// },
					{
						name: '欠压车辆',
						id: '6',
						val: 0,
					},
				],
				covers: [],
				circles: [{ //在地图上显示圆
					latitude: 26.0627,
					longitude: 119.31414,
					fillColor: "#FFC41F", //填充颜色
					color: "#12A1DD", //描边的颜色
					radius: 200, //半径
					strokeWidth: 2 //描边的宽度
				}],
				polyline: [{ //指定一系列坐标点，从数组第一项连线至最后一项
					points: [

					],
					color: "#0000AA", //线的颜色
					width: 5, //线的宽度
					// dottedLine: true, //是否虚线
					arrowLine: true, //带箭头的线 开发者工具暂不支持该属性
				}],
				tempjindu: '',
				tempweidu: '',
				orderid: '',
			};
		},
		onLoad(e) {
			this.orderid = e.orderid
			this.endmove = e.endmove
			this.headviewtext = e.text
			this.type = e.type
			this.dowhat()
			if (this.mapinfo == null) {
				this.mapinfo = uni.createMapContext('firstmap')
			}

			// switch (self.type) {
			// 	case '0':
			// 		self.nearbyshortpower(100, res.longitude, res.latitude)
			// 		break
			// 	case '1.1':
			// 		self.nearbyfaultcar(res.longitude, res.latitude)
			// 		break
			// 	case '3.1':
			// 		self.nearbymovecar(res.longitude, res.latitude,'*')
			// 		break
			// }

			switch (e.type) {
				case '0':
					this.scanbuttonname = '扫码换电'
					this.nearbyshortpower(100, this.longitude, this.latitude)
					break;
				case '0.1':
					this.cartrack(this.bikeinfo.last_order_id)
					// 设置corver初始状态
					this.showcorverview = {
							head: false,
							bottom: false
						},
						// 多边形						
					this.covers = []
					break;
				case '1.1':
					this.scanbuttonname = '扫码入库'
					this.nearbyfaultcar(this.longitude, this.latitude)
					this.selectcoverdata = [{
							name: '全部故障车辆',
							id: '0',
						},
						{
							name: '未入库故障车辆',
							id: '1',
						},
						{
							name: '已入库故障车辆',
							id: '2',
						},
					]
					break;
				case '2':
				this.showcorverview = {
						head: false,
						bottom: true
					}
					break
				case '3.1':
					this.scanbuttonname = '扫码挪车'
					this.nearbymovecar(this.longitude, this.latitude, '*')
					// this.nearbycarinfo(2)
					this.selectcoverdata = [{
							name: '全部车站',
							id: '0',
						},
						{
							name: '供给不足车站',
							id: '1',
						},
						{
							name: '供给过量车站',
							id: '2',
						},
						{
							name: '预警车站',
							id: '3',
						},
						{
							name: '车效（中）车辆',
							id: '4',
						},
						{
							name: '车效（差）车辆',
							id: '5',
						},
						{
							name: '车效（极差）车辆',
							id: '6',
						},
						{
							name: '故障-维修入库',
							id: '7',
						},
						{
							name: '故障-未入库',
							id: '8',
						},
						{
							name: '12h+无人扫码车辆',
							id: '9',
						},
						{
							name: '24h+无人扫码车辆',
							id: '10',
						},
						{
							name: '1+不动车辆',
							id: '11',
						},
						{
							name: '2+不动车辆',
							id: '12',
						},
						{
							name: '3+不动车辆',
							id: '13',
						},
						{
							name: '7+不动车辆',
							id: '14',
						}
					]
					break;
				case '9':
					this.showcorverview.bottom = false
					this.scanbuttonname = '创建车站'
					this.selectcoverdata = [{
							name: '全部车站',
							id: '0',
						},
						{
							name: '已开启车站',
							id: '0',
						},
						{
							name: '已关闭车站',
							id: '0',
						},
					]
					break;


			}
			wx.setNavigationBarTitle({
				title: e.name
			})
			uni.getLocation({ //获取当前的位置坐标
				type: 'gcj02',
				success: (res) => {
					console.log('位置信息', res.longitude, res.latitude)
					this.setLongitude(res.longitude)
					this.setLatitude(res.latitude)
					this.tempjindu = res.longitude
					this.tempweidu = res.latitude
				},
				fail: (res) => {
					console.log('fail', res)
				}
			});
		},
		onShow(e) {

		},
		onReady() {

		},
		onUnload() {
			this.mapinfo = null
		},
		methods: {
			...mapMutations(['setSn', 'setBikeid', 'setBikeinfo', 'setLongitude', 'setLatitude', 'setOrderfirstid',
				'setOrderinfo', 'setMapcovers'
			]),
			showMapSelect() {
				this.showmapselect = !this.showmapselect
			},
			choseStopLev(type) {
				this.poptype = type
			},
			togglePopup(type) {
				this.poptype = type
			},
			selectLev(item) {
				this.defaultLev = item
				this.poptype = ''
			},
			selectsure() {
				this.showmapselect = false
				switch (this.type) {
					case '0':
						this.nearbyshortpower(this.selectvals, this.longitude, this.latitude)
						break;
					case '1.1':
						this.nearbyfaultcar(this.longitude, this.latitude)
						break;
				}

			},
			markclick(e) {
				console.log('e', e)
				var pointtype = '',
					bickcount = '',
					allkcount = '',
					pointname = ''
				// var pointname=''
				// tmpObjs.bickcount=res.parks[j].bike_count
				// tmpObjs.allkcount=res.parks[j].capacity			
				for (let k = 0; k < this.covers.length; k++) {
					if (this.covers[k].id == e.markerId) {
						pointtype = this.covers[k].type
						pointname = this.covers[k].name
						if (pointtype == 'stop') {
							bickcount = this.covers[k].bickcount
							allkcount = this.covers[k].allkcount
							this.setMapcovers(this.covers[k])
						}
						break
					}
				}
				if (this.type == '3.1') {
					if (pointtype == 'stop') {
						if (this.endmove) {
							uni.showModal({
								title: '确定挪到以下车站吗？',
								content: pointname,
								showCancel: true,
								cancelText: '取消',
								confirmText: '确定',
								success: res => {
									if (res.confirm) {
										this.endmovecars()
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								},
								fail: () => {},
								complete: () => {}
							});
						} else {
							uni.navigateTo({
								url: `/pages/movecarPage/stopdetilview/stopdetilview?name=${pointname}&&bickcount=${bickcount}&&allcount=${allkcount}&&id=${e.markerId}`,
								success: res => {},
								fail: () => {},
								complete: () => {}
							});
						}
					} else {
						this.setBikeid(e.markerId)
						this.getcarinfo()
					}
				} else {
					this.setBikeid(e.markerId)
					this.getcarinfo()
				}
			},
			// 点击创建车站
			creatStop() {
				this.actives = true
			},
			// 结束挪车
			endmovecars() {
				uni.getLocation({ //获取当前的位置坐标
					type: 'gcj02',
					success: (res) => {
						var options = {
							url: '/rporder/finish', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"order_id": this.orderid,
								"user_coordinate": [
									res.longitude, res.latitude
								]
							}
						}
						this.$httpReq(options).then((res) => {
							// 请求成功的回调
							// res为服务端返回数据的根对象
							console.log('挪车', res)
							if (res.status == 0) {
								uni.showToast({
									title: '挪车成功',
									mask: false,
									duration: 3000
								});
							} else {
								uni.showToast({
									title: res.message ? res.message : '挪车失败',
									mask: false,
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
			// 提交创建车站
			finshCreat() {
				var level = parseInt(this.defaultLev.replace('级', ''))
				console.log('level', level)
				this.creatStopurl(level)
				setTimeout(() => {
					this.actives = false
				}, 2000)
			},
			active(index, item) {
				this.isActive = index
				this.selectvals = item.val
				// for (let i = 0; i < this.selectcoverdata.length; i++) {
				// 	this.selectcoverdata[i].active = false
				// }
				// this.selectcoverdata[index].active = true
			},
			functionNames() {

			},
			// 移动地图获取中心点坐标
			functionName() {
				let self = this
				this.mapinfo.getCenterLocation({
					success: (res) => {
						self.tempjindu = res.longitude
						self.tempweidu = res.latitude
						// self.nearbycarinfo(2)
						switch (self.type) {
							case '0':
								self.nearbyshortpower(100, res.longitude, res.latitude)
								break
							case '1.1':
								self.nearbyfaultcar(res.longitude, res.latitude)
								break
							case '3.1':
								self.nearbymovecar(res.longitude, res.latitude, '*')
								break
						}
					},
					fail: (res) => {
						console.log('fail' + res);
					}
				})
			},
			// 附近需要挪的车
			nearbymovecar(longitude, latitude, reparklev) {
				var options = {
					url: '/bike/list_to_repark_nearby', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"coordinate": [
							longitude,
							latitude
						],
						"repark_index": reparklev,
						"flag": 1
						// "is_under_volt": 1
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('挪车列表', res)
					if (res.status == 0) {
						this.covers = []
						var temparr = []
						for (let i = 0; i < res.list.length; i++) {
							let tmpObj = {}
							tmpObj.id = res.list[i].id
							if (!!res.list[i].coordinate) {
								tmpObj.latitude = res.list[i].coordinate[1]
								tmpObj.longitude = res.list[i].coordinate[0]
							}
							tmpObj.name = res.list[i].name
							tmpObj.iconPath = '../../static/mapicon/car_normal.png'
							tmpObj.type = 'car'
							tmpObj.width = 39
							tmpObj.height = 48
							temparr.push(tmpObj)
							// this.covers.push(tmpObj)
						}
						for (let j = 0; j < res.parks.length; j++) {
							let tmpObjs = {}
							tmpObjs.id = res.parks[j].id
							if (!!res.parks[j].coordinate) {
								tmpObjs.latitude = res.parks[j].coordinate[1]
								tmpObjs.longitude = res.parks[j].coordinate[0]
							}
							tmpObjs.name = res.parks[j].name
							tmpObjs.iconPath = '../../static/mapicon/stop_0.png'
							tmpObjs.type = 'stop'
							tmpObjs.bickcount = res.parks[j].bike_count
							tmpObjs.allkcount = res.parks[j].capacity
							tmpObjs.radius = res.parks[j].radius
							tmpObjs.remark = res.parks[j].remark
							tmpObjs.grade = res.parks[j].grade
							// tmpObjs.allkcount = res.parks[j].capacity
							tmpObjs.width = 39
							tmpObjs.height = 48
							temparr.push(tmpObjs)
							// this.covers.push(tmpObjs)
						}
						this.covers = temparr
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 附近需要换电的车辆
			nearbyshortpower(max, longitude, latitude) {
				var options = {
					url: '/bike/list_to_change_battery_nearby', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"coordinate": [
							longitude,
							latitude
						],
						"battery_level_max": max,
						// "is_under_volt": 1
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('附近缺电车辆', res)
					if (res.status == 0) {
						this.covers = []
						for (let i = 0; i < res.list.length; i++) {
							let tmpObj = {}
							tmpObj.id = res.list[i].id
							tmpObj.latitude = res.list[i].coordinate[1]
							tmpObj.longitude = res.list[i].coordinate[0]
							tmpObj.iconPath = '../../static/mapicon/car_normal.png'
							tmpObj.width = 39
							tmpObj.height = 48
							this.covers.push(tmpObj)
						}
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 车辆轨迹
			cartrack(orderid) {
				var options = {
					url: '/urorder/info', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"order_id": orderid
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('车辆轨迹', res)
					if (res.status == 0) {
						var temparr=[]
						for(let i=0;i<res.info.track.length;i++){
							var jwd={
								longitude:res.info.track[i][0],
								latitude:res.info.track[i][1]
							}
							temparr.push(jwd)
						}
						this.polyline[0].points=temparr
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 附近故障的车辆
			nearbyfaultcar(longitude, latitude) {
				var options = {
					url: '/bike/list_to_repair_nearby', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"coordinate": [
							longitude,
							latitude
						],
						"inv_state": 2
						// "is_under_volt": 1
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('故障车辆', res)
					if (res.status == 0) {
						this.covers = []
						for (let i = 0; i < res.list.length; i++) {
							let tmpObj = {}
							tmpObj.id = res.list[i].id
							tmpObj.latitude = res.list[i].coordinate[1]
							tmpObj.longitude = res.list[i].coordinate[0]
							tmpObj.iconPath = '../../static/image/0-small.png'
							this.covers.push(tmpObj)
						}
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			scanCode(type) {
				if (type == 1) {
					uni.scanCode({
						onlyFromCamera: true, //只允许相机扫码
						success: res => {
							console.log('saoma', res)
							var bikesn = res.result.match(/\?bikesn=(.*)/)[1]
							this.setSn(bikesn)
							this.getcarinfo()
							// 入库和维修要先请求订单信息
							// if (this.type == '1.1' || this.type == '1.3') {
							// 	var datas = {}
							// 	if (this.type == '1.1') {
							// 		datas = {
							// 			"is_order_finished": 0,
							// 			"pno": 1,
							// 			"psize": 100,
							// 			"order_state": 0,
							// 		}
							// 	} else {
							// 		datas = {
							// 			"is_order_finished": 0,
							// 			"pno": 1,
							// 			"psize": 100,
							// 		}
							// 	}
							// 	this.requestorder(datas)
							// } else {
							// }
						},
						fail: res => {},
						complete: res => {
						}
					});
				} else {
					uni.navigateTo({
						url: `/pages/manualscan/manualscan?urls=${this.urls}&&type=${this.type}`
					})
				}

			},
			dowhat() {
				switch (this.type) {
					case '0':
						this.urls = '/pages/swapbattery/swapbattery'
						break;
					case '1.3':
						this.urls = '/pages/repairPage/repaircar/repaircar'
						break;
					case '1.1':
						this.urls = '/pages/repairPage/putstorage/putstorage'
						break;
					case '2':
						this.urls = '/pages/maintainPage/normalmaintain/normalmaintain'
						break;	
					case '3.1':
						this.urls = '/pages/movecarPage/checkupcar/checkupcar'
						break;
				}
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
							url: this.urls,
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
			// 车站列表
			nearbycarinfo(flag) {
				var options = {
					url: '/city/city_object_nearby', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"coordinate": [
							this.longitude,
							this.latitude
						],
						"flag": flag //1服务区，2车站
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('附近车站信息', res)
					if (res.status == 0) {
						this.covers.push()
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 创建车站
			creatStopurl(level) {
				var options = {
					url: '/park/add', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"name": this.stopName,
						"remark": this.stopDesc,
						"coordinate": [
							this.tempjindu,
							this.tempweidu
						],
						"radius": 1000,
						"capacity": 10,
						"state": 0,
						"type": "SCHOOL",
						"grade": level,
						"imgs": this.imgarr
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					if (res.status == 0) {
						uni.showToast({
							title: '创建车站成功',
							mask: false,
							duration: 2500
						});
					} else {
						uni.showToast({
							title: res.message ? res.message : '创建车站失败',
							mask: false,
							duration: 2500
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
					console.log('订单列表', res)
					if (res.status == 0 && res.list.length != 0) {
						this.setOrderfirstid(res.list[0].id)
						this.setOrderinfo(res.list[0])
						uni.navigateTo({
							url: this.urls,
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
		}
	}
</script>

<style lang="scss" scoped>
	.activemap {
		height: 35vh !important;
	}

	.scroll-viewy {
		height: 65vh;
		overflow-y: auto;
		margin: 0 22upx;

		.border-view {
			border: 1upx bolid black;
			background-color: rgba(225, 225, 225, .7);
			margin: 20upx 0;
			height: 70upx;
			line-height: 70upx;

			.normal-input {
				line-height: 70upx;
				height: 70upx;
				padding-left: 30upx;
				// background: yellow;
			}
		}
	}

	.map-base-view {
		height: calc(100vh - 80upx);
		width: 100%;

		.cover-imgs {
			position: absolute;
			left: 46%;
			top: 38%;
			width: 50upx;
			height: auto;
		}

		.map-cover-view {
			width: 100%;
			display: flex;
			height: 100upx;
			position: absolute;
			// left: 10%;
			bottom: 60upx;
			text-align: center;
			font-size: 40upx;
			justify-items: center;

			.center-box {
				height: 200upx;
				width: 140upx;
			}



			// justify-content: center;
			.scan-button {
				background-color: #F6C700;
				border-radius: 20upx;
				width: 50%;
				margin: 0 30upx;
				line-height: 100upx;
			}

			.scan-button-big {
				background-color: #F6C700;
				border-radius: 20upx;
				width: 100%;
				margin: 0 30upx;
				line-height: 100upx;
			}
		}

		.map-select-view {
			width: 100%;
			// height: 420upx;
			position: absolute;
			left: 0;
			background-color: white;
			text-align: center;
			font-size: 40upx;
			background-color: #efeff2;
			font-size: 14px;

			.select-sure {
				margin-top: 30upx;
				height: 90upx;
				line-height: 80upx;
				width: 90%;
				background-color: #F6C700;
				border-radius: 8upx;
				margin-left: 5%;
			}

			.select-list {
				display: flex;
				// justify-content: space-around;
				flex-wrap: wrap;
				background-color: white;

				cover-view {
					width: calc(50% - 4upx);
					border: 1upx solid rgba(245, 245, 245, 1);
					height: 80upx;
					line-height: 80upx;
				}

				.borderrights {
					// border-right: 1upx solid gray;
					color: #F6C700;
					border: 1upx solid #F6C700;
				}
			}
		}
	}
</style>
