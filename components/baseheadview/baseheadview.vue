<template>
	<view>
		<view class="base-header" @click='showmapcoverview'>
			<i v-if="hasBack" class="iconfont iconjiantou" @click="goback" style="float: left;margin-top: 5px"></i>
			<text>{{title}}</text>
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
		},
		methods: {
			messagecenter() {
				this.$emit("messCenter")
			},
			showmapcoverview(){
				this.$emit("show")
			},
			goback() {
				// this.$emit('goBack')
				// this.$router.goBack()
				uni.navigateBack({
					delta: 1
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

		span:nth-child(1) {
			text-align: center;
		}

		span:nth-child(2) {
			position: absolute;
			right: 6px;
		}
	}
</style>
