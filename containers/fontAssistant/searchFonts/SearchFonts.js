import React, { Component, PropTypes } from 'react'

import { addArray, addArrayObj, log, isEmpty, cloneObj } from '../../../constants/UtilConstant'
import { MENU, SORT, PAGE_TYPE } from '../../../constants/DataConstant'
import ConfigInfo from '../../../constants/ConfigInfo'
import { MENU_ALL_CHECK, MENU_COLLECT, MENU_INSTALL, MENU_UNINSTALL, MENU_DOWNLOAD, MENU_REFRESH, 
  SORT_ALL, SORT_INSTALLED, SORT_UNINSTALL, SORT_CLOUD, SORT_CHINESE, SORT_ENGLISH, SORT_JAPANESE,
  SORT_KOREAN, SORT_OTHER, SORT_DAY, SORT_WEEK, SORT_MONTH} from '../../../constants/TodoFilters'

import TitleBar from '../../../modules/TitleBar'
import DataError from '../../../modules/DataError'
import Search from '../../../modules/functionBarModel/Search'
import Menu from '../../../modules/functionBarModel/Menu'
import DetailAttributes from '../../../modules/detailModel/DetailAttributes'
import CommonList from '../../../modules/CommonList'

//搜索界面
class SearchFonts extends Component {
  	constructor(props, context) {
    	super(props, context);
    	this.state = {
          timeout: null
      };
    	log("SearchFonts");
  	}	 	
    render() {
    	const { fonts, type } = this.props
    	if( fonts.common ){
    		  type.text = fonts.common.search_text
    	}
      const title = {
          dataLength: fonts && fonts.fontListData != null && fonts.fontListData.data != null ? fonts.fontListData.data.total : 0, 
          type: type
      }
      //如在搜索中心组合此模块的话并带入搜索关键字时
      if( this.props.searchFontData ){
          title.type.text = this.props.searchFontData
      }
      //如在此模块里搜索字体的话
      if( fonts && fonts.common && !isEmpty(fonts.common.search_text) ){
          title.type.text = fonts.common.search_text
      }
      return <div className="my-fonts">
	            <TitleBar data={title} {...this.props}/>
	            <div className="container">
	                <Search {...this.props}/>
	                <div className="con">  
    		            	<Menu {...this.props} />
    			            <div className="content-list" ref="clientHeight">					            
    			                <CommonList {...this.props}/>							           							                    
    				          </div>
  				            <DetailAttributes {...this.props}/>
			            </div>
			        </div>      
        	</div>
    }
    componentDidMount() {
        log('搜索---componentDidMount')
        log(this.props)      
        const n_f = this.props.fonts;
        if( n_f && n_f.afterFids && n_f.afterFids.length > 0 && n_f.allList ){
              //去云端获取字体信息
              log('搜索---去云端1') 
              log(n_f)             
              this.state.timeout = setTimeout(() => {
                 this.props.actions.fetchPostFontRequest(n_f)
              },10)           
        }       
    }
    componentWillReceiveProps(nextProps){
        log('搜索---componentWillReceiveProps')
        log(nextProps)
        log(this.props)
        const n_f = nextProps.fonts;
        if( n_f && n_f.afterFids && n_f.afterFids.length > 0 && n_f.allList ){
              //去云端获取字体信息
              log('搜索---去云端2')
              log(n_f)
              this.state.timeout = setTimeout(() => {
                  this.props.actions.fetchPostFontRequest(n_f)
              },10)           
        }
    }
    componentWillUnmount(){
        clearTimeout(this.state.timeout) 
    }         
}
SearchFonts.defaultProps = {
  hasCheck: 1, //1表示列表有选择框，其于则无
  less: 151, //用来计算减去的高度，让加载样式居中
	type: PAGE_TYPE.Font_Assistant.search_font,
	menu: addArray(MENU, [MENU_ALL_CHECK, MENU_COLLECT, MENU_INSTALL, MENU_UNINSTALL, MENU_DOWNLOAD, MENU_REFRESH]),
	sort: addArrayObj(cloneObj(SORT), [SORT_ALL, SORT_INSTALLED, SORT_UNINSTALL, SORT_CLOUD, SORT_CHINESE, SORT_ENGLISH, SORT_JAPANESE,SORT_KOREAN, SORT_OTHER, SORT_DAY, SORT_WEEK, SORT_MONTH]) 
}
SearchFonts.propTypes = {
  fonts: PropTypes.any.isRequired,
  actions: PropTypes.object.isRequired	
}
export default SearchFonts
