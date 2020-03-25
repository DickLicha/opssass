export default { 
  // 日志类型 event = 3
  ecuLogNotifyType: {
    name: 'ecu_log_notify_type',
    options: [
      {
        title: '未知',
        value: ''
      },
      {
        title: '车辆已自动设防',
        value: 0
      },
      {
        title: '车辆已上锁，开锁车接口-上锁 事件上报',
        value: 1
      },
      {
        title: '车辆已撤防',
        value: 2
      },
      {
        title: '设备登录网关服务器',
        value: 3
      },
      {
        title: '设备与网关服务器失去连接，设备掉电后5分钟触发该事件',
        value: 4
      },
      {
        title: '锁车/设防状态下移动报警',
        value: 5
      },
      {
        title: '电瓶移除报警',
        value: 6
      },
      {
        title: '电门开启通知，开锁车接口-开车事件上报',
        value: 7
      },
      {
        title: '电门关闭通知，开锁车接口-锁车事件上报',
        value: 8
      },
      {
        title: '低电量通知',
        value: 9
      },
      {
        title: '设备与网关服务器主动断开连接',
        value: 10
      },
      {
        title: '鞍座(电池仓)已开锁',
        value: 11
      },
      {
        title: '鞍座(电池仓)已上锁',
        value: 12
      },
      {
        title: '车辆已自动设防',
        value: 13
      },
      {
        title: '车辆已自动设防',
        value: 14
      },
      {
        title: '车辆已上锁，开锁车接口事件上报',
        value: 15
      },
      {
        title: '车辆已解锁，开锁车接口-开车/蓝牙-开电门命令/蓝牙-撤防命令/感应启动 事件上报',
        value: 16
      },
      {
        title: '出地理围栏通知',
        value: 17
      },
      {
        title: '入地理围栏通知',
        value: 18
      },
      {
        title: '出地理围栏通知',
        value: 19
      },
      {
        title: '入地理围栏通知',
        value: 20
      },
      {
        title: '电量剩余50%',
        value: 21
      },
      {
        title: '电量剩余30%',
        value: 22
      },
      {
        title: '电瓶恢复连接通知',
        value: 23
      }
    ]
  },
  // 日志类型
  ecuLogEventType: {
    name: 'ecu_log_event_type',
    options: [
      {
        title: '未知',
        value: ''
      },
      {
        title: '车辆Ping',
        value: 1
      },
      {
        title: '车辆GPS',
        value: 2
      },
      {
        title: '车辆上报事件',
        value: 3
      },
      {
        title: '车辆上报UART',
        value: 5
      }
    ]
  },
  // 日志类型
  ecuTibtLogEventType: {
    name: 'ecu_tibt_log_event_type',
    options: [
      {
        title: '未知',
        value: ''
      },
      {
        title: '车辆登陆',
        value: 1
      },
      {
        title: '车辆GPS',
        value: 2
      },
      {
        title: '车辆警报',
        value: 4
      },
      {
        title: '车辆Ping',
        value: 5
      },
      {
        title: '车辆下线',
        value: 0
      }      
    ]
  },
 
}
