import { hasClass, removeClass, addClass } from './UtilConstant'

var isActive = true;
module.exports = {
    direction_falg: null,	
	clientWidth: function(element){
        var w = $(element).parent().outerWidth(true);
        $(element).css('width', w);
	},
	clientHeight: function(element1, resizeH, less, element2){
		var r_h = resizeH - less;
    	if(element1){
    		element1.style.cssText = 'max-height:'+ r_h +'px;min-height:'+ r_h +'px;height:'+ r_h + 'px';
    		if(element2){
    			element2.style.maxHeight = r_h + 'px';
    		}
    	} 	
	},
	domEachHeight: function(h, $elem, $elem2){
		h = h + 26;
		if( $elem2 && $elem2.length >0 ){
			$.each($elem, function(){
				$(this).css('height', h);
			});
			$.each($elem2, function(){
				$(this).css('height', h);
			});			
		}else{
			$.each($elem, function(){
				$(this).css('height', h);
			});			
		}
	},
	domItemHeight: function(h, $elem, $elem2){
		h = h + 26;
		if( $elem2 && $elem2.length >0 ){
			$elem.css('height', h);
			$elem2.css('height', h);		
		}else{
			$elem.css('height', h);		
		}
	},			
	marginLeftOrTop: function($elem){
		var w = $elem.width(),
		    h = $elem.height();
		$elem.css({
			'width': w,
			'height': h,
			'margin-left': -w/2,
			'margin-top': -h/2
		})    
	},
	absVerticalCenter: function(element){
		//有左侧栏时，宽度为200，折半
		var _w = 0;
		if( $(element).closest('#Lianty-FontAssistant').length > 0 ){
			//有特别的左侧栏时 或 以右侧为居中时
            //_w = 100;
		}
		if(element){
			var w = element.offsetWidth,
			    h = element.offsetHeight;
			if( element.style.top && element.style.left ){
				element.style.top = '50%';
				element.style.left = '50%';
			}    
			element.style.marginLeft = -(w/2 + _w) +'px';
			element.style.marginTop = -h/2 +'px';
		}
	},
	absVerticalCenter2: function(element){
		if(element){
			var w = element.offsetWidth,
			    h = element.offsetHeight;
			if( element.style.top && element.style.left ){
				element.style.top = '50%';
				element.style.left = '50%';
			} 			    
			element.style.marginLeft = -w/2 +'px';
			element.style.marginTop = -h/2 +'px';
		}
	},
	tableCellDom: function(element){
		if(element){
			var w = element.parentNode.offsetWidth,
			    h = element.parentNode.offsetHeight;
			element.style.cssText = 'display:table-cell;width:'+ w + 'px;height:'+ h +'px';
		}		
	},
	tableCellSpecifyDom: function(element, element2){
		if(element){
			var w = element2.offsetWidth,
			    h = element2.offsetHeight;
			element.style.cssText = 'display:table-cell;width:'+ w + 'px;height:'+ h +'px';
		}		
	},
	jqTableCellDom: function(element, element2, element3, temp){
		if(element.length > 0){
			element.each(function(){
				var w = $(this).parent().outerWidth(temp),
				    h = $(this).closest(element2).siblings(element3).outerHeight(temp);
				$(this).css({'width': w, 'height': h});    				
			})
		}		
	},
	animateMoveMaxTextLeftDom: function(element, time, move){
        var move_Elem = element.querySelector('.move-item'),
            p_w = $(element).outerWidth(),
            m_w = $(move_Elem).outerWidth(true),
            diff_w = m_w - p_w;      
        if( diff_w >= 10 ){
        	if( move ){ 
            	$(move_Elem).stop(true, true).delay(10).animate({left: -diff_w},time)
        	}else{
        		$(move_Elem).stop(true, true).delay(10).animate({left: 0},1)
        	}
        }
        return false;		
	},
	getDropDownStyle1: function(element){
		if( element ){
			const elemP_1 = element.querySelector('.more-load .p-1'),
			      elemP_2 = element.querySelector('.more-load .p-2');
			if( elemP_1 != null && elemP_2 != null ){      
				elemP_1.style.display = 'block'
				elemP_2.style.display = 'none'    		
			}
		}
	},
	getDropDownStyle2: function(element){
		if( element ){
			const elemP_1 = element.querySelector('.more-load .p-1'),
			      elemP_2 = element.querySelector('.more-load .p-2');
			if( elemP_1 != null && elemP_2 != null ){      
				elemP_1.style.display = 'none'
				elemP_2.style.display = 'block'    		
			}
		}
	},
	showOrHideItem: function(sib_Elem, i_Elem, classes) {
        if( !sib_Elem ){
        	return false;
        }
        const par_Elem = sib_Elem.parentNode;
		if( hasClass(par_Elem, 'active') ){
			if( i_Elem && classes ){
				removeClass(i_Elem, classes)
			}
			$(sib_Elem).delay(0).slideUp(300,function(){
                removeClass(par_Elem, 'active')
			});
		}else{
			if( i_Elem && classes ){
				addClass(i_Elem, classes)
			}
			$(sib_Elem).delay(0).slideDown(300, function(){
				addClass(par_Elem, 'active')
			});
    	}
	},
	showOrHideItem2: function(sib_Elem, speed) {
        if( !sib_Elem ){
        	return false;
        }
		if( sib_Elem.style.display == 'block' ){
			$(sib_Elem).delay(0).slideUp(speed);
		}else{
			$(sib_Elem).delay(0).slideDown(speed);
    	}
	},		
	velocityPrveOrNext: function(element, index, offset, num, direction){
		if( !isActive ){
			return index;
		}		
		if( element && $(element).length > 0 ){
			if( direction == 'right' ){
				if( index < num ){
					isActive = false;
					$(element).velocity(
						{left: -(index * offset) +"px"},
						{
						   "delay": 200,
						   "duration": 100,
						   "easing":"swing",
						   "complete": function(){
						        isActive = true						  	  
						    }
						}
				    )	
			    }			
			}else{
				if( index > 1 ){
					isActive = false;
					$(element).velocity(
						{left: (-(index - 2)*offset) +"px"},
						{
							"delay": 200,
							"duration": 100,
							"easing":"swing",
							"complete": function(){	
							    isActive = true					  	  
							}							
						}
				    )	
			    }			
			}
		    if( direction == "left" ){
		    	index -= 1;
		    	if( index <= 0 ){
		    		index = 1
		    	}
		    }else{
			    index += 1;
			    if( index >= num ){
			    	index = num
			    }
			}
		    return index			
		}		
	}			
};