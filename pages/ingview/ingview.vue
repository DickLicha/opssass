<template>
	<view class='wrap'>
		<view class='view-common'>
			<!-- <item-cell :itemdata="carcenterdata3" :type='4' :border='true' @itemclick='gocarcenter'></item-cell> -->
			<view>
				<view class='item-cell' v-for="(item,i) in inginfo" :key='i' @click="go(item)">
					<view class='item-cell-inner'><text>{{item.bike_sn}}</text><text>{{name}}</text></view>
					<view class='item-cell-inner'><text>开始{{name}}：</text><text>{{item.create_time}}</text></view>
					<view class='right-arrows'>
						<i class="iconfont iconjiantou "></i>
					</view>
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
			this.type=e.type
			console.log('this.inginfo',e.type)
			if(this.type==0){
				wx.setNavigationBarTitle({
					title: '换电订单'
				})
				this.name='换电'
			}else{
				wx.setNavigationBarTitle({
					title: '挪车订单'
				})
				this.name='挪车'
			}
		},
		computed: mapState(['directinfo','bikeinfo','inginfo']),
		data() {
			return {
				type:'',
				name:''
			}
		},
		methods: {
			go(item) {
				if(this.type==0){
					uni.navigateTo({
						url: `/pages/endingview/endingview?type=${this.type}&&bikeid=${item.bike_id}&&orderid=${item.id}`,
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}else{
					uni.navigateTo({
						url: `/pages/movecarPage/checkupcar/checkupcar?type=99&&bikeid=${item.bike_id}&&orderid=${item.id}`,
						success: res => {},
						fail: () => {},
						complete: () => {}
					});
				}
				
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
			.item-cell{
				background-color: white;
				margin: 20upx;
				position: relative;
				.right-arrows{
					position: absolute;
					right: 20upx;
					top:22upx;
				}
				.item-cell-inner{
					margin-left: 22upx
				}
			}
		}
	}
</style>
