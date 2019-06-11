<template>
	<view>
		<view class="head-view" @click="headClick()">
			<view class="head-name">{{headTitle}}</view>
			<image class="head-arrow" src="/static/image/right_arrow.png" mode=""></image>
		</view>
		<view class="data-list-view" v-for="(item, index) in dataList" :key="index">
			<!-- <view class="" > -->
			<!-- </view> -->
			<view class="select-view" v-if="index == 3 || index == 4" @click="cellClick(index)">
				<view class="cell-name" v-if="index == 3">{{item.content}}</view>
				<ruiDataPicker v-else="" class="cell-name" fields="minute" start="2000-00-00 00:00" end="2030-12-30 23:59" :value="item.content"
				 @change="bindChange" @cancel="bindCancel"></ruiDataPicker>
				<image class="cell-arrow" src="/static/image/right_arrow.png" mode=""></image>
			</view>
			<input class="input-view" type="text" v-model="item.content" disabled="" v-else="" />
		</view>
		<view class="photo-view">
			<view class="photo-item" v-for="(item, index) in imageArr" :key="index">
				<image class="image-content" :src="item" mode="scaleToFill" @click="imageClick(index,item)">
				</image>
				<image class="delete-image-view" src="/static/image/delete_image_icon.png" mode="" v-show="item != addImagePath"
				 @click="deleteImage(index)"></image>
			</view>
		</view>
		<view class="remark-view">
			<textarea class="area-view" value="" placeholder="备注" v-model="remark" />
			</view>
		<view class="submit-btn" @click="uploadImage()"> 提交 </view>
	</view>
</template>

