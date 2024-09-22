import { GameList, GameRegions } from '@/types'
import { defineMysApi, BaseMysResData } from './define'
import { ActionHeader, CookieHeader, NormalHeader, NoHeader, PassportHeader, StokenHeader } from './headers'
import { MysTool } from './MysTool'
import { MysUtil } from './MysUtil'
import lodash from 'node-karin/lodash'

export const getDeviceFp = defineMysApi<
	BaseMysResData & {
		data: {
			device_fp: string
		}
	}
>({
	urlKey: 'get-device-fp', Method: 'POST', noFp: true,
	url: (mysReq, data) => `${MysTool[mysReq.hoyolab ? 'os_public_data_api' : 'public_data_api']}device-fp/api/getFp`,
	body: (mysReq, data) => ({
		seed_id: lodash.sampleSize('0123456789abcdef', 16),
		device_id: mysReq.device_id,
		seed_time: new Date().getTime() + '',
		...(mysReq.hoyolab ? {
			platform: '5',
			ext_fields: `{"userAgent":"Mozilla/5.0 (Linux; Android 11; J9110 Build/55.2.A.4.332; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.179 Mobile Safari/537.36 miHoYoBBSOversea/2.55.0","browserScreenSize":"387904","maxTouchPoints":"5","isTouchSupported":"1","browserLanguage":"zh-CN","browserPlat":"Linux aarch64","browserTimeZone":"Asia/Shanghai","webGlRender":"Adreno (TM) 640","webGlVendor":"Qualcomm","numOfPlugins":"0","listOfPlugins":"unknown","screenRatio":"2.625","deviceMemory":"4","hardwareConcurrency":"8","cpuClass":"unknown","ifNotTrack":"unknown","ifAdBlock":"0","hasLiedLanguage":"0","hasLiedResolution":"1","hasLiedOs":"0","hasLiedBrowser":"0","canvas":"${MysUtil.getSeedId(64)}","webDriver":"0","colorDepth":"24","pixelRatio":"2.625","packageName":"unknown","packageVersion":"2.27.0","webgl":"${MysUtil.getSeedId(64)}"}`,
			app_name: mysReq.game_biz,
			device_fp: '38d7f2364db95'
		} : {
			platform: '1',
			ext_fields: `{"proxyStatus":"0","accelerometer":"-0.159515x-0.830887x-0.682495","ramCapacity":"3746","IDFV":"${mysReq.device_id}","gyroscope":"-0.191951x-0.112927x0.632637","isJailBreak":"0","model":"iPhone12,5","ramRemain":"115","chargeStatus":"1","networkType":"WIFI","vendor":"--","osVersion":"17.0.2","batteryStatus":"50","screenSize":"414×896","cpuCores":"6","appMemory":"55","romCapacity":"488153","romRemain":"157348","cpuType":"CPU_TYPE_ARM64","magnetometer":"-84.426331x-89.708435x-37.117889"}`,
			app_name: 'bbs_cn',
			device_fp: '38d7ee834d1e9'
		})
	}),
	header: CookieHeader
})

export const getLTokenBySToken = defineMysApi<
	BaseMysResData & {
		data: {
			ltoken: string
		}
	},
	{ cookie: string }
>({
	urlKey: 'getLTokenBySToken', Method: 'GET', noFp: true,
	url: (mysReq, data) => `${MysTool.pass_api}account/auth/api/getLTokenBySToken?${data.cookie}`,
	header: NoHeader
})

export const getTokenByGameToken = defineMysApi<
	BaseMysResData & {
		data: {
			token: {
				token: string
			},
			user_info: {
				aid: string
				mid: string
			}
		}
	},
	{ account_id: number, game_token: string }
>({
	urlKey: 'getTokenByGameToken', Method: 'POST', noFp: true,
	url: (mysReq, data) => `${MysTool.pass_api}account/ma-cn-session/app/getTokenByGameToken`,
	body: (mysReq, data) => ({
		account_id: data.account_id,
		game_token: data.game_token
	}),
	header: PassportHeader
})

