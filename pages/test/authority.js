[{
		name: '换电',
		url: '/pages/map/map?onlyid=0',
		text: '全部待换电',
		src: '../../../static/image/huan_dian.png',
		children: []
	},
	{
		name: '维修',
		url: '/pages/repairlist/repairlist?onlyid=1',
		text: '全部故障车辆',
		src: '../../../static/image/wei_xiu.png',
		children: [{
				name: '维修入库',
				val: '',
				url: '/pages/map/map?text=全部故障车辆&&type=1.1&&name=维修&&onlyid=1.0',
			},
			{
				name: '修车',
				// url: '/pages/map/map?text=全部故障车辆&type=1.3&name=维修',
				val: '',
				url: '/pages/repairPage/repairenter/repairenter?onlyid=1.1',
			},
		]
	},
	{
		name: '保养',
		url: '/pages/repairlist/repairlist?onlyid=2',
		text: '待保养车辆',
		src: '../../../static/image/bao_yang.png',
		children: [{
				name: '常规保养',
				val: '',
				url: '',
			},
			{
				name: '异常保养',
				val: '',
				url: '',
			}
		]
	},
	{
		name: '单个挪车',
		url: '/pages/repairlist/repairlist?onlyid=3',
		text: '全部车站',
		src: '../../../static/image/nuo_che.png',
		children: [{
				name: '车站挪车',
				val: '',
				url: '/pages/map/map?text=全部车站&&type=3.1&&name=挪车&&onlyid=3.0',
			},
			{
				name: '挪车记录',
				val: '',
				url: '/pages/movecarPage/removecarrecord/removecarrecord?onlyid=3.1',
			}
		]
	},
	{
		name: 'ECU换绑',
		url: '/pages/map/map?onlyid=4',
		text: '',
		src: '../../../static/image/ecu_huanban.png',
		children:[]
	},
	{
		name: 'ECU绑定',
		url: '/pages/map/map?onlyid=5',
		text: '',
		src: '../../../static/image/ban_ding.png',
		children:[]
	},
	{
		name: '找不到车',
		url: '/pages/map/map?onlyid=6',
		text: '',
		src: '../../../static/image/zhao_budao.png',
		children:[]
	},
	{
		name: '批量开关锁',
		url: '/pages/map/map?onlyid=7',
		text: '',
		src: '../../../static/image/kai_guan.png',
		children:[]
	},
	{
		name: '库存管理',
		url: '/pages/repairlist/repairlist?onlyid=8',
		text: '',
		src: '../../../static/image/ku_cun.png',
		children: [{
				name: '手动输入',
				val: '',
				url: '/pages/manualscan/manualscan?urls=/pages/stockPage/stockmanage/stockmanage&&type=8&&onlyid=8.0',
			},
			{
				name: '扫码输入',
				val: '',
				url: '/pages/movecarPage/removecarrecord/removecarrecord?onlyid=8.1',
			}
		]
	},
	{
		name: '车站',
		url: '/pages/map/map?onlyid=9',
		text: '全部车站',
		src: '../../../static/image/che_zhan.png',
		children:[]
	},
	{
		name: '违章',
		url: '/pages/map/map?onlyid=10',
		text: '',
		src: '../../../static/image/wei_zhang.png',
		children: [{
				name: '违章骑行',
				val: '',
				url:'',
			},
			{
				name: '举报',
				val: '',
				url: '/pages/violations/reportViolations/reportViolations?onlyid=10.1',
			},
			{
				name: '处理',
				val: '',
				url: '/pages/violations/reportViolationsList/reportViolationsList&&onlyid=10.2',
			}
		]
	},
	{
		name: '车辆排查',
		url: '/pages/map/map?onlyid=11',
		text: '',
		src: '../../../static/image/pai_cha.png',
	},
	{
		name: '车辆换绑',
		url: '/pages/map/map?onlyid=12',
		text: '',
		src: '../../../static/image/huan_ban.png',
	},
]
