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
// 计算时间
// type=0今天,type=1昨天,type=2一周前,type=3一个月前
const timefn = (type) => {
	var date = new Date()
	var seperator1 = "-";
	var seperator2 = ":";
	var daygetday = date.getDate()
	// var month0 = date.getMonth() + 1 - type < 10 ? "0" + (date.getMonth() + 1 - type) : date.getMonth() + 1 - type;
	var startyear = date.getFullYear()
	var month1 = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
	var strDate = daygetday < 10 ? "0" + daygetday : daygetday;
	// 上个月的天数
	var day = new Date(date.getFullYear(), date.getMonth(), 0)
	
	var time = startyear + seperator1 + month1 + seperator1 + strDate
	// 昨天
	if (type == 1) {
		var strDate0 = daygetday < 10 ? "0" + daygetday - 1 : daygetday - 1;
		var strDate1 = daygetday < 10 ? "0" + daygetday - 1 : daygetday - 1;
		var month02 = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
		// 如果是这个月1号
		if (strDate1 == '00') {
			strDate0 = day.getDate()
			strDate1 = day.getDate()
			// 月份减1
			month02 = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth();
			console.log(7777, month02)
			// 月份减一,如果是一月份年份在减一
			if (month02 == '00') {
				startyear = startyear - 1
				month02 = 12
			}
		}
		time = startyear + seperator1 + month02 + seperator1 + strDate0
	}
	
	return time
}
export {
	formatetimes,eums,parkstate,invstate,parseSelectionName,parseBitsValue,parseSwBitsObj,isInPolygon,getLonAndLat,getborderpoint,timefn
}