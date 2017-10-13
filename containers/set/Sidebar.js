import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'

import { ROUTES_SET } from '../../constants/DataConstant'
import { loadingHtml2 } from '../../constants/RenderHtmlConstant'
import { tableCellDom } from '../../constants/DomConstant'
import { CREATE_SINGLE_FONTS, SHOW_DIALOG_ALERT, SET_COMMON } from '../../constants/TodoFilters'
import { log } from '../../constants/UtilConstant'

import { 
	getInItRoute, 
	triggerDialogInfo 
} from '../../actions/SetActions'

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
        this.props.initializationData();
        setTimeout(() => {
	        this.props.getInItRoute({
	        	route: route, 
	        	subRoute: route.data,
	        })
        },10)                	
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
	      <div id="jquery-accordion-menu" className="jquery-accordion-menu f5" style={{"display": "none"}}>
	          {
	          	   route ? 
			          <ul className="menu-list scllorBar_app default" id="menu">
			             {
  			             	ROUTES_SET.map((elem, index) => {
    			             		return <li className={classnames({"active": elem.menu == SET_COMMON ? true : false},{"default": true})} key={elem.key}>
      			             		    	 	<a className="submenu-indicator-minus">
      			             		    	 	   {elem.text}
      			             		    	 	</a>			             		    
    				             		     </li>		
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
	     this.props.getInItRoute({
  	     	route: ROUTES_SET[0], 
  	     	subRoute: ROUTES_SET[0].data
	     })
  	 }, 50)
  }  
  componentDidUpdate(nextProps, nextState) {
  	const jq_Elem = $('#jquery-accordion-menu'),
          ul_Elem = jq_Elem.find('.menu-list.scllorBar_app');
  	if( !nextProps.subRoute && nextProps.routeLastUpdated !== this.props.routeLastUpdated ){
	     if( ul_Elem.length > 0 ){
    			ul_Elem.mCustomScrollbar({
      				theme:"dark-3",
      				scrollInertia:550		
    			 });  	 	
	  	 } 	  	   	    
  	}  	
  	if( nextProps.resize !== this.props.resize ){
    		if( ul_Elem.length > 0 ){
  			    ul_Elem.mCustomScrollbar('update');  			
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
		routeLastUpdated: state.inIt.routeLastUpdated	
	}
}

export default connect(
  mapStateToProps,
  { getInItRoute, triggerDialogInfo }
)(Sidebar)
