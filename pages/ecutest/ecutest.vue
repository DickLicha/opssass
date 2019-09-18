<template>
	<view class='wrap'>
		<view class='view-common'>
			<view>
				<text>当前车辆imei：</text>
				<text>{{imei}}</text>
			</view>
			<view class='common-item' v-for="(item,i) in repairlist" @click="go(item)">
				<text>{{item.name}}</text>
			</view>
			<button type='primary' class='share-button-default' @click="scancode">扫码</button>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				repairlist: [{
						name: '开锁',
						val: '0',
						url: '/ecutest/unlock',
					},
					{
						name: '关锁',
						val: '1',
						url: '/ecutest/lock',
					},
					{
						name: '关电门',
						val: '2',
						url: '/ecutest/acc_off',
					},
					{
						name: '开电门',
						val: '3',
						url: '/ecutest/acc_on',
					},
					{
						name: '开电池锁',
						val: '4',
						url: '/ecutest/battery_unlock',
					},
					{
						name: '播放语音',
						val: '5',
						url: '/ecutest/voice',
					},
					{
						name: '批量测试',
						val: '6',
						url: '/ecutest/bat',
					},
				],
				order: {
					length: ''
				},
				type: '',
				userinfo: {},
				imei: '',
			}
		},
		methods: {
			...mapMutations(['setOrderfirstid', 'setOrderinfo', 'setSn', 'setBikeid', 'setBikeinfo']),
			go(item) {
				if(this.imei==''){
					uni.showToast({
						title:'请先扫码',
						duration:2000,
					})
					return
				}
				uni.showLoading({
					title: `${item.name}中`
				});
				var index = '*'
				if (item.val == '5') {
					index = 1
				}
				let options = {
					url: item.url,
					method: 'POST',
					data: {
						imei: this.imei,
						index: index,
					}
				}
				this.$httpReq(options).then((res) => {
					console.log('测试', res)
					uni.hideLoading()
					if (res.status == 0) {
						uni.showToast({
							title: `成功`,
							icon: 'none',
							duration: 3000
						});
					} else {
						uni.showToast({
							title: res.message ? res.message : '失败',
							icon: 'none',
							duration: 3000
						});
					}
				})
			},
			scancode() {
				wx.scanCode({
					onlyFromCamera: true,
					success: res => {
						var result = res.result.split(' ')
						console.log(result, 'result')
						var imei = result[0].split(':')[1]
						this.imei = imei
					},
					fail: res => {

					}
				})
			}
		},
		onLoad(e) {
			console.log('eeee', e)
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
			margin: 30upx 22upx;
			height: 98vh;
			position: relative;

			.common-item {
				background-color: white;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				margin-bottom: 20upx;
				margin-top: 30upx;
			}
		}
	}
</style>
