<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="carcenterdata1" :type='2' :border='true'></item-cell>
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		components: {
			itemCell
		},
		computed:mapState(['directinfo', 'bikeinfo','removecaritem']),
		onLoad() {
			console.log('this.removecaritem',this.removecaritem)
			// 车辆编号
			this.carcenterdata1[0].val = this.removecaritem.bike_id
			// 挪车开始时间
			this.carcenterdata1[1].val = this.removecaritem.create_time
			// 挪车结束时间
			this.carcenterdata1[2].val = this.removecaritem.end_time
			// 挪车开始地点
			this.carcenterdata1[3].val = this.removecaritem.start_address
			// 挪车结束地点
			this.carcenterdata1[4].val = this.removecaritem.end_address
			// 是否有效
			var status=''
			if(this.removecaritem.grade==0 || this.removecaritem.grade==null){
				status='无效'
			}else{
				status='有效'
			}
			this.carcenterdata1[5].val = status
			// 备注
			this.carcenterdata1[5].val = this.removecaritem.grade_info.remark
			// // 无效原因
			// this.carcenterdata1[6].val = this.removecaritem.create_time
			// // 不合格原因
			// this.carcenterdata1[7].val = this.removecaritem.create_time

		},
		// computed:mapState(['removecaritem']),
		
		data() {
			return {
				carcenterdata1: [{
						name: '车辆编号:',
						val: ''
					},
					{
						name: '挪车开始时间:',
						val: ''
					},
					{
						name: '挪车结束时间:',
						val: ''
					},
					{
						name: '挪车开始地点',
						val: ''
					},
					{
						name: '挪车结束地点:',
						val: ''
					},
					{
						name: '是否有效:',
						val: ''
					},
					{
						name: '备注:',
						val: ''
					},
					// {
					// 	name: '无效原因:',
					// 	val: ''
					// }, {
					// 	name: '不合格原因:',
					// 	val: ''
					// }
				],
				item: '',
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
		},
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
	}
</style>
