<template>
	<view class='wrap'>
		<view class='view-common'>
				<uni-swipe-action class='action-class' :options="options1" v-for="(item,i) in faultinfo" @click='bindClick(i)'>
					<!-- <uni-list-item :show-arrow="false" :title="item" /> -->
					<view class='action-list-view'>{{item}}</view>
				</uni-swipe-action>
			</view>
	</view>
</template>

<script>
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniList from '@/components/uni-list/uni-list.vue'
	import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
	import {mapState,mapMutations} from 'vuex'

	export default {
		components: {
			uniSwipeAction,
			uniList,
			uniListItem
		},
		data() {
			return {
				isOpened: false,
				options1: [{
					text: '删除',
					style: {
						backgroundColor: 'rgb(255,58,49)'
					}
				}],
			}
		},
		computed: mapState(['faultinfo','directinfo','selectfaultobj']),
		onLoad(){
			console.log('faultinfo',this.faultinfo)
		},
		methods: {
			...mapMutations(['setFaultinfo']),
			bindClick(i) {
				this.faultinfo.splice(i,1)
				this.selectfaultobj.splice(i,1)
			},
			setOpened() {
				this.isOpened = !this.isOpened
			},
			bindOpened() {
				this.isOpened = true
			},
			bindClosed() {
				this.isOpened = false
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

		/* margin-bottom: 20upx; */
		.view-common {
			margin: 30upx 22upx;
			height: 98vh;
			position: relative;
			.action-class{
				margin:20upx;
				width:calc(100% - 44upx)
			}

			.action-list-view {
				height: 80upx;
				line-height: 80upx;
				text-align: center;
			}
		}
	}
</style>