export const getCookieBySToken = defineMysApi<
	BaseMysResData & {
		data: {
			cookie_token: string
		}
	},
	{ method: 'GET' | 'POST' }
>({
	urlKey: 'getCookieBySToken', noFp: true,
	Method: (mysReq) => (mysReq.hoyolab ? 'POST' : 'GET'),
	url: (mysReq, data) => `${MysTool[mysReq.hoyolab ? 'os_web_api' : 'web_api']}auth/api/getCookieAccountInfoBySToken?game_biz=${mysReq.game_biz}&${mysReq.mysUserInfo!.stoken}`,
	header: NoHeader
})

interface UserGameRole {
	game_biz: string
	region: string
	game_uid: string
	nickname: string
	is_chosen: boolean
}

export const getUserGameRolesByCookie = defineMysApi<
	BaseMysResData & {
		data: {
			list: UserGameRole[]
		}
	}
>({
	urlKey: 'getUserGameRolesByCookie', Method: 'GET', noFp: true,
	url: (mysReq, data) => `${MysTool[mysReq.hoyolab ? 'os_web_api' : 'web_api']}binding/api/getUserGameRolesByCookie`,
	header: CookieHeader
})

export const getUserGameRolesByStoken = defineMysApi<
	BaseMysResData & {
		data: {
			list: UserGameRole[]
		}
	}
>({
	urlKey: 'getUserGameRolesByStoken', Method: 'GET', noFp: true,
	url: (mysReq, data) => `${MysTool.new_web_api}binding/api/getUserGameRolesByStoken`,
	header: ActionHeader
})

export const getActionTicketBySToken = defineMysApi<
	BaseMysResData & {
		data: {
			ticket: string
		}
	}
>({
	urlKey: 'getActionTicketBySToken', Method: 'GET', noFp: true,
	url: (mysReq, data) => `${MysTool.new_web_api}auth/api/getActionTicketBySToken`,
	query: (mysReq, data) => `uid=${mysReq.mysUserInfo!.ltuid}&action_type=game_role`,
	header: ActionHeader
})

export const changeGameRoleByDefault = defineMysApi<
	BaseMysResData & {
		data: {
			game_biz: string
			game_uid: string
		}
	},
	{ action_ticket: string, game_biz: string, game_uid: string }
>({
	urlKey: 'changeGameRoleByDefault', Method: 'POST', noFp: true,
	url: (mysReq, data) => `${MysTool.new_web_api}binding/api/changeGameRoleByDefault`,
	body: (mysReq, data) => ({
		action_ticket: data.action_ticket,
		game_biz: data.game_biz,
		game_uid: data.game_uid
	}),
	header: ActionHeader
})

export const getUserFullInfo = defineMysApi<
	BaseMysResData & {
		data: {
			user_info: {
				uid: string
			}
		}
	}
>({
	urlKey: 'getUserFullInfo', Method: 'GET', noFp: true,
	url: (mysReq, data) => `${MysTool.new_web_api}user/wapi/getUserFullInfo?gids=2`,
	header: CookieHeader
})

export const fetchQRcode = defineMysApi<
	BaseMysResData & {
		data: {
			url: string
		}
	},
	{ device: string }
>({
	urlKey: 'fetchQRcode', Method: 'POST', noFp: true,
	url: (mysReq, data) => `${MysTool.hk4e_sdk_api}hk4e_cn/combo/panda/qrcode/fetch`,
	body: (mysReq, data) => ({
		app_id: MysTool.app_id,
		device: data.device
	}),
	header: NoHeader
})

export const queryQRcode = defineMysApi<
	BaseMysResData & {
		data: {
			stat: 'Scanned' | 'Confirmed',
			payload: {
				raw: string
			}
		}
	},
	{ device: string, ticket: string }
>({
	urlKey: 'queryQRcode', Method: 'POST', noFp: true,
	url: (mysReq, data) => `${MysTool.hk4e_sdk_api}hk4e_cn/combo/panda/qrcode/query`,
	body: (mysReq, data) => ({
		app_id: MysTool.app_id,
		device: data.device,
		ticket: data.ticket
	}),
	header: NoHeader
})

