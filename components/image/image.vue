<template>
	<view>
		<page-head :title="title"></page-head>
		<view class="uni-common-mt">
			<form>
				<!-- <view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-left">
							<view class="uni-label">图片来源</view>
						</view>
						<view class="uni-list-cell-right">
							<picker :range="sourceType" @change="sourceTypeChange" :value="sourceTypeIndex" mode="selector">
								<view class="uni-input">{{sourceType[sourceTypeIndex]}}</view>
							</picker>
						</view>
					</view>

					<view class="uni-list-cell">
						<view class="uni-list-cell-left">
							<view class="uni-label">图片质量</view>
						</view>
						<view class="uni-list-cell-right">
							<picker :range="sizeType" @change="sizeTypeChange" :value="sizeTypeIndex" mode="selector">
								<view class="uni-input">{{sizeType[sizeTypeIndex]}}</view>
							</picker>
						</view>
					</view>

					<view class="uni-list-cell">
						<view class="uni-list-cell-left">
							<view class="uni-label">数量限制</view>
						</view>
						<view class="uni-list-cell-right">
							<picker :range="count" @change="countChange" mode="selector">
								<view class="uni-input">{{count[countIndex]}}</view>
							</picker>
						</view>
					</view>
				</view> -->


				<view class="uni-list list-pd">
					<view class="uni-list-cell cell-pd">
						<view class="uni-uploader">
							<view class="uni-uploader-head">
								<view class="uni-uploader-title">点击可预览选好的图片</view>
								<view class="uni-uploader-info">{{imageList.length}}/9</view>
							</view>
							<view class="uni-uploader-body">
								<view class="uni-uploader__files">
									<block v-for="(image,index) in imageList" :key="index">
										<view class="uni-uploader__file">
											<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
										</view>
									</block>
									<view class="uni-uploader__input-box">
										<view class="uni-uploader__input" @tap="chooseImage"></view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</form>
		</view>
	</view>
</template>
<script>
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	export default {
		data() {
			return {
				base64Img: '',
				title: 'choose/previewImage',
				imageList: [],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
			}
		},
		onUnload() {
			this.imageList = [],
				this.sourceTypeIndex = 2,
				this.sourceType = ['拍照', '相册', '拍照或相册'],
				this.sizeTypeIndex = 2,
				this.sizeType = ['压缩', '原图', '压缩或原图'],
				this.countIndex = 8;
		},
		methods: {
			sourceTypeChange: function(e) {
				this.sourceTypeIndex = e.target.value
			},
			sizeTypeChange: function(e) {
				this.sizeTypeIndex = e.target.value
			},
			countChange: function(e) {
				this.countIndex = e.target.value;
			},
			// 图片路径转base64
			convertImgToBase64(url, callback, outputFormat) {
				var canvas = document.createElement('CANVAS'),
					ctx = canvas.getContext('2d'),
					img = new Image;
				img.crossOrigin = 'Anonymous';
				img.onload = function() {
					canvas.height = img.height;
					canvas.width = img.width;
					ctx.drawImage(img, 0, 0);
					var dataURL = canvas.toDataURL(outputFormat || 'image/png');
					callback.call(this, dataURL);
					canvas = null;
				};
				img.src = url;
			},
			chooseImage: async function() {
				if (this.imageList.length === 9) {
					let isContinue = await this.isFullImg();
					console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
					success: (res) => {
						this.imageList = this.imageList.concat(res.tempFilePaths);
						// console.log('img',this.imageList)
						//  this.convertImgToBase64(res.tempFilePaths, (base64img) => {
						// 	 this.base64Img=base64img
						// })
						// console.log('base64',this.base64Img)
						console.log('path', res.tempFilePaths)
						uni.uploadFile({
							url: this.$resourcesurl+'/upload', //仅为示例，非真实的接口地址
							filePath: res.tempFilePaths[0],
							// method: 'POST',
							header: {
								'content-type': 'multipart/form-data',
								'Content-Type': 'multipart/form-data',
							},
							name: 'uploadfile',
							formData: {
								'scheme': 2
							},
							success: (res) => {
								console.log('文件上传结果', res);
							}
						});
					}
				})
			},
			isFullImg: function() {
				return new Promise((res) => {
					uni.showModal({
						content: "已经有9张图片了,是否清空现有图片？",
						success: (e) => {
							if (e.confirm) {
								this.imageList = [];
								res(true);
							} else {
								res(false)
							}
						},
						fail: () => {
							res(false)
						}
					})
				})
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			}
		}
	}
</script>

<style>
	.cell-pd {
		padding: 22upx 30upx;
	}

	.list-pd {
		margin-top: 50upx;
	}
</style>
