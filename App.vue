<script>
	import {
		timefn
	} from './common/conf.js'
	// import ble from '../../common/xa-bluetooth.js'
	var dataTransition = require('./common/dataTransition.js')
	export default {
		data() {
			return {
				gobeldata: " "
			};
		},
		onLaunch: function() {
			console.log('App Launch',timefn(0));
			
			var bluealldevice=[]
			function onBluetoothDeviceFounds() {
				return new Promise((resolve, reject) => {
					wx.onBluetoothDeviceFound((res) => {
						try {		
							let machineNO = dataTransition.encrypt(dataTransition.ab2hex(res.devices[0].advertisData).slice(4, 13));
							// console.log("success1:", res.devices[0],machineNO);
							// console.log("success1:", res);
							res.machineNO=machineNO
							// res.localName=res
							bluealldevice.push(res)						
						} catch (e) {
							//TODO handle the exception
							console.log('error', e)
							reject({
								fail: '异常失败' + e
							})
						}
					})
				})
			}
			
			wx.closeBluetoothAdapter({
				success(res) {
					console.log('关闭蓝牙成功', res)
					uni.getSystemInfo({
						success: function(res) {
							// systemtype = res.platform
							// bluebikeinfo = bikeinfo
							// var _this=e
							wx.openBluetoothAdapter({
								success: (res) => {
									console.log(" ======== 初始化蓝牙 (成功) =======", res);
									// store.commit("setBluestate", true);
									//  开始搜索设备
									wx.startBluetoothDevicesDiscovery({
										success: (res) => {
											console.log(" 开始搜索设备", res);
											// return onBluetoothDeviceFound;
											// console.log('onBluetoothDeviceFound',onBluetoothDeviceFound())
											onBluetoothDeviceFounds().then((val) => {
												console.log("查询返回结果", val);
												isok(val)
											}).catch((err) => {
												console.log('蓝牙reject', err)
											})
											setTimeout(()=>{
												wx.stopBluetoothDevicesDiscovery({
													success: (res) => {
														console.log("关闭成功");
													}
												})
												uni.setStorage({
													key: 'bluealldevice',
													data: bluealldevice,
													success: res => {
														console.log('successputdata',res)
													},
													fail: res => {
												        console.log('errputdata',res)
													}
												})	
											},8000)
											
										},
										fail: (res) => {
											console.log("搜索设备失败", res);
											// uni.hideLoading()
											uni.showToast({
												title: '搜索蓝牙失败',
												icon: 'none',
												duration: 3000
											});
										}
									})
									// return startBluetoothDevicesDiscovery;
								},
								fail: (res) => {
									// uni.hideLoading()
									console.log(" ======== 初始化蓝牙（失败） =======", res);
									uni.showToast({
										title: '初始化蓝牙失败请手动打开蓝牙',
										icon: 'none',
										duration: 3000
									});
								}
							})
						},
					})
				},
				fail: (res) => {
					console.log('关闭蓝牙失败', res)
				}
			})
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
					// uni.setStorageSync('baseurl', 'https://api.gray.lexiangys.top');		
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
