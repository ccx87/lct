let API = null,
    lianty = 'http://www.lianty.com/',
    //lianty = 'http://192.168.2.17:8082/',
    fs = 'http://fs.lianty.com:8084/';
export const domain = () => {
	try{
	    const result_data = window.getConfigRequest('[{"key":"Font_WebServer"},{"key":"lianty_WebServer"}]')
		const json_result_data = $.parseJSON(result_data)
		if( json_result_data.data ){
			API = json_result_data.data
		}
	}catch(e){
	    API = null	
	}	
}
domain();
import { isEmpty } from './UtilConstant'
module.exports = {
	DOMAIN_GO: API && API.Font_WebServer && !isEmpty(API.Font_WebServer.value) ? API.Font_WebServer.value+'/' : fs,
	DOMAIN_LIANTY: API && API.lianty_WebServer && !isEmpty(API.lianty_WebServer.value) ? API.lianty_WebServer.value+'/' : lianty,
	
	/* 登录 */
	API_GET_USER_LOGIN: 'site/login',
	API_THIRD_PARTY_LOGIN:'thirdParty/getUserByOpenId',
    API_CREATE_THIRD_PARTY_LOGIN:'thirdParty/createUserByOpenId',
    /* 注册 */
    API_REGISTER_PHONE: 'site/register',
    API_REGISTER_EMAIL: 'site/registerEmail',
    API_PHONE_VERIFICATION_CODE: 'site/sendPhoneMsg',
    API_CHECK_PHONE: 'site/checkLoginPhone',
    API_CHECK_EMAIL: 'site/checkEmail',

    /* 站内消息 */
    API_GET_NO_DEAL_MESSAGE_LIST: 'message/getNoDealMessageList',
    API_DO_DEAL: 'message/dealMessage',
    API_GET_PC_NOTICE_MESSAGE: 'message/getPcNoticeMessageList',

    /* chat */
    API_GET_YUN_CHAT_ACCID: 'userCenter/getYunChatAccid',
    API_FIND_YUN_FRIEND: 'userCenter/findYunFriend',


    /* 收藏  */
    API_UN_COLLECT_FONTS: 'upFontToFontUser',
    
	//从云端获得字体信息和预览图
	API_GET_FONTS_By_FONT_ID: 'getPreviewAndFontsByFontId', 

	//搜索云端字体 
	API_GET_SEARCH_FONTS_LIST_DATA: 'getPreviewAndFontsByName',

    //创建字体单
	API_ADD_SINGLE_FONT: 'addFontList',

	/* 获取字体单列表 */
    API_GET_SINGLE_FONTS_LIST: 'getMyFontListsByUserId',	

	//根据字体单ID获得字体列表
	API_GET_FONTS_BY_FONT_LIST_ID: 'getFontsByFontListID',

	//根据字体ID获取字体预览图
	API_GET_PREVIEW_BY_FONT_ID: 'getPreviewByFontId',
	shitu: {
		GET_SEARCH_IMG_CODE: "http://192.168.2.17:8082/largeFile/getYunFilePreviewByStId", //识图按图片搜索
		GET_SEARCH_TEXT_CODE :"http://192.168.2.17:8082/largeFile/getYunFilePreviewBySearchCode" //识图按文字搜索
	},
	file : {
	UPLOAD_YUN_SHITU :  "http://192.168.2.5:8080/gaojianyun_upload/file/uploadSTFile",	//识图上传接口
		}				
};