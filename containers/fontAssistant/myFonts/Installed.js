import React, { Component, PropTypes } from 'react'

import { MENU, SORT, PAGE_TYPE } from '../../../constants/DataConstant'
import { addArray, log, objClone } from '../../../constants/UtilConstant'
import { getFontInitObjectData } from '../../../constants/ConfigInfo'
import { MY_FONTS_INSTALLED, MENU_ALL_CHECK, MENU_UNCOLLECT, MENU_COLLECT, MENU_UNINSTALL, MENU_REFRESH, SORT_ALL, SORT_INSTALLED, SORT_UNINSTALL, SORT_WEEK, SORT_MONTH } from '../../../constants/TodoFilters'

import TitleBar from '../../../modules/TitleBar'
import DataError from '../../../modules/DataError'
import Search from '../../../modules/functionBarModel/Search'
import Menu from '../../../modules/functionBarModel/Menu'
import DetailAttributes from '../../../modules/detailModel/DetailAttributes'
import CommonList from '../../../modules/CommonList'

//我的字体--已安装
class Installed extends Component {	
  	constructor(props, context) {
    	super(props, context);
    	this.state = {};
    	log("Installed--已安装：实例化开始")
  	}
  	onGetFontListData() {
  		let t_c = objClone(getFontInitObjectData);
	    if( this.props.route.mode === 'nav' && this.props.route.common ){
	        t_c = this.props.route.common
	    }  		
  		t_c.type = this.props.type.value;
  		t_c.user_id = this.props.login.loginUserData ? this.props.login.loginUserData.id : null;  		 
  	    setTimeout(() => {
  			this.props.actions.getFontRequest(t_c)
  		}, 50)
  	}	
    render() {
    	const { fonts, type } = this.props
    	const title = {dataLength: fonts.fontListData != null && fonts.fontListData.data != null ? fonts.fontListData.data.total : 0, type: type}
      return <div className="my-fonts">
	            <TitleBar 
	                data={title} {...this.props}/>
	            <div className="container">
	                <Search {...this.props} />
	                <div className="con"> 
		            	<Menu {...this.props} />
			            <div className="content-list">
			                <CommonList {...this.props}/>             
				        </div>
				        <DetailAttributes {...this.props}/>
			        </div>
			    </div>      
        	</div>
    }
	componentDidMount() {
		const t_ic = this.props.inititlizeteCompleted
		if( t_ic && t_ic.data ){
            if( t_ic.data.status == 0 ) {
				this.onGetFontListData()
            } 
		}
	}
	componentWillReceiveProps(nextProps){
		if( nextProps.inititlizeteCompleted && nextProps.inititlizeteLastUpdated !== this.props.inititlizeteLastUpdated ){
			const n_initData = nextProps.inititlizeteCompleted.data;
		  	if( n_initData ){
                if( n_initData.status == 0 ){
                	log("数据库已建成，开始读取数据")
					this.onGetFontListData()	
                }
            }    
		}
	} 	     
}
Installed.defaultProps = {
	hasCheck: 1, //1表示列表有选择框，其余则无
	less: 151, //用来计算减去的高度，让加载样式居中		
	type: PAGE_TYPE.Font_Assistant.installed_font,
	menu: addArray(MENU, [MENU_ALL_CHECK, MENU_COLLECT, MENU_UNINSTALL, MENU_REFRESH]),
	sort: addArray(SORT, [SORT_ALL, SORT_INSTALLED, SORT_UNINSTALL, SORT_WEEK, SORT_MONTH])  
}
Installed.propTypes = {
  fonts: PropTypes.any.isRequired,
  actions: PropTypes.object.isRequired	
}
export default Installed
