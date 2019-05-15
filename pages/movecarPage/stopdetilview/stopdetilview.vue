<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="carcenterdata1" :type='4' :border='true' @itemclick='go'></item-cell>
			<item-cell :itemdata="carcenterdata2" :type='2' :border='true'></item-cell>
			<view class='car-view'>
				<view class='car-list-view' v-for="(item,i) in carlist" :key='i'>
					<text>车辆编号：</text>
					<text>{{item.sn}}({{getstatus(item.bus_state)}})</text>
				</view>
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
			this.requestbikelist(e.id)
		},
		computed: mapState(['directinfo','bikeinfo']),
		data() {
			return {
				carcenterdata1: [{
						name: '车站名称:',
						val: ''
					}
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
			getstatus(state){
				var status=''
				if(state==0){
					status='正常'
				}else{
					status='异常'
				}
				return status
			},
			requestbikelist(id) {
				let options = {
					url: '/bike/list',
					method: 'POST',
					data: {
						"pno": 1,
						"psize": 10,
						"park_id": id
					}
				}
				this.$httpReq(options).then((res) => {
					console.log('车站内车辆', res)
					if(res.status==0){
						this.carlist=res.list
					}
				})
			},
			go(){
				uni.navigateTo({
					url: '/pages/movecarPage/stopdetilview1/stopdetilview1',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
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
