<template>
	<view class='wrap'>
		<view class='view-common'>
			<view class="uni-list margin-tops">
				<radio-group @change="radioChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
						<view>
							<radio :value="item.value" :checked="index === current" />
						</view>
						<view>{{item.name}}</view>
					</label>
				</radio-group>
			</view>
			<view>
				<button class='share-button-default bottom-btn' type="primary" @click='goback'>完成</button>
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
		data() {
			return {
				items: [],
				current: 0,
				values:'',
			}
		},
		onLoad(){
			var items={}
			for(let i=0;i<this.warehoselist.length;i++){
				items={
					name:this.warehoselist[i].name,
					value:this.warehoselist[i].id,
				}
				this.items.push(items)
			}
		},		
		computed:mapState(['warehoselist','putstorageindex']),
		methods: {
			...mapMutations(['setPutstorageindex']),
			radioChange: function(evt) {
				this.values=event.detail
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
				this.setPutstorageindex(this.current)
			},
			goback(){
				uni.navigateBack({
					delta: 1
				});
			},
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

		.view-common {
			margin: 10upx 22upx;
			height: 98vh;
			position: relative;
			.margin-tops{
				margin-top: 30upx;
			}
			.bottom-btn{
				/* margin-top: 60upx; */
				position: fixed;
				width: calc(100% - 44upx);
				bottom: 80upx;
			}
		}

	}
</style>
