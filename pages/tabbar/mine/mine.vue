<template>

	<view class='wrap'>
		<!-- <view class='water_top' :style="'height:'+canvsheigh">
			<canvas canvas-id='myCanvas' id='myCanvas' style='width:100%;height:100%'></canvas>
		</view> -->
		<view class='view-common'>
			<item-cell :itemdata="swapdata" type='4' :border='borders' @itemclick='go'></item-cell>
			<item-cell :itemdata="swapbatterydata" type='4' :border='borders' @itemclick='go'></item-cell>
		</view>
		<!-- <view class='shuiyin'></view> -->
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				canvsheigh:'100vh',
				base64img:'',
				borders: true,
				swapdata: [{
					name: '',
					val: '',
					url: '/pageA/mine/minecard/minecard'
				}],
				swapbatterydata: [{
						name: '切换城市',
						val: '',
						url: '/pageA/mine/mineye/mineye',
					},
					{
						name: '换电记录',
						val: '',
						url: '/pageA/mine/minehdrecord/minehdrecord'
					},
					{
						name: '挪车记录',
						val: '',
						url: '/pageB/movecarPage/removecarrecord/removecarrecord'
					},
					{
						name: '最近上传日志',
						val: '',
						url: '/pageA/carBigCenter/uploadlog/uploadlog'
					},
					{
						name: '身份证辅助认证',
						val: '',
						url: '/pageA/mine/mineyhq/mineyhq'
					},
					{
						name: '运维人员管理',
						val: '',
						url: '/pageA/mine/peoplemanage/peoplemanage'
					},
					// {
					// 	name: 'test',
					// 	val: '',
					// 	url:'/pages/mine/mineyj/mineyj'
					// },				
				]
			}
		},
		onLoad() {
			// this.drowsyUserinfo()
		},
		onShow() {
			try {
				const value = uni.getStorageSync('userinfo');
				if (value) {
					this.swapdata[0].name = value.userinfo.name
					// this.userinfo = value
				}
			} catch (e) {
				// error
			}
		},
		components: {
			itemCell
		},
		methods: {
			drowsyUserinfo() {
				var name_xx = '水印';
				var ctx = wx.createCanvasContext("myCanvas");

				ctx.rotate(45 * Math.PI / 180); //设置文字的旋转角度，角度为45°；

				//对斜对角线以左部分进行文字的填充
				for (let j = 1; j < 10; j++) { //用for循环达到重复输出文字的效果，这个for循环代表纵向循环
					ctx.beginPath();
					ctx.setFontSize(20);
					ctx.setFillStyle("rgba(169,169,169,.2)");

					ctx.fillText(name_xx, 0, 50 * j);
					for (let i = 1; i < 10; i++) { //这个for循环代表横向循环，
						ctx.beginPath();
						ctx.setFontSize(20);
						ctx.setFillStyle("rgba(169,169,169,.2)");
						ctx.fillText(name_xx, 80 * i, 50 * j);
					}
				} //两个for循环的配合，使得文字充满斜对角线的左下部分

				//对斜对角线以右部分进行文字的填充逻辑同上
				for (let j = 0; j < 10; j++) {
					ctx.beginPath();
					ctx.setFontSize(20);
					ctx.setFillStyle("rgba(169,169,169,.2)");

					ctx.fillText(name_xx, 0, -50 * j);
					for (let i = 1; i < 10; i++) {
						ctx.beginPath();
						ctx.setFontSize(20);
						ctx.setFillStyle("rgba(169,169,169,.2)");
						ctx.fillText(name_xx, 80 * i, -50 * j);
					}
				}
				var _this=this
				ctx.draw(false,()=>{
					  wx.canvasToTempFilePath({
					  	canvasId: 'myCanvas',
					  	success(res) {
					  		wx.getFileSystemManager().readFile({
					  			filePath: res.tempFilePath, //图片路径
					  			encoding: 'base64', //编码格式
					  			success: res => { //成功的回调
					  	            _this.canvsheigh=0
									_this.base64img='data:image/png;base64,' + res.data
								}
					  		})
					  	},
					  	err(err){
					  		console.log(44444,err)
					  	}
					  })
				});
			},

			go(item) {
				console.log(4444)
				uni.navigateTo({
					url: item.url,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			changbattery() {
				uni.showModal({
					title: '确认打开电池锁',
					content: '',
					// showCancel: false,
					cancelText: '取消',
					confirmText: '打开',
					confirmColor: '#F6C700',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style lang='scss'>
	.water_top {
		position: fixed;
		z-index: 1;
		opacity: 0.9;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		/* height: 20px; */
	}

	.wrap {
		background-color: rgb(245, 245, 245);
		padding-top: 1upx;
		padding-bottom: 1upx;
		/* height: 100vh; */
		overflow: hidden;

		/* margin-bottom: 20upx; */
		.view-common {
			margin: 10upx 22upx;
			height: 98vh;
			position: relative;			
			.change-battery-button {
				position: fixed;
				bottom: 3vh;
				width: 706upx;
			}
		}
		.shuiyin{
			height: 98vh;
			position: absolute;	
			width: 100%;
			top:0;
			left:0;
		}
	}
</style>
