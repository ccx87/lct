import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { SEARCH_ROUTES, FORMAT_TYPE, ROUTES } from '../../constants/DataConstant'

import Main from '../../containers/fontAssistant/Main'
import * as FontActions from '../../actions/fontsActions'

class MissingFont extends Component {
  	constructor(props) {
    	super(props);
    	this.state = {};
  	}	
    backFont() {
        try{      
            console.log('清空数据');
            this.props.actions.eventsInitializationData();
            this.props.actions.initializationData();      
        }catch(e){}
        this.props.setRoute(SEARCH_ROUTES[0])
    }
    render() {
      const { searchFontData, actions, login, resize, fonts } = this.props
    	return (
    		<div className="shitu-info" style={{"position":"relative"}}>
          <div  className='info-title'>
              <span className='search-return shitu-icon'  onClick={this.backFont.bind(this)}> </span>
           </div>
            <div className="content-list">  
                <Main 
                   resize={resize} 
                   login={login}
                   fonts={fonts} 
                   missingFontData={searchFontData && searchFontData.data} 
                   actions={actions}
                   defaultRoute={{route: ROUTES[1], subRoute: ROUTES[1].data[0]}}/>
            </div>
    		</div>
    	)
    }
    componentDidMount() {
        try{    
            setTimeout(() => {
                //首页关闭
                window.asyncStopGetDragDropFileRequest() //关闭拖拽监听
                console.log('关闭拖拽监听')
            }, 1000)
        }catch(e){}      
    }
}
function mapStateToProps(state) {
  return {
      searchFontData: state.searchfont.searchFontData,
      searchFontDataLastUpdated: state.searchfont.searchFontDataLastUpdated    
  }
}
function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(FontActions, dispatch)
    }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps   
)(MissingFont)