export const miyolive_index = defineMysApi<
	BaseMysResData & {
		data: {
			live: {
				title: string
				code_ver: string
				remain: number
			}
		}
	},
	{ actid: string }
>({
	urlKey: 'miyolive_index', Method: 'GET', noFp: true,
	url: (mysReq, data) => `${MysTool.web_api}event/miyolive/index`,
	header: (mysReq, options) => ({ 'x-rpc-act_id': options!.reqData!.actid })
})

export const miyolive_code = defineMysApi<
	BaseMysResData & {
		data: {
			code_list: {
				code: string,
				to_get_time: number
			}[]
		}
	},
	{ actid: string, code_ver: string }
>({
	urlKey: 'miyolive_code', Method: 'GET', noFp: true,
	url: (mysReq, data) => `${MysTool.web_api}event/miyolive/refreshCode?version=${data.code_ver}&time=${Math.floor(Date.now() / 1000)}`,
	header: (mysReq, options) => ({ 'x-rpc-act_id': options!.reqData!.actid })
})

export const miyolive_actId = defineMysApi<
	BaseMysResData & {
		data: {
			list: {
				post: {
					post?: {
						structured_content: string
					}
				}
			}[]
		}
	}
>({
	urlKey: 'miyolive_actId', Method: 'GET', noFp: true,
	url: (mysReq, data) => `${MysTool.web_api}painter/api/user_instant/list?offset=0&size=20&uid=${mysReq.uid}`,
	header: NoHeader
})

export const genAuthKey = defineMysApi<
	BaseMysResData & {
		data: {
			authkey: string
		}
	},
	{ auth_appid: 'webview_gacha' }
>({
	urlKey: 'genAuthKey', Method: 'POST', noFp: true,
	url: (mysReq, data) => `${MysTool.web_api}binding/api/genAuthKey`,
	body: (mysReq, data) => ({
		auth_appid: data.auth_appid,
		game_biz: mysReq.game_biz,
		game_uid: mysReq.uid,
		region: mysReq.server,
	}),
	header: (mysReq, options) => {
		return {
			...StokenHeader(mysReq),
			'x-rpc-client_type': '5',
			DS: mysReq.getDS1('', '', 'LK2'),
		}
	}
})

export const getGachaLog = defineMysApi<
	BaseMysResData & {
		data: {
			region: GameRegions[GameList]
		}
	},
	{ authkey: string, gacha_type: number, page: number, end_id: number }
>({
	urlKey: 'getGachaLog', Method: 'GET', noFp: true,
	url: (mysReq, data) => {
		const query = `?authkey_ver=1&lang=zh-cn&authkey=${data.authkey}&gacha_type=${data.gacha_type}&page=${data.page}&size=20&end_id=${data.end_id}&game_biz=${mysReq.game_biz}`
		if (mysReq.game === GameList.Gs) {
			return `${MysTool[mysReq.hoyolab ? 'os_hk4_api' : 'hk4e_gacha_api']}gacha_info/api/getGachaLog` + query
		} else if (mysReq.game === GameList.Sr) {
			return `${MysTool[mysReq.hoyolab ? 'os_web_api' : 'web_api']}common/gacha_record/api/getGachaLog` + query
		} else {
			return `${MysTool[mysReq.hoyolab ? 'os_nap_gacha_api' : 'nap_gacha_api']}common/gacha_record/api/getGachaLog` + query
		}
	},
	header: NoHeader
})

export const getGameRecordCard = defineMysApi<
	BaseMysResData & {
		data: {
			list: {
				game_role_id: string
				nickname: string
				region: GameRegions[GameList]
				level: number
				data: {
					name: string
					value: string
				}[]
			}[]
		}
	}
>({
	urlKey: 'getGameRecordCard', Method: 'GET', noFp: true,
	url: (mysReq, data) => `${MysTool[mysReq.hoyolab ? 'os_record_api' : 'record_api']}game_record/card/api/getGameRecordCard`,
	query: (mysReq, data) => `uid=${mysReq.mysUserInfo!.ltuid}`,
	header: NormalHeader
})