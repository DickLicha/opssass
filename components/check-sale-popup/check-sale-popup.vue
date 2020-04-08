<template>
	<view>
		<uni-popup ref="popup" type="center">
			<view class="popup">
				<view class="popup-tt tl flex-box">
					<view class="popup-tt-img">
						<image :src="checkData.sku_thumb" mode="aspectFill"></image>
					</view>
					<view class="popup-ct flex text3">{{checkData.sku_title}}</view>
				</view>
				<scroll-view scroll-y class="popup-box tl">
					<view class="flex-box">
						<view>顾客名称：</view>
						<view class="flex">{{checkData.user_name}}</view>
					</view>
					<view class="flex-box">
						<view>手机号码：</view>
						<view class="flex">{{checkData.user_phone}}</view>
					</view>
					<view class="flex-box">
						<view>开始时间：</view>
						<view class="flex">{{checkData.use_start_time}}</view>
					</view>
					<view class="flex-box">
						<view>截止时间：</view>
						<view class="flex">{{checkData.use_end_time}}</view>
					</view>
					<view class="flex-box">
						<view>商品详情：</view>
						<view class="flex">{{checkData.sku_desc}}</view>
					</view>
				</scroll-view>
				<view class="popup-btns flex-box">
					<view class="btn flex" @tap="close">取消</view>
					<view class="btn flex theme-color" @tap="confirm">核销</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components: {
			uniPopup
		},
		props: {
			checkData: {
				type: Object
			}
		},
		methods: {
			open() {
			    this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			confirm() {
				this.$utils.getLocation((res) => {
					let {latitude, longitude} = res
					let {code} = this.checkData
					this.$request({
						url: '/merchant/operation/write_off',
						header: {
							lnglat: `${latitude},${longitude}`
						},
						data: {
							code
						},
						loadTitle: '请稍候'
					}).then((res) => {
						uni.showModal({
							title: '提示',
							content: '核销成功',
							showCancel: false,
						})
						this.close()
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup{
		.popup-tt{
			font-size: 30rpx;
			line-height: 36rpx;
			height: 108rpx;
			.popup-tt-img{
				width: 110rpx;
				height: 110rpx;
				margin-right: 20rpx;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		.popup-box{
			font-size: 28rpx;
			.flex-box{
				align-items: flex-start;
			}
		}
	}
</style>
