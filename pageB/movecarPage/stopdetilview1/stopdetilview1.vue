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
			this.carcenterdata1[0].val = this.mapcovers.name
			var desc=''
			if(parseInt(e.bickcount)<parseInt(e.allcount)){
				desc='不足'
			}else{
				desc='过量'
			}
			this.carcenterdata1[1].val = this.mapcovers.id
			this.carcenterdata1[2].val = this.mapcovers.grade
			this.carcenterdata1[3].val = this.mapcovers.radius
			this.carcenterdata1[4].val = this.mapcovers.remark
			// this.carcenterdata1[5].val = this.mapcoversgrade
		},
		computed: mapState(['directinfo','bikeinfo','mapcovers']),
		data() {
			return {
				carcenterdata1: [
					{
						name: '车站名称:',
						val: ''
					},
					{
						name: 'ID:',
						val: ''
					},
					{
						name: '等级:',
						val: ''
					},
					{
						name: '半径:',
						val: ''
					},
					{
						name: '描述:',
						val: ''
					},
					// {
					// 	name: '是否为库房:',
					// 	val: ''
					// },
					// {
					// 	name: '状态:',
					// 	val: ''
					// },
				],
				carcenterdata2: [
					{
						name: '车站供给状态:',
						val: ''
					},
					{
						name: '车站内车辆:',
						val: ''
					},
				],
				carlist:[]
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
