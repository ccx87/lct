import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { SEARCH_ROUTES, FORMAT_TYPE, ROUTES } from '../../constants/DataConstant'

 import Main from '../../containers/fontAssistant/Main'
 import * as FontActions from '../../actions/fontsActions'

class SearchFont extends Component {
  	constructor(props) {
    	super(props);
    	this.state = {
      };
  	}	
    render() {
      const { searchFontData, actions, login, resize } = this.props
    	return (
    		<div className="shitu-info" style={{"position":"relative"}}>
          <div  className='info-title'>
              <span className='search-return shitu-icon'  onClick={() => this.props.setRoute(SEARCH_ROUTES[0])}> </span>
           </div>
                <div className="content-list">  
                <Main 
                   resize={resize} 
                   login={login} 
                   searchFontData={searchFontData && searchFontData.data} 
                   actions={actions}
                   defaultRoute={{route: ROUTES[2], subRoute: ROUTES[2].data[0]}}/>
            </div>
    		</div>
    	)
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
)(SearchFont)