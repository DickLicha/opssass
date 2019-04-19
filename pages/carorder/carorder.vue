<template>
	<view class='wrap'>
		<view class='view-common'>
			<itemcell :itemdata="carcenterdata1" :type='2' :border='true' ></itemcell>
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
					{name:'订单编号:',val:'T1904194644548'},
					{name:'用户姓名:',val:'XXX'},
					{name:'手机号码:',val:'130435xxxx'},
					{name:'订单开始:',val:'2019-04-19：12:55:44'},
					{name:'订单结束:',val:'2019-04-19：12:55:44'},
					{name:'订单状态:',val:'已结束'},
					{name:'订单轨迹:',val:'查看'},
				]		
			}
		},
		methods: {
			gocarcenter(e){
// 				uni.navigateTo({
// 					url: '/pages/map/map',
// 					success: res => {},
// 					fail: () => {},
// 					complete: () => {}
// 				});
			}
		}
	}
</script>

<style lang='scss' >
	.wrap{
		background-color: rgb(245,245,245);	
	    height: calc(100vh - 11upx);
		padding-top: 1upx;
		overflow: hidden;
		/* padding-bottom: 1upx; */
		.view-common{
		  margin:10upx 22upx 0 22upx;
		}
	}
	
  
</style>
