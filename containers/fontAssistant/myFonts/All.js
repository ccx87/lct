import React, { Component, PropTypes } from 'react'

import { addArray, addArrayObj, log, cloneObj } from '../../../constants/UtilConstant'
import { MENU, SORT, PAGE_TYPE } from '../../../constants/DataConstant'
import { MENU_ALL_CHECK, MENU_COLLECT, MENU_INSTALL, MENU_UNINSTALL, MENU_REFRESH, 
         SORT_ALL, SORT_INSTALLED, SORT_UNINSTALL,SORT_CLOUD, SORT_CHINESE, SORT_ENGLISH, SORT_JAPANESE,
         SORT_KOREAN, SORT_OTHER, SORT_DAY, SORT_WEEK, SORT_MONTH } from '../../../constants/TodoFilters'
import { getFontInItData } from '../../../constants/InItConstant'

import TitleBar from '../../../modules/TitleBar'
import DataError from '../../../modules/DataError'
import Search from '../../../modules/functionBarModel/Search'
import Menu from '../../../modules/functionBarModel/Menu'
import DetailAttributes from '../../../modules/detailModel/DetailAttributes'
import CommonList from '../../../modules/CommonList'

//我的字体--全部
class All extends Component {
  	constructor(props, context) {
      	super(props, context);
      	this.state = {
            timeout: null
        };
      	log("All--全部");
  	}	
  	onGetFontListData() {
    	  this.state.timeout = setTimeout(() => {
    			 this.props.actions.getFontRequest(getFontInItData(this.props))
    		},50)		
  	}  	  	
    render() {
      	const { fonts, type } = this.props
      	const title = {dataLength: fonts.fontListData != null && fonts.fontListData.data != null ? fonts.fontListData.data.total : 0, type: type}
        return <div className="my-fonts">
    	            <TitleBar 
    	                data={title} {...this.props}/>
    	            <div className="container">
    	                <Search {...this.props}/>
    	                <div className="con">  
    		            	<Menu {...this.props} />
    			            <div className="content-list" ref="clientHeight">						            
    			                <CommonList 
    			                    {...this.props}/>							           							                    
    				        </div>
    				        <DetailAttributes {...this.props}/>
    			        </div>
    			    </div>      
            	</div>
    }
    componentWillMount() {
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
    componentWillUnmount(){
        clearTimeout(this.state.timeout)
    }      
}
All.defaultProps = {
	hasCheck: 1, //1表示列表有选择框，其余则无
	less: 151, //用来计算减去的高度，让加载样式居中	
	type: PAGE_TYPE.Font_Assistant.local_font,
	menu: addArray(MENU, [MENU_ALL_CHECK, MENU_COLLECT, MENU_INSTALL, MENU_UNINSTALL, MENU_REFRESH]),
	sort: addArrayObj(cloneObj(SORT), [SORT_ALL, SORT_INSTALLED, SORT_UNINSTALL, SORT_CHINESE, SORT_ENGLISH, SORT_JAPANESE,SORT_KOREAN, SORT_OTHER, SORT_DAY, SORT_WEEK, SORT_MONTH]) 
}
All.propTypes = {
  fonts: PropTypes.any.isRequired,
  actions: PropTypes.object.isRequired	
}
export default All
