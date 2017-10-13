import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { isEmpty, regexStr, log, objClone, getNewRoute } from '../../constants/UtilConstant'
import { msgAlertHtml } from '../../constants/RenderHtmlConstant'
import { ROUTES, PAGE_TYPE, GET_REGEX_MATCH } from '../../constants/DataConstant'
import { getFontInitObjectData, getFileInitObjectData } from '../../constants/ConfigInfo'
import { LOCAL_MATERIAL, SEARCH_FRIENDS, SEARCH_SCAN_MSG } from '../../constants/TodoFilters'

//搜索框
class SearchInput extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		msg_show: false,
    		timer: true
    	};
    	log("SearchInput");		
	}
	eventsKeyDownSearch(event){
		var keyCode = window.event ? event.keyCode : event.which;
		if(keyCode == 13) {
			if( !this.state.timer ){
				return
			}
			if( this.props.onEvents ){
				if( this.refs.searchTextRef ){
                	this.props.onEvents(this.refs.searchTextRef.value) 
            	}
				return false;
			}
			if( this.props.mode === SEARCH_FRIENDS ){
                //this.searchFriends()
			} else if( this.props.mode === LOCAL_MATERIAL ){
				this.searchLocalMaterial()
			}else{
				this.searchTextBtn()
			}
		}
		return false;
	}
	searchLocalMaterial() {
		if( !this.state.timer ){
			return
		}		
		//搜索文件--本地素材
		let searchTextRefDOM = this.refs.searchTextRef
		if(searchTextRefDOM){
			const text = searchTextRefDOM.value;
			if( isEmpty(text) ){
                return false 
			}
			if( this.props.route ){
	            const data = getNewRoute(this.props.route, text, 'search');
	            this.props.actions.getInItRoute(data);			
			}	
		    this.state.timer = false
		    setTimeout(() => {
               this.state.timer = true
		    }, 1500)			
		}			
	}
	searchTextBtn() {
		if( !this.state.timer ){
			return
		}		
		//搜索字体--字体助手
		let searchTextRefDOM = this.refs.searchTextRef
		if(searchTextRefDOM){
			const text = searchTextRefDOM.value,
			      preview_text = $('.preview-font .pf-input').val();     
			let t_c = this.props.fonts.common;	  
			if( regexStr(text, GET_REGEX_MATCH.only_letter) ){
                this.setState({
                	msg_show: true
                })
				setTimeout(() => {
					this.setState({
						msg_show: false
					})
				}, 1500)                
                return false
			}
			if( isEmpty(text) || this.state.msg_show ){
                return false 
			}
			this.state.timer = false
			t_c = objClone(getFontInitObjectData);
			t_c.search_text = text;
			t_c.temp = 1;		
			t_c.type = PAGE_TYPE.Font_Assistant.search_font.value;
			t_c.PageName = PAGE_TYPE.Font_Assistant.search_font.PageName;
			t_c.user_id = this.props.login.loginUserData ? this.props.login.loginUserData.id : null; 
            //跳转路由
			ROUTES[2]['mode'] = 'menu'
			ROUTES[2]['common'] = t_c
			if( this.props.subRoute && this.props.subRoute.PageName != ROUTES[2].data[0].PageName ){
				//如果当前搜索不在搜索页
				this.props.actions.getInItRoute({route: ROUTES[2], subRoute: ROUTES[2].data[0]})
		    }
				//清空events数据
		    this.props.actions.eventsInitializationData();
				//清空fonts数据，保留common数据
			this.props.actions.initializationLoadingData(t_c);
			//清除滚动条,等待加载时样式还原
			if( $(".scllorBar_commonList.mCustomScrollbar").length > 0 ){
				$(".scllorBar_commonList").mCustomScrollbar("destroy");	
			}
			setTimeout(() => {
				//请求数据
		    	this.props.actions.searchFontRequest(t_c)    
			},80)
		    setTimeout(() => {
               this.state.timer = true
		    }, 1500)
		}
	}
	searchFriends(event) {
		log('键盘按下搜索朋友')
        const val = event.currentTarget.value;		
        this.props.onSearchFriends(val);
	}
	focusFriend(event) {
		log('焦点搜索朋友')
		const iDom = event.currentTarget.parentNode.querySelector('.sf-abtn i');
		iDom.className = 'icons-local-material icons-20 fn-close-bg';
		this.props.onFocusFriend();
	}
	closeSearch(event) {
		log('关闭搜索朋友')
		const iDom = event.currentTarget.querySelector('i');
		iDom.className = 'icons icons-18 search-bg';
		this.refs.searchTextRef.value = '';
		this.props.onCloseSearch();		
	}		
	render() {
		const { type, mode, onEvents } = this.props
		const { msg_show } = this.state
		return  <div className="search-input flex flex-c" onKeyDown={this.eventsKeyDownSearch.bind(this)}>
	                <span className="search-info flex">
	                    {
	                    	mode === SEARCH_FRIENDS ?
				                <input className="sf-input" maxLength="30" type="text" placeholder={type.search} ref="searchTextRef" onFocus={this.focusFriend.bind(this)} onKeyUp={this.searchFriends.bind(this)}/>
				            :
				                <input className="sf-input" maxLength="30" type="text" placeholder={type.search} ref="searchTextRef"/>				                       	                    	  
	                    }
		                {
		                	mode === LOCAL_MATERIAL ?
		                	   <a className="sf-abtn flex flex-c flex-c-c flex-item-gsb-0"
		                	      onClick={this.searchLocalMaterial.bind(this)}>
		                	      搜索
		                	      <i className="icons icons-18 search-bg"></i>
		                	   </a>
		                	:   
		                	mode === SEARCH_FRIENDS ?
		                	   <a className="sf-abtn flex flex-c flex-c-c flex-item-gsb-0"
		                	      onClick={this.closeSearch.bind(this)}>
		                	      搜索
		                	      <i className="icons icons-18 search-bg"></i>
		                	   </a>
		                	:
		                	mode === SEARCH_SCAN_MSG ?
		                	   <a className="sf-abtn flex flex-c flex-c-c flex-item-gsb-0"
		                	      onClick={() => onEvents(this.refs.searchTextRef.value) }>
		                	      搜索
		                	      <i className="icons icons-18 search-bg"></i>
		                	   </a>
		                	:
		                	   <a className="sf-abtn flex flex-c flex-c-c flex-item-gsb-0" 
		                	      onClick={this.searchTextBtn.bind(this)}>
		                	      搜索
		                	      <i className="icons icons-18 search-bg"></i>
		                	   </a>		                	   		                	   
		                }
		                
	                </span>
                    {
                   	    msg_show ?
                   	        msgAlertHtml('不能少于两个字符')
                   	    :
                   	        null   
                    }	           
		        </div> 
	}	
	componentDidMount() {
		const t_f = this.props.fonts,
		      t_r = this.props.route;
		let isVal = false;
		      
		if( t_f && t_f.common && !isEmpty(t_f.common.search_text) ){
			isVal = true;
	       $('.search-input .sf-input').val(t_f.common.search_text)
		}		
		if( t_r && t_r.data && t_r.mode == 'search' ){
  		   if( t_r.data.mode == 'search' && !isEmpty(t_r.data.file_name) ){	
  		   	   isVal = true 
           	   $('.search-input .sf-input').val(t_r.data.file_name)
       	   }
		} 
		if( !isVal ){
			$('.search-input .sf-input').val('')	
		}
		//关键字赋值
		if( this.props.type && this.props.type.keyWord && this.refs.searchTextRef ){
            this.refs.searchTextRef.value = this.props.type.keyWord
		}								
	}
	componentWillReceiveProps(nextProps){
		//搜索中心----字体搜索跳转
		if( !isEmpty(nextProps.searchFontData) ){
		    $('.search-input .sf-input').val(nextProps.searchFontData)			
		}
	}
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))
    }		
	componentDidUpdate(nextProps) {
		const t_f = this.props.fonts,
		      t_r = this.props.route;
		let isVal = false;      
		    
		if( t_f && t_f.common && !isEmpty(t_f.common.search_text) ){
			isVal = true;
	        $('.search-input .sf-input').val(t_f.common.search_text)
		} 
		if( t_r && t_r.data ){
		   if( t_r.data.mode == 'search' && !isEmpty(t_r.data.file_name) ){	
		   	   isVal = true;
           	   $('.search-input .sf-input').val(t_r.data.file_name)
       	   }
		}
		if( !isVal ){
		   $('.search-input .sf-input').val('')	
		}
		//关键字赋值
		if( this.props.type && this.props.type.keyWord && this.refs.searchTextRef ){
            this.refs.searchTextRef.value = this.props.type.keyWord
		}				       
	}
}
export default immutableRenderDecorator(SearchInput)
