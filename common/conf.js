const formatetimes = (timestamp)=> {
	var date = new Date(timestamp*1000);
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
	var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
	var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':';
	var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
	return Y + M + D + h + m + s;
}
 // 日志类型 event = 3 
 const parseSelectionName = (selections, value) => {
   if (selections.length > 0) {
     if (Array.isArray(value)) {
       var names = []
       for (let index = 0; index < selections.length; index++) {
         const element = selections[index]
         if (value.indexOf(element.value) > -1) {
           names.push(element.title)
         }
       }
       return names.join('\n')
     } else {
       for (let index = 0; index < selections.length; index++) {
         const element = selections[index]
         if (element.value == value) {
           return element.title
         }
       }
     }
   }
   return '未知'
 }
 const PointInPoly=(pt, poly)=> { 
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i) 
        ((poly[i].y <= pt[1] && pt.y < poly[j][1]) || (poly[j][1] <= pt[1] && pt[1] < poly[i][1])) 
        && (pt[0] < (poly[j][0] - poly[i][0]) * (pt[1] - poly[i][1]) / (poly[j][1] - poly[i][1]) + poly[i][0]) 
        && (c = !c); 
    return c; 
} 
 const isInPolygon=(checkPoint, polygonPoints)=> {
     var counter = 0;
     var i;
     var xinters;
     var p1, p2;
     var pointCount = polygonPoints.length;
     p1 = polygonPoints[0];
  
     for (i = 1; i <= pointCount; i++) {
         p2 = polygonPoints[i % pointCount];
         if (
             checkPoint[0] > Math.min(p1[0], p2[0]) &&
             checkPoint[0] <= Math.max(p1[0], p2[0])
         ) {
             if (checkPoint[1] <= Math.max(p1[1], p2[1])) {
                 if (p1[0] != p2[0]) {
                     xinters =
                         (checkPoint[0] - p1[0]) *
                             (p2[1] - p1[1]) /
                             (p2[0] - p1[0]) +
                         p1[1];
                     if (p1[1] == p2[1] || checkPoint[1] <= xinters) {
                         counter++;
                     }
                 }
             }
         }
         p1 = p2;
     }
     if (counter % 2 == 0) {
         return false;
     } else {
         return true;
     }
}
  var mapNumberUtil = {}
  var mobilePx={}
  uni.getSystemInfo({
  	success: res => {
  		// this.gobeldata=res.statusBarHeight
  		console.log('info',res)
  			mobilePx=res
  	},
  	fail: res => {
  
  	}
  })
  const getLonAndLat =(lng,lat,brng,dist)=>{ 
	   // brng 方位角 45   ---- 正北方：000°或360°  正东方：090° 正南方：180°  正西方：270°  
	  //大地坐标系资料WGS-84 长半径a=6378137 短半径b=6356752.3142 扁率f=1/298.2572236
	  var a=6378137;
	  var b=6356752.3142;
	  var f=1/298.257223563;
	  
	  var lon1 = lng*1;
	  var lat1 = lat*1;
	  var s=''
	  if(brng==0 || brng==180){
		  s=dist*mobilePx.windowHeight/200
	  }else{
		 s=dist*mobilePx.windowWidth/200
	  }
	  var alpha1 = brng *(Math.PI /180);
	  var sinAlpha1 = Math.sin(alpha1);
	  var cosAlpha1 = Math.cos(alpha1);
	  // console.log(lon1,lat1,s,alpha1,sinAlpha1,cosAlpha1)
	  
	  var tanU1 =tanU1 = (1 - f) * Math.tan(lat1 * (Math.PI / 180));
	  var cosU1 = 1 / Math.sqrt((1 + tanU1*tanU1)), sinU1 = tanU1*cosU1;
	  var sigma1 = Math.atan2(tanU1, cosAlpha1);
	  var sinAlpha = cosU1 * sinAlpha1;
	  var cosSqAlpha = 1 - sinAlpha*sinAlpha;
	  var uSq = cosSqAlpha * (a*a - b*b) / (b*b);
	  var A = 1 + uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));
	  var B = uSq/1024 * (256+uSq*(-128+uSq*(74-47*uSq)));
	  
	  var sigma = s / (b*A), sigmaP = 2*Math.PI;
	  while (Math.abs(sigma-sigmaP) > 1e-12) {
	  var cos2SigmaM = Math.cos(2*sigma1 + sigma);
	  var sinSigma = Math.sin(sigma);
	  var cosSigma = Math.cos(sigma);
	  var deltaSigma = B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-
	  B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));
	  sigmaP = sigma;
	  sigma = s / (b*A) + deltaSigma;
	  }
	  
	  var tmp = sinU1*sinSigma - cosU1*cosSigma*cosAlpha1;
	  var lat2 = Math.atan2(sinU1*cosSigma + cosU1*sinSigma*cosAlpha1,
	  (1-f)*Math.sqrt(sinAlpha*sinAlpha + tmp*tmp));
	  var lambda = Math.atan2(sinSigma*sinAlpha1, cosU1*cosSigma - sinU1*sinSigma*cosAlpha1);
	  var C = f/16*cosSqAlpha*(4+f*(4-3*cosSqAlpha));
	  var L = lambda - (1-C) * f * sinAlpha *
	  (sigma + C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));
	  
	  var revAz = Math.atan2(sinAlpha, -tmp); // final bearing
	  var lngLatObj = { x: lon1 + L * (180 / Math.PI), y: lat2 * (180 / Math.PI) }
	  return lngLatObj;
  }
  const getborderpoint =(lng,lat,sacle)=>{
	  var brng=[0,90,180,270]
	  var point=[],points=[]
	  for(let i=0;i<brng.length;i++){
		  point.push(getLonAndLat(lng,lat,brng[i],sacle))
	  }
	  points=[[point[3].x,point[0].y],
	  [point[1].x,point[0].y],
	  [point[1].x,point[2].y],
	  [point[3].x,point[2].y]]
	  return points
  }
  // 获取gps及电量等信息
  const getcarinfodetil=(res)=>{
	  let carinfo={}
	  // 电量
	  let reg1=/\8524(.*)/
	  var gpsData=res.val.match(reg1)[0];
	  gpsData=gpsData.substring(4,50)
	  var battery_volt=gpsData.substr(26,4)
	  // 16进制转10进制
	  battery_volt=ex16hex(battery_volt)*10
	  carinfo.battery_volt=battery_volt
	  
	  // 经纬度
	  // 经度		
	  let jind=ex16hex(gpsData.substr(0,8))
	  console.log('jind1',jind)
	  jind=jind/1800000
	  // let jind1=parseInt(jind)
	  // let jind2=(parseFloat(jind)-jind1).toFixed(6)
	  // jind=jind.toString()
	  // let newjind=jind1+'°'+jind2.substring(2,4)+'.'+jind2.substring(4,8)+'’'
	  
	  // 纬度
	  let weid=ex16hex(gpsData.substr(8,8))
	  weid=weid/1800000
	  // let weid1=parseInt(weid)
	  // let weid2=(parseFloat(weid)-weid1).toFixed(6)
	  // weid=weid.toString()
	  // let newweid=weid1+'°'+weid2.substring(2,4)+'.'+weid2.substring(4,8)+'’'																		
	  var coordinate=[jind,weid]
	  carinfo.coordinate=coordinate
	  
	  // 航向
	  let course=ex16hex(gpsData.substr(16,4))
	  var flag_1 = (course >> 13) & 1; // 1=实时定位，0=历史定位
	  var flag_2 = (course >> 12) & 1; //1=定位成功，0=定位失败		
	  course = course & 0b1111111111; //航向
	  carinfo.locate_type=flag_2?'gps':'lbs'
	  carinfo.gps_flag=flag_2
	  carinfo.course=course
	  // 速度
	  // var speed=ex16hex(gpsData.substr(20,2))
	  
	  // 卫星数量
	  var satellite=ex16hex(gpsData.substr(22,2))
	  carinfo.satellite=satellite
	  
	  // gsm信号强调
	  var gsm_signal_strength=ex16hex(gpsData.substr(20,2))
	  carinfo.gsm_signal_strength=gsm_signal_strength
	  
	  // 基站信息
	  var cellid=ex16hex(gpsData.substr(30,4))
	  var lac=ex16hex(gpsData.substr(34,2))
	  var mcc=ex16hex(gpsData.substr(36,4))
	  var mnc=ex16hex(gpsData.substr(40,6))
	  carinfo.cellid=cellid
	  carinfo.lac=lac
	  carinfo.mcc=mcc
	  carinfo.mnc=mnc
	  
	  // 控制器相关
	  // 里程
	  var trip_miles=ex16hex(gpsData.substr(46,4))
	  // 速度
	  var speed=ex16hex(gpsData.substr(46,4))
	  carinfo.trip_miles=trip_miles
	  carinfo.speed=speed
	  console.log('carinfo------>',carinfo)
	  return carinfo
  }
  const getheaderinfo=(value)=>{
	  var data=ex16hex(value.val.substr(4,2))
	  // data=data.toString(2)
	  console.log('data',data)
	  // 设防
	  var is_defend_on=data & 1
	  
	  // 电门
	  var is_acc_on=(data >> 3) & 1
	  
	  // 车轮锁
	  var is_wheel_locked=''
	  
	  // 是否休眠
	  var is_sleeping1=(data >> 4) & 1
	  var is_sleeping2=(data >> 5) & 1
	  var is_sleeping=2*is_sleeping2+is_sleeping1
	  
	  
	  // 是否运动
	  var is_in_motion=(data >> 1) & 1
	  return {is_defend_on:is_defend_on,
	  is_sleeping:is_sleeping,
	  is_in_motion:is_in_motion
	  }
  }
  // 16进制转10进制
  const ex16hex=(value)=>{
	    value = stripscript(value);
	      value = value.replace("0x","");
	    var arr = value.split("");
	    arr = arr.reverse();
	    var len = arr.length;
	    var res = 0;
		arr.forEach(function(i,v){
			var num = hex_change(i);
			res += muti16(num, v);
		})
	    return res;
  }
  // 字符转16进制数字
  const hex_change = function(v){
      var res;
      switch(v){
        case "a": res = 10;break;
      case "b": res = 11;break;
      case "c": res = 12;break;
      case "d": res = 13;break;
      case "e": res = 14;break;
      case "f": res = 15;break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9": res = Number(v);break;
      default: res = 0;break;
    }
    return res;
  }
  // 过滤所有特殊字符
  const stripscript = function(s) {
      var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？↵\r\n]");
          var rs = "";
      for (var i = 0; i < s.length; i++) {
          rs = rs + s.substr(i, 1).replace(pattern, '');
      }
      return rs;
  }
  
  // 返回 v 乘以 n 个 16 的积
  const muti16 = function(v, n){
    var temp = v;
      for(var i = 0; i < n; i++){
      temp *= 16;
    }
    return temp;
  }
  const parseBitsValue = (n) => {
    var r = []
    var i = 0
    while (n > 0) {
      if (n & 0x01 === 1) {
        r.push(i)
      }
      i++
      n = n >> 1
    }
    return r
  }
  const parseSwBitsObj = (sw) => {
    let swPosition = [
      ['撤防','设防'],
      ['电门关','电门开'],
      ['后轮锁解锁','后轮锁上锁'],
      ['电池仓锁解锁','电池仓锁上锁'],
      ['电瓶断开','电瓶连接'],
      ['GPS静止','GPS运动'],
      ['车辆静止','车辆运动'],
      ['后轮静止','后轮转动'],
      ['功耗正常模式','低功耗模式'],
      ['休眠正常模式','休眠模式'],
      ['移动告警不触发语音','移动告警触发语音']
    ] 
    let obj = {
      numbers: [],
      desc: []
    }
    for (let index = 0; index < swPosition.length; index++) {
		if([2,3,5,8,9].indexOf(index)>-1){
			continue
		}
      const el = swPosition[index];
      let val = sw & (1 << index) ? 1 : 0
      obj.numbers.push(val)
      obj.desc.push(el[val])
    }
    return obj
  }
