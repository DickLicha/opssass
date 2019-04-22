<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="carcenterdata1" :type='2' :border='true' ></item-cell>
			<item-cell :itemdata="carcenterdata2" :type='2' :border='true' ></item-cell>
			<item-cell :itemdata="carcenterdata3" :type='4' :border='true' @itemclick='gocarcenter'></item-cell>			
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	export default {
		components:{
			itemCell
		},
		data() {
			return {
				carcenterdata1:[
					{name:'车型:',val:'6.0'},
					{name:'库存状态:',val:'已投放'},
					{name:'车辆状态:',val:'正常'},
					{name:'车辆位置:',val:'车站外'},
				],
				carcenterdata2:[
					{name:'使用状态:',val:'空闲'},
					{name:'运行状态状态:',val:'禁止不止10分钟'},
					{name:'网络状态:',val:'在线'},
					{name:'GPS状态:',val:'可用'},
					{name:'SIM卡状态:',val:'可用'},
					{name:'车锁状态:',val:'关闭'},
					{name:'车把状态:',val:'可用'},
				],
				carcenterdata3:[
					{name:'订单',val:'',url:'/pages/carorder/carorder'},
					{name:'开关锁记录',val:'',url:'/pages/switchloockinfo/switchloockinfo'},
					{name:'换电记录',val:'',url:'/pages/batteriesrecord/batteriesrecord'},
					{name:'维修记录',val:'',url:'/pages/carorbit/carorbit'},
					{name:'车辆轨迹',val:'',url:'/pages/map/map?type=0.1'},
					{name:'最后一次扫码时手机位置',val:'',url:'/pages/map/map?type=0.2'},
					{name:'ECU',val:'',url:'/pages/ecuview/ecuview'},
					{name:'电池',val:'',url:'/pages/batteryview/batteryview'},
				],				
			}
		},
		methods: {
			gocarcenter(item){
				uni.navigateTo({
					url: item.url,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style lang='scss' scoped>
	.wrap{
		background-color: rgb(245,245,245);		
		padding-top: 1upx;
		padding-bottom: 1upx;
		.view-common{
		  margin:10upx 22upx;
		}
	}
	
  
</style>
