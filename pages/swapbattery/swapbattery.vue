<template>
	<view class='wrap'>
		<view class='view-common'>
			<itemcell :itemdata="swapdata" type='4' :border='borders' @itemclick='gocarcenter'></itemcell>
			<itemcell :itemdata="swapbatterydata" type='2' :border='borders' ></itemcell>
		</view>

	</view>
</template>

<script>
	import itemcell from '@/components/itemcell/itemcell.vue'
	export default {
		data() {
			return {
				borders: true,
				swapdata: [{
					name: '车牌型号',
					val: '80135654'
				}],
				swapbatterydata: [{
						name: '车型:',
						val: '6.0'
					},
					{
						name: '剩余电量:',
						val: '39%'
					},
					{
						name: '电池状态:',
						val: '装入'
					},
					{
						name: '电池锁状态:',
						val: '关闭'
					},
					{
						name: '电池电压:',
						val: '49.23v'
					},
					{
						name: '剩余容量:',
						val: '4.93Ah'
					},
					{
						name: '剩余寿命:',
						val: '96%'
					},
					{
						name: '网络状态:',
						val: '在线'
					},
				]
			}
		},
		components: {
			itemcell
		},
		methods: {
			gocarcenter() {
				uni.navigateTo({
					url: '/pages/carcenter/carcenter',
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
			height:98vh;
		}
	}
</style>
