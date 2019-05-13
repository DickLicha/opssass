<template>
	<view>
		<view class="base-header" >
			<i v-if="hasBack" class="iconfont iconsousuo sousuo-view" @click='gosuchview'></i>
			<text class='text-view' @click='showmapcoverview'>{{title}}</text>
			<img v-if='xialajiantou' src="../../static/image/xiala.png" class='base-img'  alt="">
			<!-- <img src="/static/image/shangla.png" style='width:20upx;height:auto' alt=""> -->
			<text v-if="hasright" @click="messagecenter">{{rightTitle}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: "Headers",
		props: {
			title: {
				default: ''
			},
			hasBack: {
				default: false
			},
			hasright: {
				default: false
			},
			rightTitle: {
				default: ''
			},
			xialajiantou:{
				default:false
			}
		},
		methods: {
			messagecenter() {
				this.$emit("messCenter")
			},
			showmapcoverview(){
				this.$emit("show")
			},
			goback() {
				uni.navigateBack({
					delta: 1
				});
			},
			gosuchview(){
				uni.navigateTo({
					url: '../searchview/searchview',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		},
	}
</script>

<style scoped lang="scss">
	.base-header {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 80upx;
		line-height: 80upx;
		// background-color: #f5f5f5;
		background-color: #555555;
		text-align: center;
		.base-img{
			width:18upx;
			height:18upx;
		}
		.sousuo-view{
			position: absolute;
			right:18upx;
			font-size: 40upx;
			color:white;
		}
        .text-view{
			color:white
		}
		span:nth-child(1) {
			text-align: center;
		}

		span:nth-child(2) {
			position: absolute;
			right: 6px;
		}
	}
</style>
