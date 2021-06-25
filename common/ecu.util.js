import { moment, parseSelectionName, parseBitsValue, parseSwBitsObj,formatetimes} from '@/common/conf.js'
import config from '@/common/eculog.js'
export default {
    // 解析日志SW
    parseLogBySw (sw) {
        let obj = parseSwBitsObj(sw)
        return '[' + obj.numbers.join('') + '] ' + obj.desc.join(',')
    },
    // 解析日志Event
    parseLogByNotify (notify) {
        var names = parseSelectionName(config.ecuLogNotifyType.options, notify)
        return names
    },
    // 解析ECU的品牌
    parseEcuBrand(bodyParams) {
      if (!!bodyParams.imei) {
        return '小安'
      } else {
        return '泰比特'
      }
    },
    // 获取可用字段
    filterLogBody(bodyParams, fields) {
      let data = {}
      for (const key in bodyParams) {
        if (fields.indexOf(key) === -1) {
          data[key] = bodyParams[key]
        }
      }
      return data
    },
    // 解析ECU的Body
    parseBody(body) {
        var param = {
            tm: '', body: '',
            imei: '', event: '',
            event_name: '', desc: ''
        }
        param.body = body
        if (!body) {
            return param
        }
        var bodyParams = JSON.parse(body)
        param.ecu_brand = this.parseEcuBrand(bodyParams)
        if (bodyParams) {
          // 区分ECU品牌
          if (!!bodyParams.imei) {
            param.imei = bodyParams.imei
            if (bodyParams.tm) {
              // param.tm = moment(bodyParams.tm * 1000).format('YYYY-MM-DD HH:mm:ss')
              param.tm = formatetimes(bodyParams.tm)
            }
            if (bodyParams.event) {
                param.event = bodyParams.event
                param.event_name = parseSelectionName(config.ecuLogEventType.options, bodyParams.event)
              switch (bodyParams.event) {
                case 2:
                    if (!!bodyParams.data && !!bodyParams.data.sw) {
                        param.desc = this.parseLogBySw(bodyParams.data.sw)
                    }
                    break
                case 3:
                  if (bodyParams.data) {
                    param.desc = this.parseLogByNotify(bodyParams.data)
                  }
                  break
                default:
                    param.desc = bodyParams.data
                    break
              }
            } else {
              param.event = 'Unfind(' + bodyParams.event + ')'
            }
          } else {
            param.imei = bodyParams.ecu_sn
            if (bodyParams.timestamp) {
              // param.tm = moment(bodyParams.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
              param.tm = formatetimes(bodyParams.timestamp)
            }
            if (bodyParams.type) {
              let fields = ['battery_volt', 'ecu_sn', 'timestamp', 'type']
              param.event = bodyParams.type
              param.event_name = parseSelectionName(config.ecuTibtLogEventType.options, bodyParams.type)
              switch (bodyParams.type) {
                case 5:
                    param.desc = JSON.stringify(this.filterLogBody(bodyParams, fields))
                    break
                case 4:
                    param.desc = JSON.stringify(this.filterLogBody(bodyParams, fields))
                    break
                case 2:
                    let descparams = {
                      gps: '',
                      hallspeed: 0,
                      lbs: ''
                    }
                    if (bodyParams.gps) {
                      descparams.gps = bodyParams.gps
                    }
                    if (bodyParams.hallspeed) {
                      descparams.hallspeed = bodyParams.hallspeed
                    }
                    if (bodyParams.lbs) {
                      descparams.lbs = bodyParams.lbs
                    }
                    param.desc = JSON.stringify(descparams)
                  break
                case 1:
                    param.desc = JSON.stringify(this.filterLogBody(bodyParams, fields))
                    break
                case 0:
                    param.desc = JSON.stringify(this.filterLogBody(bodyParams, fields))
                    break
                default:
                    param.desc = bodyParams.data
                    break
              }
            } else {
              param.event = 'Unfind(' + bodyParams.type + ')'
            }
          }
        } else {
            param.event = 'UnKnow'
        }
        return param
    }
}