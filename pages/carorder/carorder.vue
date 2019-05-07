<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="carcenterdata1" :type='2' :border='true' @itemclick='go'></item-cell>
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	import {mapState} from 'vuex'
	export default {
		components:{
			itemCell
		},
		computed: mapState(['bikeinfo']),
		data() {
			return {
				carcenterdata1:[
					{name:'订单编号:',val:''},
					{name:'用户姓名:',val:''},
					{name:'手机号码:',val:'',click:true},
					{name:'订单开始:',val:''},
					{name:'订单结束:',val:''},
					{name:'订单状态:',val:'已结束'},
					{name:'订单轨迹:',val:'查看',click:true},
				]		
			}
		},
		onLoad(){
			// this.getcarinfo()
			// 订单编号
			this.carcenterdata1[0].val = this.bikeinfo.last_order_id
						
			// 用户姓名
			this.carcenterdata1[1].val = this.bikeinfo.last_order_oper_name
			 
			// 手机号码
			this.carcenterdata1[2].val = this.bikeinfo.last_order_oper_phone
			
			// 订单开始时间
			this.carcenterdata1[3].val = this.bikeinfo.last_order_start_time
			
			// 订单结束时间
			this.carcenterdata1[4].val = this.bikeinfo.last_order_end_time
			
			// 订单状态
			if(this.bikeinfo.last_order_id!=''){
				this.carcenterdata1[5].val = '已结束'
			}else{
				this.carcenterdata1[5].val = '空闲'
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
			},
			go(item){
				if(item.click){
					if(item.name=='手机号码:'){
						uni.showModal({
							title: '',
							content: item.val,
							// showCancel: false,
							cancelText: '取消',
							confirmText: '拨打',
							success: res => {
								uni.makePhoneCall({
									phoneNumber:item.val
								})
							},
							fail: () => {},
							complete: () => {}
						});
					}else if(item.name=='订单轨迹:'){
						uni.navigateTo({
							// url: '/pages/map/map?name=' + name
							url: `/pages/map/map?name=订单轨迹&type=0.1&text=33`
						});
					}
				}				
			},
		}
	}
</script>

<style lang='scss' scoped>
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
