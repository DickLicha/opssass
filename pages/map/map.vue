<template>
	<view>
		<view class="page-body">
			<view class="page-section page-section-gap">
				<map class='map-base-view'  :controls="controls"   :scale="scale"
				 :latitude="latitude" :longitude="longitude" :markers="covers"  :show-location='showLocation' :circles='circles' >
				</map>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'map',
				latitude: 26.0527,
				longitude: 119.31414,
				scale:'12',//缩放级别5-18
				showLocation:true,
				covers: 
				[
					{
				    id:0,		
					latitude: 26.0528, //纬度
					longitude: 119.31416, //经度
					iconPath: '../../static/image/icon-small.png', //显示的图标			
					title: '阿打算', //标注点名
					label: { //为标记点旁边增加标签
// 						content: '文本1', //文本
// 						color: '#F76350', //文本颜色
// 						anchorX: 0, //label的坐标，原点是 marker 对应的经纬度
// 						anchorY: -80, //label的坐标，原点是 marker 对应的经纬度 
// 						bgColor: '#fff', //背景色
// 						padding: 5, //文本边缘留白
// 						borderWidth: 1, //边框宽度
// 						borderColor: '#D84C29', //边框颜色							
// 						textAlign: 'right' //文本对齐方式。
					},
					callout: { //自定义标记点上方的气泡窗口 点击有效
						content: '地点1',
						color: '#F76350',
						fontSize: 12,
						borderRadius: 5,
					},
				},
				{
					id:1,
					latitude: 26.0628, //纬度
					longitude: 119.31416, //经度
					iconPath: '../../static/image/4-small.png', //显示的图标		
				},	
				{
					id:2,
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
			let self=this
			console.log('this',self,this)
			uni.getLocation({ //获取当前的位置坐标
				type: 'wgs84',
				success: function(res) {
					self.latitude=res.latitude
					self.longitude=res.longitude
					self.covers[0].latitude=res.latitude
					self.covers[0].longitude=res.longitude
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
				}
			});
			// 			uni.chooseLocation({
			// 				success: function (res) {
			// 					console.log('位置名称：' + res.name);
			// 					console.log('详细地址：' + res.address);
			// 					console.log('纬度：' + res.latitude);
			// 					console.log('经度：' + res.longitude);
			// 				}
			// 			});
		}
	}
</script>

<style lang="scss" scoped>
.map-base-view{
	height: calc(100vh - 44px);
	width: 100%;
}
</style>
