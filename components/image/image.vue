<template>
	<view>
		<page-head :title="title"></page-head>
		<view class="uni-common-mt">
			<form>
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
	import {mapState,mapMutations} from 'vuex'
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
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				imgArr:[]
			}
		},
		onUnload() {
			this.setImgarr([])
			this.imageList = [],
				this.sourceTypeIndex = 2,
				this.sourceType = ['拍照', '相册', '拍照或相册'],
				this.sizeTypeIndex = 2,
				this.sizeType = ['压缩', '原图', '压缩或原图'],
				this.countIndex = 8;
		},
		computed:mapState(['directinfo']),
		methods: {
			...mapMutations(['setImgarr']),
			sourceTypeChange: function(e) {
				this.sourceTypeIndex = e.target.value
			},
			sizeTypeChange: function(e) {
				this.sizeTypeIndex = e.target.value
			},
			countChange: function(e) {
				this.countIndex = e.target.value;
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
					// sizeType: sizeType[this.sizeTypeIndex],
					sizeType: ['compressed'],
					count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
					success: (res) => {
						this.imageList = this.imageList.concat(res.tempFilePaths);
						console.log('path', res.tempFilePaths)
						uni.uploadFile({
							url: this.$resourcesurl()+'/upload',
							filePath: res.tempFilePaths[0],
							// method: 'POST',
							header: {
								'content-type': 'multipart/form-data',
								// 'Content-Type': 'multipart/form-data',
							},
							name: 'uploadfile',
							formData: {
								'scheme': 1
							},
							success: (res) => {					
								var parsedata=JSON.parse(res.data)
								console.log('数据类型', typeof(parsedata),parsedata);
								console.log('数据类型1', parsedata.data);
								try{
									if(parsedata.status==0){
										console.log('this.directinfo',this.directinfo)
										var imgs=this.directinfo.res_server_url+'/'+parsedata.data.oss_name
										console.log('imgs',imgs)
										this.imgArr.push(imgs)
										this.setImgarr(this.imgArr)
									}else{
										uni.showToast({
											title: parsedata.msg?parsedata.msg:'文件上传失败',
											mask: false,
											icon:'none',
											duration: 1500
										});
									}
									
								}catch(e){
									//TODO handle the exception
									console.log(666,e)
								}
								
								
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
