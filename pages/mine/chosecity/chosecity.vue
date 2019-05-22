<template>
	<view>
		
	</view>
</template><template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="carcenterdata1" :type='2' :border='true'></item-cell>
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	import {mapState,mapMutations} from 'vuex'
	export default {
		components: {
			itemCell
		},
		computed: mapState(['directinfo','bikeinfo']),
		data() {
			return {
				carcenterdata1: [{
						name: '车型:',
						val: ''
					},
					{
						name: '库存状态:',
						val: ''
					},
					{
						name: '车辆状态:',
						val: ''
					},
					{
						name: '车辆位置:',
						val: ''
					},
				],
			}
		},
		methods: {
			gocarcenter(item) {
				uni.navigateTo({
					url: item.url,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
		}
	}
</script>

<style lang='scss' scoped>
	.wrap {
		background-color: rgb(245, 245, 245);
		padding-top: 1upx;
		padding-bottom: 1upx;

		.view-common {
			margin: 10upx 22upx;
		}
	}
</style>


<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
