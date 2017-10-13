import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log } from '../../constants/UtilConstant'
import { FILE_ROUTES } from '../../constants/DataConstant'
import { LOCAL_FILE_TOTAL_PANELS, LOCAL_FILE_DESKTOP, LOCAL_FILE_CONTENT } from '../../constants/TodoFilters'

import TotalPanels from './TotalPanels'
import MainContent from './MainContent'
import Perf from 'react-addons-perf'
// Perf.start()
class Main extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            route: FILE_ROUTES[0]
        };
      	log("Main");		
  	}	
    render() {
      const { route } = this.state
      const _props = this.props
      return (
        <div className="main flex-item-gsb-1">
            {
                route ?
                    route.menu === LOCAL_FILE_TOTAL_PANELS ?
                       <TotalPanels 
                          resize={_props.resize}
                          files={_props.files} 
                          actions={_props.actions}
                          route={route}
                          routeLastUpdated={_props.routeLastUpdated}
                          getConfig={_props.getConfig}
                          configLastUpdated={_props.configLastUpdated}
                          actionsLog={_props.actionsLog}
                          actionsLF={_props.actionsLF}
                          pcNoticeMsg={_props.pcNoticeMsg}
                          pcNoticeMsgLastUpdated={_props.pcNoticeMsgLastUpdated}
                          noticeMsg={_props.noticeMsg}
                          noticeMsgLastUpdated={_props.noticeMsgLastUpdated}/>
                    :
                    route.menu === LOCAL_FILE_CONTENT ? 
                       <MainContent {...this.props} route={route}/>
                    :
                    route.menu === LOCAL_FILE_DESKTOP ? 
                       null
                    :
                       null         
                :
                    null   
            }
        </div>
      )
    } 
    componentWillReceiveProps(nextProps){
        if( nextProps.route && nextProps.routeLastUpdated != this.props.routeLastUpdated ){
            this.setState({
                route: nextProps.route
            })            
        }        
    }
    shouldComponentUpdate(nextProps, nextState){
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))         
    }    
}
const mapStateToProps = (state) => {
  	return {
        files: state.files,

    		route: state.inIt.route,
    		subRoute: state.inIt.subRoute,
    		routeLastUpdated: state.inIt.routeLastUpdated,

        check: state.events.check,
        checkLastUpdated: state.events.checkLastUpdated,

        uncheck: state.events.uncheck,
        uncheckLastUpdated: state.events.uncheckLastUpdated,

        modeChangeMsg: state.msg.modeChangeMsg,
        modeChangeMsgLastUpdated: state.msg.modeChangeMsgLastUpdated,

        fileItemData: state.events.fileItemData,
        fileItemDataLastUpdated: state.events.fileItemDataLastUpdated,   

        filter: state.events.filter,
        filterLastUpdated: state.events.filterLastUpdated,

        noticeMsgLastUpdated: state.msg.noticeMsgLastUpdated,
        noticeMsg: state.msg.noticeMsg,

        delectScanDocs: state.events.delectScanDocs,
        delectScanDocsLastUpdated: state.events.delectScanDocsLastUpdated,

        attributes: state.events.attributes,
        attributesLastUpdated: state.events.attributesLastUpdated,

        fileInfoData: state.events.fileInfoData,
        fileInfoDataLastUpdated: state.events.fileInfoDataLastUpdated,

        pasteData: state.events.pasteData,
        pasteDataLastUpdated: state.events.pasteDataLastUpdated,

        jsMsgHandle: state.inIt.jsMsgHandle,
        jsMsgHandleLastUpdated: state.inIt.jsMsgHandleLastUpdated                                                         
  	}
}
export default connect(
    mapStateToProps
)(immutableRenderDecorator(Main))
