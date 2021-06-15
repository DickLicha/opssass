<template>
	<view class='wrap'>
		<view class='view-common'>
			<view class='base-head'>
				<view class='search-head'>
					<i class="iconfont iconsousuo search-icon"></i>
					<input class='search-input' placeholder="地点搜索" v-model="inputval" @input="getplace" type="text">
				</view>
				<text class='search-cacel' @click='goback'>取消</text>
			</view>
			<view class='search-histroy'>
				<!-- <item-cell :itemdata="swapdata" type='2' :border='borders'></item-cell> -->
				<view class='search-histroy-view' v-for="(item,i) in swapdata" :key='i' @click='gomapview(item)'>
					<view>
						<i class='iconfont icondengdai load-icon'></i>
					</view>
					<view class='history-font'>
						<view><text class='history-first'>{{item.name}}</text></view>
						<view><text class='history-secon'>{{item.district}}</text></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	import amap from '@/sdk/amap/amap-wx.js';
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				swapdata: [
				],
				amapPlugin:{},
				inputval:'',
			}
		},
		components: {
			itemCell
		},
		onLoad(){
			this.amapPlugin = new amap.AMapWX({
				key: '9fdc0486cc497bd08c388dc8db6ea85b',
			});			
		},
		methods: {
			...mapMutations(['setLongitude','setLatitude']),
			goback() {
              uni.navigateBack({
              	delta: 1
              });
			},
			gomapview(item){
				try{
					var placels=item.location.split(',')
					this.setLongitude(placels[0])
					this.setLatitude(placels[1])
					uni.navigateBack({
						delta: 1
					});
				}catch(e){
					//TODO handle the exception
					uni.showToast({
						title: '该地点经纬度异常',
						icon:'none'
					});
				}
				
			},
			getplace(){
				this.amapPlugin.getInputtips({
					key: '9fdc0486cc497bd08c388dc8db6ea85b',
					keywords: this.inputval,
					success: res => {
						console.log("检索结果:",res);
						this.swapdata=res.tips
					},
					fail: res =>{
						console.log("失败:",res);
					}
				})
			}
		}
	}
</script>

<style lang='scss' scoped>
	.wrap {
		/* background-color: rgb(245, 245, 245); */
		height: calc(100vh);
		padding-top: 1upx;
		overflow: hidden;

		.view-common {
			margin-top: 20upx;

			.search-histroy {
				background-color: rgb(245, 245, 245);
				height: calc(100vh - 90upx);

				.search-histroy-view {
					border-bottom: 1upx solid rgb(235, 235, 235);
					margin: 20upx 50upx;
					height: 120upx;
					display: flex;
					background-color: #F6C700;

					.history-font {
						margin-left: 12upx;
					}

					.history-first {}

					.history-secon {
						color: rgb(100, 100, 100);
						font-size: 24upx;
						/* margin-left: 18upx; */
					}

					.load-icon {
						font-size: 12px;
					}
				}
			}

			.base-head {
				margin: 10upx 22upx;
				display: flex;
				background-color: white;

				.search-head {
					line-height: 60upx;
					display: flex;
					align-content: center;
					border: 1upx solid #F6C700;
					width: 90%;
					height: 60upx;
					border-radius: 8upx;

					.search-icon {
						height: 60upx;
						margin-top: -12upx;
						margin-left: 6upx;
						font-size: 40upx;
					}

					.search-input {
						height: 60upx;
						margin-left: 6upx;
						/* background-color: #F6C700; */
						width: 100%
					}
				}

				.search-cacel {
					margin-left: 16upx;
					width: 10%;
					line-height: 60upx;
				}
			}

		}
	}
</style>
