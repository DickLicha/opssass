<template>
	<view class='wrap'>
		<view class='view-commons'>

			<view class='flexd-posion'>
				<view class='view-flexs switch-head'>
					<view>车辆编号</view>
					<view class='view-border-letf'>是否有效</view>
					<view class='view-border-letf'>备注</view>
					<!-- <view class='view-border-letf'>结果</view> -->
				</view>
			</view>

			<scroll-view class='listscrow' lower-threshold='20' scroll-y @scrolltolower="loadMore">
				<view class='view-flexs view-border-bottom' v-for="(item,i) in switchloockdata" :key=i @click="detilpop(item,i,'middle-list')">
					<view>{{item.bike_id}}</view>
					<view class='view-border-letf'>{{getgrade(item.grade)}}</view>
					<view class='view-border-letf'>{{remark(item.grade_info)}}</view>
					<!-- <view class='view-border-letf' :class="{'right-view':item.status=='正常','wrong-view':item.status=='异常'}">{{item.status}}</view> -->
				</view>
				<uni-load-more :loadingType="resquestState"></uni-load-more>
			</scroll-view>

		</view>
	</view>
</template>

<script>
	import UniLoadMore from '@/components/load-more.vue'
	import itemCell from '@/components/item-cell/item-cell.vue'
	// import {mapMutations} from 'vuex'
	import {mapState,mapMutations} from 'vuex'
	export default {
		data() {
			return {
				switchloockdata: [],
				resquestState: 0,
				pageindex: 1,
				pagenum: 20,
				allnumber: 100,
				type: '',
				list: [1, 2, 3, 4],
				userid:'',
			}
		},
		components: {
			UniLoadMore,
			itemCell,
		},
		methods: {
			...mapMutations(['setRemovecaritem','setSn']),
			togglePopup(type) {
				this.type = type
			},
			remark(grade){
				var status=''
				if(!!grade && !!grade.remark){
					status=grade.remark
				}else{
					status='无'
				}
				return status
			},
			getgrade(grade){
				var status=''
				if(grade==0 || grade==null){
					status='无效'
				}else{
					status='有效'
				}
				return status
			},
			detilpop(item, i, type) {
				this.setRemovecaritem(item)
				uni.navigateTo({
					url: `/pages/movecarPage/movecardetil/movecardetil`,
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			loadMore() {
				if (this.resquestState < 2) {
					if (this.pageindex < parseInt(parseInt(this.allnumber) / this.pageindex) + 1) {
						// this.getartlist(this.pageindex, 10, 'add')
						this.openbattery(this.pageindex, this.pagenum)
						this.pageindex += 1
					} else {
						// this.resquestState = res.data.list.length == 10 ? 0 : 2
						this.resquestState = 2
						console.log('到底了！！！！')
					}

				}
			},
			// 挪车记录
			openbattery(page, num,starttime,endtime) {
				this.setSn('*')
				var options = {
					url: '/rporder/list', //请求接口
					method: 'POST', //请求方法全部大写，默认GET
					context: '',
					data: {
						"pno": page,
						"psize": num,
						"is_start_from_park": 0,
						"sk": "",
						"start_time": starttime,
						'user_id':this.userid,
						"end_time": endtime
					}
				}
				this.$httpReq(options).then((res) => {
					// 请求成功的回调
					// res为服务端返回数据的根对象
					console.log('当天挪车记录', res)
					this.allnumber = res.total
					if (res.status == 0) {
						this.switchloockdata=res.list
					} else {

					}
				}).catch((err) => {
					// 请求失败的回调
					console.error(err, '捕捉')
				})
			},
		},
		onLoad(e) {
			try {
				var value = uni.getStorageSync('userinfo');
				if (value) {
					this.userid=value.userinfo.id
					var starttime=e.date+' 00:00:00'
					var endtime=e.date+' 23:59:59'
					this.openbattery(this.pageindex, this.pagenum,starttime,endtime)
				}
			} catch (e) {
				// error
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.listscrow {
		// height: calc(100vh - 100upx);
	}

	.right-view {
		color: green
	}

	.wrong-view {
		color: red
	}

	.wrap {
		padding-top: 1upx;
		height: 100vh;
		background-color: rgb(245, 245, 245);

		.view-commons {
			margin: 10upx 22upx;
			position: relative;
			background-color: white;
            // height: 100vh;
			.switch-head {
				height: 90upx;
				line-height: 90upx;
			}

			.center-box {
				width: 500upx;
				height: 350upx;
				text-align: left;
				margin: 40upx;

				.list-item {
					height: 70upx;
					line-height: 70upx;

					.second-text {
						margin-left: 24upx
					}
				}
			}

			.flexd-posion {
				background-color: rgb(225, 225, 225);
			}

			.view-border-bottom {
				border-bottom: 1upx solid rgb(235, 235, 235);
			}

			.view-flexs {
				display: flex;
				// left: 0;
				width: 100%;
				text-align: center;
				align-items: center;

				// justify-content: center;
				.view-border-letf {
					border-left: 1upx solid rgb(235, 235, 235);
				}

				view {
					width: 30%;
				}
			}
		}
	}
</style>