// 车辆状态
const eums = {
	BIKE_FAULT_HEALTH: 0, //健康
	BIKE_FAULT_TYPE_X_KONG_ZHI_QI: 1000, //控制器故障
	BIKE_FAULT_TYPE_X_KONG_ZHI_QI_JIN_SHUI_DUAN_LU: 1001, //控制器故障, 进水短路 
	BIKE_FAULT_TYPE_X_KONG_ZHI_QI_GONG_NENG: 1002, //控制器故障, 功能故障 
	BIKE_FAULT_TYPE_X_DIAN_JI: 1100, //电机故障,
	BIKE_FAULT_TYPE_X_DIAN_JI_XIAN_LU: 1101, //电机故障,线路故障
	BIKE_FAULT_TYPE_X_DIAN_JI_GAI_LIE: 1102, //电机故障,盖子裂了
	BIKE_FAULT_TYPE_X_DIAN_JI_GONG_NENG: 1103, //电机故障, 功能故障 
	BIKE_FAULT_TYPE_X_SHA_CHE: 1200, //刹车
	BIKE_FAULT_TYPE_X_SHA_CHE_QIAN: 1201, //刹车-前刹
	BIKE_FAULT_TYPE_X_SHA_CHE_HOU: 1202, //刹车-后刹
	BIKE_FAULT_TYPE_X_SHA_CHE_XIAN: 1203, //刹车-莎车县
	BIKE_FAULT_TYPE_X_SHA_CHE_DIAO_JIE: 1204 //刹车-不能调节
}
// 位置信息
const parkstate = {
	BIKE_PARK_STAT_FREE:0, //自由停放
	BIKE_PARK_STAT_PARK:1, //站点停放
	BIKE_PARK_STAT_NPA:11, //禁停区停放
	BIKE_PARK_STAT_OSA:21 //服务区外
}
// 库存状态
const invstate = {
	BIKE_INV_STATE_IN_MARKET:0, //投放市场
	BIKE_INV_STATE_IN_WAREHOUSE:1, //入库
	BIKE_INV_STATE_RECALL:2, //入库维修
	BIKE_INV_STATE_SCRAPED:3, //报废
	BIKE_INV_STATE_DEPOT_REPAIRED:4 //返厂维修
}
export {
	formatetimes,eums,parkstate,invstate,parseSelectionName,parseBitsValue,parseSwBitsObj,
	isInPolygon,getLonAndLat,getborderpoint,getcarinfodetil,ex16hex,getheaderinfo
}