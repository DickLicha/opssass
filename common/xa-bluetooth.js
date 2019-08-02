var systemtype = '',
	name = '',
	code = ''

function ab2hex(buffer) {
	const hexArr = Array.prototype.map.call(
		new Uint8Array(buffer),
		function(bit) {
			return ('00' + bit.toString(16)).slice(-2)
		}
	)
	return hexArr.join('')
}

var onBluetoothDeviceFound = new Promise((resolve, reject) => {
	// 搜索到设备回调 
	uni.onBluetoothDeviceFound(function(res) {
		console.log("成功1:", res.devices[0]);
		// if (res.devices[0].name == "08910134" && res.devices[0].localName == "08910134") {
		if (res.devices[0].localName == name) {
			uni.hideLoading()
			console.log("成功:", res);
			var deviceId = "";
			var serviceId = "";
			deviceId = res.devices[0].deviceId;
			//  连接指定设备
			uni.createBLEConnection({
				deviceId: res.devices[0].deviceId,
				success: (res) => {
					console.log("连接设备成功", res);
					uni.showToast({
						title: '连接蓝牙成功',
						duration:3000,
					});
					//  获取蓝牙设备所有服务 ，获取设备服务 uuid
					uni.getBLEDeviceServices({
						deviceId: deviceId,
						success: (res) => {
							// console.log("蓝牙设备服务",res);
							serviceId = res.services[0].uuid;
							// 获取蓝牙设备某个服务中所有特征值
							uni.getBLEDeviceCharacteristics({
								deviceId: deviceId,
								serviceId: serviceId,
								success: (res) => {
									// console.log("蓝牙设备所有特征值",res);
									var charaArr = res.characteristics;
									var notifyId = "";
									var characterId = "";
									for (var i = 0; i < charaArr.length; i++) {
										if (charaArr[i].properties.notify && false === charaArr[i].properties.read && false === charaArr[
												i].properties.write) {
											// _this.notyCharacteristicId = charaArr[i].uuid;
											notifyId = charaArr[i].uuid;
										}
										if (false === charaArr[i].properties.notify && false === charaArr[i].properties.read && charaArr[
												i].properties.write) {
											// _this.characteristicId = charaArr[i].uuid;
											characterId = charaArr[i].uuid;
										}
									}
									uni.notifyBLECharacteristicValueChange({
										deviceId: deviceId,
										serviceId: serviceId,
										characteristicId: notifyId,
										state: true,
										success: (res) => {
											console.log("特征值变化监听启动成功：",res);
											// _this.writeDataToBluetooth();
										},
										fail: (res) => {
											console.log("特征值变化监听启动失败：", res);
										}
									})
									resolve({
											deviceId: deviceId,
											serviceId: serviceId,
											characterId: characterId,
										}),
										reject({
											fail: 'fali'
										})
								}
							})
						}
					})
					//  关闭蓝牙搜索
					uni.stopBluetoothDevicesDiscovery({
						success: (res) => {
							console.log("关闭成功");
						}
					})
				},
				fail: (res) => {
					console.log("连接设备失败", res);
					uni.showToast({
						title: '连接蓝牙失败',
						duration:3000,
					});
				}
			})
		}
	})
})


/*** 监听蓝牙变化 ***/

//  监听蓝牙是否打开，以及是否在搜索附近设备
const onBluetoothAdapterStateChange = (callback) => {
	uni.onBluetoothAdapterStateChange(function(res) {
		// console.log('adapterState changed, now is', res)
		callback(res);
	})
}
//  手机与蓝牙连接状态变化监听
const onBLEConnectionStateChange = (callback) => {
	uni.onBLEConnectionStateChange(function(res) {
		// console.log('onBLEConnectionStateChange：', JSON.stringify(res));
		callback(res);
	})
}
//  特征值发生变化
const onBLECharacteristicValueChange = (callback) => {
	uni.onBLECharacteristicValueChange(function(res) {
		// console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
		// console.log("特征值变化事件", ab2hex(res.value));
		callback(ab2hex(res.value));
	})
}
/*
	27 
	05
	0A0A0505
	01
	4B
*/
// 获取IMSI
// const doCmdIMSI=()=> {
//   this.doCmd("33", "")
// }
//  写入数据
//  开锁相关操作
const openLock = (tocken, deviceId, serviceId, characteristicId, success) => {
	console.log('str', tocken)
	uni.writeBLECharacteristicValue({
		deviceId: deviceId,
		serviceId: serviceId,
		characteristicId: characteristicId,
		value: tocken,
		success: (res) => {
			console.log('writeBLECharacteristicValue success', res.errMsg)
			success(res);
		},
		fail: (res) => {
			console.log('writeBLECharacteristicValue fail', res)
		},
	})
}
/*
	27 //大类型
	05  
	0A0A0505  //tocken
	00  //小类型 开关量
	4A
*/

//  停止搜索周边蓝牙设备
function stopSearchBluetooth() {
	uni.stopBluetoothDevicesDiscovery({
		success: (res) => {
			console.log("停止成功");
		}
	})
}

var startBluetoothDevicesDiscovery = new Promise((resolve, reject) => {

})

// 连接蓝牙
const connectBluetooth = (names, isok) => {
	name = names
	uni.startBluetoothDevicesDiscovery({
		success: (res) => {
			console.log("搜索到的设备", res);
			// return onBluetoothDeviceFound;
			onBluetoothDeviceFound.then((val) => {
				console.log("返回结果", val);
				isok(val)
			})
		},
		fail: (res) => {
			console.log("搜索设备失败", res);
		}
	})
}

///  初始化蓝牙 
const initBluetooth = (e,names, isok, error) => {
	uni.showLoading({
		title: '连接蓝牙中',
		mask: false
	});
	uni.getSystemInfo({
		success: function(res) {
			console.log(res.platform);
			systemtype = res.platform
			name = names;
			var _this=e
			uni.openBluetoothAdapter({
				success: (res) => {
					console.log(" ======== 初始化蓝牙 (成功) =======", res);
					//  开始搜索设备
					uni.startBluetoothDevicesDiscovery({
						success: (res) => {
							console.log("搜索到的设备",res);
							// return onBluetoothDeviceFound;
							onBluetoothDeviceFound.then((val) =>{
								console.log("返回结果",val);
								isok(val)
							})
						},
						fail: (res) => {
							console.log("搜索设备失败",res);
							uni.hideLoading()
							uni.showToast({
								title: '搜索蓝牙失败',
								icon: 'none',
								duration: 3000
							});
						}
					})
					return startBluetoothDevicesDiscovery;
				},
				fail: (res) => {
					uni.hideLoading()
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

}



export default {
	//  监听蓝牙打开或关闭
	onBluetoothAdapterStateChange,
	//  监听设备与蓝牙的连接状态
	onBLEConnectionStateChange,
	//  监听特征值的变化
	onBLECharacteristicValueChange,
	// 启动蓝牙
	initBluetooth,
	// 开锁
	openLock,
	// 连接蓝牙
	connectBluetooth
}