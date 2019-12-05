var dataTransition = require('./dataTransition.js')
import Utils from '@/common/uti.js';

function BluetoothOperate(){
  /*----私有成员变量----*/
  let _machineNO = null;
  let _ctrl_cb = null; //指令回调
  let _isOpenLockFlag = null;
  let _dataLen = 0; //需要接收的数据长度
  let _deviceId = ''; //蓝牙id
  let _hasReceive = false;
  let _connected = false; //连接状态
  let _CRC16 = '';
  let _dataContent = '';
  let _recommandTimer = null; //指令发送定时器
  let _sequenceId = 10; //流水号
  let _sequenceId_16 = ''; //流水号16进制
  let _systemState = '';
  let _characteristicId_notify = null; //getCharacter => 读特征值
  let _characteristicId_write = null; //getCharacter => 写特征值
  let _serviceId = 'FEF6'; //UUID 
  let _discoveryDevicesTimer = null; 
  let _discoveryDevicesTime = 0;
  let _sendData = ''; //发送的包数据
  let _tempTimer = null;


  /*----工共方法----*/
  this.start = (isOpenLock, machineNO) =>{
    console.log('正在初始化变量......')
    _deviceId = '';
    _hasReceive = false;
    _connected = false;
    if(isOpenLock == undefined){
      console.log('请设置操作模式！')
      return;
    }
    if(machineNO == undefined){
      console.log('请传入设备编号！')
      return;
    }
    _isOpenLockFlag = isOpenLock;
    _machineNO = machineNO; //将形参转换为该文件的全局内部变量

    return new Promise((resolve,reject) => {
      _isOpenLock(() => {
        console.log('回调执行...')
        resolve();
      })
    })
  }

  this.end = (cb) =>{
    //关闭蓝牙
    if (_tempTimer){
      clearTimeout(_tempTimer);
    }
    if (_recommandTimer){
      clearTimeout(_recommandTimer)
    }
    wx.closeBLEConnection({
      deviceId: _deviceId,
      success: function (res) {
        console.log('主动断开连接', res);
        _deviceId = '';
        _hasReceive = false;
        _connected = false;
        _ctrl_cb = null;
      },
      fail: function (err) {
        console.log('断开连接失败', err);
      },
      complete: function () {
        _closeBluetoothAdapter();
        cb && cb();
        console.log('结束蓝牙操作！');
        try{
          wx.navigateBack({
            delta: 1
          })
        }catch(e){
          console.log(e);
        }
      }
    })
  }

  //判断是否开启了蓝牙 
  this.judgeBluetooth = (cb) =>{
    wx.closeBluetoothAdapter({
      complete: function (res) {
        wx.openBluetoothAdapter({
          success: function (res) {
            console.log("初始化小程序蓝牙模块", res);
            console.log('第一次判断');
            cb && cb(true);
          },
          fail: function (err) {
            wx.hideToast();
            cb && cb(false);
          },
          complete() {
            let lastAvailable = null;
            wx.onBluetoothAdapterStateChange(function (res) {
              console.log(`第二次判断${res.available},${lastAvailable}`);
              if (res.available !== lastAvailable) {
                if (res.available) { //可用
                  cb && cb(true);
                } else {
                  cb && cb(false);
                }
              }
              lastAvailable = res.available;
            })
          }
        });
      }
    })
  }



  //判断是否开启了蓝牙
  this.isOpenBluetooth = (cb) =>{
    let that = this;
    wx.getBluetoothAdapterState({
      success: function(res) {
        cb && cb(res.available);
      },
      fail: function(err){
        console.log(err);
        if(err.errCode == '10000'){
          wx.openBluetoothAdapter({
            success: function() {
              setTimeout(()=>{
                that.isOpenBluetooth(cb);
              },500)
            },
            fail: function(e){
              console.log(e);
            }
          })
        }else{
          wx.showToast({
            title: err.errMsg,
            icon: 'none'
          })
        }
      }
    })
  }

  /*----私有方法----*/

  //蓝牙开关锁
  const _isOpenLock = (callback) => {
    _ctrl_cb = callback; //将回调函数转换为内部全局函数-结束时回调

    console.log('开始执行蓝牙操作...');
    if (_deviceId.length > 0) {
      console.log('有设备已连接');
      wx.closeBLEConnection({
        deviceId: _deviceId,
        success: function (res) {
          console.log('主动断开连接', res);
        },
        fail: function (err) {
          console.log('断开连接失败', err);
        },
        complete: function () {
          _startBluetoothDevicesDiscovery();
        }
      })
    } else _startBluetoothDevicesDiscovery();
  }

  //开启搜索功能
  const _startBluetoothDevicesDiscovery = () => {
    _dataLen = 0;
    _CRC16 = '';
    _dataContent = '';

    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: false,
      success: function (res) {
        console.log('开启搜索功能');
        if (!res.isDiscovering) {
          console.log('没有开启定位服务');
          //without_accdent_end_1
        } else {
          _onBluetoothDeviceFound();
        }
      },
      fail: function (err) {
        wx.hideLoading();
        console.log('开启蓝牙设备搜索失败', err);
      }
    });
  }

  //监测新设备
  const _onBluetoothDeviceFound = () => {

    _deviceId = '';
    _repeatDiscoveryMachine();

    wx.onBluetoothDeviceFound(function (res) {
		console.log('deviceid',res.devices[0])
      if (res.devices[0] && typeof res.devices[0].localName != 'undefined') {
        //解密编号
        let machineNO = dataTransition.encrypt(dataTransition.ab2hex(res.devices[0].advertisData).slice(4, 13));
        console.log('搜索到的设备编号：' + machineNO + "，目标：" + _machineNO);
        if (machineNO == _machineNO && _deviceId == '') {
          _stopBluetoothDevicesDiscovery();

          clearInterval(_discoveryDevicesTimer);
          _discoveryDevicesTimer = null;
          _discoveryDevicesTime = 0;

          let deviceId = res.devices[0]['deviceId'];
          _deviceId = deviceId;
          console.log('已搜索到目标设备,deviceId为', deviceId);

          //上传周边的设备编号和RSSI
          wx.getBluetoothDevices({
            success(res) {
              console.log("获取周围设备", res)
              if (res.devices) {
                let machineNO_RSSI = [];
                res.devices.forEach(function (value, i) {
                  if (typeof value.localName != 'undefined' && value.localName.indexOf('TBIT') > -1) {
                    let machineNO = dataTransition.encrypt(dataTransition.ab2hex(value.advertisData).slice(4, 13));
                    let RSSI = value.RSSI;
                    machineNO_RSSI.push(machineNO + "_" + RSSI);
                  }
                })
				console.log('typeof _isOpenLockFlag',typeof _isOpenLockFlag)
                if (typeof _isOpenLockFlag === 'boolean')
                  _startConnectDevices();
                else
                  _ctrl_cb();
              }
            }
          })
        }
      }
    })
  }

  //重新搜索
  const _repeatDiscoveryMachine = () => {
    _discoveryDevicesTime = 0; //轮询次数
    if (!_discoveryDevicesTimer)
      _discoveryDevicesTimer = setInterval(function () {
        if (_discoveryDevicesTime > 14) {
          clearInterval(_discoveryDevicesTimer);
          _discoveryDevicesTimer = null;
          _discoveryDevicesTime = 0;
          wx.hideToast();

          _stopBluetoothDevicesDiscovery();
          wx.showModal({
            title: '温馨提示',
            content: '搜索失败,请尝试打开GPS服务，是否重新搜索？',
            showCancel: true,
            success: function (res) {
              if (res.cancel) {
                _closeBluetoothAdapter();
              } else { //蒙层和confirm
                wx.showToast({
                  title: '请稍候',
                  icon: 'loading',
                  mask: true,
                  duration: 1000000
                })
                _startBluetoothDevicesDiscovery()
              }
            }
          })
        } else {
          _discoveryDevicesTime++;
          console.log('搜索时间：', _discoveryDevicesTime)
        }
      }, 1000);
  }

  const _stopBluetoothDevicesDiscovery = () => {
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log('停止搜寻附近的蓝牙外围设备');
      }
    })
  }

  const _closeBluetoothAdapter = () => {
    wx.closeBluetoothAdapter({
      success: function (res) {
        console.log('关闭蓝牙适配器')
      }
    })
  }

  //开启连接设备，每次开机微信貌似连接15秒。
  const _startConnectDevices = () => {
    console.log('开始连接设备startConnectDevices');
    if (_deviceId.length > 0) {
      wx.closeBLEConnection({
        deviceId: _deviceId,
        success: function (res) {
          console.log('主动断开连接', res);
        },
        fail: function (err) {
          console.log('断开连接失败', err);
        },
        complete: function () {
          wx.createBLEConnection({
            deviceId: _deviceId,
            success: function (res) {
              //console.log(res);
              if (res.errCode == 0) {
                console.log('连接设备成功', _deviceId);
                _getService();
              }
            },
            fail: function (err) {
              console.log('连接失败原因', err);
              if (err.errCode != -1 && err.errcode != 10000) {
                if (err.errCode == 10006 || err.errCode == 10003 || err.errCode == 10012) {
                  wx.showModal({
                    title: '温馨提示',
                    content: '连接失败,请尝试 1) 打开GPS服务。2) 重新连接',
                    cancelText: '取消',
                    confirmText: '重试',
                    showCancel: true,
                    success: function (res) {
                      if (res.cancel) {
                        wx.hideLoading();
                      } else {
                        console.log('正在重连...');
                        //这里加一个
                        wx.closeBluetoothAdapter({
                          success: function (res) {
                            wx.openBluetoothAdapter({
                              success: function (res) {
                                console.log('重连之前，重启蓝牙适配器成功!')
                                _startConnectDevices();
                              }
                            })
                          }
                        });
                      }
                    }
                  })
                }
              } else {
                console.log('已经连接!');
                wx.hideLoading();
              }
            },
            complete: function () {

            }
          });
        }
      })
    }
  }

  //获取所有服务
  const _getService = () => {
    // 获取蓝牙设备service值
    wx.getBLEDeviceServices({
      deviceId: _deviceId,
      success: function (res) {
        console.log('获取的所有服务值', res);
        _getCharacter(res.services);
      }
    })
  }

  const _getCharacter = (services) => {
    services.forEach(function (value, index, array) {
      console.log("设备所有的UUId", value.uuid);
      if (value.uuid.indexOf(_serviceId) > -1) {
        _serviceId = array[index].uuid;
        console.log("设置的一个_serviced", _serviceId)

        wx.getBLEDeviceCharacteristics({
          deviceId: _deviceId,
          serviceId: _serviceId,
          success: function (res) {
            console.log(res);
            for (let i = 0; i < res.characteristics.length; i++) {
              if (res.characteristics[i].properties.notify && !res.characteristics[i].properties.write)
                _characteristicId_notify = res.characteristics[i].uuid;
              if (res.characteristics[i].properties.write)
                _characteristicId_write = res.characteristics[i].uuid;
            }

            console.log('特征值读:', _characteristicId_notify);
            console.log('特征值写:', _characteristicId_write);

            _connectCtrl()

            _notifyBLECharacteristicValueChange();
          },
          fail: function (err) {
            console.log('读取特征值失败：' + err);
          },
          complete: function () {

          }
        })
        return;
      } else {
        console.log('无符合UUID');
      }
    });
  }

  //秘钥连接指令
  const _connectCtrl = () =>{

    //秘钥连接指令
    _getSecretKey().then(function (key) {
		console.log('key1111',key)
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
      let cLength = dataTransition.getSecretKeyLength(c);
      //发送内容
      let sendValue = `02 00 01 ${cLength}`; //02 连接命令  01连接请求 cLength秘钥长度。
      let allData = `${sendValue} ${secretKey}`;
      console.log('数据头和内容：' + allData);
      let header = dataTransition.header(allData, 0, '00', sequenceId_16);
      let data = header + allData.replace(/\s+/g, "");
      console.log('发送的连接数据：', data);
      _sendCtrl(data);
    })
  }
  

  //获取秘钥
  const _getSecretKey = () =>{
    return new Promise(function (res, rej) {
      let url = '';
	  var devcode = Utils.encrypt('003451386','15326738')
	  console.log('asecode',devcode)
	  // 预留字段
	  var ylcode = '0000000000000000000000'
	  // 客户编码
	  var khcode = '00'
	  // 厂家编码
	  var cjcode = '00'
	  // utc时间戳
	  var utccode = getutctimestring()
	  // 掩码标识
	  var ymcode = '0000'
	  // 补码编码
	  var bmcode = '0000000000'
	  var connectvalue =devcode + ylcode + khcode + cjcode + utccode + ymcode + bmcode
	  res('6E B0 4A F9 EB FD F0 54 C9 89 76 F8 00 54 87 D6 82 2A 56 27 16 BE 12 AE 5A 42 47 38 87 A0 3A 1E ')
      //res(网络请求密钥);

    });
  }

  //发送指令。判断是否分包发送数据
  const _sendCtrl = (data) =>{
    //保存一下发送的数据
    _sendData = data;
    //如果大于20个字节则分包发送,两个字符一个字节
    var dataLen = Math.ceil(data.length / 40);
    if (dataLen > 1) { //3
      for (let i = 0; i < data.length; i += 40) {

        let value = dataTransition.hexStringToArrayBuffer(data.slice(i, i + 40));
        console.log("分包发送的数据", data.slice(i, i + 40))
        
        _writeBLECharacteristicValue(value);
      }
    } else {
      let value = dataTransition.hexStringToArrayBuffer(data);
      _writeBLECharacteristicValue(value);
    }
  }

  //发送信息
  const _writeBLECharacteristicValue = (value, cb) =>{
    setTimeout(() => {
      wx.writeBLECharacteristicValue({
        deviceId: _deviceId,
        serviceId: _serviceId,
        characteristicId: _characteristicId_write,
        // 这里的value是ArrayBuffer类型
        value: value,
        success: function (res) {
          console.log('发送信息成功', res.errMsg);
          cb && cb();
        },
        fail: function (err) {
          let errMsg = JSON.stringify(err);
          console.log(errMsg);
          let code = err.errCode;
          if (code == 10006 || code == 10000) { //连接断开
            _startConnectDevices();
          } else if (code == 10008) {
            console.log('重发数据', dataTransition.ab2hex(value));
            _writeBLECharacteristicValue(value);
          }
        }
      })
    }, 300);
  }

  //启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值
  const _notifyBLECharacteristicValueChange = () =>{                                     
    let that = this;
    wx.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: _deviceId,
      serviceId: _serviceId,
      characteristicId: _characteristicId_notify,
      success(res) {
        console.log('启用监听计划...')

        let tempTime = 0;
        _tempTimer = setInterval(() => {
          tempTime++;
          if (tempTime >= 8) {
            clearInterval(_tempTimer);
            wx.hideToast();
            wx.hideLoading();
            wx.showModal({
              title: '温馨提示',
              content: '设备未响应,是否重新操作',
              showCancel: true,
              success: function (res) {
                if (res.confirm) {
                  wx.showToast({
                    title: '请稍后',
                    icon: 'loading',
                    mask: true,
                    duration: 100000
                  })
                  // that.start(_isOpenLockFlag, _machineNO);
                  _connectCtrl();
                } else {
                  that.end();
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          }
        }, 1024)

        wx.onBLECharacteristicValueChange(function (res) {
          clearInterval(_tempTimer)
          console.log('********notify收到的数据：', dataTransition.ab2hex(res.value));
          console.log('长度1', _dataLen);
          let resData = dataTransition.ab2hex(res.value);
          if (resData.slice(0, 4) == 'aa10') { //<aa10550a00000000>
            console.log('指令发送成功：', resData);
          } else if (resData.slice(0, 3) == 'aa0' && _dataLen == 0) { //终端响应的数据，微信这里每次只接受8个字节 <aa00550a 003e4c10>
            //16进制流水号
            _sequenceId_16 = resData.slice(6, 8); //0a
            //计算数据包长度
            _dataLen = parseInt(resData.slice(8, 12), 16); //003e,16=62
            //计算systemState
            _systemState = resData.slice(4, 6); //4c
            //crc
            _CRC16 = resData.slice(12, 16); //290e
            console.log("需要接收的字节长度", _dataLen);
            if (resData.length > 16) {
              _connectData(resData.slice(16))
            }
          } else if (resData.slice(0, 4) == 'aa30') {
            console.log('CRC校验失败', _sendData);
            wx.hideLoading();
          } else {
            if (_dataLen > 0) {
              //校验长度和crc
              _connectData(res.value)
            }
          }
        })
      },
      fail(err) {
        console.log('接收数据', err);
      }
    })
  }

  //拼接数据，判断数据并发送
  const _connectData = (data) =>{
    if (Object.prototype.toString.call(data) == '[object ArrayBuffer]') {
      _dataContent += dataTransition.ab2hex(data);
    } else {
      _dataContent += data;
    }
    console.log('接收到的数据长度', _dataLen);
    console.log('内容长度', _dataContent.length);
    if (_dataContent.length == _dataLen * 2) { //接收完该长度的字节和校验CRC成功之后再发送ACK
      let dc = _dataContent;
      let dcArr = [];
      console.log('接收的数据长度字节：', dc.length / 2);
      let contentArr = dataTransition.addFlagBeforeArr(dataTransition.strAverage2Arr(dc, 2));
      if (parseInt(dataTransition.getCRC16(contentArr), 16) == parseInt(_CRC16, 16)) {
        console.log('CRC16校验成功', dataTransition.getCRC16(contentArr));
        let value = dataTransition.hexStringToArrayBuffer(`aa12${_systemState}${_sequenceId_16}00000000`);
        console.log(`返回的确认数据${dataTransition.ab2hex(value)}`);
        //分析数据返回的内容 
        _analysisBLEContent(dc).then((response) => {
          if (response === '连接成功') {
            _dataLen = 0;
            _CRC16 = '';
            _dataContent = '';
            console.log('发送连接ACK', dataTransition.ab2hex(value));

            _writeBLECharacteristicValue(value, function () {
              if (_isOpenLockFlag === true)
                _ctrl('open');
              else if (_isOpenLockFlag === false)
                _ctrl('close');
              //console.log('准备开锁');
            });
          }
          if (response === '开锁成功') {
            console.log('发送开锁ACK', dataTransition.ab2hex(value));
            _writeBLECharacteristicValue(value, function () {
              console.log('开锁成功，开始回调ctrl_cb');
              if (_ctrl_cb) {
                _isOpenLockFlag = '';
                _ctrl_cb();
              }
            });
          }
          if (response === '上锁成功') {
            console.log('发送上锁ACK', dataTransition.ab2hex(value));
            _writeBLECharacteristicValue(value, function () {
              console.log('上锁成功，开始回调ctrl_cb');
              if (_ctrl_cb) {
                _isOpenLockFlag = '';
                _ctrl_cb();
              }
            });
          }
          if (response == '心跳包') {
            
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
  const _analysisBLEContent = (content) =>{
    return new Promise(function (res, rej) {
      console.log('解析数据数据***************', content);
      if (content.indexOf('020101') > -1) {
        if (!_connected) {
          _connected = true;
          res('连接成功');
        }
      } else if (content.indexOf('0300820100') > -1) {
        if (!_hasReceive) {
          clearTimeout(_recommandTimer); //清除未响应定时器
          _hasReceive = true;
          res('开锁成功');
        }
      } else if (content.indexOf('0300810100') > -1) {
        if (!_hasReceive) {
          clearTimeout(_recommandTimer); //清除未响应定时器
          _hasReceive = true;
          res('上锁成功');
        }
      } else if (content.indexOf('04008524') > -1) {
        res('心跳包');
      } else if (content.indexOf('020100') > -1) {
        clearTimeout(_recommandTimer); //清除未响应定时器
        wx.hideLoading();
        console.log('鉴权失败：', _sendData);
      } else {
        clearTimeout(_recommandTimer); //清除未响应定时器
        wx.hideLoading();
        console.log('蓝牙内容：', content);
        
        wx.closeBLEConnection({
          deviceId: _deviceId,
          success: function (res) {
            console.log('主动断开连接', res);
            _deviceId = '';
            _hasReceive = false;
            _connected = false;
          },
          fail: function (err) {
            console.log('断开连接', err);
          },
          complete: function () {
            wx.showToast({
              title: content === '0300810102' ? '运动中不能上锁!' : '蓝牙操作失败，请重试!',
              mask: true,
              icon: 'none',
              duration: 5000
            })
            //关闭蓝牙
            //_closeBluetoothAdapter();
          }
        })
      }
    });
  }

  //指令
  const _ctrl = (flag) =>{
    let sequenceId_16 = dataTransition.getSequenceId(_sequenceId);
    _sequenceId++;
    let sendData = '';
    if (flag === 'open') //<aa02000b 00057edb 03000201 00 >
      sendData = '03 00 02 01 00';
    else if (flag === 'close') //<aa02000c 00058036 03000101 01 >
      sendData = '03 00 01 01 01';
    let header = dataTransition.header(sendData, 0, '00', sequenceId_16);
    let data = header + sendData.replace(/\s+/g, "");
    console.log(`发送${flag}指令`, data);
    
    setTimeout(()=>{
      _sendCtrl(data);
    },500)

    _recommandTimer = setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '温馨提示',
        content: '终端未响应，是否重新发送指令？',
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            wx.showLoading({
              title: '开锁中',
            })
            if (_isOpenLockFlag === true)
              _ctrl('open');
            else if (_isOpenLockFlag === false)
              _ctrl('close');
          } else {

          }
        }
      })
    }, 8000)
  }

}
// 获取utc时间戳
function getutctimestring() {
	var date = new Date()
	var now_utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
		date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
	var strs = new Date(now_utc)
	console.log('utctime',strs.valueOf().toString(16))
	return '5a0ab894'
	// return strs.valueOf().toString(16)
}

module.exports = BluetoothOperate