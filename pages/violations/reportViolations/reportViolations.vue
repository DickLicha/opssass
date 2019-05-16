<template>
	<view>
		<view class="head-view">
			<view class="head-name">{{headTitle}}</view>
			<image class="head-arrow" src="/static/image/right_arrow.png" mode=""></image>
		</view>
		<view class="data-list-view" v-for="(item, index) in dataList" :key="index">
			<!-- <view class="" > -->
			<!-- </view> -->
			<view class="select-view" v-if="index == 3 || index == 4" @click="cellClick(index)">
				<view class="cell-name" v-if="index == 3">{{item.content}}</view>
				<ruiDataPicker
					v-else=""
					class="cell-name"
					fields="minute"
					start="2000-00-00 00:00"
					end="2030-12-30 23:59"
					:value="item.content"
					@change="bindChange"
					@cancel="bindCancel"
				></ruiDataPicker>
				<image class="cell-arrow" src="/static/image/right_arrow.png" mode=""></image>
			</view>
			<input class="input-view" type="text" v-model="item.content"  v-else=""/>
		</view>
		<view class="photo-view">
			<image 
			class="image-content" 
			:src="item" 
			mode="scaleToFill" 
			v-for="(item, index) in imageArr" 
			:key="index" 
			@click="imageClick(index,item)"
			>
				<image class="delete-image-view" src="/static/image/delete_image_icon.png" mode="" v-show="true"></image>
			</image>
			
		</view>
	</view>
</template>

<script>
	import ruiDataPicker from "@/components/rattenking-dtpicker/rattenking-dtpicker.vue"
	export default {
		components:{
			ruiDataPicker,
		},
		data() {
			return {
				headTitle: "用户还车地点吻合",
				dataList:[
					{"content":"车辆编码：801313560"},
					{"content":"13655999000"},
					{"content":"小明"},
					{"content":"选择违章类型"},
					{"content":"2019-05-16 09:12"},
					{"content":"江西省景德镇市乐平市名电路1号"},
				],
				imageArr: [
					
				],
				addImagePath: "/static/image/add_image.png",
			}
		},
		onLoad() {
			this.dataList[4].content = this.curentTime();
			this.imageArr.push(this.addImagePath);
		},
		methods: {
			cellClick(e){
				if (e == 3) {
					
				}else{
					
				}
			},
			bindChange(e){
				this.dataList[4].content = e
				console.log(e);
			},
			bindCancel(e){
				console.log(e);
			},
			imageClick(e, item){
				var _this = this;
				if (e == this.imageArr.length-1 && item == this.addImagePath) {
					uni.showActionSheet({
						itemList: ["拍照","从手机相册选择"],
						success(e) {
							var sourceType = []
							let count = 5 - _this.imageArr.length;
							console.log(e)
							if (e.tapIndex == 0) {
								sourceType = ["camera"]
							}else{
								sourceType = ["album"]
							}
							console.log(sourceType);
							uni.chooseImage({
								count: count,
								sizeType: ['original', 'compressed'],
								sourceType: sourceType,
								success(e) {
									console.log(JSON.stringify(e.tempFilePaths));
									var tempArr = []
									for (var i = 0; i < _this.imageArr.length-1; i++) {
										tempArr.push(_this.imageArr[i]);
									}
									for (var i = 0; i < e.tempFilePaths.length; i++) {
										tempArr.push(e.tempFilePaths[i]);
									}
									if (tempArr.length != 4) {
										tempArr.push(_this.addImagePath);
									}
									_this.imageArr = tempArr;
									console.log(_this.imageArr, tempArr);
								}
							})
						}
					}) 
				}
			},
		    curentTime(){ 
				var now = new Date();
			   
				var year = now.getFullYear();       //年
				var month = now.getMonth() + 1;     //月
				var day = now.getDate();            //日
			   
				var hh = now.getHours();            //时
				var mm = now.getMinutes();          //分
			   
				var clock = year + "-";
			   
				if(month < 10)
					clock += "0";
			   
				clock += month + "-";
			   
				if(day < 10)
					clock += "0";
				   
				clock += day + " ";
			   
				if(hh < 10)
					clock += "0";
				   
				clock += hh + ":";
				if (mm < 10) clock += '0'; 
				clock += mm; 
				return(clock); 
			} 
		}
	}
</script>

<style lang="scss">
	.head-view{
		background-color: orange;
		width: 100%;
		height: 88upx;
		line-height: 88upx;
		display: flex;
		align-items: center;
		justify-items: center;
		.head-name{
			margin-left: 20upx;
			width: calc(100vw - 30upx - 60upx);
		}
		.head-arrow{
			margin-right: 20upx;
			width: 40upx;
			height: 40upx;
		}
	}
	.data-list-view{
		width: 100%;
		height: 88upx;
		.input-view{
			margin: 20upx 20upx 0upx 20upx;
			height: 88upx;
			line-height: 88upx;
			padding-left: 20upx;
			border-color: gold;
			border-width: 2upx;
			border-style: solid;
		}
		.select-view{
			margin: 20upx 20upx 0upx 20upx;
			height: 88upx;
			line-height: 88upx;
			background-color: white;
			display: flex;
			align-items: center;
			justify-items: center;
			border-color: gold;
			border-width: 2upx;
			border-style: solid;
			.cell-name{
				margin-left: 20upx;
				width: calc(100vw - 30upx - 60upx);
			}
			.cell-arrow{
				margin-right: 20upx;
				width: 40upx;
				height: 40upx;
			}
		}
	}
	.photo-view{
		display: flex;
		margin-top: 30upx;
		height: auto;
		width: 100%;
		.image-content{
			margin-top: 20upx;
			width: 140upx;
			height: 140upx;
			margin-left: 30upx;
			.delete-image-view{
				z-index: 10;
				margin-left: 150upx;
				width: 50upx;
				height: 50upx;
			}
		}
	}
</style>
