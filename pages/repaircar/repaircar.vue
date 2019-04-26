<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="swapdata" type='4' :border='borders' @itemclick='gocarcenter'></item-cell>
			<item-cell :itemdata="swapbatterydata" type='2' :border='borders'></item-cell>
			<item-cell :itemdata="faulttype" type='4' :border='borders' @itemclick='gofaultinfo'></item-cell>
			<view class='fault-view'>
				<view class='fault-list-view' v-for="(item,i) in faultdata" @click="faultpop('middle-list',item)">
					<text>{{item.name}}</text>
				</view>
			</view>
			<uni-popup  :show="type ==='middle-list'" position="middle" mode="fixed" @hidePopup="togglePopup('')">
				<!-- <view class='cancel-view'><img src="/static/image/quxiao.png" alt="" class='pop-cancels' @click="togglePopup('')"></view>			 -->
				<view class='cancel-view'><text class='pop-cancels' @click="togglePopup('')">取消</text></view>			
				<scroll-view :scroll-y="true" class="uni-center center-box">
					<view v-for="(item, index) in list" :key="index" @click="getfaulttype(item)" class="uni-list-item">
						{{ item.name }}
					</view>
				</scroll-view>
			</uni-popup>
			
			<view class='change-battery-button'>
				<button class='share-button-default bottom-button' @click='changbattery'>误报</button>
				<button class='share-button-default bottom-button' @click='changbattery'>处理完成</button>
			</view>
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				type:'',
				list: [],
				borders: true,
				swapdata: [{
					name: '车牌型号',
					val: '80135654'
				}],
				swapbatterydata: [{
						name: '当前状态:',
						val: '未入库'
					},
					{
						name: 'SIM卡状态:',
						val: '使用'
					},
				],
				faulttype:[{
					name: '故障类型:',
					val: '请在下面选择'
				}],
				faulttypeall:'',
				faultdata:[
					{
						name:'控制器故障',id:1
					},
					{
						name:'电机故障',id:2
					},
					{
						name:'刹车故障',id:3
					},
					{
						name:'车灯故障',id:4
					},
					{
						name:'刹把断电',id:5
					},
					{
						name:'转把故障',id:6
					},
					{
						name:'车把故障',id:7
					},
					{
						name:'控制器故障',id:8
					},
				]
			}
		},
		components: {
			itemCell,uniPopup
		},
		computed: mapState(['faultinfo']),
		onLoad(){
			this.setFaultinfo('')
			console.log('faultinfo',this.faultinfo)		
		},
		methods: {
			...mapMutations(['setFaultinfo']),
			getfaulttype(item){
				// if(this.faulttypeall==''){
				// 	this.faulttypeall=item.name
				// }
				// else if(this.faulttypeall.indexOf(item.name)=='-1'){
				// 	this.faulttypeall+='/'+item.name
				// }	
				
				if(this.faultinfo==''){
					this.setFaultinfo(item.name)
				}
				else if(this.faultinfo.indexOf(item.name)=='-1'){
					let temp=this.faultinfo					
					temp+='/'+item.name
					this.setFaultinfo(temp)
				}						
				this.faulttype[0].val=this.faultinfo
				this.type=''
			},
			faultpop(types,item){
				this.type=types
				switch(item.id){
					case 1:
					this.list=[
						{
						name:'进水短路',
						val:1
					},
					{
						name:'功能故障',
						val:2
					},
					]
					break;
					case 2:
					this.list=[
						{
						name:'电机线被剪',
						val:1
					},
					{
						name:'电机端盖裂',
						val:2
					},
					{
						name:'功能故障',
						val:3
					},
					]
					break;
					default:
					this.list=[
						{
						name:'其他',
						val:1
					},
					]		
				}
			},
			gocarcenter() {
				uni.navigateTo({
					url: '/pages/carcenter/carcenter',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			togglePopup(type) {
				this.type = type
			},
			gofaultinfo(){
				if(this.faultinfo==''){
					return
				}
				this.setFaultinfo(this.faultinfo.split('/'))
			    uni.navigateTo({
			    	url: '/pages/faulttypeview/faulttypeview',
			    	success: res => {},
			    	fail: () => {},
			    	complete: () => {}
			    });	
			},
			changbattery() {
				uni.showModal({
					title: '确认打开电池锁',
					content: '',
					// showCancel: false,
					cancelText: '取消',
					confirmText: '打开',
					confirmColor: '#F6C700',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
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
		.center-box {
			width: 500upx;
			height: 500upx;
		}
		.cancel-view{
			position: relative;
			text-align: left;
			width:100%;
			.pop-cancels{
				width: 30upx;
				height: auto;
				position: relative;
				/* right:50upx; */
		}
		
		}
		.uni-list-item {
			text-align: center;
			line-height: 70upx;
			/* border-bottom: 1px #f5f5f5 solid; */
			background-color: rgb(222,222,222);
			margin-bottom: 20upx;
			margin-top: 10upx;
		}
		
		.uni-list-item:last-child {
			border: none;
		}

		/* margin-bottom: 20upx; */
		.view-common {
			margin: 10upx 22upx;
			height: 98vh;
			position: relative;
            .fault-view{
				margin:20upx 0;
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;
				align-items: center;
				.fault-list-view{
					background-color: white;
					width: calc(50% - 50upx);
					margin-bottom: 20upx;
					height: 70upx;
					line-height: 70upx;
					text-align: center;
				}
			}
			.change-battery-button {
				position: fixed;
				bottom: 3vh;
				width: 706upx;
				display: flex;
				.bottom-button{
					margin: 0 40upx;
					width:50%
				}
			}
			
		}
	}
</style>
