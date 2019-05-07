<template>
	<view class='wrap'>
		<view class='common-base-view'>
			<view class='weixiu-button'>
				<button class='' type='primary' @click="putstorage">维修入库</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {

			};
		},
		computed:mapState(['orderfirstid']),
		methods:{
			putstorage(){
					var options = {
					url: '/brorder/recall', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data:{
						"order_id": this.orderfirstid
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('入库状态',res)
					if(res.status==0){
						uni.showToast({
							title: '入库成功！',
							mask: false,
							duration: 2500
						});
					}else{
						uni.showToast({
							title: res.message?res.message:'入库失败！',
							mask: false,
							duration: 2500
						});
					}					
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
		},
	}
</script>

<style lang="scss">
	.wrap {
		position: relative;
		height: calc(200vh);
		background-color: rgb(245, 245, 245);
		padding-top: 1upx;

		.common-base-view {
			display: flex;
			justify-content: space-between;
			padding-top: 15upx;
			flex-wrap: wrap;
			margin: 0 20upx;
			text-align: center;
			.weixiu-button{
				margin: 120upx;
				width: 100%;
			}
		}
	}
</style>
