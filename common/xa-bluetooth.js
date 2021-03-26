import store from '@/store'
var dataTransition = require('./dataTransition.js')
// var bluealldevice = uni.getStorageSync('bluealldevice');
// var bluealldevice = uni.getStorage('bluealldevice');
var systemtype = '',
	code = '',
	starttime = '',
	endtime = '',
	deviceId = '',
	serviceId = '',
	characterId = '',
	bluebikeinfo = {}, //蓝牙货源
	_dataLen = 0, //需要接收的数据长度
	_isOpenLockFlag = true,
	_hasReceive = false,
	_connected = false, //连接状态
	_CRC16 = '',
	_dataContent = '',
	_recommandTimer = null, //指令发送定时器
	_sequenceId = 10, //流水号
	_sequenceId_16 = '', //流水号16进制
	_systemState = '',
	_characteristicId_notify = null, //getCharacter => 读特征值
	_characteristicId_write = null, //getCharacter => 写特征值
	_serviceId = 'FEF6', //UUID 
	_discoveryDevicesTimer = null,
	_discoveryDevicesTime = 0,
	_sendData = '', //发送的包数据
	_tempTimer = null,
	_glbelStateObj = {}

function ab2hex(buffer) {
	const hexArr = Array.prototype.map.call(
		new Uint8Array(buffer),
		function(bit) {
			return ('00' + bit.toString(16)).slice(-2)
		}
	)
	return hexArr.join('')
}

function onBluetoothDeviceFound() {
	return new Promise((resolve, reject) => {
		
		try{
			var bluealldevice = uni.getStorageSync('bluealldevice');
			console.log('bluealldevice',bluealldevice)
			if(bluealldevice){
				for(var i=0;i<bluealldevice.length;i++){
					try {
						// console.log("成功1:", bluealldevice[i].devices[0]);
						// console.log("成功1:", bluealldevice[i].devices[0]);
						if (bluebikeinfo.ecu_model == "WA-209D") {
							//解密编号
							// let machineNO = dataTransition.encrypt(dataTransition.ab2hex(bluealldevice[i].devices[0].advertisData).slice(4, 13));
							// console.log('machineNO',machineNO)
							if (bluealldevice[i].machineNO == bluebikeinfo.ecu_sn.toUpperCase().slice(0, 9)) {
								coreapi(resolve, reject, bluealldevice[i])
								// console.log("成功2:", bluealldevice[i].devices[0]);
							}
						} else {
							
							// if (bluealldevice[i].devices[0].localName == bluebikeinfo.bluetooth_name) {
							if (bluealldevice[i].devices[0].localName == bluebikeinfo.bluetooth_name) {
								coreapi(resolve, reject, bluealldevice[i])
							}
						}
					} catch (e) {
						//TODO handle the exception
						console.log('error', e)
						reject({
							fail: '异常失败' + e
						})
					}
					
					
					
					// try{
					// 	if(bluealldevice[i].advertisData==bluebikeinfo.ecu_sn.toUpperCase().slice(0, 9)){
					// 		coreapi(resolve, reject, bluealldevice[i])
					// 		return
					// 	}
					// }catch(e){
					// 	console.log('error', e)
					// 	reject({
					// 		fail: '异常失败' + e
					// 	})
					// }
					
				}
			}
		}
		catch(e){
			
		}
		
		
	})
}

