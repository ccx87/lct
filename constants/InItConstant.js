/**
 * 初始化
 * @type {Object}
*/
import { SHOW_LIST_MODE, SHOW_THUMBNAIL_MODE } from './TodoFilters'
import { getFontInitObjectData, getIntervalValue } from './ConfigInfo'
import { log, objClone, getCss } from './UtilConstant'

const doc = document;
module.exports = {
    /**
     * 字体助手--请求数据的初始化
    */ 
    getFontInItData: function(_props) {
        //let t_c = objClone(_props.fonts.common),
        let t_c = objClone(getFontInitObjectData);
        if( _props.route.mode === 'nav' && _props.route.common ){
            t_c = objClone(_props.route.common)
        }else{ 
            // if( !t_c ){      
            //     t_c = clone_t_c
            // }   
            //这三个字段是初始化筛选字体的(全部、按状态、按语言、按时间) 
            t_c.type = _props.type.value;
            // t_c.InstallTime = clone_t_c.InstallTime;
            // t_c.language = clone_t_c.language;

            // t_c.search_text = clone_t_c.search_text;
            t_c.PageName = _props.type.PageName;
            t_c.user_id = _props.login.loginUserData ? _props.login.loginUserData.id : null;
        } 
        return t_c       
    },
    /**
     * 本地素材--初始化计算当前页面可以加载多少条数据
    */    
    getListOffset: function(displayMode, panElem, bcSilder) {                 
        let fetchSize = 50; //初始值
        if( panElem ){  
            //减掉滚动条占的宽度，不管是否有滚动条      
            let parW = parseInt(getCss(panElem, 'width')) - 8,
                parH = parseInt(getCss(panElem, 'height')),
                speed = getIntervalValue.thumbnail,
                _h = 0,
                _row = 1;  
            try{
                if( bcSilder ){
                    const bcW = parseInt(getCss(bcSilder, 'width')); //14为point,14px为左临界点。            
                    if( bcW > 0 ){ 
                        _h = bcW * speed; //底部缩略图的移动值                    
                    }
                }
                if( displayMode === SHOW_LIST_MODE ){
                    _h += 28;//28是li的最小高度，加上border:1px则是30
                    fetchSize = (Math.ceil(parH/_h) * _row) + 5 
                } 
                if( displayMode === SHOW_THUMBNAIL_MODE ){
                    //margin-top:8px; margin-left:8px;
                    _h += 88;
                    _row = Math.floor(parW/_h);
                    fetchSize = (Math.ceil(parH/_h) + 1) * _row //加1多出一行来
                }
            }catch(e){}
        }
        return fetchSize
    },
    /**
     * 本地素材--初始化列表样式
     * 当缩略图按扭值大于0时，计算列表对应的宽高
    */    
    listEquqlBCdrag: function(displayMode, $elem, $bcSilder) {
        const speed = getIntervalValue.thumbnail;            
        if( $elem.length > 0 && $bcSilder.length > 0){
            const bcW = $bcSilder.width(); //14为point,14px为左临界点。
            if( bcW > 0 ){ 
                let newH = bcW * speed,
                    imgH = 0,
                    _h = 0;  
                if( displayMode === SHOW_LIST_MODE ){
                    _h = newH + 28;//28是li的最小高度,加上border:1px则是30
                    imgH = newH + 20; //20是图片的最小高度
                    $elem.css('height', _h)
                } else{
                    _h = newH + 80;
                    imgH = newH + 36;
                    $elem.css({'height': _h, 'width': _h})
                }
                $elem.find('img').css({'max-width': imgH, 'max-height': imgH})                
            }
        }
        //变换模式时判断是不是有选中
        //单个文件选中时--选中时要有存储单个选中的状态(后续开发)      
    },
    /**
     * 本地素材--初始化底部栏左侧数据
    */     
    getTextMsg: function(num, lens, size) {
        if( lens ){
            if( lens > 1 ){
                if( size ){
                    return {text: '<em>'+ num +'</em>个项目', msg:'已选择<em>'+ lens +'</em>个', size: size} 
                }else{
                    return {text: '<em>'+ num +'</em>个项目', msg:'已选择<em>'+ lens +'</em>个'}
                }
            }else{
                if( size ){
                    return {text: '<em>'+ num +'</em>个项目', msg:'选中<em>'+ lens +'</em>个', size: size}
                }else{
                    return {text: '<em>'+ num +'</em>个项目', msg:'选中<em>'+ lens +'</em>个'}
                }
            }
        }else{
            return {text: '<em>'+ num +'</em>个项目'}
        }
    },
    /**
     * 本地素材--初始化列表选中样式
    */      
    selectLiItem: function(argument1) { 
        //初始化样式       
        log('初始化样式执行中====>selectLiItem')
        const $elem1 = $('.file-list-table').find('.file-item.active'),          
              $meun = $('#FirstMeunUl').find('.item-p.select');     
        if( $elem1.length > 0  ){
            if( argument1 ){
                $elem1.removeClass('active')
            }else{
                $elem1.removeClass('active default')
            }
        } 
        if( $meun.length > 0 ){
            $meun.addClass('default')
        }      
        if( !argument1 ){   
            const $elem2 = $('.file-list-table').find('.file-item.default');
            if( $elem2.length > 0  ){
                $elem2.removeClass('default')
            } 
        }         
    }                
};