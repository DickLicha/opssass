<template>
	<view class='wrap'>
		<view class='view-common'>
			<view>
				<item-cell :itemdata="swapdata" type='4' :border='true' @itemclick='gocarcenter'></item-cell>
			</view>
			<view class='result-fault'>
				<view class='result-fault-view' v-for="(item,i) in faultdata" :key="i" @click='chosefault(i,item)' :class="{'borderrights':item.select}">
					<text>{{item.name}}</text>
				</view>
			</view>
			<view>
				<button class='share-button-default submit-btn' @click='submitorder'>提交报修</button>
			</view>
		</view>
	</view>
</template>

<script>
	import itemCell from '@/components/item-cell/item-cell.vue'
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			itemCell
		},
		data() {
			return {
				isOpened: false,
				swapdata: [{
					name: '车辆编号',
					val: ''
				}],
				faultdata: [{
						name: '车灯坏',
						val: 1,
						select: false
					},
					{
						name: '线路断',
						val: 2,
						select: false
					},
					{
						name: '刹车坏',
						val: 3,
						select: false
					},
					{
						name: '脚蹬坏',
						val: 4,
						select: false
					},
					{
						name: '车座坏',
						val: 5,
						select: false
					},
					{
						name: '盖板卡死',
						val: 6,
						select: false
					},
					{
						name: '车撑坏',
						val: 7,
						select: false
					},
					{
						name: '拧把不走',
						val: 8,
						select: false
					},
					{
						name: '无法开锁',
						val: 9,
						select: false
					},
					{
						name: '二维码坏',
						val: 10,
						select: false
					},
					{
						name: '闸锁故障',
						val: 11,
						select: false
					},
					{
						name: '喇叭不响',
						val: 12,
						select: false
					},
					{
						name: '广告牌裂',
						val: 13,
						select: false
					},
					{
						name: '其他',
						val: 99,
						select: false
					},
				],
				selectval: [],
				selectdesc: [],
			}
		},
		computed: mapState(['faultinfo', 'directinfo', 'bikeinfo']),
		onLoad() {
			console.log('faultinfo', this.faultinfo)
			this.swapdata[0].val = this.bikeinfo.id
		},
		methods: {
			...mapMutations(['setFaultinfo']),
			gocarcenter(){
				uni.navigateTo({
					url: '/pages/carBigCenter/carcenter/carcenter',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			chosefault(i, item) {
				var temp = item.select
				item.select = !temp
				Array.prototype.indexOf = function(val) {
					for (var i = 0; i < this.length; i++) {
						if (this[i] == val) return i;
					}
					return -1;
				};
				Array.prototype.remove = function(val) {
					var index = this.indexOf(val);
					if (index > -1) {
						this.splice(index, 1);
					}
				};
				if (item.select) {
					this.selectval.push(item.val)
					this.selectdesc.push(item.name)
				} else {
					this.selectval.remove(item.val)
					this.selectdesc.remove(item.name)
				}
			},
			submitorder() {
				var options = {
					url: '/brorder/add', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"bike_id":this.bikeinfo.id,
						"fault_types": this.selectval,
						"fault_descs": this.selectdesc
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('报修状态', res)
					if (res.status == 0) {
						uni.showToast({
							title: '报修提交成功',
							mask: false,
							duration: 1500
						});
					} else {
						uni.showToast({
							title: res.message ? res.message : '报修提交失败',
							mask: false,
							duration: 1500
						});
					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			}
		}
	}
</script>

<style lang='scss'>
	.wrap {
		background-color: rgb(245, 245, 245);
		padding-top: 1upx;
		padding-bottom: 1upx;
		/* height: 100vh; */
		overflow: hidden;

		.borderrights {
			color: #F6C700;
			border: 1upx solid #F6C700;
		}

		/* margin-bottom: 20upx; */
		.view-common {
			margin: 30upx 22upx;
			height: 98vh;
			position: relative;

			.submit-btn {
				position: fixed;
				bottom: 20upx;
				width: calc(100% - 44upx)
			}

			.result-fault {
				margin-top: 20upx;
				display: flex;
				flex-wrap: wrap;

				.result-fault-view {
					width: 40%;
					margin-left: 40upx;
					text-align: center;
					margin-top: 20upx;
					background-color: white;
					height: 80upx;
					line-height: 80upx;
				}
			}

		}
	}
</style>