// function onBluetoothDeviceFound() {
// 	return new Promise((resolve, reject) => {
// 		wx.onBluetoothDeviceFound((res) => {
// 			try {
// 				console.log("成功1:", res.devices[0]);
// 				if (bluebikeinfo.ecu_model == "WA-209D") {
// 					//解密编号
// 					let machineNO = dataTransition.encrypt(dataTransition.ab2hex(res.devices[0].advertisData).slice(4, 13));
// 					console.log('machineNO',machineNO)
// 					if (machineNO == bluebikeinfo.ecu_sn.toUpperCase().slice(0, 9)) {
// 						coreapi(resolve, reject, res)
// 						console.log("成功2:", res.devices[0]);
// 					}
// 				} else {
// 					if (res.devices[0].localName == bluebikeinfo.bluetooth_name) {
// 						coreapi(resolve, reject, res)
// 					}
// 				}
// 			} catch (e) {
// 				//TODO handle the exception
// 				console.log('error', e)
// 				reject({
// 					fail: '异常失败' + e
// 				})
// 			}
// 		})
// 	})
// }
// 蓝牙操作核心函数
function coreapi(resolve, reject, res) {
	deviceId = res.devices[0].deviceId;
	//  连接指定设备
	wx.createBLEConnection({
		deviceId: res.devices[0].deviceId,
		success: (res) => {
			console.log("连接设备成功", res);
			store.commit('setBlueconectstate', 1)
			uni.showToast({
				title: '连接蓝牙成功',
				duration: 3000,
			});
			//  获取蓝牙设备所有服务 ，获取设备服务 uuid
			wx.getBLEDeviceServices({
				deviceId: deviceId,
				success: (res) => {
					console.log("蓝牙设备服务", res);
					if (systemtype == 'android') {
						serviceId = res.services[0].uuid;
					} else {
						serviceId = res.services[res.services.length - 1].uuid;
					}
					// 获取蓝牙设备某个服务中所有特征值
					wx.getBLEDeviceCharacteristics({
						deviceId: deviceId,
						serviceId: serviceId,
						success: (res) => {
							console.log("蓝牙设备所有特征值", res);
							var charaArr = res.characteristics;
							var notifyId = "";
							for (var i = 0; i < charaArr.length; i++) {
								if (bluebikeinfo.ecu_model == 'WA-209D') {
									if (charaArr[i].properties.write) {
										characterId = charaArr[i].uuid;
									}
									if (charaArr[i].properties.write === false && charaArr[i].properties.notify) {
										notifyId = charaArr[i].uuid;
									}

								} else {
									if (charaArr[i].properties.notify && false === charaArr[i].properties.read && false ===
										charaArr[
											i].properties.write) {
										// _this.notyCharacteristicId = charaArr[i].uuid;
										notifyId = charaArr[i].uuid;
									}
									if (false === charaArr[i].properties.notify && false === charaArr[i].properties.read &&
										charaArr[
											i].properties.write) {
										// _this.characteristicId = charaArr[i].uuid;
										characterId = charaArr[i].uuid;
									}
								}

							}

							wx.notifyBLECharacteristicValueChange({
								deviceId: deviceId,
								serviceId: serviceId,
								characteristicId: notifyId,
								state: true,
								success: (res) => {
									console.log("特征值变化监听启动成功：", res);
									if (bluebikeinfo.ecu_model == 'WA-209D') {
										console.log('连接泰币特蓝牙')
										_connectCtrl()
									}
									// _this.writeDataToBluetooth();

									resolve({
										deviceId: deviceId,
										serviceId: serviceId,
										characterId: characterId,
									})
								},
								fail: (res) => {
									console.log("特征值变化监听启动失败：", res);
									reject({
										fail: '特征值变化监听启动失败' + res
									})
								}
							})

						},
						fail: (err) => {
							console.log('获取蓝牙特征值失败', err)
							reject({
								fail: '获取蓝牙特征值失败' + err
							})
						}
					})
				},
				fail: (err) => {
					console.log('获取蓝牙特征值失败', err)
					reject({
						fail: '获取蓝牙所有服务失败' + err
					})
				}
			})
			//  关闭蓝牙搜索
			wx.stopBluetoothDevicesDiscovery({
				success: (res) => {
					console.log("关闭成功");
				}
			})
		},
		fail: (res) => {
			console.log("连接设备失败", res);
			reject({
				fail: '连接设备失败' + res
			})
			uni.showToast({
				title: '连接蓝牙失败',
				duration: 3000,
			});
		}
	})
}

/*** 监听蓝牙变化 ***/

