<template>
	<view>
		<uni-fab ref="fab" :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical" :direction="direction" @trigger="trigger" />
	</view>
</template>

<script>
	import uniFab from '@/components/uni-fab/uni-fab.vue'
	export default {
		components: {
			uniFab
		},
		data() {
			return {
				title: 'uni-fab',
				directionStr: '垂直',
				horizontal: 'right',
				vertical: 'top',
				direction: 'vertical',
				pattern: {
					color: '#7A7E83',
					backgroundColor: '#fff',
					selectedColor: '#007AFF',
					buttonColor: '#007AFF'
				},
				content: [{
						// iconPath: '/static/component.png',
						// selectedIconPath: '/static/componentHL.png',
						text: '关锁',
						active: false
					},
					{
						// iconPath: '/static/api.png',
						// selectedIconPath: '/static/apiHL.png',
						text: '寻车铃',
						active: false
					},
					{
						// iconPath: '/static/template.png',
						// selectedIconPath: '/static/templateHL.png',
						text: '找不到车',
						active: false
					},
					{
						// iconPath: '/static/template.png',
						// selectedIconPath: '/static/templateHL.png',
						text: '报修',
						active: false
					},
					{
						// iconPath: '/static/template.png',
						// selectedIconPath: '/static/templateHL.png',
						text: '违章举报',
						active: false
					},
					{
						// iconPath: '/static/template.png',
						// selectedIconPath: '/static/templateHL.png',
						text: '开电池锁',
						active: false
					},
				]
			}
		},
		onBackPress() {
			if (this.$refs.fab.isShow) {
				this.$refs.fab.close()
				return true
			}
			return false
		},
		methods: {
			trigger(e) {
				console.log(e)
				this.content[e.index].active = !e.item.active
				uni.showModal({
					title: '提示',
					content: `您${this.content[e.index].active ? '选中了' : '取消了'}${e.item.text}`,
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定')
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			switchBtn(hor, ver) {
				if (hor === 0) {
					this.direction = this.direction === 'horizontal' ? 'vertical' : 'horizontal'
					this.directionStr = this.direction === 'horizontal' ? '垂直' : '水平'
				} else {
					this.horizontal = hor
					this.vertical = ver
				}
				this.$forceUpdate()
			}
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #fff
	}

	view {
		font-size: 28upx;
		line-height: inherit
	}


</style>