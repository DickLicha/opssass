<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="carcenterdata1" :type='2' :border='true' ></item-cell>
			</view>			
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
		onLoad(e) {
			// this.getcarinfo()
			// 车型
			console.log('mapcovers',this.mapcovers)
			this.carcenterdata1[0].val = e.name
			var desc=''
			console.log(e)
			if(parseInt(e.bickcount)<parseInt(e.allcount)){
				desc='不足'
			}else{
				desc='过量'
			}
			this.carcenterdata2[0].val = desc
			this.carcenterdata2[1].val = e.bickcount+'辆'
		},
		computed: mapState(['directinfo','bikeinfo','mapcovers']),
		data() {
			return {
				carcenterdata1: [
					{
						name: '车辆编号:',
						val: ''
					},
					{
						name: 'SIM卡状态:',
						val: ''
					},
					{
						name: '请选择无法挪车原因:',
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
			height: 100vh;
		}
		.car-view{
			margin: 40upx 20upx;
			.car-list-view{
				margin: 20upx 0 0 0;
			}
		}
	}
</style>
