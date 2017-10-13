import { FONT_STATE, GET_FONT_STATE, GET_REGEX_MATCH, DRIVE_STATE, GET_DRIVE_STATE } from './DataConstant'
import { JSTR, FSTR } from './TextConstant'
import { SHOW_DIALOG_ALERT } from './TodoFilters'

module.exports = {
	log: function(log, isPrint){
        var print = true;
        if( print ){
        	if( isPrint == null ){
        		console.log(log)
        	}else if( isPrint ){
        		console.log(log)
        	}
        }  
	},
	dimensions: function(){
	    var winWidth = 0,
	        winHeight = 0;  
	    if (window.innerWidth){
	    	winWidth = window.innerWidth;
	    }else if ((document.body) && (document.body.clientWidth)){
	    	 winWidth = document.body.clientWidth;
	    }	          	
	    if (window.innerHeight){
	    	winHeight = window.innerHeight;
	    }else if ((document.body) && (document.body.clientHeight)){
	    	winHeight = document.body.clientHeight;
	    }
	    if (document.documentElement  && document.documentElement.clientHeight && document.documentElement.clientWidth){
	    	winHeight = document.documentElement.clientHeight;
	    	winWidth = document.documentElement.clientWidth;
	    }
	    return {w: winWidth, h: winHeight};		
	},
	sleepFn: function(numberMillis) { 
		var now = new Date(); 
		var exitTime = now.getTime() + numberMillis; 
		while (true) { 
			now = new Date(); 
			if ( now.getTime() > exitTime ) 
			return; 
		} 
	},	
	//下拉加载初始化
	getmCustomScrollbar: function($element, _this, option){
		if( $element.length > 0 ){
			if( _this && option == null ){
				$element.mCustomScrollbar({
					theme:"dark-3",
					scrollInertia:550,
				  	callbacks:{
				    	onTotalScrollOffset: 50,
				    	onTotalScroll:function(res){
				    		module.exports.log("触发下拉加载机制--->") 
				    		module.exports.log(!_this.state.loading)
				    		module.exports.log(_this.state.showLoad)
				    		if( !_this.state.loading && _this.state.showLoad ){
				    			module.exports.log("下拉加载开始--->")
		                    	_this.getFontListData()
		               		}
				        }
					}			
				})
			}else{
				$element.mCustomScrollbar({
					theme:"dark-3",
					scrollInertia:550			
				})				
			}
			if( option ){
				module.exports.log("调整滚动条")
				$element.mCustomScrollbar(option)
			}
		}		
	},
	//滚动条初始化
	getmCustomScrollbar2: function($element, option){
		if( $element.length > 0 && option ){
		    module.exports.log("调整滚动条2")
			$element.mCustomScrollbar(option)
		}		
	},	
	// 滚动条滚动事件
	getmCustomScrollbar4 : function($element,scrollByTopFn,option){
		if( $element.length > 0 ){
			$element.mCustomScrollbar({
				theme:"dark-3",
				scrollInertia:550,
				callbacks:{
					onScroll:function(){
						if(scrollByTopFn){
							scrollByTopFn()
						}
					}
				}
			})	
			if( option ){
				module.exports.log("调整滚动条")
				$element.mCustomScrollbar(option)
			}
		}
	},
	//下拉加载初始化2
	isloading: true,
	timer: null,
	body: document.body,
	getmCustomScrollbar3: function($element, _thisFn, offset){
		if( $element.length > 0 ){
			$element.mCustomScrollbar({
				theme:"dark-3",
				timeout: 100,
				moveDragger: true,
				scrollEasing:"easeOut",
				scrollInertia: 300,
			  	callbacks:{
			    	onTotalScrollOffset: offset ? offset : 100,
					onScrollStart:function(){
					    //console.log("在滚动开始时调用的函数");
					},	
				    whileScrolling:function(){
				        //console.log("在滚动时调用的函数处于活动状态");
				        //clearTimeout(module.exports.timer)
				        //module.exports.body.classList.add('disable-hover')
                        //module.exports.timer = setTimeout(() => {
                        //   module.exports.body.classList.remove('disable-hover')
                        //},500)
				    },					
				    onScroll:function(){
				        //console.log("滚动完成时调用的函数");
				        //module.exports.body.classList.remove('disable-hover')
				    },							    	
				    onBeforeUpdate:function(){
				        //console.log("在滚动条之前调用的函数被更新。");
				    },								    	
			    	onSelectorChange:function(){
                        //console.log("每次添加，删除或更改其大小和滚动条类型的元素时调用的函数都会更新")
			    	},
			    	onImageLoad:function(){
                        //console.log('每当元素中的图像被完全加载时调用的函数，以及滚动条被更新')
			    	},
					onUpdate:function(){
      					//console.log("更新滚动条时调用的函数。");
    				},			    	
			    	onTotalScroll:function(res){
			    		module.exports.log("触发下拉加载机制, 还未请求数据--->")
			    		if( module.exports.isloading ){
			    			module.exports.isloading = false
				    		setTimeout(() => {
	                           module.exports.isloading = true 
				    		},500)
				    		if( _thisFn && _thisFn.constructor == Function ){ 
				    			_thisFn()
				    		}
			    		}
			        }
				}			
			})
		}		
	},
	//下拉加载初始化
	getmCustomScrollbar5: function($element, post, option){
		if( $element.length > 0 ){
			if( post && option == null ){
				module.exports.log("实例化滚动条带下拉加载5")
				$element.mCustomScrollbar({
					theme:"dark-3",
					scrollInertia:550,
				  	callbacks:{
				    	onTotalScrollOffset: 50,
				    	onTotalScroll:function(res){
				    		module.exports.log("触发下拉加载机制--->") 
				    		module.exports.log(post.completeAt)
				    		if( post.completeAt ){
				    			post.completeAt = false;
				    			module.exports.log("下拉加载开始--->")
		                    	post._scllorFn()
		               		}
				        }
					}			
				})
			}else{
				module.exports.log("实例化滚动条5")
				$element.mCustomScrollbar({
					theme:"dark-3",
					scrollInertia:550			
				})				
			}
		}		
	},					
	//节流
	throttle: function(fn, delay){
	    var timer = null;
	    return function(){
	        var context = this, args = arguments ? arguments : [fn, delay];
	        clearTimeout(timer);
	        timer = setTimeout(function(){
	            fn.apply(context,args);
	        },delay);
	    };
	},
	//原生hasClass
	hasClass: function(ele,cls) { 
		if( !module.exports.isEmpty(ele) ){
			return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
		}
	}, 
	//原生addClass
	addClass: function(ele,cls) { 
		if( !module.exports.isEmpty(ele) ){
			if (!module.exports.hasClass(ele,cls)) ele.className += " "+cls; 
		}
	},
	//原生removeClass
	removeClass: function (ele,cls) {
	    if( !module.exports.isEmpty(ele) ){ 
			if (module.exports.hasClass(ele,cls)) { 
				var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)'); 
				ele.className=ele.className.replace(reg,' '); 
			} 
		}
	}, 
	//原生仿jq方法toggleClass
	toggleClass: function(ele,cls){
        if( module.exports.hasClass(ele,cls) ){
        	module.exports.removeClass(ele,cls)
        }else{
        	module.exports.addClass(ele,cls)
        }
	},	
	spliceArray: function(array, temp, howmany){
		if(typeof(temp) == 'number'){
			array.splice(temp, howmany);
		}else if(typeof(temp) == 'string'){
			for(var i = 0, len = array.length; i < len; i++){
				if(array[i].text == temp){
					array.splice(i, howmany);
					break;
				}
			}
		}
		return array
	},
	addHueArray: function(array, strArray){
		var newArray = [];
		for(var j = 0, lens = strArray.length; j < lens; j++){
			for(var i = 0, len = array.length; i < len; i++){
				if(array[i].value == strArray[j].value){
                    array[i]['num'] = strArray[j].num;
					newArray.push(array[i]);
					break;
				}
			}
		}
		return newArray;
	},
	addArray: function(array, strArray){
		var newArray = [];
		for(var j = 0, lens = strArray.length; j < lens; j++){
			for(var i = 0, len = array.length; i < len; i++){
				if(array[i].value == strArray[j]){
					newArray.push(array[i]);
					break;
				}
			}
		}
		return newArray;		
	},
	addArrayObj: function(arrayObj, strArray){
		var newArray = [];
		for(var i = 0, len = arrayObj.length; i < len; i++){
			var instArray = [];
			for( var j = 0, lens = strArray.length; j < lens; j++ ){
				if( module.exports.isEmpty(arrayObj[i].data) ){
	                if( arrayObj[i].value === strArray[j] ){
                        newArray.push(arrayObj[i])
                        break;
	                }  
				}else{
					if( arrayObj[i].data.length == 0 ){
						break;
					}
					for( var h = 0, lenss = arrayObj[i].data.length; h < lenss; h++ ){
						if( arrayObj[i].data[h].value === strArray[j] ){
							instArray.push(arrayObj[i].data[h])
							break;
						}
					}
				}				
			}
			if( instArray.length > 0 ){
				arrayObj[i]["data"] = instArray
				newArray.push(arrayObj[i])
			}
		}	
		return newArray;        
	},
	returnFontState: function(state, falg){
		if(state & falg){
			return true
		}
		return false
	},
	/**
	 * 获取文件大小 一
	 * @param  {Int} bitSize 文件大小
	 * @param  {Int} decimal 小数点后位数
	 * @return {String}         文件大小字符串
	 */
	getFileSize : function(bitSize, decimal) {
		var negative = false;
		if(bitSize < 0) {
			bitSize = Math.abs(bitSize);
			negative = true;
		}

		var kbSize = Math.ceil(bitSize/1024);
		if(kbSize < 1024) {
			return negative ? "-"+kbSize + "KB" : kbSize + "KB";
		}
		var mbSize = parseFloat(kbSize/1024);
		if(mbSize < 1024) {
			return negative ? "-"+mbSize.toFixed(decimal) + "MB" : mbSize.toFixed(decimal) + "MB";
		}
		var gbSize = parseFloat(mbSize/1024);
		return negative ? "-"+gbSize.toFixed(decimal)+"GB" : gbSize.toFixed(decimal)+"GB";
	},
	/**
	 * 获取文件大小 二
	 */	
    formatSize: function( size, pointLength, units ) {
        var unit;

        units = units || [ 'B', 'KB', 'M', 'G', 'TB' ];

        while ( (unit = units.shift()) && size > 1024 ) {
            size = size / 1024;
        }

        return (size.toFixed( pointLength || 2 )) + unit;
    },	
	/**
	 * 判断字符串是否不存在或为空
	 * @param  {String}  value 字符串
	 * @return {Boolean}       true 为空 false 不为空
	 */
	isEmpty : function(value) {
		if( value === null || value === "" || value === "null" ||  typeof(value) == "undefined" ){
			return true;
		}			
		return false;
	},
	/**
	 * 手机、邮箱、密码、大于0的整数----正则表达式
	 * @param  {String} or {number}
	 * @return {Boolean}
	 */	
	regexStr: function(value, str) {
		switch(str){
			case GET_REGEX_MATCH.only_letter:
			   return !!value.match(/^[a-zA-Z]{1}$/)

			case GET_REGEX_MATCH.mobile: 
			   return !!value.match(/^(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)

			case GET_REGEX_MATCH.email:
			   return !!value.match(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,})+$/)

			case GET_REGEX_MATCH.password_six:
			   return !!value.match(/^[\w]{6,16}$/)
            
            case GET_REGEX_MATCH.integer_greater_0:
               return !!value.match(/^\+?[1-9]\d*$/)
               
            case GET_REGEX_MATCH.is_image:
               //基本判断一下，如有更好的选择就修改掉。
               return /\.(png|PNG|jpe?g|JPE?G|gif|GIF)$/.test(value)

            case GET_REGEX_MATCH.last_suffix:
               return !!value.match(/\.(\w+)$/)

			default:
			   return false             
		}
	},	
	/**
	 * 获取地址栏参数 调用：GetQueryString('参数名')
	 * @param  {String}  value 字符串
	 * @return {String}  value 字符串   
	 */
	getQueryString: function(name){
	    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	    var r = window.location.search.substr(1).match(reg);
	    if(r!=null)return  unescape(r[2]); return null;
	},
	/**
	 * 时间
	 * @param {seconds} 毫秒数, {type} 类型:如yy-MM-dd hh:mm:ss 
	 * 
	 */		
	getTime: function(seconds, type, placeholder) {
        var date = new Date(seconds),
            time = {};
		Date.prototype.toUtilLocaleString = function() {
			var M = (this.getMonth() + 1),
			    d = this.getDate(),
			    h = this.getHours(),
			    m = this.getMinutes(),
			    s = this.getSeconds();
			if( placeholder == null || placeholder ){    
				if( (this.getMonth() + 1) < 10 ){
	                M = '0'+ M  
				}			
				if( this.getDate() < 10 ){
	                d = '0'+ d   
				}			
				if( this.getHours() < 10 ){
	                h = '0'+ h   
				}					
			}
			if( this.getMinutes() < 10 ){
                m = '0'+ m   
			}					
			if( this.getSeconds() < 10 ){
                s = '0'+ s   
			}			
      		return {yy: this.getFullYear(), MM: M, dd: d, hh: h, mm: m, ss: s};
		};  
		time = date.toUtilLocaleString();      
        switch(type){
        	case 'yy-MM-dd':
        	    return time.yy +"-"+ time.MM +"-"+ time.dd
        	case 'MM-dd':
        	    return time.MM +"-"+ time.dd    
    		case 'hh:mm:ss':
	          	return time.hh +":"+ time.mm +":"+ time.ss
	    	case 'hh:mm':
	    	    return time.hh +":"+ time.mm
	    	case 'yy-MM-dd hh:mm:ss':
	    	    return time.yy +"-"+ time.MM +"-"+ time.dd +"  "+ time.hh +":"+ time.mm +":"+ time.ss  		    	
	    	default:
	    	    return time.yy +"年"+ time.MM +"月"+ time.dd +"日 "+ time.hh +"点"+ time.mm +"分"+ time.ss +"秒"
        }
        
	},
	/**
	 * 日期比较大小
	 * 返回 boolean
	 * 
	 */			
    dateBooleanDiff: function(d1, d2){    
	    var start_at = new Date(d1.replace(/^(\d{4})(\d{2})(\d{2})$/,"$1/$2/$3")),
	    	end_at = new Date(d2.replace(/^(\d{4})(\d{2})(\d{2})$/,"$1/$2/$3"));
	    if(start_at > end_at) {
	      return false;
	    }
	    return true;
	},
	/**
	 * 日期比较大小
	 * 返回 毫秒数
	 * 
	 */			
    dateMinDiff: function(d1, d2){    
	    var start_at = new Date(d1.replace(/^(\d{4})(\d{2})(\d{2})$/,"$1/$2/$3")),
	    	end_at = new Date(d2.replace(/^(\d{4})(\d{2})(\d{2})$/,"$1/$2/$3"));
	    return start_at - end_at
	},
	/**
	 * 获取具体时间段
	 * 返回 字符串
	 * 
	 */			
    getStringData: function(d1, d2){    
	    const nowArray = d1.split('-'),
	          lastArray = d2.split('-');
	    let s_time;      
	    if( nowArray[0] == lastArray[0] && nowArray[1] == lastArray[1] ) {
	        const nowd = parseInt(nowArray[2]),
	              lastd = parseInt(lastArray[2]);
	        if( nowd - lastd == 1 ){
	        	s_time = '昨天'
	        } else if ( nowd - lastd == 2 ){
	            s_time = '前天'
	        } else {
                s_time = parseInt(lastArray[1])+"-"+lastd
	        }     
	    }else{
	    	s_time = parseInt(lastArray[1])+"-"+lastd
	    }
	    return s_time 
	},
	/**
	 *
	 * 获取时间相差的天数
	 */
    getTimeDiff: function(date) {
	    return (new Date().getTime() - date.getTime())/(24 * 60 * 60 * 1000); 
    },
	/**
	 * 获取原生css样式值
	 */
	getCss: function(o, key){
		return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o,false)[key]; 	
	},			
	/**
	 * 拖拽（弹出窗整个区块或某个区块拖动）
	 * 
	 */	
	dragDrop: function(bar, target, callback) {
		var params = {
			left: 0,
			top: 0,
			currentX: 0,
			currentY: 0,
			flag: false
		};
		//获取相关CSS属性
		var getCss = function(o,key){
			return o.currentStyle? o.currentStyle[key] : document.defaultView.getComputedStyle(o,false)[key]; 	
		};
		//o是移动对象
		bar.onmousedown = function(event){
			params.flag = true;
			if(!event){
				event = window.event;
				//防止IE文字选中
				bar.onselectstart = function(){
					return false;
				};  
			};
			//获取当前对象的left和top值。
			if(getCss(target, "left") !== "auto"){
				params.left = getCss(target, "left");
			}
			if(getCss(target, "top") !== "auto"){
				params.top = getCss(target, "top");
			}			
			var e = event || window.event;
			params.currentX = e.clientX;
			params.currentY = e.clientY;
		};
		document.onmouseup = function(){
			params.flag = false;
		};
		document.onmousemove = function(event){
			var e = event || window.event;
			if(params.flag){
				var nowX = e.clientX, nowY = e.clientY;
				var disX = nowX - params.currentX, disY = nowY - params.currentY;
				if( params.left.indexOf('calc') > -1 ){
					params.left = getCss(target, "left");
				}
				if( params.top.indexOf('calc') > -1 ){
					params.top = getCss(target, "top");
				}								
				target.style.left = parseInt(params.left) + disX + "px";
				target.style.top = parseInt(params.top) + disY + "px";
			}
			if (typeof callback == "function") {
				callback(parseInt(params.left) + disX, parseInt(params.top) + disY);
			}
		};	
	},
	/**
	 * 拖拽（以界点左右或上下拖动）
	 * 
	 */	
	dragLineDrop: function(bar, target, point, dir, $elem, $scroll) {
		var params = {
			left: 0,
			top: 0,
			currentX: 0,
			currentY: 0,
			flag: false,
			downW: 0,
			downH: 0,
			vu_l: 0,
			page: 0,
			maxPoint: 0,
			_resize: 'w-resize'
		};
		//获取相关CSS属性
		var getCss = function(o,key){
			return o.currentStyle? o.currentStyle[key] : document.defaultView.getComputedStyle(o,false)[key]; 	
		};
		//拖拽的实现
		if(getCss(target, "left") !== "auto"){
			params.left = getCss(target, "left");
		}
		if(getCss(target, "top") !== "auto"){
			params.top = getCss(target, "top");
		}
		var up = function(){
			document.onmouseup = function(){
				bar.style.cursor = params._resize;
				params.flag = false;
				if( $scroll ){
					module.exports.getmCustomScrollbar($scroll, null, 'update')
				}					
			};
		}
		var move = function(){
			document.onmousemove = function(event){
				var e = event || window.event;
				if(params.flag){
					var nowX = e.clientX,
					    disX = nowX - params.currentX,
					    nowY = e.clientY,
					    disY = nowY - params.currentY;
                    bar.style.cursor = params._resize;
					let moveS = 0;
					if( dir == "left" ){
						moveS = params.downW - disX;
					}else if( dir == 'right' ){
						moveS = params.downW + disX; 
					}else if( dir == 'top' ){
                        moveS = params.downH - disY;
					}else if( dir == 'bottom' ){
						moveS = params.downH + disY;
					}
					if( moveS > point && moveS - 10 <= point  ){
                        moveS = point
					}
					if( moveS < params.maxPoint && moveS + 10 >= params.maxPoint ){
						moveS = params.maxPoint
					}
					if( moveS >= point && moveS <= params.maxPoint ){
						if( $elem ){
							if( $elem.hasClass('menu-item') ){	
								$elem.css("width", moveS - 10)
							}else{
								$elem.css("width", moveS)
							}
						}
						if( dir == 'right' ){
							const bc_f_elem = $('.bottom-content .bc-first');
							if( bc_f_elem.length > 0 ){
								bc_f_elem.css("width", moveS)
							}
						}
						if( dir == 'left' || dir == 'right' ){
							target.style.width =  moveS +"px";
							const vu_elem = $(target).find('.velocity_ul_img');
							if( vu_elem.length > 0 ){
								let new_l = 0,
								    li_w = vu_elem.find('li').eq(0).width();
								if( params.vu_l != 0 ){
									new_l = -(params.page * li_w)
								}
	                            vu_elem.css('left', new_l); 
	                            vu_elem.find('li').css('width', moveS);
	                            vu_elem.find('li img').css('max-width', moveS);
                            }  							
						}else{
							target.style.height =  moveS +"px";
							target.style.minHeight =  moveS +"px";
							target.style.maxHeight =  moveS +"px";
							const vu_elem = $(target).find('.velocity_ul_img');
							if( vu_elem.length > 0 ){
                                vu_elem.find('li').css('height', moveS-45);
                                vu_elem.find('li img').css('max-height', moveS-45);
							}
						}					
					}
				}
			};
			module.exports.throttle(up(),200);
		}
		//bar是移动对象
		bar.onmousedown = function(event){
			params.flag = true;
			if(!event){
				event = window.event;
				//防止IE文字选中
				bar.onselectstart = function(){
					return false;
				};  
			};
			var e = event;
			if( dir == 'left' || dir == 'right'){
				params._resize = "w-resize";
				params.downW = target.clientWidth;
				params.currentX = e.clientX;
				const vu_elem = $(target).find('.velocity_ul_img'),
				      inputDom = $('.previmg-content .db').find('input.page');
				if( vu_elem.length > 0 ){
					params.vu_l = parseInt(vu_elem.css('left'));
					if( inputDom.length > 0 ){
						params.page = parseInt(inputDom.val())-1;
					}
				}
			}else{
				params._resize = "n-resize";
				params.downH = target.clientHeight;
				params.currentY = e.clientY;
			}
			var wh = module.exports.dimensions();
			params.maxPoint = parseInt(wh.w/2.8);
			if( !(params.maxPoint > 0) ){
				params.maxPoint = point*2;
			}
			bar.style.cursor = params._resize;
            module.exports.throttle(move(),200);
		};	
	},		
	/**
	 * 滑块（以界点左右拖动）
	 * 
	 */	
	dragSilderDrop: function(_this, bar, target, point, dir, element, speed) {
		var params = {
			left: 0,
			top: 0,
			currentX: 0,
			currentY: 0,
			flag: false,
			downW: 0,
			downH: 0,
			elemW: 0,
			icon_btn: null,
			speed: speed ? speed : 1
		};
		//获取相关CSS属性
		var getCss = function(o,key){
			return o.currentStyle? o.currentStyle[key] : document.defaultView.getComputedStyle(o,false)[key]; 	
		};
		//拖拽的实现
		if(getCss(target, "left") !== "auto"){
			params.left = getCss(target, "left");
		}
		if(getCss(target, "top") !== "auto"){
			params.top = getCss(target, "top");
		}
		var up = function(){
			document.onmouseup = function(){
				params.flag = false;
				if( _this ){
					_this.isDataFullPage()
				}					
			};
		}	
		//const _h = moveS + 16 ==> 展开为 const _h = moveS - 14 + 28
		//14为point,14px为左临界点。28为$li_Elem的原始高度，不计算border宽度
		//moveS >= point && moveS <= params.elemW ==> point为左临界点，params.elemW为右临界点
		//target.nextSibling.style.width = (moveS -1) +"px"; 这里减1是为了隐藏右侧1px边框
		var move = function(){
			document.onmousemove = function(event){
				var e = event || window.event;
				if(params.flag){
					var nowX = e.clientX,
					    disX = nowX - params.currentX,
					    nowY = e.clientY,
					    disY = nowY - params.currentY;   
					let moveS = 0;
					if( dir == "left" ){
						moveS = params.downW - disX
					}else if( dir == 'right' ){
						moveS = params.downW + disX
					}else if( dir == 'top' ){
                        moveS = params.downH - disY
					}else if( dir == 'bottom' ){
						moveS = params.downH + disY
					}
					if( moveS < 0 ) moveS = 0;
					if( moveS > params.elemW ) moveS = params.elemW;
					target.style.width = moveS +"px"
					target.nextSibling.style.width = (moveS-2) +"px"
					if( moveS >= 0 && moveS <= params.elemW ){
						const $elem = $('.file-list-table').find('.file-item'),
						      tarW = target.clientWidth;     
                        let _h = 0,
                            _imgh = 0,     
                            _size = (moveS - point) * speed;
                        if( _size < 0 ){ _size = 0 }
						if( $('#show_list_mode').length > 0 ){							
							_h = _size + 28; //28是li的最小高度，不计算border	
							_imgh = _size + 20; //20是图片的最小高度					
							$elem.css('height', _h)
						}else{						
							_h = _size + 80; //81是a的最小高度
							_imgh = _size + 36;
							$elem.css({"height": _h, "width": _h})							
						}
						if( $elem.length > 0 ){
							$elem.find('img').css({'max-width': _imgh, 'max-height': _imgh})
						}
                       if( moveS == 0 ){
                            params.icon_btn.css('right',-16)
                            $('.size-less-bg').addClass('most-left-less')
                            $('.size-plus-bg').removeClass('most-right-plus') 
                            target.nextSibling.style.width = "0px";                  		
                    	}else if( moveS == params.elemW ){
							params.icon_btn.css('right',-4)
							$('.size-plus-bg').addClass('most-right-plus')
							$('.size-less-bg').removeClass('most-left-less')
							target.nextSibling.style.width = "130px";                     		
                    	}else{
                        	//params.icon_btn.css('right',-8)	
	                        $('.size-less-bg').removeClass('most-left-less')
	                        $('.size-plus-bg').removeClass('most-right-plus')                     		
                    	}
					}
				}
			};
			module.exports.throttle(up(),200);
		}
		//bar是移动对象
		bar.onmousedown = function(event){
			params.flag = true;
			if(!event){
				event = window.event;
				//防止IE文字选中
				bar.onselectstart = function(){
					return false;
				};  
			};
			var e = event;
			params.icon_btn = $(target).find('.size-silder-bg');
			params.downW = target.clientWidth;
			params.downH = target.clientHeight;
			params.currentX = e.clientX;
			params.currentY = e.clientY;
			params.elemW = element.clientWidth;//获取当前滑块的最大宽度
            module.exports.throttle(move(),200);
		};		
	},
	/**
	 * 拉区域---多选
	 * 
	 */	
	pullArea: function(bar, elem, _this) {
		var params = {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			currentX: 0,
			currentY: 0,
			flag: false,
			dom: null
		};
		var up = function(){
			document.onmouseup = function(){
				params.flag = false;
				if( elem ){
				    $(elem).css({'top': 'initial', 'right': 'initial', 'bottom': 'initial', 'left': 'initial', 'width': 0, 'height': 0})
				}									
			};
		}	
		var move = function(){
			document.onmousemove = function(event){
				var e = event || window.event;
				if(params.flag){
					var nowX = e.clientX,
					    disX = nowX - params.currentX,
					    nowY = e.clientY,
					    disY = nowY - params.currentY;
					if( (disX < 5 && disX > -5) || (disY < 5 && disY > -5) ){
                        module.exports.throttle(up(),200);
                        return false;
					}          
					if( elem ){
						if( disX < 0 && disY < 0 ){
							//右下
							$(elem).css({'top': 'initial', 'right': params.right, 'bottom': params.bottom, 'left': 'initial', 'width': Math.abs(disX), 'height': Math.abs(disY)})
						}else if( disX > 0 && disY > 0 ){
							//左上
							$(elem).css({'top': params.top, 'right': 'initial', 'bottom':'initial', 'left': params.left, 'width': Math.abs(disX), 'height': Math.abs(disY)})
						}else if( disX < 0 && disY > 0 ){
							//右上
							$(elem).css({'top': params.top, 'right': params.right, 'bottom': 'initial', 'left': 'initial', 'width': Math.abs(disX), 'height': Math.abs(disY)})
						}else{
							//左下
							//disX > 0 && disY < 0
							$(elem).css({'top': 'initial', 'right':'initial', 'bottom': params.bottom, 'left': params.left, 'width': Math.abs(disX), 'height': Math.abs(disY)})
						}
                        if( params.dom.length > 0 ){
                        	const elemDom = $(elem).get(0),
                                  bx = elemDom.offsetLeft,
						          by = elemDom.offsetTop,
						          bw = elemDom.offsetWidth,
						          bh = elemDom.offsetHeight;  
                        	params.dom.each((index, value) => {
							    let ax = value.offsetLeft,
							        ay = parseInt(value.getAttribute('data-pulltop')),
							        aw = value.offsetWidth,
							        ah = value.offsetHeight;
							    if( ax+aw > bx && ax < bx+bw && ay+ah > by && ay < by+bh ) {
							    	$(value).addClass('active')
							    }else{
							    	console.log('=======拉区域---多选---执行删除active操作======')
							    	$(value).removeClass('active')
							    }                                      
                        	})
						    _this.stateKeyData({})
						    _this.state.mouseArea = true;                        	
                        }
					}
				}
			};
			module.exports.throttle(up(),200);
		}
		//bar是移动对象
		bar.onmousedown = function(event){
			const ufnDom = document.getElementById('update_file_name');				                
			//判断重命名框是否打开
			if( !ufnDom ){
				params.flag = true;
				if(!event){
					event = window.event;
					//防止IE文字选中
					bar.onselectstart = function(){
						return false;
					};  
				};
				var e = event || window.event,
	                mouse = module.exports.getMousePos(event,bar); 
	            if( e.button == 0 || e.button == 2 ){       
	            	//_this.mouseDownInit()
	            }  
			    const fileItemDom = $('#client_height_1').find('.file-item'),
			          scrollDom = $('#client_height_1').find('.mCSB_container'),
			          draggerDom = $('#client_height_1').find('.mCSB_dragger'); 
			    params.dom = fileItemDom;     
				let itemArray = [];     
				fileItemDom.each((index, elem) => {
					itemArray.push(elem.offsetTop);
			    })	
			    if( scrollDom.length > 0 ){
			    	const sTop = Math.abs(scrollDom.position().top);
			    	let firstIndex = 0,
			    	    lastIndex = 0;
			    	if( itemArray.indexOf(sTop) > -1 ){
			    		firstIndex = itemArray.indexOf(sTop);
			    	}else{    
		                itemArray.push(sTop)
		                itemArray.sort((a,b) => a-b)
		                firstIndex = itemArray.indexOf(sTop) - 1;
		                if( firstIndex < 0 ) firstIndex = 0;
	            	}
	            	if( _this && _this.props.files && _this.props.files.common ){
	            		const offset = _this.props.files.common.fetch_size; 
	            		lastIndex = offset + firstIndex
	            	}
	            	params.dom = fileItemDom.slice(firstIndex, lastIndex)
	            	const domLen = params.dom.length;
	            	if( domLen > 0 ){
                    	const itemH = params.dom.eq(0).outerHeight(true),
                    	      showDom = document.getElementById('show_thumbnail_mode');
                    	let rowNum = 0, cosNum = 0, showDomWidth = 0, itemW = 0, tempC = 0;      
                    	if( showDom ){
                            showDomWidth = $(showDom).width();
                            itemW = params.dom.eq(0).outerWidth(true);
						    rowNum = Math.floor(showDomWidth/itemW);//一行有几条列表
						    if( rowNum > 0 ){
						    	//计算出有几行
						    	cosNum = Math.ceil(domLen/rowNum)
							}
                    	}
                    	params.dom.each((index, elem) => {
                    		if( rowNum > 0 ){
                    			if( cosNum > 0 ){
                                	elem.setAttribute('data-pulltop', tempC*itemH)
                                	if( tempC < cosNum && index == rowNum*(tempC+1) ){
                                        tempC++;
                                	}                                    	
                    			}else{
                    				elem.setAttribute('data-pulltop', 0) 
                    			}  
                    		}else{
                    			elem.setAttribute('data-pulltop', index*itemH)
                    		}
                    	});
	            	}
			    }	    
			    params.top = mouse.y;	            
	            params.right = bar.clientWidth-mouse.x;
	            params.bottom = bar.clientHeight-mouse.y;
	            params.left = mouse.x;          
				params.currentX = e.clientX;
				params.currentY = e.clientY;            
	            module.exports.throttle(move(),1000);				
			}
		};		
	},		
	/**
	 * 按字段名排序
	 */    
	keySort: function(prop, sort) {
	    return function (obj1, obj2) {
	        var val1 = obj1[prop];
	        var val2 = obj2[prop];
	        //目前数值型为字体状态
	        if( typeof(val1) == 'number' && typeof(val2) == 'number' ){
		        val1 = module.exports.getFontState(val1)
		        val2 = module.exports.getFontState(val2)
	    	}
	        if (val1 < val2) {
                if( sort === 'DES' ){
	            	return 1;
	        	}else{
	        		return -1;
	        	}
	        } else if (val1 > val2) {
	        	if( sort === 'DES' ){
	            	return -1;
	        	}else{
	        		return 1;
	        	}
	        } else {
	            return 0;
	        }            
	    }
	},
	arrayDel: function(array, n) {　
	    //n表示第几项，从0开始算起。
	    //prototype为对象原型，注意这里为对象增加自定义方法的方法。
	　  if(n<0)　//如果n<0，则不进行任何操作。
	　  　 return array;
	　  else
	　　   return array.slice(0,n).concat(array.slice(n+1,array.length));
	　　/*
	　　　concat方法：返回一个新数组，这个新数组是由两个或更多数组组合而成的。
	　　　　　　　　　这里就是返回this.slice(0,n)/this.slice(n+1,this.length)
	　　 　　　　　　组成的新数组，这中间，刚好少了第n项。
	　　　slice方法： 返回一个数组的一段，两个参数，分别指定开始和结束的位置。
	　　*/
	},
	//字体状态解析
	getFontState: function(statu){
		if( statu & FONT_STATE.kInstallState ){
			if( statu & FONT_STATE.kLocalState ){
				if ( statu & FONT_STATE.kNeedUpdate ) {
					//可更新
					return GET_FONT_STATE.in_needupdate;
				}				
				//已安装
                return GET_FONT_STATE.installed
			}
		}else if( statu & FONT_STATE.kLocalState ){
			if ( statu & FONT_STATE.kNeedUpdate ) {
				//可更新
				return GET_FONT_STATE.not_in_needupdate;
			}			
			//未安装
			return GET_FONT_STATE.not_install
		}else{
			if( !(statu & FONT_STATE.kServerNotExist) ){
				if( statu & FONT_STATE.kDownloadEnable ){
					//可下载
					return GET_FONT_STATE.download
				}
				//不可下载			
				return GET_FONT_STATE.not_download				
			}
			//云端不存在			
			return GET_FONT_STATE.not_find			
		}
	},
	//系统or非系统盘符状态解析
	getSystemDriveState: function(statu){
        if( statu & DRIVE_STATE.kDriveSystemVol ){
        	return GET_DRIVE_STATE.systemVol
        }else{
        	return GET_DRIVE_STATE.noSystemVol
        }
	},	
	//盘符状态解析
	getDriveState: function(statu){
		if( statu & DRIVE_STATE.kDriveSystemVol ){
			//系统盘符
			if( statu & DRIVE_STATE.kDriveFixed ){
				//固定盘符
				return GET_DRIVE_STATE.sys_fixed
			}
			if( statu & DRIVE_STATE.kDriveRemovable ){
				//移动盘符
				return GET_DRIVE_STATE.sys_removable
			}
			if( statu & DRIVE_STATE.kDriveCDROM ){
				//光驱
				return GET_DRIVE_STATE.sys_CDROM
			}
			if( statu & DRIVE_STATE.kDriveUsb ){
				//U盘
				return GET_DRIVE_STATE.sys_usb
			}
			//文件夹
			return GET_DRIVE_STATE.sys_folder					
		}else {
			//非系统盘符
			if( statu & DRIVE_STATE.kDriveFixed ){
				//固定盘符
				return GET_DRIVE_STATE.noSys_fixed
			}
			if( statu & DRIVE_STATE.kDriveRemovable ){
				//移动盘符
				return GET_DRIVE_STATE.noSys_removable
			}
			if( statu & DRIVE_STATE.kDriveCDROM ){
				//光驱
				return GET_DRIVE_STATE.noSys_CDROM
			}
			if( statu & DRIVE_STATE.kDriveUsb ){
				//U盘
				return GET_DRIVE_STATE.noSys_usb
			}			
			//文件夹
			return GET_DRIVE_STATE.noSys_folder
		}
	},
	/*
	 * 通过原型继承创建一个新对象
	 * inherit() 返回了一个继承自原型对象o的属性的新对象
     *
	*/
	inherit: function(o) {
        if( o == null ) throw TypeError();
        if( Object.create ) return Object.create(o);
        var t = typeof o;
        if( t !== 'object' && t !== 'function' ) throw TypeError();
        function f() {};
        f.prototype = o;
        return new f();
	},	
	//获取字体格式
	getFileType: function(type){
		if( type.toLowerCase().indexOf('ttf') > -1 || type.toLowerCase().indexOf('ttc') > -1 ){
			return 't';
		}
		if( type.toLowerCase().indexOf('otf') > -1 || type.toLowerCase().indexOf('fon') > -1 ){
			return 'o';
		}
	},
	//克隆对象判断
	isClass: function(o){
	    if( o===null ) return "Null";
	    if( o===undefined ) return "Undefined";
	    return Object.prototype.toString.call(o).slice(8,-1);
	},	
	//克隆对象
	objClone: function(obj){
		//严格模式下arguments.callee()不可用
		//react es6下是严格模式
		//可以使用的方法1
		//可以克隆对象里的方法等。
	    var result,oClass = module.exports.isClass(obj);
	        //确定result的类型
	    if( oClass === "Object" ){
	        result = {};
	    }else if( oClass === "Array" ){
	        result = [];
	    }else{
	        return obj;
	    }
	    for(var key in obj ){
	        var copy = obj[key];
	        if( module.exports.isClass(copy)=="Object" ){
	            result[key] = module.exports.objClone(copy);//递归调用
	            //result[key] = arguments.callee(copy);//递归调用
	        }else if( module.exports.isClass(copy)=="Array" ){
	            //result[key] = arguments.callee(copy);
	            result[key] = module.exports.objClone(copy);
	        }else{
	            result[key] = obj[key];
	        }
	    }
	    return result;
	},
	//深度克隆
    cloneObj: function(obj){
    	//可以使用的方法2
	    var str, newobj = obj.constructor === Array ? [] : {};
	    if(typeof obj !== 'object'){
	        return;
	    } else if(window.JSON){
	        str = JSON.stringify(obj), //序列化对象
	        newobj = JSON.parse(str); //还原
	    } else {
	        for(var i in obj){
	            newobj[i] = typeof obj[i] === 'object' ? module.exports.cloneObj(obj[i]) : obj[i]; 
	        }
	    }
	    return newobj;
 	},	
	//鼠标位置
	getMousePos: function(event, element, _top) {
	    var e = event || window.event,
	        scrollX = document.documentElement.scrollLeft || document.body.scrollLeft,
	        scrollY = document.documentElement.scrollTop || document.body.scrollTop,
	        x = e.pageX || e.clientX + scrollX,
	        y = e.pageY || e.clientY + scrollY;
	    if( element ){
	    	var elementX = element.offsetLeft,
	    	    elementY = !_top ? element.offsetTop : element.offsetTop - _top;   //_top总体偏移10px, 模拟a标签hover状态下显示title
	    	x = x - elementX;
	    	y = y - elementY;
	    }
	    return { 'x': x, 'y': y };
	},
	//简繁转换
	TransJF: function(t, s) {
		var str = '';
		if (t == '1') {
			for (var i = 0; i < s.length; i++) {
				if (JSTR.indexOf(s.charAt(i)) != -1) {
					str += FSTR.charAt(JSTR.indexOf(s.charAt(i)));
				} else {
					str += s.charAt(i);
				}
			}
		} else {
			for (var i = 0; i < s.length; i++) {
				if (FSTR.indexOf(s.charAt(i)) != -1) {
					str += JSTR.charAt(FSTR.indexOf(s.charAt(i)));
				} else {
					str += s.charAt(i);
				}
			}
		}
		return str;
	}﻿,
	//加密
	Encrypt: function(word){
	    var key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12"); 

	    var srcs = CryptoJS.enc.Utf8.parse(word);
	    var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
	    return encrypted.toString();
	},
	//解密
	Decrypt: function(word){
	    var key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12"); 

	    var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
	    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
	},
	/**
	 * HTML 标签转义
	 * @param {Array.<DOMString>} templateData 字符串类型的tokens
	 * @param {...} ..vals 表达式占位符的运算结果tokens
	 * 
	 */
	SaferHTML: function(templateData) {
		var s = templateData[0];
		for (var i = 1; i < templateData.length; i++) {
		    var arg = String(templateData[i]);
		    // Escape special characters in the substitution.
		    s += arg.replace(/&/g, "&amp;")
		            .replace(/</g, "&lt;")
		            .replace(/>/g, "&gt;");
		    // Don't escape special characters in the template.
		    s += templateData[i];
		}
		return s;
	},	
	//es6模版生成
	compile: function(template){
	  var evalExpr = /<%=(.+?)%>/g;
	  var expr = /<%([\s\S]+?)%>/g;

	  template = template
	    .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
	    .replace(expr, '`); \n $1 \n  echo(`');

	  template = 'echo(`' + template + '`);';
	  var script =
	  `(function parse(data){
	    var output = "";

	    function echo(html){
	      output += html;
	    }

	    ${ template }

	    return output;
	  })`;

	  return script;
	},
	/**
	 * 获取新的路由结构
	 * 
	 */	
    getNewRoute: function(route, path, mode){
        if( module.exports.isEmpty(path) ){
            return {}
        }
        let name_array, elem, navData, data = {}; 
        if( path == '我的电脑' || mode == 'drive' ){
            elem = {file_name:'我的电脑', dir: null, path: null, mode: 'drive',IDS: 'LOCAL_FILE_TOTAL_PANELS'};
            navData = module.exports.getNavigation(route, elem);
            data = {
               route: {
                  menu: 'LOCAL_FILE_TOTAL_PANELS',
                  data: elem,
                  nav:{
                     fore: navData.fore,
                     now: navData.now,
                     after: navData.after
                  },
                  host: !module.exports.isEmpty(elem.path) ? elem.path.split('\\') : [elem.file_name]             
               }
            };                
        }else{ 
        	let e_path = null;
            if( mode == 'search' ){
                name_array = path
                e_path = route.data.path
            }else{
            	e_path = path
                name_array = !module.exports.isEmpty(path) && path != '\\' ? path.split('\\') : [];
            }            
            elem = {
                IDS: 'LOCAL_FILE_CONTENT',
                file_name: name_array.constructor == Array ? name_array[name_array.length-1] : name_array,                  
                path: !module.exports.isEmpty(e_path) && e_path != '\\' ? e_path : null,
                mode: mode ? mode : 'path',
                old_file_name: route.data.old_file_name ? route.data.old_file_name : route.data.file_name,
                volume_name: route.data.volume_name
            };
            navData = module.exports.getNavigation(route, elem);           
            data = {
               route: {
                  menu: 'LOCAL_FILE_CONTENT',
                  data: elem,
                  nav:{
                     fore: navData.fore,
                     now: navData.now,
                     after: navData.after
                  },
                  host: !module.exports.isEmpty(elem.path) ? elem.path.split('\\') : [elem.file_name]             
               }
            };
            if( mode == 'search' ){
            	data.route.data['is_refresh'] = true;
            }
        }
        return data
    },	
	/**
	 * 组建导航（前进和后退）
	 * 
	 */
	getNavigation(route, data, temp){
		const rdata = route && route.data;
		const nowRoute = (arr) => {
			let _route = arr.pop();
			if( rdata && rdata.path === _route.path ){
				_route = arr.pop()
			}
			if( _route ){
				route.nav.now = _route
			}            
		}
		const pushRoute = (arr, tp) => {
			let _route = arr.slice(-1);//获取数组最后一个
            if( !_route || !rdata || _route.path !== rdata.path ){
            	//判断前一位和当前位path是否相同，相同则不push
            	if( tp ){
					if( rdata && data.path !== rdata.path ){
                    	arr.push(rdata)
                	}            		
            	}else{
            		arr.push(rdata)
            	}
            } 			
		}
		try{
			if( route ){
				if( data == null && temp != null ){
					if( temp == 0 ){
						nowRoute(route.nav.fore)
						pushRoute(route.nav.after,0)					
					}else{
						nowRoute(route.nav.after)
						pushRoute(route.nav.fore,0)
					}
				}else{
					pushRoute(route.nav.fore,1)
	            	route.nav.now = data;
	        	}
	            return route.nav 
        	}else{
        		return {}
        	}
		}catch(e){
			if( route ){
            	return route.nav
        	}else{
        		return {}
        	}
		} 		
	},
	/**
	 * 回退键或返回上一级目录
	 * 
	 */	
	routesBackLocal(route) {
		let newpath = '我的电脑';
        if( route && route.data ) {
            let path = route.data.path,
                pathArray = [];       
            if( path ) {
                if( route.data.mode == 'search' ){
                    newpath = path;
                }else{
                    pathArray = path.split('\\')
                    if( pathArray.length > 0 ) {
                        const splData = pathArray.pop()
                        if( !splData ){
                            pathArray.pop()
                        }
                        if( pathArray.length > 0 ){                   
                            newpath = pathArray.join('\\');
                        }
                    }
                }               
            }          
        }
        return newpath
	},
	/**
	 * 计算字符串所占字节数
	 * 
	 */	
	getSizeOf(str, charset){
	    var total = 0,
	        charCode,
	        i,
	        len;
	    charset = charset ? charset.toLowerCase() : '';
	    if(charset === 'utf-16' || charset === 'utf16'){
	        for(i = 0, len = str.length; i < len; i++){
	            charCode = str.charCodeAt(i);
	            if(charCode <= 0xffff){
	                total += 2;
	            }else{
	                total += 4;
	            }
	        }
	    }else{
	        for(i = 0, len = str.length; i < len; i++){
	            charCode = str.charCodeAt(i);
	            if(charCode <= 0x007f) {
	                total += 1;
	            }else if(charCode <= 0x07ff){
	                total += 2;
	            }else if(charCode <= 0xffff){
	                total += 3;
	            }else{
	                total += 4;
	            }
	        }
	    }
	    return total;
	},
	/**
	 * 获取盘符或路径
	 * @pathObj config里获取的字符串路径，@allDrive 首页获取的盘符，包括硬盘盘符
	 */	
	getDriveOrPath(pathObj, allDrive) {
		let scanPathArray = [];
		try{
	        if( !module.exports.isEmpty(pathObj.value) && pathObj.value != 'null' ){
	            scanPathArray = JSON.parse(pathObj.value);
	            if( allDrive && allDrive.length > 0 ){
	                const driveLetterData = allDrive.map((itemData) => itemData.path);
	                scanPathArray.forEach((itemArray, indexArray) => {                        
	                    const hasIndex = driveLetterData.indexOf(itemArray.path);
	                    if( hasIndex != -1 ){
	                        itemArray['prop'] = allDrive[hasIndex].file_prop
	                    }
	                }) 
	            } 
	        }
    	}catch(e){}
        return scanPathArray
	},
	/**
	 * 重组聊天消息
	 * 
	 */
	getChatMessage(msgData, myId, routeId) {
      	let newData = [],
            newOutData = [],
            newInData = [];		
	    for( const x in msgData ){
	        const id = x.split('-')[1];
	        if( id === routeId ){
	        	if( msgData[x] && msgData[x].constructor == Array ){
	        		msgData[x].map((item) => {
	        			if( item.from.toLowerCase() === myId && item.to.toLowerCase() === routeId ){
	        			    item.flow = 'out'
	        			    newOutData.push(item)
	        			}
	        			if( item.from.toLowerCase() === routeId && item.to.toLowerCase() === myId ){
	        				newInData.push(item)
	        			}
	        		})
	        	}
	        }
	        if( id === myId ){
	            if( msgData[x] && msgData[x].constructor == Array ){
	            	msgData[x].map((item) => {
	            		if( item.from.toLowerCase() === myId && item.to.toLowerCase() === routeId ) {
	            			item.flow = 'out'
	            			newOutData.push(item)
	            		}
	            		if( item.from.toLowerCase() === routeId && item.to.toLowerCase() === myId ){
						    newInData.push(item)
	            		}
	            	})                
	            }                
	        }
	    }
	    newData.unshift.apply( newData, newInData );
	    newData.unshift.apply( newData, newOutData ); 
	    //排序
	    newData.sort((a, b) => a.time-b.time)
	    return newData;	
	},
	/**
	 * 重组字体串（字体串里有换行时显示换行）
	 * 
	 */	
	getStringCode(oldtext) {
        let newtext = '';
        try{    
            for( let i = 0; i < oldtext.length; i++ ){
                if( oldtext.codePointAt(i) == 10 ){
                    newtext += oldtext[i] + '\r\n'
                }else{
                    newtext += oldtext[i]
                }
            }   
        } catch (e){
            for( let i = 0; i < oldtext.length; i++ ){
                if( oldtext.charCodeAt(i) == 10 ){
                    newtext += oldtext[i] + '\r\n'
                }else{
                    newtext += oldtext[i]
                }
            }             
        }
        if( module.exports.isEmpty(newtext) ){
            return oldtext
        } 
        return newtext
	},
	/**
	 * 路径特殊字符转码
	 * 本地素材
	 */
	getEncodeURIComponentPath: function(item, tempItem){
        let img_src = null;
        const defaultImgSrcFn = (d_item, d_tempItem) => {
        	let default_img_src;
            default_img_src = 'compress/img/file-type/';
            if( !module.exports.isEmpty(d_item.file_type) ){
                default_img_src += d_item.file_type.toLowerCase() +'.png';
            }else{
            	if( d_tempItem && !module.exports.isEmpty(d_tempItem.file_type) ){
                    default_img_src += d_tempItem.file_type.toLowerCase() +'.png';
            	}else{
                	default_img_src += 'folder.png';
            	}	            	
            }
            return default_img_src
        }
        if( item ){
        	const imageData = item.thumb_image;
	        if( module.exports.isEmpty(imageData) || (module.exports.isEmpty(imageData.images) && module.exports.isEmpty(imageData.path)) ){
                img_src = defaultImgSrcFn(item, tempItem)
	        }else{
	        	if( !module.exports.isEmpty(imageData.images) ){
	        		img_src = "data:image/png;base64,"+ imageData.images[0]
	        	}else{
	        		if( !module.exports.isEmpty(imageData.path) ){
	        			let path_src = null,
	        			    isURI = false;
			            if( item.is_URI == null || !item.is_URI ){ //防止二次转码
			                const reg = /[.~!@#$%\^\+\*&\\\/\?\|\.{}()';="]/,
		                          patharray = imageData.path[0] && imageData.path[0].split('\\');
		                    if( patharray && patharray.constructor == Array ){
		                    	isURI = true
		                        path_src = patharray.map((arr) => {
		                            if( reg.test(arr) ){
		                                return encodeURIComponent(arr) 
		                            }
		                            return arr
		                        })
		                        if( path_src ){
		                            img_src = path_src.join('\\')
		                            imageData.path[0] = img_src
		                            if( tempItem ){
		                            	tempItem['is_URI'] = isURI
		                            }else{
		                            	item['is_URI'] = isURI
		                            }
		                        }
		                    }        
			            }else{
			            	img_src = imageData.path[0]
			            }
		        	}else{
		        		img_src = defaultImgSrcFn(item, tempItem)
		        	}
	            }                               
	        } 
    	}
        return img_src       
	},
	/**
	 * 图片预加载
	 * 
	 */	
    loadImage: function(url,callback) {
	    var img = new Image();
	    img.src = url;
	    if(img.complete) {  // 如果图片已经存在于浏览器缓存，直接调用回调函数
	        callback.call(img);
	        return; // 直接返回，不用再处理onload事件
	    }
	    img.onload = function(){
	        img.onload = null;
	        callback.call(img);
	    }
	},
	/**
	 * 去除字符串前后空格
	 *
	 */					
	getTrim: function(str) {
        if( !str ) return str;
        return str.replace(/^\s+|\s+$/g, "");
	},	
	 /**
	 *  自动截取字符串，多余的用省略号代替
	 *  str为要截取的字符串，dom为str的容器
	 *  maxW为dom的最大宽度，temp为截取的方位(left=左，cnter=中，其他为右) 
	 */
	ellipsisStr: function(str, dom, maxW, temp) {
	    var len,startIndex,startStr,endStr,newStr,_w;
	    _w = dom.offsetWidth;
	    if( _w < maxW ) return str;          
	    len = str.length;
	    switch(temp){
	    	case 'left':
		        startStr = str.substring(4, len);
		        newStr = "..."+ startStr;
	    	break;
	    	case 'center':
		        startIndex = Math.ceil(len/2)
		        startStr = str.substring(0, startIndex-5);
		        endStr = str.substring(startIndex+5, len);
		        newStr = startStr +"..."+ endStr;
	    	break;
	    	case 'right':
		        startStr = str.substring(0, len-5);
		        newStr = startStr+"...";
	    	break;
	    	default:
		        startStr = str.substring(0, len-5);
		        newStr = startStr+"...";	    	
	    	break;
	    }      
	    if( newStr ){
	        dom.innerText = newStr;
            var newtext = dom.innerText.toString(); 
            if( newtext.length == len ){
            	return newStr
            }
            module.exports.ellipsisStr(newtext, dom, maxW, temp)	        
	    }
	    return str
	},
	/*
	* 动态高度伸缩动画
	*/
    funTransitionHeight: function(element, time) { // time, 数值，可缺省
        if (typeof window.getComputedStyle == "undefined") return;
        let height = window.getComputedStyle(element).height;
        element.style.transition = "none";  
        element.style.height = "auto";
        var targetHeight = window.getComputedStyle(element).height;
        element.style.height = height;
        element.offsetWidth = element.offsetWidth;
        if (time) element.style.transition = "height "+ time +"ms";
        element.style.height = targetHeight;
    } 	
};
