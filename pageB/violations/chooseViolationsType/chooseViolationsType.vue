<template>
	<view class="containt-view">
		<view class="type-view">
			<view class="viola-item" v-for="(item,index) in items" :key="index" :class="{'violat-select-item' :index==tapItem}" @click="itemClick(index)">{{item}}</view>
		</view>
		<view class="item-one-view" v-show="tapItem == 0">
			<view class="title">请选择</view>
			<view class="more-list-view" >
				<view class="more-list-item" v-for="(item,index) in moreItem" :key="index" :class="{'more-list-select-item' :index==moreTapItem}" @click="moreClick(index)">{{item}}</view>
			</view>
		</view>
		<view class="remark-view" v-show="tapItem == 7">
			<textarea class="area-view" value="" placeholder="备注" v-model="remark" />
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
				remark: "",
				tapItem : 20,
				moreTapItem : 20,
				items: [
					"乱停放","一人栽多人","未成年人骑行","肇事逃逸","私藏车辆","恶意破坏车辆","上私锁","其他"
				],
				moreItem: [
					"马路上","楼道内","小区内","车库下"
				]
			}
		},
		onLoad(e) {
			this.tapItem = this.violationsInfo.tapItem;
			this.moreTapItem = this.violationsInfo.moreTapItem;
			this.remark = this.violationsInfo.remark;
		},
		computed: mapState(['violationsInfo']),
		methods: {
			...mapMutations(['setViolationsInfo']),
			itemClick(tapItem){
				this.moreTapItem = 20;
				this.tapItem = tapItem;
				console.log(this.tapItem)
				switch (tapItem){
					case 0:
						break;
					case 1:
						break;
					case 2:
						break;
					case 3:
						break;
					case 4:
						break;
					case 5:
						break;
					case 6:
						break;
					case 7:
						break;
					default:
						break;
				}
			},
			moreClick(e){
				this.moreTapItem = e;
			},
			submitClick(){
				if (this.tapItem == 7) {
					if (this.remark == "") {
						uni.showToast({
							title:"请填写违规描述",
							icon: "none"
						})
						return;
					}
					var vInfo = {
								"tapItem": this.tapItem,
								"itemContent": this.items[this.tapItem],
								"moreTapItem": this.moreTapItem,
								"moreItemContent": this.moreItem[this.moreTapItem],
								"remark": this.remark,
								}
					
					this.setViolationsInfo(vInfo)
					uni.navigateBack({})
				}else{
					if (this.tapItem == 0 && this.moreTapItem == 20) {
						uni.showToast({
							title:"请选择二级分类",
							icon: "none"
						})
						return;
					}
					var vInfo = {};
					if (this.moreTapItem != 20) {
						vInfo = {
								"tapItem": this.tapItem,
								"itemContent": this.items[this.tapItem],
								"moreTapItem": this.moreTapItem,
								"moreItemContent": this.moreItem[this.moreTapItem],
								}
					}else{
						vInfo = {
								"tapItem": this.tapItem,
								"itemContent": this.items[this.tapItem],
								}
					}
					this.setViolationsInfo(vInfo)
					uni.navigateBack({})
					return;
				}
				/*
				if (this.tapItem == 7 || this.moreTapItem == 1 || this.moreTapItem == 2 || this.moreTapItem == 3) {
					if (this.tapItem == 7) {
						if (this.remark == "") {
							uni.showToast({
								title:"请填写违规描述",
								icon: "none"
							})
							return;
						}
					}
					var vInfo = {};
					if (this.moreTapItem != 20) {
						vInfo = {
								"tapItem": this.tapItem,
								"itemContent": this.items[this.tapItem],
								"moreTapItem": this.moreTapItem,
								"moreItemContent": this.moreItem[this.moreTapItem],
								}
					}else{
						vInfo = {
								"tapItem": this.tapItem,
								"itemContent": this.items[this.tapItem],
								}
					}
					this.setViolationsInfo(vInfo)
					uni.navigateBack({})
					return;
				}
				if (this.tapItem == 20) {
					uni.showToast({
						title:"请选择一级分类",
						icon: "none"
					})
					return;
				}
				if (this.tapItem == 0 && this.moreTapItem == 20) {
					uni.showToast({
						title:"请选择二级分类",
						icon: "none"
					})
					return;
				}
				var typeData = {
					"tapItem": this.tapItem,
					"itemContent": this.items[this.tapItem],
					"moreTapItem": this.moreTapItem,
					"moreItemContent": this.moreItem[this.moreTapItem],
				};

				uni.navigateTo({
					url: "../chooseViolationsAffect/chooseViolationsAffect?typeData=" + JSON.stringify(typeData),
				})
				*/
			}
		}
	}
</script>

<style lang="scss">
	.containt-view{
		background-color: #f6f6f6;
		width: 100%;
		height: 100vh;
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
				width: calc(50vw - 30upx);
				height: 88upx;
				font-size: 30upx;
				line-height: 88upx;
				text-align: center;
				color: black;
			}
			.violat-select-item{
				margin-left: 20upx;
				margin-bottom: 30upx;
				width: calc(50vw - 30upx);
				height: 88upx;
				font-size: 30upx;
				line-height: 88upx;
				text-align: center;
				color: #FFB400;
				border: 3upx solid #FFB400;
			}
		}
		.item-one-view{
			margin-top: 20upx;
			margin: 30upx 20upx;
			height: auto;
			.title{
				margin-left: 10upx;
				font-size: 28upx;
			}
			.more-list-view{
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex-wrap: wrap;
				// background-color: #FFB400;
				.more-list-item{
					margin-top: 20upx;
					margin-bottom: 20upx;
					width: 200upx;
					height: 70upx;
					border-radius: 35upx;
					text-align: center;
					line-height: 70upx;
					background-color: white;
					color: black;
				}
				.more-list-select-item{
					margin-top: 20upx;
					margin-bottom: 20upx;
					width: 200upx;
					height: 70upx;
					border-radius: 35upx;
					text-align: center;
					line-height: 70upx;
					background-color: white;
					color: #FFB400;
					border: 3upx solid #FFB400;
				}
			}
		}
		.remark-view{
			margin-top: 20upx;
			margin-left: 20upx;
			margin-right: 20upx;
			height: 200upx;
			border: 2upx solid gold;
			background-color: white;
			.area-view{
				margin-top: 20upx;
				margin-left: 20upx;
				width: calc(100% - 40upx);
				height: 160upx;
				// background-color: red;
			}
		}
		.submit-btn{
			position: absolute;
			top: calc(100vh - 88upx - 60upx );
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