//  监听蓝牙是否打开，以及是否在搜索附近设备
const onBluetoothAdapterStateChange = (callback) => {
	wx.onBluetoothAdapterStateChange(function(res) {
		// console.log('adapterState changed, now is', res)
		callback(res);
	})
}
//  手机与蓝牙连接状态变化监听
const onBLEConnectionStateChange = (callback) => {
	wx.onBLEConnectionStateChange(function(res) {
		// console.log('onBLEConnectionStateChange：', JSON.stringify(res));
		if(res.connected==false){
			store.commit('setBlueconectstate', 0)
		}
		callback(res);
	})
}
//  特征值发生变化
const onBLECharacteristicValueChange = (callback) => {
	wx.onBLECharacteristicValueChange(function(res) {
		// console.log('********notify收到的数据：', dataTransition.ab2hex(res.value));		
		if (bluebikeinfo.ecu_model == "WA-209D") {
			let resData = dataTransition.ab2hex(res.value);
			// console.log('resData', resData);
			if (resData.slice(0, 4) == 'aa10') { //<aa10550a00000000>
				// console.log('指令发送成功：', resData);
			} else if (resData.slice(0, 3) == 'aa0' && _dataLen == 0) { //终端响应的数据，微信这里每次只接受8个字节 <aa00550a 003e4c10>
				//16进制流水号
				_sequenceId_16 = resData.slice(6, 8); //0a
				// console.log('_sequenceId_16',_sequenceId_16)
				//计算数据包长度
				_dataLen = parseInt(resData.slice(8, 12), 16); //003e,16=62
				//计算systemState
				_systemState = resData.slice(4, 6); //4c
				//crc
				_CRC16 = resData.slice(12, 16); //290e
				// console.log("需要接收的字节长度", _dataLen);
				if (resData.length > 16) {
					_connectData(resData.slice(16), 'ring', callback)
					// _ctrl('ring')
				}
			} else if (resData.slice(0, 4) == 'aa30') {
				console.log('CRC校验失败', _sendData);
				wx.hideLoading();
			} else {
				if (_dataLen > 0) {
					//校验长度和crc
					// console.log('othertype')
					_connectData(res.value, 'ring', callback)
				}
			}
		} else {
			callback(ab2hex(res.value));
		}
	})
}
//  写入数据
//  开锁相关操作
const openLock = (tocken, dowhat, success) => {
	starttime = Date.now()
	if (bluebikeinfo.ecu_model == 'WA-209D') {
		if (dowhat != '') {
			_ctrl(dowhat)
		}
	} else {
		writevalue(success, tocken)
	}

}

function writevalue(success, strs) {
	wx.writeBLECharacteristicValue({
		deviceId: deviceId,
		serviceId: serviceId,
		characteristicId: characterId,
		// value: tocken,
		value: strs,
		success: (res) => {
			console.log('writeBLECharacteristicValue success', res)
			endtime = Date.now()
			var loadtime = endtime - starttime
			// console.log('loadtime',loadtime)
			res.loadtime = loadtime
			success(res);
		},
		fail: (res) => {
			console.log('writeBLECharacteristicValue fail', res)
			wx.writeBLECharacteristicValue({
				deviceId: deviceId,
				serviceId: serviceId,
				characteristicId: characterId,
				value: strs,
				success: (res) => {
					console.log('writeBLECharacteristicValue success', res)
					success(res);
				},
				fail: (res) => {
					console.log('writeBLECharacteristicValue fail', res)
					wx.writeBLECharacteristicValue({
						deviceId: deviceId,
						serviceId: serviceId,
						characteristicId: characterId,
						value: strs,
						success: (res) => {
							console.log('writeBLECharacteristicValue success', res)
							success(res);
						},
						fail: (res) => {
							console.log('writeBLECharacteristicValue fail', res)
						},
					})
				},
			})
		},
	})
}
//  停止搜索周边蓝牙设备
function stopSearchBluetooth() {
	wx.stopBluetoothDevicesDiscovery({
		success: (res) => {
			console.log("停止成功");
		}
	})
}

var startBluetoothDevicesDiscovery = new Promise((resolve, reject) => {

})

