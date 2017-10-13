import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { log, isEmpty, objClone } from '../../../constants/UtilConstant'
import { SEARCH_FONTS } from '../../../constants/TodoFilters'
import { getFontInitObjectData } from '../../../constants/ConfigInfo'
import { PAGE_TYPE } from '../../../constants/DataConstant'

import SearchFonts from './SearchFonts'

//搜索界面
class SearchMain extends Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
          initStatu: false
      };
      log("SearchMain");
    } 
    inItSearchFont(_props) {
        log("数据库已建成，开始读取数据")               
        if( !isEmpty(_props.searchFontData) ) {
           const t_c = objClone(getFontInitObjectData);
            t_c.search_text = _props.searchFontData;
            t_c.temp = 1;   
            t_c.type = PAGE_TYPE.Font_Assistant.search_font.value;
            t_c.PageName = PAGE_TYPE.Font_Assistant.search_font.PageName;
            t_c.user_id = _props.login.loginUserData ? _props.login.loginUserData.id : null;
            //清空events数据
            _props.actions.eventsInitializationData();
            //清空fonts数据，保留common数据
            _props.actions.initializationLoadingData(t_c);
            setTimeout(() => {
                _props.actions.searchFontRequest(t_c)
            },80) 
            return false;           
        }
        if( _props.route && _props.route.mode === 'nav' ) {
            let t_c = null;
            if( _props.route.mode === 'nav' && _props.route.common ){
                t_c = objClone(_props.route.common)
            }else{
                t_c = objClone(getFontInitObjectData);
            }             
            //清空events数据
            _props.actions.eventsInitializationData();
            //清空fonts数据，保留common数据
            _props.actions.initializationLoadingData(t_c);
            setTimeout(() => {
                _props.actions.searchFontRequest(t_c)
            },80) 
            return false;                    
        }       
    }  
    render() {
        const { subRoute } = this.props
        return (
            <div className="main_container">
                {
                  subRoute ?
                    subRoute.name === SEARCH_FONTS ?
                       <SearchFonts {...this.props} />
                    :     
                       null
                  :
                    null         
                }
            </div>
        ) 
    } 
    componentDidMount() {
        const t_ic = this.props.inititlizeteCompleted
        if( t_ic && t_ic.data ){
            //字体数据库初始化完后执行搜索
            if( t_ic.data.status == 0 ) { 
                this.state.initStatu = true
                this.inItSearchFont(this.props)
            }
        }         
    }
    componentWillReceiveProps(nextProps){
        if( !this.state.initStatu && nextProps.inititlizeteCompleted 
            && nextProps.inititlizeteLastUpdated !== this.props.inititlizeteLastUpdated ){
            const n_initData = nextProps.inititlizeteCompleted.data;
            if( n_initData ){
                if( n_initData.status == 0 ){
                    this.inItSearchFont(nextProps) 
                }
            }
        }
    }                       
}
SearchMain.propTypes = {
  fonts: PropTypes.any.isRequired,
  actions: PropTypes.object.isRequired  
}
const mapStateToProps = (state) => {
  return {
    fonts: state.fonts
  }
}
export default connect(
  mapStateToProps
)(SearchMain)