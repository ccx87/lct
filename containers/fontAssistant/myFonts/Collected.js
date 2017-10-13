import React, { Component, PropTypes } from 'react'

import { MENU, SORT, PAGE_TYPE } from '../../../constants/DataConstant'
import { addArray, log, addArrayObj, cloneObj } from '../../../constants/UtilConstant'
import { 
	MY_FONTS_COLLECTED, 
	MENU_ALL_CHECK, 
	MENU_UNCOLLECT, 
	MENU_INSTALL, 
	MENU_UNINSTALL, 
	MENU_REFRESH, 
  SORT_ALL, SORT_INSTALLED, SORT_UNINSTALL, SORT_CLOUD, SORT_CHINESE, SORT_ENGLISH, SORT_JAPANESE,
  SORT_KOREAN, SORT_OTHER, SORT_DAY, SORT_WEEK, SORT_MONTH
   } from '../../../constants/TodoFilters'
import { getFontInItData } from '../../../constants/InItConstant'

import TitleBar from '../../../modules/TitleBar'
import DataError from '../../../modules/DataError'
import Search from '../../../modules/functionBarModel/Search'
import Menu from '../../../modules/functionBarModel/Menu'
import DetailAttributes from '../../../modules/detailModel/DetailAttributes'
import CommonList from '../../../modules/CommonList'

//我的字体--已收藏
class Collected extends Component {	
  	constructor(props, context) {
    	super(props, context);
    	this.state = {timeout: null};
    	log("Collected--已收藏：实例化开始")
  	}	
  	onGetFontListData() {
  	  this.state.timeout = setTimeout(() => {
  			 this.props.actions.getFontRequest(getFontInItData(this.props))
  		},50)  	 
  	}  	   	
    render() {
    	const { fonts, type} = this.props
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
      	log(this.props)
      	if( t_ic && t_ic.data ){
            if( t_ic.data.status == 0 ) {
                this.onGetFontListData()
            } 
      	}				
  	}
    componentWillReceiveProps(nextProps){
        log('已收藏---componentWillReceiveProps')
        log(nextProps)
        log(this.props)
        const n_f = nextProps.fonts;
        if( n_f && n_f.afterFids && n_f.afterFids.length > 0 && n_f.allList ){
              //去云端获取字体信息
              log('已收藏---去云端')
              this.state.timeout = setTimeout(() => {
                  this.props.actions.fetchPostFontRequest(n_f)
              },10)           
        }
    }
    componentWillUnmount(){
        clearTimeout(this.state.timeout) 
    }        		     
}
Collected.defaultProps = {
	hasCheck: 1, //1表示列表有选择框，其余则无
	less: 151, //用来计算减去的高度，让加载样式居中		
	type: PAGE_TYPE.Font_Assistant.my_collection,	
	menu: addArray(MENU, [MENU_ALL_CHECK, MENU_UNCOLLECT, MENU_INSTALL, MENU_UNINSTALL, MENU_REFRESH]),
  sort: addArrayObj(cloneObj(SORT), [SORT_ALL, SORT_INSTALLED, SORT_UNINSTALL, SORT_CLOUD, SORT_CHINESE, SORT_ENGLISH, SORT_JAPANESE,SORT_KOREAN, SORT_OTHER, SORT_DAY, SORT_WEEK, SORT_MONTH])  
}
Collected.propTypes = {
  fonts: PropTypes.any.isRequired,
  actions: PropTypes.object.isRequired	
}
export default Collected
