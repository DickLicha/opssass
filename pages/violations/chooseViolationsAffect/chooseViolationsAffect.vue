<template>
	<view class="containt-view">
		<view class="type-view">
			<view class="viola-item" v-for="(item,index) in items[typeData.tapItem]" :key="index" :class="{'violat-select-item' :index==currentIndex}" @click="itemClick(index)">{{item}}</view>
		</view>
		<view class="submit-btn" @click="submitClick()">提交</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				typeData:{},
				currentIndex: 20,
				items: [
					["路边，影响他人通行","路边，不影响他人通行","马路中间，影响机动车通行","马路中间，造车车辆损失","占用消防通道/盲道等特殊路段"],
					["两个成年人","成年人带2个小孩","三个以上"],
					["家长配合，结束用车","家长不配合，不结束用车"],
					["用户愿意承担责任","用户不愿意承担责任"],
					["用户配合找出藏匿车辆","用户拒绝找出藏匿车辆"],
					["用户愿意赔偿损失","用户拒绝赔偿损失"],
					["用户配合开锁","用户不配合开锁"],
				],
			}
		},
		onLoad(e) {
			console.log(JSON.parse(e.typeData));
			this.typeData = JSON.parse(e.typeData);
			console.log(this.typeData, this.items, this.typeData["tapItem"]);
		},
		onShow() {
			console.log(this.violationsInfo);
			if (this.violationsInfo.secondContent != null && this.violationsInfo.secondContent != "") {
				if (this.typeData["tapItem"] == this.violationsInfo.tapItem) {
					this.currentIndex = this.violationsInfo.secondTap; 
				}
			}
		},
		computed: mapState(['violationsInfo']),
		methods: {
			...mapMutations(['setViolationsInfo']),
			itemClick(tapItem){
				this.currentIndex = tapItem;
				console.log(this.currentIndex)
			},
			submitClick(){
				if (this.currentIndex == 20) {
					uni.showToast({
						title:"请选择影响类型",
						icon: "none"
					})
					return;
				}
				var vInfo = {
					"tapItem": this.typeData.tapItem,
					"itemContent": this.typeData.itemContent,
					"moreTapItem": this.typeData.moreTapItem,
					"moreItemContent": this.typeData.moreItemContent,
					"secondTap": this.currentIndex,
					"secondContent": this.items[this.typeData.tapItem][this.currentIndex],
					"remark": "",
				}

				this.setViolationsInfo(vInfo)
				uni.navigateBack({
					delta : 2,
				})
			}
		}
	}
</script>

<style lang="scss">
	.containt-view{
		background-color: #f6f6f6;
		width: 100%;
		height: calc(100vh);
		padding-top: 1upx;
		.type-view{
			display: flex;
			margin-top: 20upx;
			width: 100%;
			height: auto;
			flex-wrap: wrap;
			.viola-item{
				background-color: white;
				margin-left: 20upx;
				margin-bottom: 30upx;
				width: calc(100vw - 40upx);
				height: 88upx;
				font-size: 30upx;
				line-height: 88upx;
				text-align: center;
				color: black;
			}
			.violat-select-item{
				margin-left: 20upx;
				margin-bottom: 30upx;
				width: calc(100vw - 40upx);
				height: 88upx;
				font-size: 30upx;
				line-height: 88upx;
				text-align: center;
				color: #FFB400;
				border: 3upx solid #FFB400;
			}
		}
		.submit-btn{
			position: absolute;
			top: calc(100vh - 88upx - 60upx);
			left: 20upx;
			width: calc(100vw - 40upx);
			height: 88upx;
			border-radius: 6upx;
			background-color: gold;
			text-align: center;
			line-height: 88upx;
			font-size: 36upx;
		}
	}

</style>
