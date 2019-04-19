<template>
	<view>
		<!-- <view style='background: #09BB07;height: 50px;width:100%;'>hello</view> -->
		<view style='height: 80upx;width:100%;background-color:#555555;'>
			<baseheader title="餐厅" @show='showMapSelect'></baseheader>
		</view>	
		<view class="page-body">
			<view class="page-section page-section-gap">
				<map class='map-base-view' :scale="scale" id='firstmap' :latitude="latitude" :longitude="longitude" :markers="covers"
				 :show-location='showLocation' :circles='circles' @regionchange="functionName" @end="functionName" @begin="functionName">
					<cover-view v-if="showmapselect" class='map-select-view' >
						<cover-view class='select-list'>
							<cover-view v-for="(item,i) in selectcoverdata" @click="active(i)"  :class="{'borderrights':item.active}">{{item.name}}</cover-view>
						</cover-view>
						<cover-view class='select-sure' @click="selectsure">确定</cover-view>
					</cover-view>
					<cover-view class='map-cover-view' @click="scanCode">扫码用车</cover-view>
				</map>
			</view>
		</view>
	</view>
</template>

<script>
	import scanbutton from '@/components/scanbutton.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import baseheader from '@/components/baseheadview/baseheadview.vue'
	export default {
		components: {
			scanbutton,baseheader
		},
		data() {
			return {
				title: 'map',
				latitude: 26.0527,
				showmapselect:false,
				longitude: 119.31414,
				mapinfo:'',
				scale: '12', //缩放级别5-18
				showLocation: true,
				selectcoverdata:[
					{name:'全部换电',id:'0',active:true},
					{name:'所有35%以下',id:'1',active:false},
					{name:'所有30%以下',id:'2',active:false},
					{name:'所有20%以下',id:'3',active:false},
					{name:'所有10%以下',id:'4',active:false},
					{name:'低于可用里程',id:'5',active:false},
					// {name:'欠压车辆',id:'6'},
// 					{name:'',id:'6'},
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
					points: [{
							latitude: 26.0528,
							longitude: 119.31414
						},
						{
							latitude: 26.053,
							longitude: 119.315
						},
					],
					color: "#0000AA", //线的颜色
					width: 5, //线的宽度
					// dottedLine: true, //是否虚线
					arrowLine: true, //带箭头的线 开发者工具暂不支持该属性
				}],

			};
		},
		onLoad() {
			let self = this
			// uni.nav
			console.log('this', self, this)
			uni.getLocation({ //获取当前的位置坐标
				type: 'wgs84',
				success: function(res) {
					self.latitude = res.latitude
					self.longitude = res.longitude
					self.covers[0].latitude = res.latitude
					self.covers[0].longitude = res.longitude
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
					uni.showToast({
						title: '当前位置的经度：' + res.longitude.toString(),
						mask: false,
						duration: 1500,
					});
				}
			});
		},
		onReady(){
			this.mapinfo=uni.createMapContext('firstmap')
		},
		methods: {
			showMapSelect(){
				this.showmapselect=!this.showmapselect
			},
			selectsure(){
				this.showmapselect=false
			},
			active(index){
				for(let i=0;i<this.selectcoverdata.length;i++){
					this.selectcoverdata[i].active=false
				}
				this.selectcoverdata[index].active=true
				// console.log('this.selectcoverdata',this.selectcoverdata)
			},
			functionName() {
				let self = this		
				this.mapinfo.getCenterLocation({
						success:(res)=> {
							console.log('当前位置的经度1：' + res.longitude);
							console.log('当前位置的纬度1：' + res.latitude);
							uni.showToast({
								title: res.longitude.toString(),
								mask: false,
								duration: 1500,
							});
						},
						fail:(res)=>{
							console.log('当前位置的经度2：' + res.longitude);
							console.log('当前位置的纬度2：' + res.latitude);

						}
					})
					
// 			uni.getLocation({ //获取当前的位置坐标
// 				type: 'wgs84',
// 				success: function(res) {
// 					self.latitude = res.latitude
// 					self.longitude = res.longitude
// 					self.covers[0].latitude = res.latitude
// 					self.covers[0].longitude = res.longitude
// 					console.log('当前位置的经度：' + res.longitude);
// 					console.log('当前位置的纬度：' + res.latitude);
// 					uni.showToast({
// 						title: res.longitude.toString(),
// 						mask: false,
// 						duration: 1500,
// 					});
// 
// 				}
// 			});

		},
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
	}
	}
</script>

<style lang="scss" scoped>
	.map-base-view {
		height: calc(100vh - 80upx);
		width: 100%;
		// margin-top: 100px;
		.map-cover-view {
			width: 50%;
			height: 100upx;
			position: absolute;
			left: 25%;
			bottom: 60upx;
			background-color: #F6C700;
			border-radius: 20upx;
			line-height: 100upx;
			text-align: center;
			font-size: 40upx
		}
		.map-select-view{
			width: 100%;
			height: 420upx;
			position: absolute;
			left: 0;
			// bottom: 60upx;
			background-color: white;
			// border-radius: 20upx;
			// line-height: 100upx;
			text-align: center;
			font-size: 40upx;
			background-color:#efeff2;
			font-size: 14px;
			.select-sure{
				margin-top: 30upx;
				height: 90upx;
				line-height: 80upx;
				width: 90%;
				background-color: #F6C700;
				border-radius: 8upx;
				margin-left: 5%;
			}
			.select-list{
				display: flex;
				justify-content: space-around;
				flex-wrap: wrap;
				background-color: white;
				cover-view{
					width: calc(50% - 4upx);
					border: 1upx solid rgba(245,245,245,1);
					height: 80upx;
					line-height: 80upx;
					// text-decoration:underline 
				}
				.borderrights{
					// border-right: 1upx solid gray;
					color: #F6C700;
					border: 1upx solid #F6C700;
				}
			}
		}
	}
</style>
