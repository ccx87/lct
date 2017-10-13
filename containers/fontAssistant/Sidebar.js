import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'

import { ROUTES } from '../../constants/DataConstant'
import { loadingHtml2 } from '../../constants/RenderHtmlConstant'
import { tableCellDom } from '../../constants/DomConstant'
import { CREATE_SINGLE_FONTS, SHOW_DIALOG_ALERT } from '../../constants/TodoFilters'
import { log } from '../../constants/UtilConstant'
import { getmCustomScrollbar } from '../../constants/EventsConstant'

import { 
	getSingleFontsList, 
	getInItRoute, 
	initializationData,
	triggerDialogInfo,
	eventsInitializationData,
	initializationLoadingData
} from '../../actions/fontsActions'

const doc = document
class Sidebar extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		initTimeout: null,
    		isLogin: false
    	};
    	log("Sidebar");		
	}
	goToLogin(event){
        event.stopPropagation();
        event.preventDefault();
        this.props.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "字体单需要登录后才能使用",auto: true,speed: 1500,statu: 0})		
	}
	routePage(route, subRoute, event) {
		log("点击菜点")
        event.stopPropagation();
        event.preventDefault();
        if( this.props.subRoute && subRoute.name == this.props.subRoute.name ){
        	return
        }
		//清空events数据
		this.props.eventsInitializationData();
		//清空fonts数据
		this.props.initializationLoadingData();
		//清除滚动条,等待加载时样式还原
		if( $(".scllorBar_commonList").length > 0 ){
			$(".scllorBar_commonList").mCustomScrollbar("destroy");
		}    
		route['mode'] = 'menu'
		//这边的this.props.fonts.common获取的可能是上一次的。有bug
		route['common'] = null     
        setTimeout(() => {
	        this.props.getInItRoute({
	        	route: route, 
	        	subRoute: subRoute,
	        })
        },5)
        log("开启透明层")
		const optElem = doc.querySelector('.body-opacity-layer')
		optElem.style.display = 'block' 
		optElem.classList.add('opt0')                	
	}
	createSingleFonts(event) {
        event.stopPropagation();
        event.preventDefault();
	     // this.props.getInItRoute({
	     // 	route: ROUTES[2], 
	     // 	subRoute: ROUTES[2].data[100]
	     // })              		
	}
	submenuBtn(event) {
        const a_Elem = event.currentTarget,
              ul_Elem = a_Elem.nextSibling;
        log(ul_Elem.style.display)      
        if( ul_Elem.style.display == 'none' ){
            $(ul_Elem).stop(true, true).delay(10).slideDown(300);
            a_Elem.className = 'submenu-indicator-minus';        	
        }else{
            $(ul_Elem).stop(true, true).delay(10).slideUp(300);
            a_Elem.className = '';        	
        }
	}	
  render() {  
    const { subRoute, route, loginUserData, login, downloadMsg } = this.props
    let { isLogin } = this.state
  	 if( login && login.loginUserData ){
  	 	if( login.loginUserData.id != null && login.loginUserData.id > 0 ){
  	 		isLogin = true
  	 	}
  	 }  
    return (
	      <div id="jquery-accordion-menu" className="jquery-accordion-menu f5">
	          {
	          	   route ? 
			          <ul className="menu-list scllorBar_app" id="menu">
			             {
			             	ROUTES.map((elem, index) => {
		             		    if( elem.menu == "SearchMain" ){
                                    return null
		             		    }else{
				             		return <li className={classnames({"default": elem.classes != ""})} key={elem.key}>
					             		    {
					             		    	elem.classes == "" ?
					             		    	    isLogin ? 
						             		    	 	<a onClick={this.submenuBtn.bind(this)} className="submenu-indicator-minus">
						             		    	 	   {elem.text}
						             		    	 	   <i className="icons icons-18 submenu-list-bg submenu-indicator"></i>
						             		    	 	</a>
						             		    	:
						             		    	 	<a onClick={this.goToLogin.bind(this)}>
						             		    	 	   {elem.text}
						             		    	 	   <i className="icons icons-18 submenu-list-bg submenu-indicator"></i>
						             		    	 	</a>				             		    	     	
					             		    	:
					             		    	    <a>{elem.text}</a> 
					             		    }
					             		    <ul className="submenu" role="nav">
					             		    {
					             		    	elem.data.map((data, index) => {
					             		    		const iicons = "fa icons "+ data.icons
					             		    		return <li key={index} className={classnames({"active": subRoute && data.name == subRoute.name ? true : false},{"default": true})}>
					             		    	       <a onClick={this.routePage.bind(this, elem, data)}>
					             		    	          <i className={iicons}></i>
					             		    	          {data.text} 
					             		    	       </a>
					             		    	    </li>
					             		    	})
					             		    }
					             		    </ul>
					             		    {
					             		    	elem.menu == "CreateSingleFonts" ?
					             		    	   isLogin ? 
					             		    	   	  <i className="icons icons-18 csf-bg abs create-csf-btn" onClick={this.createSingleFonts.bind(this)}></i>
					             		    	   :
					             		    	      <i className="icons icons-18 csf-bg abs create-csf-btn" onClick={this.goToLogin.bind(this)}></i>	  
					             		    	:
					             		    	   null    
					             		    }			             		    
					             		</li>
					            } 		
			             	})
			             }
					  </ul>
				    :
				      null	  	          	   
	          }
	      </div>
    )
  }  
  componentDidMount() {    
  	 //初始化选中Tab
  	 setTimeout(() => {
  	 	 const initRoute = ROUTES[0] ? ROUTES[0] : {};
	     this.props.getInItRoute({
	     	route: initRoute, 
	     	subRoute: initRoute.data[0]
	     })
  	 }, 50)
  } 
  componentWillReceiveProps(nextProps) {
	  	const login = nextProps.login;
	  	if( login && login.loginUserData && login.loginLastUpdated !== this.props.login.loginLastUpdated ){
	  	 	//初始化获取Tab接口数据
	  	 	if( login.loginUserData.id != null && login.loginUserData.id > 0 ){
	  	 		this.props.getSingleFontsList(login.loginUserData.id)
	  	 	}
	  	}

       if( nextProps.menuSingleData && nextProps.singleLastUpdated !== this.props.singleLastUpdated ){
       	    if( nextProps.menuSingleData.data ){
		    	let lens = nextProps.menuSingleData.data.length,
		    	    newArrayData = []
		    	if( lens > 0 ){
		    		for( let j = 0; j < lens; j++ ){
		    			let singleObj = { 
		    				text: nextProps.menuSingleData.data[j].list_name, 
		    				id: nextProps.menuSingleData.data[j].id, 
		    				name:"CREATE_SINGLE_FONTS_"+ j, 
		    				icons:"fa-like-font", 
		    				value: j, 
		    				key: j + 1,
		    				data: nextProps.menuSingleData.data[j]
		    			}
		    			newArrayData.push(singleObj)
		    		}
			        for( let i = 0; i < ROUTES.length; i++ ){
			        	if( ROUTES[i].menu == CREATE_SINGLE_FONTS ){
			        		//ROUTES[i].data.unshift.apply(ROUTES[i].data, newArrayData)
			        		ROUTES[i].data = newArrayData
			        		if( nextProps.creatSingleRoute && nextProps.creatSingleRoute.error_code == 0 ){
			        			for( let k = 0; k < ROUTES[i].data.length; k++ ){
			        				if( ROUTES[i].data[k].id == nextProps.creatSingleRoute.data.id ){
									     this.props.getInItRoute({
									     	route: ROUTES[i], 
									     	subRoute: ROUTES[i].data[k]
									     })
									     return false;
			        				}
			        			}
			        		}
			        	}
			        }
		        }
	        }       	   
       }   	 
  }   
  componentDidUpdate(nextProps, nextState) {
  	const jq_Elem = $('#jquery-accordion-menu'),
          ul_Elem = jq_Elem.find('.menu-list.scllorBar_app');
  	if( !nextProps.subRoute && nextProps.routeLastUpdated !== this.props.routeLastUpdated ){
	     if( ul_Elem.length > 0 ){
	  	 	//jq_Elem.jqueryAccordionMenu();
	  	 	getmCustomScrollbar(ul_Elem)  	 	
	  	 } 	  	   	    
  	}
  	if( nextProps.routeLastUpdated !== this.props.routeLastUpdated && this.props.inititlizeteCompleted &&
  		this.props.inititlizeteCompleted.data && this.props.inititlizeteCompleted.data.status == 0 ){
  		this.state.optHidetime = setTimeout(() => {
			log("解除透明层结束1") 
			const optElem = doc.querySelector('.body-opacity-layer')
			optElem.style.display = 'none'
			optElem.classList.remove('opt0')
		}, 100)
  	}  
  	if( this.props.inititlizeteCompleted && nextProps.inititlizeteLastUpdated !== this.props.inititlizeteLastUpdated ){
  		//如果此回调比路由回调慢的时间，把透明层解除
  		if( this.props.inititlizeteCompleted.data && this.props.inititlizeteCompleted.data.status == 0 ){
	  		this.state.optHidetime = setTimeout(() => {
				log("解除透明层结束2") 
				const optElem = doc.querySelector('.body-opacity-layer')
				optElem.style.display = 'none'
				optElem.classList.remove('opt0')
			}, 100)        
  		}
  	}	
  	if( nextProps.resize !== this.props.resize ){
  		if( ul_Elem.length > 0 ){ 
			getmCustomScrollbar(ul_Elem, null, 'update') 			
  		}
  	}
 	
  }
  componentWillUnmount() {
  	if( this.state.optHidetime ){
  		clearTimeout(this.state.optHidetime)
  	}
  }  
}
const mapStateToProps = (state) => {
	return {
		route: state.inIt.route,
		subRoute: state.inIt.subRoute,
		routeLastUpdated: state.inIt.routeLastUpdated,

		menuSingleData: state.inIt.menuSingleData,
		creatSingleRoute: state.inIt.creatSingleRoute,
		singleLastUpdated: state.inIt.singleLastUpdated,

  		inititlizeteCompleted: state.inIt.inititlizeteCompleted,
        inititlizeteLastUpdated: state.inIt.inititlizeteLastUpdated,		
	}
}

export default connect(
  mapStateToProps,
  { getSingleFontsList, getInItRoute, initializationData, initializationLoadingData, triggerDialogInfo, eventsInitializationData }
)(Sidebar)
