<template>
	<view class='wrap'>
		<view class='view-common'>
			<item-cell :itemdata="carcenterdata1" :type='2' :border='true' @itemclick='callphone'></item-cell>
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	import {mapMutations} from 'vuex'
	export default {
		components: {
			itemCell
		},
		onLoad(){
			this.setSn('*')
			this.repairlist()
		},
		data() {
			return {
				carcenterdata1: [{
						name: '报修:',
						val: ''
					},
					{
						name: '时间:',
						val: ''
					},
					{
						name: '故障现象:',
						val: '',
						click: false
					},
					{
						name: '提交:',
						val: ''
					}
				]
			}
		},
		methods: {
			...mapMutations(['setSn']),
			gocarcenter(e) {
			},
			// 维修记录
			repairlist() {
				var options = {
					url: '/brorder/list', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"psize": 1,
						"pno": 1,
						"is_order_finished": 1,
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('维修记录', res.list[0])
					if (res.status==0) {
						this.carcenterdata1[0].val=res.list[0].creator_name
						this.carcenterdata1[1].val=res.list[0].create_time
						this.carcenterdata1[2].val=res.list[0].report_fault_descs[0]+' , '+res.list[0].report_fault_descs[1]
						this.carcenterdata1[3].val=res.list[0].repairer_name
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
			callphone(item) {
				if (item.name == '手机号码:') {
					uni.showModal({
						title: '',
						content: item.val,
						// showCancel: false,
						cancelText: '取消',
						confirmText: '拨打',
						success: res => {
							if (res.confirm) {
								uni.makePhoneCall({
									phoneNumber: item.val
								})
							}
						},
						fail: () => {},
						complete: () => {}
					});
				}
			}
		}
	}
</script>

<style lang='scss' scoped>
	.wrap {
		background-color: rgb(245, 245, 245);
		height: calc(100vh - 11upx);
		padding-top: 1upx;
		overflow: hidden;
		/* padding-bottom: 1upx; */
		.view-common {
			margin: 10upx 22upx 0 22upx;
		}
	}
</style>
