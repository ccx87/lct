import { log } from '../constants/UtilConstant'
module.exports = {
	handleAjax: function(url, param, type) {
		return $.ajax(url, param, type).then(function(resp){
			// 成功回调
			log("ajax成功回调")
			log(resp)
			if(resp){
				return resp;
			}else{
				return $.Deferred().reject("返回成功但数据为空");
			}
		}, function(err){
			// 失败回调
		    log(err.status);
		});
	}		
};