<script>
	import ruiDataPicker from "@/components/rattenking-dtpicker/rattenking-dtpicker.vue"
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		components:{
			ruiDataPicker,
		},
		data() {
			return {
				bikeInfo: {},
				headTitle: "用户还车地点吻合",
				remark: "",
				dataList:[
					{"content":"车辆编码："},
					{"content":""},
					{"content":""},
					{"content":"选择违章类型"},
					{"content":""},
					{"content":""},
				],
				imageArr: [
				],
				postImageArr : [
				],
				addImagePath: "/static/image/add_image.png",
			}
		},
		onLoad() {
			this.getcarinfo();
			this.dataList[4].content = this.curentTime();
			this.imageArr.push(this.addImagePath);
		},
		onUnload() {
			this.setViolationsInfo({});
		},
		onShow() {
			console.log(this.violationsInfo);
			if (this.violationsInfo.itemContent == null || this.violationsInfo.itemContent == "") {
				console.log("选择违章类型")
				this.dataList[3].content = "选择违章类型";
			}else{
				var content = "";
				if (this.violationsInfo.tapItem == 0) {
					content = content + this.violationsInfo.itemContent + "/" + this.violationsInfo.moreItemContent;
					if (this.violationsInfo.moreTapItem == 0) {
						content = content //+ "(" + this.violationsInfo.secondContent + ")"
					}
				}else if(this.violationsInfo.tapItem == 7){
					content = this.violationsInfo.itemContent + "(" + this.violationsInfo.remark + ")"
				}else{
					content = this.violationsInfo.itemContent //+ "(" + this.violationsInfo.secondContent + ")"
				}
				this.dataList[3].content = content;
			}
		},
		computed: mapState(['violationsInfo','sn','directinfo']),
		methods: {
			...mapMutations(['setViolationsInfo','setSn']),
			// 获取车辆信息
			getcarinfo() {
				console.log("开始请求");
				// this.setSn("08910127");
				var _this = this;
				var options = {
					url: '/bike/info', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('车辆信息',res)
					if (res.status == 0) {
						_this.bikeInfo = res.info;
						// 剩余电量
						_this.dataList[0].content = "车辆编号：" + res.info.sn;           
						_this.dataList[1].content = "电话号码：" + res.info.last_order_oper_phone;
						_this.dataList[2].content = "用户：" + res.info.last_order_oper_name;
						_this.dataList[5].content = res.info.address;
						
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			headClick(){
				uni.navigateTo({
					url: "../userUseCarMessage/userUseCarMessage?order_id=" + this.bikeInfo.last_order_id,
				})
			},
			cellClick(e){
				if (e == 3) {
					uni.navigateTo({
						url: "../chooseViolationsType/chooseViolationsType",
					})
				}else{
					
				}
			},
			uploadImage(){
				if (this.violationsInfo.itemContent == null || this.violationsInfo.itemContent == "") {
					// console.log("选择违章类型")
					// this.dataList[3].content = "选择违章类型";
					uni.showToast({
						title: "请选择类型",
						icon: "none"
					});
					return;
				}
				// console.log(e);
				uni.showLoading({
					title: "正在上传图片..."
				})
				if (this.postImageArr.length < this.imageArr.length) {
					if (this.imageArr[this.postImageArr.length] != this.addImagePath){
						uni.uploadFile({
							url: this.$resourcesurl()+'/upload',
							filePath: this.imageArr[this.postImageArr.length],
							header: {
								'content-type': 'multipart/form-data',
							},
							name: 'uploadfile',
							formData: {
								'scheme': 1
							},
							success: (res) => {					
								var parsedata=JSON.parse(res.data)
								if(parsedata.status==0){
									console.log('this.directinfo',this.directinfo)
									var imgs = this.directinfo.res_server_url+'/'+parsedata.data.oss_name
									console.log('imgs',imgs)
									this.postImageArr.push(imgs);
									this.uploadImage();
									setTimeout(()=>{
									uni.navigateBack({
										delta: 2
									});	
									},1500)
								}else{
									uni.showToast({
										title: parsedata.msg?parsedata.msg:'文件上传失败',
										mask: false,
										icon:'none',
										duration: 1500
									});
								}
							}
						});
					}else{
						uni.hideLoading();
						this.submitClick();
					}
				}else{
					uni.hideLoading();
					this.submitClick();
				}
			},
			submitClick(){
				var options = {
					url: '/urviolation/submit', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"bike_id": this.bikeInfo.id,
						"violation_type": this.violationsInfo.tapItem+1,
						"violation_remark": this.remark,
						"violation_desc": this.dataList[3].content,
						"imgs": this.postImageArr,
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('提交：',res)
					if (res.status == 0) {
						uni.showToast({
							title: "提交成功",
						})
					}else{
						uni.showToast({
							title: res.message?res.message:'提交失败',
							icon: "none"
						})
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
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
							// let count = 5 - _this.imageArr.length;
							let count = 1;
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
									// _this.uploadImage(e.tempFilePaths[0]);
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
									// console.log(_this.imageArr, tempArr);
								}
							})
						}
					}) 
				}
			},
			deleteImage(e){
				this.imageArr.splice(e,1);
				if (this.imageArr[this.imageArr.length-1] != this.addImagePath) {
					this.imageArr.push(this.addImagePath);
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
		position: relative;
		display: flex;
		align-items: flex-start;
		margin-top: 30upx;
		height: auto;
		width: 100%;
		// background-color: antiquewhite;
		.photo-item{
			position: relative;
			.image-content{
				margin-top: 20upx;
				width: 140upx;
				height: 140upx;
				margin-left: 30upx;
				// background-color: blanchedalmond;
			}
			.delete-image-view{
				// margin-top: -100upx;
				// margin-left: -30upx;
				position: absolute;
				top: 10upx;
				left: 140upx;
				width: 40upx;
				height: 40upx;
				// background-color: cadetblue;
			}
		}
	}
	.remark-view{
		margin-top: 20upx;
		margin-left: 20upx;
		margin-right: 20upx;
		height: 200upx;
		border: 2upx solid gold;
		.area-view{
			margin-top: 20upx;
			margin-left: 20upx;
			// margin-right: 20upx;
			width: calc(100% - 40upx);
			height: 160upx;
			// background-color: red;
		}
	}
	.submit-btn{
		margin: 40upx 20upx 40upx 20upx;
		height: 88upx;
		border-radius: 6upx;
		background-color: gold;
		text-align: center;
		line-height: 88upx;
		font-size: 36upx;
	}
</style>
