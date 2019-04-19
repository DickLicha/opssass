<template>
	<view class='wrap'>
		<view class='view-commons'>

			<view class='flexd-posion'>
				<view class='view-flexs switch-head'>
					<view>时间</view>
					<view class='view-border-letf'>动作</view>
					<view class='view-border-letf'>渠道</view>
					<view class='view-border-letf'>结果</view>
				</view>
			</view>

			<view class='view-flexs view-border-bottom' v-for="(item,i) in switchloockdata">
				<view>{{item.time}}</view>
				<view class='view-border-letf'>{{item.action}}</view>
				<view class='view-border-letf'>{{item.qudao}}</view>
				<view class='view-border-letf'>{{item.status}}</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				switchloockdata: []
			}
		},
		methods: {

		},
		onLoad(){
			let datainfo={}
			for(let i=0;i<30;i++){
				datainfo.time='2019-04-19-15:15:26'
				datainfo.action='关锁'
				datainfo.qudao='系统下发'
				datainfo.status='正常'
				this.switchloockdata.push(datainfo)
			}
			console.log('this.switchloockdata',this.switchloockdata)
		}
	}
</script>

<style lang="scss">
	.wrap {
		padding-top: 1upx;
		// height: 100vh;
		background-color: rgb(245,245,245);

		.view-commons {
			margin:10upx 22upx;
			position: relative;
			background-color: white;
			.switch-head{
				height: 90upx;
				line-height: 90upx;
			}
			.flexd-posion {
				// 				position: fixed;
				// 				top:0;
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
// 					height: 80upx;
// 					line-height: 80upx;

				}
			}
		}
	}
</style>
