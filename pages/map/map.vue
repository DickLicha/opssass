<template>
	<view>
		<!-- <view style='background: #09BB07;height: 50px;width:100%;'>hello</view> -->
		<view v-if="showcorverview.head" style='height: 80upx;width:100%;background-color:rgba(100,100,100,.5);'>
			<baseheader :title="headviewtext" @show='showMapSelect' :hasBack='true' :xialajiantou='true'></baseheader>
		</view>

		<view class="page-body">
			<view class="page-section page-section-gap">
				<!-- <basemapview></basemapview> -->
				<map class='map-base-view' :class="{'activemap':actives}" :scale="scale" id='firstmap' :latitude="latitude"
				 :longitude="longitude" :markers="covers" :show-location='showLocation' :circles='circles' :polyline="polyline"
				 @regionchange="functionName" @end="functionName" @begin="functionName">
					<cover-view v-if="showmapselect" class='map-select-view'>
						<cover-view class='select-list'>
							<cover-view v-for="(item,i) in selectcoverdata" @click="active(i)" :class="{'borderrights':item.active}">{{item.name}}</cover-view>
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
		data() {
			return {
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
				latitude: 26.0527,
				showmapselect: false,
				longitude: 119.31414,
				mapinfo: null,
				scale: '13', //缩放级别5-18
				showLocation: true,
				selectcoverdata: [{
						name: '全部换电',
						id: '0',
						active: true
					},
					{
						name: '所有35%以下',
						id: '1',
						active: false
					},
					{
						name: '所有30%以下',
						id: '2',
						active: false
					},
					{
						name: '所有20%以下',
						id: '3',
						active: false
					},
					{
						name: '所有10%以下',
						id: '4',
						active: false
					},
					{
						name: '低于可用里程',
						id: '5',
						active: false
					},
					{
						name: '欠压车辆',
						id: '6',
						active: false
					},
				],
				covers: [{
						id: 0,
						latitude: 26.0528, //纬度
						longitude: 119.31416, //经度
						iconPath: '../../static/image/icon-small.png', //显示的图标			
						title: '阿打算', //标注点名
						label: { //为标记点旁边增加标签
						},
						callout: { //自定义标记点上方的气泡窗口 点击有效
							content: '地点1',
							color: '#F76350',
							fontSize: 12,
							borderRadius: 5,
						},
					},
					{
						id: 1,
						latitude: 26.0628, //纬度
						longitude: 119.31416, //经度
						iconPath: '../../static/image/4-small.png', //显示的图标		
					},
					{
						id: 2,
						latitude: 26.0328, //纬度
						longitude: 119.31446, //经度
						iconPath: '../../static/image/10-small.png', //显示的图标		
					},
				],
				controls: [{ //在地图上显示控件，控件不随着地图移动
					id: 1, //控件id
					iconPath: '../../static/image/timg.png', //显示的图标	
					position: { //控件在地图的位置
						left: 15,
						top: 15,
						width: 50,
						height: 50
					},
				}],
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

			};
		},
		onLoad(e) {
			this.headviewtext = e.text
			this.type = e.type
			switch (e.type) {
				case '0':
					this.scanbuttonname = '扫码换电'
					break;
				case '0.1':
					// 设置corver初始状态
					this.showcorverview = {
							head: false,
							bottom: false
						},
						// 多边形
						this.polyline[0].points = [{
								latitude: 26.0528,
								longitude: 119.31414
							},
							{
								latitude: 26.063,
								longitude: 119.325
							},
							{
								latitude: 26.059,
								longitude: 119.385
							},
							{
								latitude: 26.0528,
								longitude: 119.31414
							},
						]
					this.covers = []
					break;
				case '3.1':
					this.scanbuttonname = '扫码挪车'
					this.selectcoverdata = [{
							name: '全部车站',
							id: '0',
							active: true
						},
						{
							name: '供给不足车站',
							id: '1',
							active: false
						},
						{
							name: '供给过量车站',
							id: '2',
							active: false
						},
						{
							name: '预警车站',
							id: '3',
							active: false
						},
						{
							name: '车效（中）车辆',
							id: '4',
							active: false
						},
						{
							name: '车效（差）车辆',
							id: '5',
							active: false
						},
						{
							name: '车效（极差）车辆',
							id: '6',
							active: false
						},
						{
							name: '故障-维修入库',
							id: '7',
							active: false
						},
						{
							name: '故障-未入库',
							id: '8',
							active: false
						},
						{
							name: '12h+无人扫码车辆',
							id: '9',
							active: false
						},
						{
							name: '24h+无人扫码车辆',
							id: '10',
							active: false
						},
						{
							name: '1+不动车辆',
							id: '11',
							active: false
						},
						{
							name: '2+不动车辆',
							id: '12',
							active: false
						},
						{
							name: '3+不动车辆',
							id: '13',
							active: false
						},
						{
							name: '7+不动车辆',
							id: '14',
							active: false
						}
					]
					break;
				case '1.1':
					this.scanbuttonname = '扫码入库'
					this.selectcoverdata = [{
							name: '全部故障车辆',
							id: '0',
							active: true
						},
						{
							name: '未入库故障车辆',
							id: '1',
							active: false
						},
						{
							name: '已入库故障车辆',
							id: '2',
							active: false
						},
					]
					break;
				case '9':
					this.showcorverview.bottom = false
					this.scanbuttonname = '创建车站'
					this.selectcoverdata = [{
							name: '全部车站',
							id: '0',
							active: true
						},
						{
							name: '已开启车站',
							id: '0',
							active: false
						},
						{
							name: '已关闭车站',
							id: '0',
							active: false
						},
					]
					break;


			}
			wx.setNavigationBarTitle({
				title: e.name
			})
			uni.getLocation({ //获取当前的位置坐标
				type: 'wgs84',
				success: function(res) {
					this.latitude = res.latitude
					this.longitude = res.longitude
					this.covers[0].latitude = res.latitude
					this.covers[0].longitude = res.longitude
					uni.showToast({
						title: '当前位置的经度：' + res.longitude.toString(),
						mask: false,
						duration: 1500,
					});
				}
			});
		},
		onShow(e) {

		},
		onReady() {
			if (this.mapinfo == null) {
				this.mapinfo = uni.createMapContext('firstmap')
			}
		},
		onUnload() {
			this.mapinfo = null
		},
		methods: {
			...mapMutations(['setSn', 'setBikeid']),
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
			},
			// 点击创建车站
			creatStop() {
				this.actives = true
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
			active(index) {
				for (let i = 0; i < this.selectcoverdata.length; i++) {
					this.selectcoverdata[i].active = false
				}
				this.selectcoverdata[index].active = true
			},
			functionName() {
				let self = this
				this.mapinfo.getCenterLocation({
					success: (res) => {
						console.log('当前位置的经度1：' + res.longitude);
						console.log('当前位置的纬度1：' + res.latitude);
						uni.showToast({
							title: res.longitude.toString(),
							mask: false,
							duration: 1500,
						});
					},
					fail: (res) => {
						console.log('当前位置的经度2：' + res.longitude);
						console.log('当前位置的纬度2：' + res.latitude);
					}
				})
			},
			scanCode(type) {
				this.dowhat()
				if (type == 1) {
					uni.scanCode({
						onlyFromCamera: true, //只允许相机扫码
						success: res => {
							console.log('saoma', res)
							this.setSn(res.result)
							this.getcarinfo()
							// 入库和维修要先请求订单信息
							if (this.type == '1.1' || this.type == '1.3') {
								var datas = {}
								if (this.type == '1.1') {
									datas = {
										"is_order_finished": 0,
										"pno": 1,
										"psize": 100,
										"order_state": 0,
									}
								} else {
									datas = {
										"is_order_finished": 0,
										"pno": 1,
										"psize": 100,
									}
								}
								this.requestorder(datas)
							} else {
								uni.navigateTo({
									url: this.urls,
									success: res => {},
									fail: () => {},
									complete: () => {}
								});
							}
							uni.navigateTo({
								url: this.urls
							})
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
						this.urls = '/pages/repaircar/repaircar'
						break;
					case '1.1':
						this.urls = '/pages/putstorage/putstorage'
						break;
					case '3.1':
						this.urls = '/pages/checkupcar/checkupcar'
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
						this.setBikeid(res.id)
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			// 获取车辆信息
			creatStopurl(level) {
				var options = {
					url: '/park/add', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"name": this.stopName,
						"remark": this.stopDesc,
						"coordinate": [
							1,
							2
						],
						"radius": 1000,
						"capacity": 10,
						"state": 0,
						"type": "SCHOOL",
						"grade": level
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
