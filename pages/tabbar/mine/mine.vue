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
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				borders: true,
				swapdata: [{
					name: '',
					val: '',
					url:'/pages/mine/minecard/minecard'
				}],
				swapbatterydata: [
					{
						name: '切换城市',
						val: '',
						url:'/pages/mine/mineye/mineye',
					},
					{
						name: '换电记录',
						val: '',
						url:'/pages/mine/minehdrecord/minehdrecord'
					},
					{
						name: '挪车记录',
						val: '',
						url:'/pages/movecarPage/removecarrecord/removecarrecord'
					},
					{
						name: '最近上传日志',
						val: '',
						url:'/carBigCenter/uploadlog/uploadlog'
					},
					{
						name: '身份证辅助认证',
						val: '',
						url:'/pages/mine/mineyhq/mineyhq'
					},
					// {
					// 	name: 'test',
					// 	val: '',
					// 	url:'/pages/mine/mineyj/mineyj'
					// },				
				]
			}
		},
		onLoad(){			
		},
		onShow(){
			try {
				const value = uni.getStorageSync('userinfo');
				if (value) {
					this.swapdata[0].name=value.userinfo.name
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
