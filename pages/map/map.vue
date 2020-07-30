<template>
	<view>
		<view v-if="showcorverview.head" style='height: 6vh;width:100%;background-color:rgba(100,100,100,.5);'>
			<baseheader :title="headviewtext" @show='showMapSelect' :hasBack='true' :xialajiantou='true'></baseheader>
		</view>
		<view class="page-body">
			<view class="page-section page-section-gap">
				<!-- <map class='map-base-view' :class="{activemap:actives}" :style="{height:(!showcorverview.bottom&&!actives&&!hidebutton||type==0.1?'100vh':'84vh')}" -->
				<map class='map-base-view' :style="{height:mapheihts}"
				 :scale="scale" id='firstmap' :latitude="latitude" :longitude="longitude" :markers="covers" :show-location='showLocation'
				 :circles='circles' :polyline="polyline" @markertap='markclick' @controltap='mapcentionloc' :polygons='polygon' @regionchange="functionNames"
				 @end="functionName" :controls='maploc' @tap='creatStopServ'>
					<cover-image  src='../../static/mapicon/center.png' class='cover-imgs'></cover-image>
					<!-- <cover-view v-if="actives" class='movecar-view'>拖动地图选择车站</cover-view> -->
					<cover-view v-if="showmapselect" class='map-select-view'>
						<cover-view class='select-list'>
							<cover-view v-for="(item,i) in selectcoverdata" @click="active(i,item)" :class="{'borderrights':i==isActive}"
							 :key=i>{{item.name}}</cover-view>
						</cover-view>
						<cover-view class='select-sure' @click="selectsure">确定</cover-view>
					</cover-view>
					<cover-view v-if="getorder()" class='movecar-view' @click='goingview'>{{ingtext}}</cover-view>
					<cover-view class='map-cover-view'>
						<!-- <cover-view v-if="showcorverview.bottom" class='scan-button' @click="scanCode(0)">手动输入</cover-view>
						<cover-view v-if="showcorverview.bottom" class='scan-button' @click="scanCode(1)">{{scanbuttonname}}</cover-view> -->
						<cover-view v-if="!showcorverview.bottom&&!actives&&!hidebutton" class='scan-button-big' @click="creatStop">{{scanbuttonname}}</cover-view>
					</cover-view>
				</map>
				<view v-if="actives && type==9">
					<view class='scroll-viewy'>
						<base-img v-if="!editstop"></base-img>
						<view class='border-view'>
							<input class='normal-input' v-model="stopName" type="text" placeholder="车站名称">
						</view>
						<!-- <view class='border-view'>
							<view class='normal-input' @click="choseStopLev('middle-list')">{{defaultLev}}</view>
						</view> -->
						<view class='border-view'>
							<input class='normal-input' v-model="stopVolume" type="text" placeholder="车站容量">
						</view>
						<view class='border-view'>
							<input class='normal-input' v-model="stopRadius" type="text" placeholder="半径">
						</view>
						<view class='border-view'>
							<input class='normal-input' v-model="stopDesc" type="text" placeholder="描述(限50字)">
						</view>
						<view class='open-close' v-if="editstop">
							<!-- <view class="uni-list-cell uni-list-cell-pd"> -->
							<view class="opclose-text">{{openclosestop}}</view>
							<switch checked @change="switch1Change" />
							<!-- </view> -->
						</view>
						<view v-if="editstop">
							<button type='warn' style='margin-bottom: 20upx;' @click="delstop">删除</button>
						</view>
						<view>
							<button type='primary' class='' @click="finshCreat">提交</button>
						</view>

					</view>
					<uni-popup :show="poptype ==='middle-list'" position="bottom" mode="fixed" @hidePopup="togglePopup('')">
						<view :scroll-y="true" class="uni-center center-box">
							<view v-for="(item, index) in itemcells" :key="index" @click="selectLev(item)" style="width:180upx;height: 70upx;">
								<text>{{item}}</text>
							</view>
						</view>
					</uni-popup>
				</view>
				<view v-if="type==9.1">
					<view class='scroll-viewy'>
						<!-- <base-img v-if="!editstop"></base-img> -->
						<view class='border-view'>
							<input class='normal-input' v-model="stopName" type="text" placeholder="停车区名称">
						</view>
						<view class='border-view'>
							<input class='normal-input' v-model="stopVolume" type="text" placeholder="停车区容量">
						</view>

						<view class='open-close' v-if="editstop">
							<!-- <view class="uni-list-cell uni-list-cell-pd"> -->
							<view class="opclose-text">{{openclosestop}}</view>
							<switch checked @change="switch1Change" />
							<!-- </view> -->
						</view>
						<view v-if="editstop">
							<button type='warn' style='margin-bottom: 20upx;' @click="delstop">删除</button>
						</view>
						<view class='creatStopServ'>
							<button type='primary' class='leftBtn btn' @click="chosePoint">选择锚点</button>
							<!-- <button type='primary' class='leftBtn btn' @click="cleanPoint">清空锚点</button> -->
							<button type='primary' class='rightBtn btn' @click="finshCreatServ">完成创建</button>
						</view>

					</view>
				</view>
				<!-- 地图时间选择 -->
				<view v-if='type==0.4' class='timeselect'>
					<view class='timedetil' @tap="toggleTab(1)">
						<view class='wenzi'>开始</view>
						<view>{{start_time}}</view>
					</view>
					<yu-datetime-picker @confirm="onConfirm" startYear="2015" ref="dateTime" value="2020-01-01 00:00:00" :isAll="true"
					 :current="false"></yu-datetime-picker>				 
					<view class='timedetil' @tap="toggleTab(2)">
						<view class='wenzi'>结束</view>
						<view>{{end_time}}</view>
					</view>
					<!-- <calendar @change="change" :startDate="initStartDate" :endDate="initEndDate" :daysCount="daysCount"></calendar> -->
				</view>
				<view v-if="showcorverview.bottom" style='margin-top: 10upx;'>
					<base-input @scanCode='scanCode(1)' @goPage='goNewPage' :title='inputval' @hidekeygo='manualsgo'></base-input>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	var blueWriteState = 0,
		loadtime = 1000
	import scanbutton from '@/components/scanbutton.vue'
	import baseheader from '@/components/basehead/basehead.vue'
	import baseInput from '@/components/baseinput/baseinput.vue'
	import baseImg from '@/components/image/image.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import yuDatetimePicker from "@/components/yu-datetime-picker.vue"
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import ble from '../../common/xa-bluetooth.js'


	export default {
		components: {
			scanbutton,
			baseheader,
			baseImg,
			uniPopup,
			baseInput,
			yuDatetimePicker
		},
		computed: mapState(['longitude', 'latitude', 'mapcovers', 'imgarr', 'bikeinfo', 'movecarorder', 'orderid',
			'endmove', 'blueres', 'bluestate', 'blueconectstate', 'blueconectstate'
		]),
		data() {
			return {
				timeflag:0,
				start_time: '2020-03-20 00:00:00',
				end_time: "2020-03-20 23:00:00",
				mapheihts:'50vh',
				clicksuccess: false,
				maploc: [{
						id: 88,
						position: {
							left: 10,
							top: 50,
							width: 50,
							height: 50
						},
						iconPath: '../../static/image/location.png',
						clickable: true,
					},
					// {
					// id:89,
					// position:{left:10,top:100,width:50,height:50},
					// iconPath:'../../static/image/location.png',
					// clickable:true,
					// },
				],
				inputval: '',
				isActive: -1,
				selectvals: 100,
				stopName: '',
				defaultLev: '1级',
				stopRadius: "",
				stopVolume: '',
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
				showmapselect: false,
				mapinfo: null,
				scale: '18', //缩放级别5-18
				showLocation: true,
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
				circles: [],
				polyline: [{ //指定一系列坐标点，从数组第一项连线至最后一项
					points: [

					],
					color: "#0000AA", //线的颜色
					width: 5, //线的宽度
					// dottedLine: true, //是否虚线
					arrowLine: true, //带箭头的线 开发者工具暂不支持该属性
				}],
				polygon: [{ //指定一系列坐标点，从数组第一项连线至最后一项
					points: [
				
					],
					strokeColor: "#0000AA", //线的颜色
					strokeWidth: 5, //线的宽度
				}],
				tempjindu: '',
				tempweidu: '',
				// orderid: '',
				hidebutton: false,
				ingtext: '挪车中车辆：1', //正在进行中订单标题
				inglength: 0, //是否有正在进行中的订单
				userinfo: {},
				editstop: false,
				openclosestop: '开启',
				gobeltimestr: 0,
				timestrArr: [],
				polylinePoint:[],
				polylinePoints:[],
				locationtime:'',
			};
		},
		onLoad(e) {
			this.type = e.type
			this.mapheihts='85vh'
			this.polylinePoint=[]
			this.polylinePoints=[]
			if(this.type!='0.3'){
				uni.getLocation({ //获取当前的位置坐标
					type: 'gcj02',
					success: (res) => {
						console.log('位置信息', res.longitude, res.latitude)
						this.setLongitude(res.longitude)
						this.setLatitude(res.latitude)
						this.tempjindu = res.longitude
						this.tempweidu = res.latitude
						setTimeout(() => {
							var citycenter = this.userinfo.cities[0].coordinate
							var distances = this.getFlatternDistance(parseFloat(citycenter[0]), parseFloat(citycenter[1]), res.longitude,
								res.latitude)
							// var distances=this.getFlatternDistance(119.283383,26.131703,119.285615,26.123959)
							console.log('juli', distances)
							if (distances / 1000 > 30) {
								uni.showModal({
									title: '当前距离服务区过远',
									content: '是否切换到服务区？',
									showCancel: true,
									cancelText: '不切换',
									confirmText: '切换',
									success: res => {
										if (res.confirm) {
											this.setLongitude(citycenter[0])
											this.setLatitude(citycenter[1])
										} else if (res.cancel) {
				
										}
									},
									fail: () => {},
									complete: () => {}
								});
				
							}
							console.log('距离城市中心点距离为', distances)
						}, 1000);
				
					},
					fail: (res) => {
						console.log('fail', res)
					}
				});		
			}else{				
				this.locationtime=setInterval(()=>{
					this.setBikeid(this.bikeinfo.id)
					this.getcarinfo()
				},5000)
			}
				
			// this.orderid = e.orderid
			// this.endmove = e.endmove
			try {
				const value = uni.getStorageSync('userinfo');
				if (value) {
					this.userinfo = value
				}
			} catch (e) {
				// error
			}
			this.headviewtext = e.text	
			this.dowhat()
			if (this.mapinfo == null) {
				this.mapinfo = uni.createMapContext('firstmap')
			}
			if (!!e.name) {
				wx.setNavigationBarTitle({
					title: e.name
				})
			}
		},
		onShow() {
			this.clicksuccess = false
			setTimeout(() => {
				this.serverice(this.longitude, this.latitude)
				switch (this.type) {
					case '0':
						this.scanbuttonname = '扫码换电'
						this.changeingbattery()
						this.nearbyshortpower(this.selectvals, this.longitude, this.latitude, '*')
						break;
					case '0.1':
						this.hidebutton = true
						this.mapheihts='99vh'
						this.cartrack(this.bikeinfo.last_order_id)
						// 设置corver初始状态
						this.showcorverview = {
								head: false,
								bottom: false
							},
							// 多边形						
							this.covers = []
						break;
					case '0.2':
						this.hidebutton = true
						let tembikeinfos = {}
						tembikeinfos.latitude = this.bikeinfo.last_scaned_user_coordinate[1]
						tembikeinfos.longitude = this.bikeinfo.last_scaned_user_coordinate[0]
						tembikeinfos.iconPath = '/static/mapicon/car_normal.png'
						tembikeinfos.width = 39
						tembikeinfos.height = 48
						this.covers[0] = tembikeinfos
						this.showcorverview = {
							head: true,
							bottom: true
						}
						break;
					case '0.3':
						this.hidebutton = true
						// this.covers[0].name = res.parks[j].name
						let tembikeinfo = {}
						tembikeinfo.latitude = this.bikeinfo.coordinate[1]
						tembikeinfo.longitude = this.bikeinfo.coordinate[0]
						this.setLatitude(this.bikeinfo.coordinate[1])
						this.setLongitude(this.bikeinfo.coordinate[0])
						tembikeinfo.iconPath = '/static/mapicon/car_normal.png'
						tembikeinfo.width = 39
						tembikeinfo.height = 48
						this.covers[0] = tembikeinfo
						// 设置corver初始状态
						this.showcorverview = {
							head: true,
							bottom: true
						}
						// 多边形						
						// this.covers = []
						break;
					case '0.4':
					    this.mapheihts='94vh'
						this.hidebutton = true
						// 设置corver初始状态
						this.showcorverview = {
							head: false,
							bottom: false
						}
						var date = new Date()
						var seperator1 = "-";
						var seperator2 = ":";
						var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
						var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
						var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
							" " + date.getHours() + seperator2 + date.getMinutes() +
							seperator2 + date.getSeconds()
						this.start_time = date.getFullYear() + seperator1 + month + seperator1 + strDate +
							" " + '00' + seperator2 + '00' +
							seperator2 + '00'
						this.end_time = date.getFullYear() + seperator1 + month + seperator1 + strDate +
							" " + '23' + seperator2 + '59' +
							seperator2 + '59'
						this.getbiketrack(this.bikeinfo.sn)	
						// 多边形						
						// this.covers = []
						break;	
					case '1.1':
						this.scanbuttonname = '扫码入库'
						var setectval = (this.selectvals == 100) ? 0 : this.selectvals
						this.nearbyfaultcar(this.longitude, this.latitude, setectval)
						// this.nearbyfaultcar(this.longitude, this.latitude, this.selectvals)
						this.selectcoverdata = [{
								name: '全部故障车辆',
								id: '0',
								val: '*'
							},
							{
								name: '未入库故障车辆',
								id: '1',
								val: '0'
							},
							{
								name: '已入库故障车辆',
								id: '2',
								val: '2'
							},
						]
						break;
					case '2':
						this.showcorverview = {
							head: false,
							bottom: true
						}
						this.mapheihts='90vh'
						this.maintainbikelist(this.longitude, this.latitude)
						break
					case '3.1':
						// this.showcorverview.head = false
						this.movingbike()
						this.scanbuttonname = '扫码挪车'
						if (this.selectvals == 100) {
							this.nearbymovecar(this.longitude, this.latitude, "*", '*')
						} else {
							// 服务区外车辆
							if (this.selectvals == 21 || this.selectvals == 11) {
								this.nearbymovecar(this.longitude, this.latitude, '*', parseInt(this.selectvals))
							} else {
								this.nearbymovecar(this.longitude, this.latitude, parseInt(this.selectvals), '*')
							}
						}
						// this.nearbymovecar(this.longitude, this.latitude, '*','*')
						// this.nearbycarinfo(2)
						this.selectcoverdata = [{
								name: '全部车站',
								val: '0',
							},
							{
								name: '1+不动车辆',
								val: '1',
							},
							{
								name: '2+不动车辆',
								val: '2',
							},
							{
								name: '3+不动车辆',
								val: '3',
							},
							{
								name: '4+不动车辆',
								val: '4',
							},
							{
								name: '禁停区内车辆',
								val: '11',
							},
							{
								name: '服务区外车辆',
								val: '21',
							},
						]
						break;
					case '9':
						this.showcorverview.head = false
						this.showcorverview.bottom = false
						this.mapheihts='100vh'
						this.scanbuttonname = '创建车站'
						// this.nearbymovecar(this.longitude, this.latitude, '*')
						this.stoplist(this.longitude, this.latitude, '*')
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
					case '9.1':
						this.mapheihts='100vh'
						this.showcorverview.head = false
						this.showcorverview.bottom = false
						this.scanbuttonname = '创建停车区'
						this.stoplist(this.longitude, this.latitude, '*')
						// this.selectcoverdata = [{
						// 		name: '全部车站',
						// 		id: '0',
						// 	},
						// 	{
						// 		name: '已开启车站',
						// 		id: '0',
						// 	},
						// 	{
						// 		name: '已关闭车站',
						// 		id: '0',
						// 	},
						// ]
						break;
				}
			}, 1000)
		},
		onUnload() {
			this.mapinfo = null
			uni.closeBluetoothAdapter({
				success(res) {
					console.log(res)
				}
			})
			clearInterval(this.locationtime)
			this.locationtime=null
		},
		methods: {
			...mapMutations(['setSn', 'setBikeid', 'setBikeinfo', 'setLongitude', 'setLatitude', 'setOrderfirstid',
				'setOrderinfo', 'setMapcovers', 'setInginfo'
			]),
			toggleTab(item) {
				this.timeflag=item
			    this.$refs.dateTime.show();  
			}, 
			onConfirm(val) {
				console.log(val);
				if (this.timeflag == 1) {
					this.start_time = val.selectRes
				} else {
					this.end_time = val.selectRes
				}
				if (!!this.bikeinfo.sn) {
					this.getbiketrack(this.bikeinfo.sn)
				}
			},
			getbiketrack(sn){
				var options = {
					url: '/bike/query_track', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
				         from_xiao_an: 0,
						 sn: sn,
						 end_time:this.end_time,
						 start_time:this.start_time
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('车辆轨迹', res)
					if (res.status == 0) {
						var temarr=[]
						var temparr = []			
						let tempobj0 = {},
							tempobj1 = {}					
						this.circles = []
						let circlepoint = []
						tempobj0.id = 0
						tempobj0.longitude = res.track[0][0]
						tempobj0.latitude = res.track[0][1]
						tempobj0.iconPath = '/static/mapicon/start.png'
						tempobj0.width = 39
						tempobj0.height = 48
						tempobj1.id = 1
						tempobj1.longitude = res.track[res.track.length - 1][0]
						tempobj1.latitude = res.track[res.track.length - 1][1]
						tempobj1.iconPath = '/static/mapicon/end.png'
						tempobj1.width = 39
						tempobj1.height = 48
						temarr.push(tempobj0)
						temarr.push(tempobj1)
						this.covers = temarr
						this.circles = []
						for (let i = 0; i < res.track.length; i++) {
							var jwd = {
								longitude: res.track[i][0],
								latitude: res.track[i][1]
							}
							let circleobj = {
								longitude: res.track[i][0],
								latitude: res.track[i][1],
								color: '#DC143C',
								fillColor: '#DC143C',
								radius: 4					
							}
							temparr.push(jwd)
							circlepoint.push(circleobj)
						}
						this.circles = circlepoint
						this.polyline[0].points = temparr
						this.polyline[0].color = "#0000AA" //线的颜色
						this.polyline[0].width = 3 //线的宽度
						// dottedLine: true, //是否虚线
						this.polyline[0].arrowLine = true
						console.log('this.covers', this.covers);
					} else {
						uni.showToast({
							title: res.message ? res.message : '获取轨迹失败',
							icon: 'none'
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			switch1Change(e) {
				if (e.target.value) {
					this.openclosestop = '开启'
				} else {
					this.openclosestop = '关闭'
				}
			},
			getRad(d) {
				var PI = Math.PI;
				return d * PI / 180.0;
			},
			// 计算当前位置跟城市中心点距离
			getFlatternDistance(lat1, lng1, lat2, lng2) {
				var f = this.getRad((lat1 + lat2) / 2);
				var g = this.getRad((lat1 - lat2) / 2);
				var l = this.getRad((lng1 - lng2) / 2);

				var sg = Math.sin(g);
				var sl = Math.sin(l);
				var sf = Math.sin(f);

				var s, c, w, r, d, h1, h2;
				var a = 6378137;
				var fl = 1 / 298.257;

				sg = sg * sg;
				sl = sl * sl;
				sf = sf * sf;

				s = sg * (1 - sl) + (1 - sf) * sl;
				c = (1 - sg) * (1 - sl) + sf * sl;

				w = Math.atan(Math.sqrt(s / c));
				r = Math.sqrt(s * c) / w;
				d = 2 * w * a;
				h1 = (3 * r - 1) / 2 / c;
				h2 = (3 * r + 1) / 2 / s;

				return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg));
			},
			manualsgo() {
				this.getcarinfo()
			},
			goNewPage(item) {
				this.setSn(item)
				this.getcarinfo()
			},
			getorder() {
				var test = false
				if (this.type == 3.1) {
					if (this.inglength > 0) {
						test = true
					}
				} else if (this.type == 0 && this.inglength > 0) {
					test = true
				} else {
					test = false
				}
				return test
			},
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
						var undervolt = '*'
						if (this.selectvals == 0) {
							undervolt = 1
						}
						this.nearbyshortpower(this.selectvals, this.longitude, this.latitude, undervolt)
						break;
					case '1.1':
						var setectval = (this.selectvals == 100) ? 0 : this.selectvals
						this.nearbyfaultcar(this.longitude, this.latitude, setectval)
						break;
					case '3.1':
						if (this.selectvals == 100) {
							this.nearbymovecar(this.longitude, this.latitude, "*", '*')
						} else {
							// 服务区外车辆
							if (this.selectvals == 21 || this.selectvals == 11) {
								this.nearbymovecar(this.longitude, this.latitude, '*', parseInt(this.selectvals))
							} else {
								this.nearbymovecar(this.longitude, this.latitude, parseInt(this.selectvals), '*')
							}
						}
						break
				}

			},
			creatStopServ(e){
							
			},
			chosePoint(){
				if(this.type=='9.1'){								
					var jwd = {
						longitude: this.tempjindu,
						latitude: this.tempweidu
					}
					var temparr=[this.tempjindu,this.tempweidu]
					this.polylinePoints.push(temparr)
					this.polylinePoint.push(jwd)					
					this.polyline[0].color = "#0055ff", //线的颜色
					this.polyline[0].width = 2, //线的宽度
					this.polyline[0].arrowLine = true, //带箭头的线 开发者工具暂不支持该属性
					this.polyline[0].points=this.polylinePoint	
					// console.log(4444,this.polyline[0].points)			
				}				
			},
			cleanPoint(){
				   this.polyline[0].points=[]
				   this.polylinePoint=[]
				   // this.polylinePoints.pop()
				   this.polygon[0].points=[]
			},
			finshCreatServ(){
				if (this.stopName == '') {
					uni.showToast({
						title: '车站名称不能为空',
						icon: 'none',
						duration: 2000,
					});
					return
				}
				if (this.stopVolume == '') {
					uni.showToast({
						title: '车站容量不能为空',
						icon: 'none',
						duration: 2000,
					});
					return
				}
				this.polyline[0]=[]
				this.polygon[0].points=this.polylinePoint
				// this.creatStopurl(level)
				this.polylinePoints.push(this.polylinePoints[0])
				this.creatStopurl(0,1,"*",this.polylinePoints)				
			},
			markclick(e) {
				var pointtype = '',
					bickcount = '',
					allkcount = '',
					pointname = '',
					parkid = ""
				for (let k = 0; k < this.covers.length; k++) {
					if (this.covers[k].id == e.markerId) {
						pointtype = this.covers[k].type
						pointname = this.covers[k].name
						if (pointtype == 'stop') {
							bickcount = this.covers[k].bickcount
							allkcount = this.covers[k].allkcount
							parkid = this.covers[k].parkid
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
										this.endmovecars(parkid)
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								},
								fail: () => {},
								complete: () => {}
							});
						} else {
							if (this.clicksuccess == false) {
								uni.navigateTo({
									url: `/pages/movecarPage/stopdetilview/stopdetilview?name=${pointname}&&bickcount=${bickcount}&&allcount=${allkcount}&&id=${e.markerId}`,
									success: res => {
										this.clicksuccess = true
									},
									fail: () => {},
									complete: () => {}
								});
							}
						}
					} else {
						this.setBikeid(e.markerId)
						this.getcarinfo()
					}
				} else if (this.type == '9') {
					uni.showModal({
						title: '编辑车站',
						content: pointname,
						showCancel: true,
						cancelText: '取消',
						confirmText: '编辑',
						success: res => {
							if (res.confirm) {
								console.log('parkid', parkid)
								// this.deletestop(parkid)
								this.actives = true
								this.editstop = true
								// uni.navigateTo({
								// 	url: '',
								// 	success: res => {},
								// 	fail: () => {},
								// 	complete: () => {}
								// });
								this.stopName = this.mapcovers.name
								this.stopVolume = this.mapcovers.allkcount
								this.stopRadius = this.mapcovers.radius
								this.stopDesc = this.mapcovers.remark
								this.mapheihts='35vh'
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						},
						fail: () => {},
						complete: () => {}
					});
				} else {
					if (this.type != '0.1') {
						this.setBikeid(e.markerId)
						this.getcarinfo()
					}
				}
			},
			// 删除车站
			delstop() {
				uni.showModal({
					title: '删除车站',
					content: this.mapcovers.name,
					showCancel: true,
					cancelText: '取消',
					confirmText: '删除',
					success: res => {
						if (res.confirm) {
							this.deletestop(this.mapcovers.id)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					},
					fail: () => {},
					complete: () => {}
				});
			},
			mapcentionloc(e) {
				if (e.controlId == 88) {
					this.mapinfo.moveToLocation()
				} else {
					// this.refreshinfo()
				}

			},
			// 刷新车辆信息
			refreshinfo() {
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

					} else {

					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 点击创建车站
			creatStop() {
				this.actives = true
				if(this.type=='9'){
					this.mapheihts='35vh'
				}else if(this.type=='9.1'){
					this.mapheihts='70vh'
				}
				// 点击创建车站前的地图经纬度坐标
				this.coorDinates = {
					long: this.tempjindu,
					lat: this.tempweidu,
				}
			},
			// 删除车站
			deletestop(ids) {
				console.log('ids', ids)
				var options = {
					url: '/park/del', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"id": ids
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('删除车站', res)
					if (res.status == 0) {
						uni.showToast({
							title: '删除车站成功',
							mask: false,
							icon: 'none',
							duration: 3000
						});
						this.stoplist(this.longitude, this.latitude, '*')
						this.actives = false
					} else {
						uni.showToast({
							title: res.message ? res.message : '删除车站失败',
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
			//上报蓝牙操作
			reportblue(type, state, loadtime, errname) {
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						var opername = ''
						if (type == 10) {
							opername = '挪车关锁'
						}
						if (type == 11) {
							opername = '挪车开锁'
						}
						var options = {
							url: '/bike/report_bluetooth_oper', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								// "token": "xxx",
								"bike_id": this.bikeinfo.id,
								"bound_order_type": "BIKE_REPARK", //绑定订单类型， USER_RIDE =用户骑行订单，BIKE_REPARK=挪车订单，BIKE_BATTERY_RECHANGE=换电订单，
								"bound_order_id": this.orderid,
								"bound_order_op": opername, //骑行开锁，骑行关锁，挪车开锁，挪车关锁，换电开锁 。。。,
								"type": type, //10=关锁，11=开锁，21=开电池锁,
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
			// 结束挪车
			endmovecars(parkid) {
				var name = this.bikeinfo.bluetooth_name
				var _self = this
				if (!!name && !!_self.bikeinfo.bluetooth_token) {
					ble.initBluetooth(_self.bikeinfo, (res) => {
						_self.setBlueres(res)
					})
					ble.onBLECharacteristicValueChange(function(res) {
						console.log('初始化监听', res)
						// 泰币特类型
						if (_self.bikeinfo.ecu_model == "WA-209D") {
							if (res == '连接成功') {

							} else if (res == '开锁成功') {
								blueWriteState = 1
								_self.reportblue(_self.openOrClose, 0, loadtime, '')
							} else if (res == '上锁成功') {
								blueWriteState = 1
								_self.reportblue(_self.openOrClose, 0, loadtime, '')
							}
						} else {
							var gps = res.slice(0, 2)
							var blestate = res.slice(-3, -2)
							if (gps == 20) {
								if (blestate == 0) {
									this.reportblue(10, 0, loadtime, '')
									blueWriteState = 1
								} else {
									var bleerrstate = ''
									if (blestate == 1) {
										bleerrstate = 'token校验失败'
									} else if (blestate == 2) {
										bleerrstate = '请求内容错误'
									} else if (blestate == 3) {
										bleerrstate = '请求命令错误'
									} else if (blestate == 4) {
										bleerrstate = '操作失败'
									} else if (blestate == 5) {
										bleerrstate = '命令不支持'
									} else if (blestate == 6) {
										bleerrstate = '车辆正在骑行中'
									} else {
										bleerrstate = '未知失败'
									}
									this.reportblue(10, 1, loadtime, bleerrstate)
								}
							}
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
				} else {
					console.log('++++蓝牙不可用++++')
				}

				this.setSn('*')
				uni.getLocation({ //获取当前的位置坐标
					type: 'gcj02',
					success: (res) => {
						var options = {
							url: '/rporder/finish', //请求接口
							method: 'POST', //请求方法全部大写，默认GET
							context: '',
							data: {
								"order_id": this.orderid,
								"park_id": parkid,
								"bluetooth": this.blueconectstate,
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
								if (!!this.bikeinfo.bluetooth_token && this.blueconectstate == 1) {
									var str1 = ble.doCmd('20', '01', this.bikeinfo.bluetooth_token)
									ble.openLock(str1, 'close', function(res) {
										console.log('蓝牙操作', res)
										loadtime = res.loadtime
									})
									blueWriteState = 0
									setTimeout(() => {
										if (blueWriteState == 0) {
											this.reportblue(10, 1, loadtime, '无特征值返回')
										}
									}, 5000)
								}
								this.movingbike()
								uni.showToast({
									title: '挪车成功',
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
			// 提交创建车站
			finshCreat() {
				if (this.stopName == '') {
					uni.showToast({
						title: '车站名称不能为空',
						icon: 'none',
						duration: 2000,
					});
					return
				}
				if (this.stopVolume == '') {
					uni.showToast({
						title: '车站容量不能为空',
						icon: 'none',
						duration: 2000,
					});
					return
				}
				if (this.stopRadius == '') {
					uni.showToast({
						title: '车站半径不能为空',
						icon: 'none',
						duration: 2000,
					});
					return
				}
				if (!this.editstop) {
					var level = parseInt(this.defaultLev.replace('级', ''))
					this.creatStopurl(level,0,[this.coorDinates.long,this.coorDinates.lat],[])
				} else {
					console.log(222, this.mapcovers)
					this.updateStopurl(this.mapcovers.id)
				}

			},
			active(index, item) {
				this.isActive = index
				this.selectvals = item.val
				this.headviewtext = item.name
				// for (let i = 0; i < this.selectcoverdata.length; i++) {
				// 	this.selectcoverdata[i].active = false
				// }
				// this.selectcoverdata[index].active = true
			},
			functionNames() {},
			// 移动地图获取中心点坐标
			functionName() {
				let self = this
				let intervaltime = (new Date()).getTime() - this.gobeltimestr
				this.gobeltimestr = (new Date()).getTime()
				this.timestrArr.push(this.gobeltimestr)
				if (intervaltime < 800) {
					return
				}
				let distance = 500
				let promise = new Promise((respon, rej) => {
						this.mapinfo.getScale({
							success: (res) => {
								console.log('suofangsuccess', res)
								// distance=res.scale							
								switch (res.scale) {
									case 20:
										distance = 100
										break;
									case 19:
										distance = 200
										break;
									case 18:
										distance = 300
										break;
									case 17:
										distance = 400
										break;
									case 16:
										distance = 500
										break;
									case 15:
										distance = 800
										break;
									case 14:
										distance = 1500
										break;
									case 13:
										distance = 1800
										break;
									case 12:
										distance = 2000
										break;
									case 11:
										distance = 3000
										break;
									case 10:
										distance = 5000
										break;
									default:
										distance = 15000
								}
								respon(distance)
							},
							fail: (res) => {
								console.log('suofangfail', res)
							}
						})
					})
					.then((dis) => {
						this.mapinfo.getCenterLocation({
							success: (res) => {
								this.tempjindu = res.longitude
								this.tempweidu = res.latitude
								// self.nearbycarinfo(2)
								switch (self.type) {
									case '0':
										var undervolt = '*'
										if (this.selectvals == 0) {
											undervolt = 1
										}
										self.nearbyshortpower(this.selectvals, res.longitude, res.latitude, undervolt, dis, this.gobeltimestr)
										break
									case '1.1':
										var setectval = (this.selectvals == 100) ? 0 : this.selectvals
										// this.nearbyfaultcar(this.longitude, this.latitude, setectval)
										self.nearbyfaultcar(res.longitude, res.latitude, setectval)
										break
									case '2':
										self.maintainbikelist(res.longitude, res.latitude)
										break
									case '3.1':
										if (this.selectvals == 100) {
											self.nearbymovecar(res.longitude, res.latitude, "*", '*', dis, this.gobeltimestr)
										} else {
											if (this.selectvals == 21 || this.selectvals == 11) {
												this.nearbymovecar(res.longitude, res.latitude, '*', parseInt(this.selectvals), dis, this.gobeltimestr)
											} else {
												this.nearbymovecar(res.longitude, res.latitude, parseInt(this.selectvals), '*', dis, this.gobeltimestr)
											}
											// self.nearbymovecar(res.longitude, res.latitude, parseInt(this.selectvals))
										}
										break
									case '9':
										this.stoplist(res.longitude, res.latitude, '*')
										break
								}
							},
							fail: (res) => {
								console.log('fail' + res);
							}
						})

					})
					.catch(() => {

					})


			},
			// 附近需要挪的车
			nearbymovecar(longitude, latitude, reparklev, parkstate, distance, timestr) {
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
						"park_state": parkstate,
						"distance": distance,
						"flag": 1
						// "is_under_volt": 1
					}
				}
				this.$httpReq(options).then((res) => {
					if (timestr != this.timestrArr[this.timestrArr.length - 1]) {
						return
					}
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('挪车列表', res)
					if (res.status == 0) {
						this.covers = []
						var temparr = []
						var circles = []
						if (this.type != '9' && !!res.list) {
							for (let i = 0; i < res.list.length; i++) {
								let tmpObj = {}
								tmpObj.id = res.list[i].id
								if (!!res.list[i].coordinate) {
									tmpObj.latitude = res.list[i].coordinate[1]
									tmpObj.longitude = res.list[i].coordinate[0]
								}
								tmpObj.name = res.list[i].name
								// tmpObj.iconPath = '../../static/mapicon/car_normal.png'
								tmpObj.iconPath = this.$imagepath(res.list[i], 'car', 0, 0)
								tmpObj.type = 'car'
								tmpObj.width = 39
								tmpObj.height = 48
								temparr.push(tmpObj)
								// this.covers.push(tmpObj)
							}
						}
						// circles: [{ //在地图上显示圆
						// 		latitude: 26.0627,
						// 		longitude: 119.31414,
						// 		fillColor: "#FFC41F", //填充颜色
						// 		color: "#12A1DD", //描边的颜色
						// 		radius: 200, //半径
						// 		strokeWidth: 2 //描边的宽度
						// 	}],
						if (!!res.parks) {
							for (let j = 0; j < res.parks.length; j++) {
								let tmpObjs = {}
								let circlesObj = {}
								tmpObjs.id = res.parks[j].id
								if (!!res.parks[j].coordinate) {
									tmpObjs.latitude = res.parks[j].coordinate[1]
									tmpObjs.longitude = res.parks[j].coordinate[0]
									circlesObj.latitude = res.parks[j].coordinate[1]
									circlesObj.longitude = res.parks[j].coordinate[0]
									circlesObj.radius = res.parks[j].radius
									circlesObj.fillColor = "#FF9F0040"
									circlesObj.color = "#FF9F0040"
									circlesObj.strokeWidth = 2
								}
								tmpObjs.name = res.parks[j].name
								// tmpObjs.iconPath = '../../static/mapicon/stop_0.png'
								var bikenum = parseInt(res.parks[j].capacity) - parseInt(res.parks[j].bike_count)
								tmpObjs.iconPath = this.$imagepath(res.parks[j], 'stop', bikenum, res.parks[j].grade)
								tmpObjs.type = 'stop'
								tmpObjs.bickcount = res.parks[j].bike_count
								tmpObjs.allkcount = res.parks[j].capacity
								tmpObjs.radius = res.parks[j].radius
								tmpObjs.remark = res.parks[j].remark
								tmpObjs.grade = res.parks[j].grade
								// tmpObjs.allkcount = res.parks[j].capacity
								tmpObjs.width = 39
								tmpObjs.height = 48
								tmpObjs.parkid = res.parks[j].id
								temparr.push(tmpObjs)
								circles.push(circlesObj)
								// this.covers.push(tmpObjs)
							}
						}
						this.covers = temparr
						this.circles = circles
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 附近的车站
			stoplist(longitude, latitude, reparklev,type) {
				this.setSn('*')
				this.setBikeid('*')
				var options = {
					url: '/city/city_object_nearby', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"coordinate": [
							longitude,
							latitude
						],
						"flag": 2
						// "is_under_volt": 1
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('车站列表', res)
					if (res.status == 0) {
						this.covers = []
						var temparr = []
						var circles = []
						for (let j = 0; j < res.parks.length; j++) {
							if(res.parks[j].polygon_type==0){
								let tmpObjs = {}
								let circlesObj = {}
								tmpObjs.id = res.parks[j].id
								if (!!res.parks[j].coordinate) {
									tmpObjs.latitude = res.parks[j].coordinate[1]
									tmpObjs.longitude = res.parks[j].coordinate[0]
									circlesObj.latitude = res.parks[j].coordinate[1]
									circlesObj.longitude = res.parks[j].coordinate[0]
									circlesObj.radius = res.parks[j].radius
									circlesObj.fillColor = "#FF9F0040"
									circlesObj.color = "#FF9F0040"
									circlesObj.strokeWidth = 2
								}
								tmpObjs.name = res.parks[j].name
								// tmpObjs.iconPath = '../../static/mapicon/stop_0.png'
								var bikenum = parseInt(res.parks[j].capacity) - parseInt(res.parks[j].bike_count)
								tmpObjs.iconPath = this.$imagepath(res.parks[j], 'stop', bikenum, res.parks[j].grade)
								tmpObjs.type = 'stop'
								tmpObjs.bickcount = res.parks[j].bike_count
								tmpObjs.allkcount = res.parks[j].capacity
								tmpObjs.radius = res.parks[j].radius
								tmpObjs.remark = res.parks[j].remark
								tmpObjs.grade = res.parks[j].grade
								// tmpObjs.allkcount = res.parks[j].capacity
								tmpObjs.width = 39
								tmpObjs.height = 48
								tmpObjs.parkid = res.parks[j].id
								temparr.push(tmpObjs)
								circles.push(circlesObj)
								// this.covers.push(tmpObjs)
							}else if(res.parks[j].polygon_type==1){								
								let circlesObjs = {}
								let tmpObjs = {}
								circlesObjs.points=[]
								tmpObjs.id = res.parks[j].id
								if (!!res.parks[j].coordinate) {
									tmpObjs.latitude = res.parks[j].coordinate[1]
									tmpObjs.longitude = res.parks[j].coordinate[0]
								}
								tmpObjs.name = res.parks[j].name
								tmpObjs.iconPath = '/static/mapicon/stopare.png'
								tmpObjs.type = 'stop'
								tmpObjs.bickcount = res.parks[j].bike_count
								tmpObjs.allkcount = res.parks[j].capacity
								tmpObjs.radius = res.parks[j].radius
								tmpObjs.remark = res.parks[j].remark
								tmpObjs.grade = res.parks[j].grade
								// tmpObjs.allkcount = res.parks[j].capacity
								tmpObjs.width = 39
								tmpObjs.height = 48
								tmpObjs.parkid = res.parks[j].id
								temparr.push(tmpObjs)
								if (!!res.parks[j].coordinates) {
									for(let k=0;k<res.parks[j].coordinates.length;k++){	
										var secondtemp=res.parks[j].coordinates[k]
										let polygon = {}
										polygon.latitude=secondtemp[1]
										polygon.longitude=secondtemp[0]
										circlesObjs.points.push(polygon)
										circlesObjs.fillColor = "#A9A9A980"
										circlesObjs.color = "#FF9F0040"
										circlesObjs.strokeWidth = 1
									}
									this.polygon.push(circlesObjs)
								}								
							}							
						}
						this.covers = temparr
						this.circles = circles
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 服务区
			serverice(longitude, latitude) {
				this.setSn('*')
				this.setBikeid('*')
				var options = {
					url: '/city/city_object_nearby', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"coordinate": [
							longitude,
							latitude
						],
						"flag": 1
						// "is_under_volt": 1
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('服务区', res)
					if (res.status == 0) {
						this.polyline = []
						for (let i = 0; i < res.svcas.length; i++) {
							let temobj = {}
							var temparr = []
							for (let j = 0; j < res.svcas[i].coordinates.length; j++) {
								var jwd = {
									longitude: res.svcas[i].coordinates[j][0],
									latitude: res.svcas[i].coordinates[j][1]
								}
								temparr.push(jwd)
							}
							temobj.points = temparr
							temobj.color = "#0000AA", //线的颜色
								temobj.width = 3, //线的宽度
								// dottedLine: true, //是否虚线
								temobj.arrowLine = true, //带箭头的线 开发者工具暂不支持该属性
								this.polyline.push(temobj)
						}
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 附近需要换电的车辆
			nearbyshortpower(max, longitude, latitude, undervolt, distance, timestr) {
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
						"distance": distance,
						"is_under_volt": undervolt
					}
				}
				this.$httpReq(options).then((res) => {
					if (timestr != this.timestrArr[this.timestrArr.length - 1]) {
						return
					}
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
							// tmpObj.iconPath = '../../static/mapicon/car_normal.png'
							tmpObj.iconPath = this.$imagepath(res.list[i], 'car', 0, 0)
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
				var tempcoor = this.bikeinfo.coordinate
				let temarr = []
				this.covers = []
				let tmpObj = {}
				tmpObj.id = 999999
				tmpObj.latitude = tempcoor[1]
				tmpObj.longitude = tempcoor[0]
				tmpObj.name = this.bikeinfo.id
				tmpObj.iconPath = '/static/mapicon/car_normal.png'
				tmpObj.type = 'car'
				tmpObj.width = 39
				tmpObj.height = 48
				temarr.push(tmpObj)
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
						var temparr = []
						// this.covers = []					
						let tempobj0 = {},
							tempobj1 = {}
						tempobj0.id = 0
						tempobj0.longitude = res.info.track[0][0]
						tempobj0.latitude = res.info.track[0][1]
						tempobj0.iconPath = '/static/mapicon/start.png'
						tempobj0.width = 39
						tempobj0.height = 48
						tempobj1.id = 1
						tempobj1.longitude = res.info.track[res.info.track.length - 1][0]
						tempobj1.latitude = res.info.track[res.info.track.length - 1][1]
						tempobj1.iconPath = '/static/mapicon/end.png'
						tempobj1.width = 39
						tempobj1.height = 48
						temarr.push(tempobj0)
						temarr.push(tempobj1)
						this.covers = temarr
						this.circles = []
						let circlepoint = []
						for (let i = 0; i < res.info.track.length; i++) {
							var jwd = {
								longitude: res.info.track[i][0],
								latitude: res.info.track[i][1]
							}
							let circleobj = {
								longitude: res.info.track[i][0],
								latitude: res.info.track[i][1],
								color: '#DC143C',
								fillColor: '#DC143C',
								radius: 4

							}
							temparr.push(jwd)
							circlepoint.push(circleobj)
						}
						this.circles = circlepoint
						this.polyline[0].points = temparr
						this.polyline[0].color = "#0000AA" //线的颜色
						this.polyline[0].width = 3 //线的宽度
						// dottedLine: true, //是否虚线
						this.polyline[0].arrowLine = true
						console.log('this.covers', this.covers);
					} else {
						uni.showToast({
							title: res.message ? res.message : '获取轨迹失败',
							icon: 'none'
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 附近故障的车辆
			nearbyfaultcar(longitude, latitude, type) {
				var types = '*'
				if (type != '*') {
					types = parseInt(type)
				}
				var options = {
					url: '/bike/list_to_repair_nearby', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"coordinate": [
							longitude,
							latitude
						],
						"inv_state": types
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
							tmpObj.width = 39
							tmpObj.height = 48
							// tmpObj.iconPath = '../../static/image/0-small.png'
							tmpObj.iconPath = this.$imagepath(res.list[i], 'car', 0, 0)
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
					wx.scanCode({
						onlyFromCamera: true, //只允许相机扫码
						success: res => {
							console.log('saoma', res)
							var bikesn = res.result.match(/\?bikesn=(.*)/)[1]
							this.inputval = bikesn
							console.log(this.inputval, 555)
							this.setSn(bikesn)
							this.setBikeid('*')
							this.getcarinfo()
							// setTimeout(() => {
							// 	this.getcarinfo()
							// }, 1500)
						},
						fail: res => {},
						complete: res => {}
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
						this.urls = '/pages/swapbattery/swapbattery?type=0'
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
						// this.setBikeid(res.info.id)
						this.setBikeid('*')
						this.setBikeinfo(res.info)
						if (this.type == 1.1) {
							var datas = {
								"is_order_finished": 0,
								"pno": 1,
								"psize": 100,
								// "order_state": 0,
								"bike_id": res.info.id
							}
							this.setSn('*')
							this.requestorder(datas)
						}else if(this.type=='0.3'){
							let tembikeinfo = {}
							tembikeinfo.latitude = this.bikeinfo.coordinate[1]
							tembikeinfo.longitude = this.bikeinfo.coordinate[0]
							tembikeinfo.iconPath = '/static/mapicon/car_normal.png'
							tembikeinfo.width = 39
							tembikeinfo.height = 48
							this.covers[0] = tembikeinfo			
						}
						 else {
							if (this.clicksuccess == false) {
								uni.navigateTo({
									url: this.urls,
									success: res => {
										this.clicksuccess = true
									},
									fail: () => {},
									complete: () => {}
								});
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
			// 更新车站
			updateStopurl(id) {
				let status = ''
				if (this.openclosestop == '开启') {
					status = 0
				} else {
					status = 1
				}
				var options = {
					url: '/park/update', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"name": this.stopName,
						"remark": this.stopDesc,
						"radius": parseInt(this.stopRadius),
						"capacity": parseInt(this.stopVolume),
						"state": status,
						"type": "SCHOOL",
						"id": id
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					if (res.status == 0) {
						uni.showToast({
							title: '更新车站成功',
							mask: false,
							duration: 2500
						});
						setTimeout(() => {
							this.actives = false
						}, 2000)
						this.stoplist(this.longitude, this.latitude, '*')
					} else {
						uni.showToast({
							title: res.message ? res.message : '更新车站失败',
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
			// 创建车站
			creatStopurl(level,type,coordinate,marks) {
				
				var options = {
					url: '/park/add', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"name": this.stopName,
						"remark": this.stopDesc,
						// "coordinate": [
						// 	this.coorDinates.long,
						// 	this.coorDinates.lat
						// ],
						"coordinate":coordinate,
						"coordinates":marks,
						"radius": parseInt(this.stopRadius)?parseInt(this.stopRadius):0,
						"capacity": parseInt(this.stopVolume),
						"state": 0,
						"type": "SCHOOL",
						"polygon_type":type,
						// "grade": level,
						"grade": 1,
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
						setTimeout(() => {
							this.actives = false
						}, 2000)
					} else {
						uni.showToast({
							title: res.message ? res.message : '创建车站失败',
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
					} else {
						uni.showToast({
							title: '查询订单失败'
						});
					}
				})
			},
			// 换电中的订单列表
			changeingbattery() {
				this.setBikeid('*')
				let options = {
					url: '/bcorder/list',
					method: 'POST',
					data: {
						"user_id": this.userinfo.userinfo.id,
						"pno": 1,
						"psize": 100,
						"is_order_finished": 0,
						"sk": '',
					}
				}
				this.$httpReq(options).then((res) => {
					console.log('换电中的订单', res)
					if (res.status == 0) {
						this.ingtext = '换电中的车辆' + res.list.length
						this.inglength = res.list.length
						this.setInginfo(res.list)
					}
				})
			},
			// 挪车中的订单列表
			movingbike() {
				this.setBikeid('*')
				let options = {
					url: '/rporder/list',
					method: 'POST',
					data: {
						"user_id": this.userinfo.userinfo.id,
						"pno": 1,
						"psize": 100,
						"sk": '',
						"is_order_finished": 0
					}
				}
				this.$httpReq(options).then((res) => {
					console.log('挪车中的订单', res)
					this.inglength = res.list.length
					this.setInginfo(res.list)
					if (res.status == 0) {
						this.ingtext = '挪车中的车辆' + res.list.length
						this.inglength = res.list.length
						this.setInginfo(res.list)
					}
				})
			},
			// 车辆保养列表
			maintainbikelist(tempjindu, tempweidu) {
				this.setSn('*')
				this.setBikeid('*')
				let options = {
					url: '/bike/list_to_maintain_nearby',
					method: 'POST',
					data: {
						"coordinate": [
							tempjindu,
							tempweidu
						],
					}
				}
				this.$httpReq(options).then((res) => {
					console.log('车辆保养列表', res)
					if (res.status == 0) {
						this.covers = []
						for (let i = 0; i < res.list.length; i++) {
							let tmpObj = {}
							tmpObj.id = res.list[i].id
							tmpObj.latitude = res.list[i].coordinate[1]
							tmpObj.longitude = res.list[i].coordinate[0]
							tmpObj.iconPath = this.$imagepath(res.list[i], 'car', 0, 0)
							tmpObj.width = 39
							tmpObj.height = 48
							this.covers.push(tmpObj)
						}
					}
				})
			},
			goingview() {
				uni.navigateTo({
					url: `/pages/ingview/ingview?type=${this.type}`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	// $mapheight:40vh;
	// .mapHeight{
	// 	height: $mapheight!important;
	// }
	.page-body {
		background-color: rgb(245, 245, 245);
	}

	.activemap {
		height: 35vh !important;
		// height: 70vh !important;
	}

	.open-close {
		display: flex;
		background-color: rgba(225, 225, 225, .7);
		height: 70upx;
		line-height: 70upx;
		// margin: 20upx 0;
		justify-content: space-between;
		margin-bottom: 20upx;
		align-items: center;

		.opclose-text {
			margin-left: 30upx;
			// margin-top: 20upx;
		}
	}

	.movecar-view {
		margin-top: 10upx;
		background-color: #555555;
		text-align: center;
		color: white;
		height: 80upx;
		line-height: 80upx;
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
		// height: calc(100vh - 80upx);
		height: calc(90vh - 88upx);
		width: 100%;

		.cover-imgs {
			position: absolute;
			left: 46%;
			top: 42%;
			width: 50upx;
			height: auto;
		}

		.location-imgs {
			position: absolute;
			right: 40upx;
			bottom: 100upx;
			width: 100upx;
			height: auto;
		}

		.map-cover-view {
			width: 100%;
			display: flex;
			height: 100upx;
			position: absolute;
			// left: 10%;
			bottom: 100upx;
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

	.maxheigh {
		height: 100vh;
	}

	.creatStopServ {
		display: flex;
		justify-content: space-between;

		.leftBtn {
			color: black;
			background-color: yellow;
		}

		.ringhtBtn {}

		.btn {
			width: 30% !important;
		}
	}
	.timeselect {
		margin-top: 12upx;
		margin-bottom: 12upx;
		height: 6vh;
		.wenzi {
			font-size: 18upx;
			color: rgb(80, 80, 80);
			margin-right: 20upx;
			line-height: 40upx;
		}
	
		display: flex;
		justify-content: space-around;
		height: 50upx;
	
		.timedetil {
			display: flex;
			justify-content: space-around;
		}
	}
</style>
