<template>
	<view class='wrap'>
		<view class='view-common'>
			<view>
				<item-cell :itemdata="swapdata" type='4' :border='true' @itemclick='gocarcenter'></item-cell>
			</view>
			<view class='result-fault'>
				<view class='result-fault-view' v-for="(item,i) in faultdata" :key="i" >{{item.name}}</view>
			</view>
			<view>
				<button class='share-button-default submit-btn'>提交报修</button>
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
		data() {
			return {
				isOpened: false,
				swapdata:[{name:'车辆编号',val:''}],
				faultdata:[
					{name:'车灯坏',val:'0'},
					{name:'线路断',val:'1'},
					{name:'刹车坏',val:'2'},
					{name:'脚蹬坏',val:'3'},
					{name:'车座坏',val:'4'},
					{name:'盖板卡死',val:'5'},
					{name:'车撑坏',val:'6'},
					{name:'拧把不走',val:'7'},
					{name:'无法开锁',val:'8'},
					{name:'二维码坏',val:'9'},
					{name:'闸锁故障',val:'10'},
					{name:'喇叭不响',val:'11'},
					{name:'广告牌裂',val:'12'},
					{name:'其他',val:'13'},
					]
			}
		},
		computed: mapState(['faultinfo','directinfo']),
		onLoad(){
			console.log('faultinfo',this.faultinfo)
		},
		methods: {
			...mapMutations(['setFaultinfo']),
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

		/* margin-bottom: 20upx; */
		.view-common {
			margin: 30upx 22upx;
			height: 98vh;
			position: relative;
			.submit-btn{
				position: fixed;
				bottom: 20upx;
				width: calc(100% - 44upx)
			}
			.result-fault{
				margin-top: 20upx;
				display: flex;
				flex-wrap: wrap;
				.result-fault-view{
					width: 40%;
					margin-left: 40upx;
					text-align: center;
					margin-top: 20upx;
					background-color: white;
					height: 80upx;
					line-height: 80upx;
				}
			}

		}
	}
</style>