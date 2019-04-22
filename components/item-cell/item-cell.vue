<template>
	<view class='wrap'>
		<view class='mine-common'>
			<view class='mine-body' :class="{'mine-body-border':border}">
				<view class="uni-flex uni-column">
					<view class="flex-item-mine " v-for="(item,i) in itemdata" :class="{'mine-border-top':i!=0}">
						<view class='flex-item-left' @click="itemclick(item)">
							<i v-if='type==3 || type==4' class="iconfont flewfour" :class='item.img'></i>
							<text class='flextwo'>{{item.name}}</text>
							<text class='flextree' :class="{'click-text':item.click==true}">{{item.val}}</text>
						</view>
						<view>
							<i v-if='type==1 || type==4' class="iconfont iconjiantou flewfour"></i>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		props: {
			type: {
				default: 1,
			},
			itemdata: {
				default: [],
			},
			border: {
				default: false,
			}
		},
		methods: {
			itemclick(item) {
				this.$emit('itemclick',item)
			}
		},
		onLoad() {
			console.log('border', this.border)
		}
	}
</script>

<style lang='scss' scoped>
	$true:false;

	.wrap {
		/* position: relative; */
		/* height: calc(130vh); */
		/* background-color: rgb(245, 245, 245); */
		padding-top: 1upx;
		.mine-common {
			.mine-title {
				display: flex;
				align-items: center;
				.mine-phone {
					width: 80%;
					/* margin-left: 40upx; */
				}

				.mine-img-view {
					width: 100upx;
					height: 100upx;
					/* border-radius: 50%; */
					background-color: yellow;
				}
			}
             .mine-body-border {
             	border-radius: 20upx;
             }
			.mine-body {
				// height: 420upx;
				background-color: white;
				/* @if $true{
					border-radius: 20upx;
				} */
				margin-top: 20upx;
				.flex-item-mine {
					display: flex;
					height: 80upx;
					margin: 0 40upx;
					line-height: 80upx;
					align-items: center;

					.flex-item-left {
						width: 97%;
					}

					.flextwo {}
                    .click-text{
                    	color:#F6C700
                    }
					.flextree {
						margin-left: 20upx;						
					}

					.flexfour {
						text-align: right;
					}
				}
				.mine-border-top {
					border-top: 1upx solid rgb(245, 245, 245);
				}
			}
		}
	}
</style>
