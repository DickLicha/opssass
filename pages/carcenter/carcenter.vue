<template>
	<view class='wrap'>
		<view class='view-common'>
			<itemcell :itemdata="carcenterdata1" :type='2' :border='true' ></itemcell>
			<itemcell :itemdata="carcenterdata2" :type='2' :border='true' ></itemcell>
			<itemcell :itemdata="carcenterdata3" :type='4' :border='true' @itemclick='gocarcenter'></itemcell>			
		</view>
	</view>
</template>

<script>
	import itemcell from '@/components/itemcell/itemcell.vue'
	export default {
		components:{
			itemcell
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
					{name:'换电记录',val:''},
					{name:'维修记录',val:''},
					{name:'车辆轨迹',val:''},
					{name:'最后一次扫码时手机位置',val:''},
					{name:'ECU',val:''},
					{name:'电池',val:''},
				],
				
			}
		},
		methods: {
			gocarcenter(item){
				console.log('33',item)
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

<style lang='scss'>
	.wrap{
		background-color: rgb(245,245,245);		
		padding-top: 1upx;
		padding-bottom: 1upx;
		.view-common{
		  margin:10upx 22upx;
		}
	}
	
  
</style>
