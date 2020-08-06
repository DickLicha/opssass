<script>
	export default {
		data() {
			return {
				gobeldata: " "
			};
		},
		onLaunch: function() {
			console.log('App Launch');		
			var baseurl = '',
				realuser = ''		    
			try {
				baseurl = uni.getStorageSync('baseurl');
				realuser = uni.getStorageSync('realuser');
			} catch (e) {
				// error
			}
			console.log('baseurl', realuser)
			if (baseurl == '') {
				try {
					uni.setStorageSync('baseurl', 'https://api.lexiangys.top');
				} catch (e) {
					// error
				}
			}
			if (realuser == '') {
				try {
					uni.setStorageSync('realuser', true);
				} catch (e) {
					// error
				}
			}
			if (wx.canIUse('getUpdateManager')) {
				const updateManager = wx.getUpdateManager()
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					if (res.hasUpdate) {
						console.log('res.hasUpdate====')
						updateManager.onUpdateReady(function() {
							wx.showModal({
								title: '更新提示',
								content: '新版本已经准备好，是否重启应用？',
								success: function(res) {
									console.log('success====', res)
									// res: {errMsg: "showModal: ok", cancel: false, confirm: true}
									if (res.confirm) {
										// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										updateManager.applyUpdate()
									}
								}
							})
						})
						updateManager.onUpdateFailed(function() {
							// 新的版本下载失败
							wx.showModal({
								title: '已经有新版本了哟~',
								content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
							})
						})
					}
				})
			}

			// #ifdef APP-PLUS
			// 锁定屏幕方向
			plus.screen.lockOrientation('portrait-primary'); //锁定
			// 检测升级
			uni.request({
				url: 'https://uniapp.dcloud.io/update', //检查更新的服务器地址
				data: {
					appid: plus.runtime.appid,
					version: plus.runtime.version,
					imei: plus.device.imei
				},
				success: (res) => {
					console.log('success', res);
					if (res.statusCode == 200 && res.data.isUpdate) {
						let openUrl = plus.os.name === 'iOS' ? res.data.iOS : res.data.Android;
						// 提醒用户更新
						uni.showModal({
							title: '更新提示',
							content: res.data.note ? res.data.note : '是否选择更新',
							success: (showResult) => {
								if (showResult.confirm) {
									plus.runtime.openURL(openUrl);
								}
							}
						})
					}
				}
			})
			// #endif

		},
		onShow: function() {
			console.log('App Show')
		},
		methods:{
			getutctimestring() {
				var date = new Date()
				var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
					date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
				var strs = new Date(now_utc)
				console.log('timess',strs.valueOf().toString(16))
				return strs.valueOf().toString(16)
			}
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import './common/uni.css';
	/*每个页面公共css */	
</style>
