<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="swapdata" type='4' :border='borders' @itemclick='gocarcenter'></item-cell>
			<item-cell :itemdata="swapbatterydata" type='2' :border='borders'></item-cell>
			<view class='check-bottom-view'>
				<view class='checkup-text'><text>安全检查项目:</text></view>
				<view class='checkup-text' v-for="(item,i) in checkupdata"><text>{{item}}</text></view>
			</view>
			<view class='change-battery-button'>
				<button class='share-button-default checkup-button' @click='changbattery'>车辆故障</button>
				<button class='share-button-default checkup-button' @click='changbattery'>车辆正常</button>
			</view>
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	export default {
		data() {
			return {
				borders: true,
				swapdata: [{
					name: '车辆编号',
					val: '80135654'
				}],
				swapbatterydata: [{
						name: '最近一次检查时间:',
						val: '04-18 19：10：40'
					},
					{
						name: '最近一次检查人:',
						val: '祝盛炜'
					},
					{
						name: '待安全检查持续时常:',
						val: '3天19小时19分21秒'
					}
				],
				checkupdata:[
					'1、转把','2、转把','3、转把','4、转把','5、转把','6、转把'
				]
			}
		},
		components: {
			itemCell
		},
		methods: {
			gocarcenter() {
				uni.navigateTo({
					url: '/pages/carcenter/carcenter',
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
				display: flex;
				.checkup-button{
					width:50%;
					margin:0 30upx;
				}
			}
			.check-bottom-view{
				margin-top: 20upx;
				background-color: white;
				border-radius: 20upx;
				.checkup-text{
					margin: 18upx 40upx;
				}
			}
		}
	}
</style>