///  初始化蓝牙 
const initBluetooth = (bikeinfo, isok) => {
	store.commit('setBlueconectstate', 0)
	wx.closeBluetoothAdapter({
		success(res) {
			console.log('关闭蓝牙成功', res)
			store.commit("setBluestate", false);
			uni.getSystemInfo({
				success: function(res) {
					systemtype = res.platform
					bluebikeinfo = bikeinfo
					if (bluebikeinfo.ecu_model == "WA-209D") {

					} else {

					}
					// var _this=e
					wx.openBluetoothAdapter({
						success: (res) => {
							console.log(" ======== 初始化蓝牙 (成功) =======", res);
							store.commit("setBluestate", true);
							//  开始搜索设备
							wx.startBluetoothDevicesDiscovery({
								success: (res) => {
									console.log(" 开始搜索设备", res);
									// return onBluetoothDeviceFound;
									// console.log('onBluetoothDeviceFound',onBluetoothDeviceFound())
									onBluetoothDeviceFound().then((val) => {
										console.log("查询返回结果", val);
										isok(val)
									}).catch((err) => {
										console.log('蓝牙reject', err)
									})
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


}
// 计算长度
function sumDataLength(token, params) {
	if (params === "") {
		return "04";
	}
	var ll = params.length + token.length;
	if (ll > 15) {
		return "" + Number(ll / 2).toString(16);
	}
	return "0" + Number(ll / 2).toString(16);
}
// 分割字符串
function splitStrs(source, count) {
	let arr = [];
	for (let i = 0, len = source.length / count; i < len; i++) {
		let subStr = source.substr(0, count);
		arr.push(subStr);
		source = source.replace(subStr, "");
	}
	return arr;
}
// 计算命令总长
function sumCkLen(type, len, token, cmd) {
	var str = type + len + token + cmd;
	var numArray = splitStrs(str, 2);
	var totalnum = parseInt(0, 16);
	for (var index = 0; index < numArray.length; index++) {
		totalnum += parseInt(numArray[index], 16);
	}
	return Number(totalnum % 256).toString(16);
}
const doCmd = (type, params, tocken) => {
	var dToken = !!tocken ? tocken.toString(16) : '0A0A0505';
	dToken = (Array(8).join('0') + dToken).slice(-8)
	// console.log('dToken', dToken)
	var len = sumDataLength(dToken, params);
	var ckLen = sumCkLen(type, len, dToken, params);
	var cmdStr = type + len + dToken + params + ckLen;
	// this.setData({ cmdStr: cmdStr });
	var typedArray = new Uint8Array(cmdStr.match(/[\da-f]{2}/gi).map(function(h) {
		return parseInt(h, 16)
	}))
	// console.log('typedArray', cmdStr, typedArray)
	var buffer1 = typedArray.buffer
	// this.write(cmdStr);
	return buffer1
}

function getdevcode(code) {
	var devcode = code.split(':')
	devcode = devcode[5] + devcode[4] + devcode[3] + devcode[2] + devcode[1]
	return devcode
}



// 泰币特蓝牙
//秘钥连接指令
const _connectCtrl = () => {

	//秘钥连接指令
	_getSecretKey().then(function(key) {
		let secretKey = key.toString().trim().toLowerCase();
		//拼接数据头
		//ack, systemState, _sequenceId, payLoadLength, CRC16
		/*
		 * ack 0 ,1,反馈为1，发送为0
		 * systemState,反馈为带过来的值，发送为00
		 * _sequenceId,为流水号，自增
		 * payLoadLength,数据包的长度
		 * CRC16,数据包经过CRC算法得到的结果
		 */
		let sequenceId_16 = dataTransition.getSequenceId(_sequenceId);
		_sequenceId++;
		let c = secretKey.toString().replace(/\s+/g, "");
		console.log('secretKey', secretKey, c)
		let cLength = dataTransition.getSecretKeyLength(c);
		//发送内容
		let sendValue = `02 00 01 ${cLength}`; //02 连接命令  01连接请求 cLength秘钥长度。
		let allData = `${sendValue} ${secretKey}`;
		console.log('数据头和内容：' + allData);
		let header = dataTransition.header(allData, 0, '00', sequenceId_16);
		let data = header + allData.replace(/\s+/g, "");
		console.log('发送的连接数据：', data);
		_sendCtrl(data, 'connect');
	})
}
//获取秘钥
const _getSecretKey = () => {
	return new Promise(function(res, rej) {
		// res('D9 B6 8B 9B AE D4 9E B1 21 7A D8 5B 6B 92 03 5C 4E 31 B6 9B 12 88 7A D9 8B 12 87 F7 CF 80 2E 93 ')
		res(bluebikeinfo.bluetooth_token.replace(/(.{2})/g, '$1 '))
		//res(网络请求密钥);

	});
}
//发送指令。判断是否分包发送数据
const _sendCtrl = (data, name) => {
	//保存一下发送的数据
	_sendData = data;
	// console.log("分包发送的数据", data)
	//如果大于20个字节则分包发送,两个字符一个字节
	var dataLen = Math.ceil(data.length / 40);
	_glbelStateObj.name = name
	_glbelStateObj.state = false
	_hasReceive = false
	if (dataLen > 1) { //3
		for (let i = 0; i < data.length; i += 40) {

			let value = dataTransition.hexStringToArrayBuffer(data.slice(i, i + 40));
			// console.log("分包发送的数据", data.slice(i, i + 40))
			// console.log('write',value,new Date.getTime())
			_writeBLECharacteristicValue(value);
		}
	} else {
		let value = dataTransition.hexStringToArrayBuffer(data);
		// console.log('write',value,new Date.getTime())
		_writeBLECharacteristicValue(value);
	}
}
//发送信息
const _writeBLECharacteristicValue = (value, cb) => {
	setTimeout(() => {
		wx.writeBLECharacteristicValue({
			deviceId: deviceId,
			serviceId: serviceId,
			characteristicId: characterId,
			// 这里的value是ArrayBuffer类型
			value: value,
			success: function(res) {
				console.log('发送信息成功', res.errMsg);
				cb && cb();
			},
			fail: function(err) {
				let errMsg = JSON.stringify(err);
				console.log(errMsg);
				let code = err.errCode;
				if (code == 10006 || code == 10000) { //连接断开
					// _startConnectDevices();
				} else if (code == 10008) {
					console.log('重发数据', dataTransition.ab2hex(value));
					_writeBLECharacteristicValue(value);
				}
			}
		})
	}, 300);
}
//拼接数据，判断数据并发送
const _connectData = (data, type, callback) => {
	if (Object.prototype.toString.call(data) == '[object ArrayBuffer]') {
		_dataContent += dataTransition.ab2hex(data);
	} else {
		_dataContent += data;
	}

	// console.log('接收到的数据长度', _dataLen);
	// console.log('内容长度', _dataContent.length);
	if (_dataContent.length == _dataLen * 2) { //接收完该长度的字节和校验CRC成功之后再发送ACK
		// console.log('_dataContent-------',_dataContent)
		let dc = _dataContent;
		let dcArr = [];
		// console.log('接收的数据长度字节：', dc.length / 2);
		let contentArr = dataTransition.addFlagBeforeArr(dataTransition.strAverage2Arr(dc, 2));
		if (parseInt(dataTransition.getCRC16(contentArr), 16) == parseInt(_CRC16, 16)) {
			console.log('CRC16校验成功', dataTransition.getCRC16(contentArr));
			let value = dataTransition.hexStringToArrayBuffer(`aa12${_systemState}${_sequenceId_16}00000000`);
			// console.log(`返回的确认数据${dataTransition.ab2hex(value)}`);
			//分析数据返回的内容 
			_analysisBLEContent(dc).then((response) => {
				callback(response)
				if (response.name === '连接成功') {
					store.commit('setBlueconectstate', 1)
					_dataLen = 0;
					_CRC16 = '';
					_dataContent = '';
					console.log('登录成功', dataTransition.ab2hex(value));
				}
				if (response.name === '开锁成功') {

				}
				if (response.name === '上锁成功') {
					console.log('发送上锁ACK', dataTransition.ab2hex(value));
				}
				if (response.name == '心跳包') {

				}
			})
		} else {
			console.log('CRC16校验失败', dataTransition.getCRC16(contentArr) + "_应为：" + _CRC16);
		}
		_dataLen = 0;
		_dataContent = '';
		_systemState = '';
		_dataContent = '';
		_sequenceId_16 = '';
		_CRC16 = '';
	}
}
//解析蓝牙发送内容
const _analysisBLEContent = (content) => {
	return new Promise(function(res, rej) {
		console.log('解析数据数据***************', content); 
		if (content.indexOf('020101') > -1) {
			res({name:'连接成功',val:content});
			if (!_connected) {
				_connected = true;
				console.log('连接成功---》')
				// res({name:'连接成功',val:content});
				if(content.indexOf('840a') > -1){

				}
				
			}
		} else if (content.indexOf('0300820100') > -1) {
			// _glbelStateObj.name=='open' &&_glbelStateObj.state==false
			if (!_hasReceive) {
				_hasReceive = true;
				res({name:'开锁成功',val:content});
			}
		} else if (content.indexOf('0300810100') > -1) {
			if (!_hasReceive) {
				_hasReceive = true;
				res({name:'上锁成功',val:content});
			}
		} else if (content.indexOf('0300850100') > -1) {
			if (!_hasReceive) {
				_hasReceive = true;
				res({name:'电池锁打开成功',val:content});
			}
		} else if (content.indexOf('04008524') > -1) {
			res({name:'心跳包',val:content});
		} else if (content.indexOf('020100') > -1) {
			wx.hideLoading();
			console.log('鉴权失败：', _sendData);
		} else if (content.indexOf('04008524') > -1) {
			res({name:'同步信息成功',val:content});
		} 
		
		else {
			wx.hideLoading();
			wx.showToast({
				title: content === '0300810102' ? '运动中不能上锁!' : '蓝牙操作失败，请重试!',
				mask: true,
				icon: 'none',
				duration: 5000
			})
			console.log('蓝牙内容：', content);
			// wx.closeBLEConnection({
			// 	deviceId: deviceId,
			// 	success: function(res) {
			// 		console.log('主动断开连接', res);
			// 		deviceId = '';
			// 		_hasReceive = false;
			// 		_connected = false;
			// 	},
			// 	fail: function(err) {
			// 		console.log('断开连接', err);
			// 	},
			// 	complete: function() {
			// 		wx.showToast({
			// 			title: content === '0300810102' ? '运动中不能上锁!' : '蓝牙操作失败，请重试!',
			// 			mask: true,
			// 			icon: 'none',
			// 			duration: 5000
			// 		})
			// 		//关闭蓝牙
			// 		//_closeBluetoothAdapter();
			// 	}
			// })
		}
	});
}
//指令
const _ctrl = (flag) => {
	let sequenceId_16 = dataTransition.getSequenceId(_sequenceId);
	_sequenceId++;
	let sendData = '';
	if (flag == 'dianchisuo')
		sendData = '03 00 05 01 01';
	else if (flag == 'ring')
		sendData = '03 00 04 01 01';
	else if (flag === 'open') //电门锁打开
		sendData = '03 00 02 01 00';
	else if (flag === 'close') //设防
		sendData = '03 00 01 01 01';
	else if (flag === 'dmopen') //撤防
		sendData = '03 00 01 01 00';
	else if (flag === 'dmclose') //电门锁关闭
		sendData = '03 00 02 01 01';
	else if (flag === 'gps') //gps
		sendData = '04 00 05 01 00';	
	let header = dataTransition.header(sendData, 0, '00', sequenceId_16);
	let data = header + sendData.replace(/\s+/g, "");
	console.log(`发送${flag}指令`, data);

	setTimeout(() => {
		_sendCtrl(data, flag);
	}, 500)
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
	// connectBluetooth,
	// 字符串处理
	doCmd
}
