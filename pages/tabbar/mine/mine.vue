<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="swapdata" type='4' :border='borders' @itemclick='go'></item-cell>
			<item-cell :itemdata="swapbatterydata" type='4' :border='borders' @itemclick='go'></item-cell>
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
					name: '祝盛炜',
					val: '',
					url:'/pages/mine/minecard/minecard'
				}],
				swapbatterydata: [{
						name: '预警',
						val: '',
						url:'/pages/mine/mineye/mineye',
					},
					{
						name: '通知',
						val: '',
						url:'/pages/mine/mineyhq/mineyhq'
					},
					{
						name: '未关电机锁车辆记录',
						val: '',
						url:'/pages/mine/mineyj/mineyj'
					},
					{
						name: '未关电池锁车辆记录',
						val: '',
						url:'/pages/mine/minezhmx/minezhmx'
					},
					{
						name: '员工反馈',
						val: '',
						url:'/pages/mine/minezhmx/minezhmx'
					},
					{
						name: '当前运维城市',
						val: '',
						url:'/pages/swapbattery/swapbattery'
					},
					{
						name: 'test',
						val: '',
						url:'/pages/repairPage/repaircar/repaircar'
					},
					{
						name: 'login',
						val: '',
						url:'/pages/mine/loginView/loginView'
					},
				]
			}
		},
		components: {
			itemCell
		},
		methods: {
			go(item) {
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
	}
</style>
