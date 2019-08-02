<template>
	<view class='wrap'>
		<view class='view-common'>
			<view class='common-item' v-for="(item,i) in repairlist" @click="go(item)">
				<text>{{item.name}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				repairlist:[{
						name: '手动输入',
						val: '',
						url: `/pages/manualscan/manualscan?urls=/pages/violations/reportViolations/reportViolations&&type=10`
					},
					{
						name: '扫码输入',
						val: '',
						url: `/pages/manualscan/manualscan?urls=/pages/violations/reportViolations/reportViolations&&type=10`
					},
				]
			}
		},
		methods: {
			
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
			}
		}
	}
</style>
