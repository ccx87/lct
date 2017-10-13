import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { FILE_MENU, FILE_SORT } from '../../constants/DataConstant'
import { log, addArray, addArrayObj, objClone } from '../../constants/UtilConstant'
import { MENU_BATCH_EDIT, MENU_IMMEDIATELY_SCAN, MENU_DEL, 
         SORT_FILE_NAME, SORT_FILE_SIZE, SORT_FILE_UPDATE_TIME, 
         SORT_FILE_TYPE, SORT_ASC, SORT_DES, SHOW_THUMBNAIL_MODE, SHOW_LIST_MODE } from '../../constants/TodoFilters'

import Menu from '../../modules/functionBarModel/Menu'
import FileMenu from '../../modules/functionBarModel/FileMenu'
import NavigationBar from '../../modules/functionBarModel/NavigationBar'
import FileListTable from './FileListTable'
import FileInfoDetail from './FileInfoDetail'         

class MainContent extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            dispaly_mode: SHOW_LIST_MODE
        };
      	log("MainContent");		
  	}	  
    render() {
        const { dispaly_mode } = this.state
        const _props = this.props;
        return (
          <div className="main-content" style={{"height":"100%"}}>
              <NavigationBar 
                 actions={_props.actions}
                 resize={_props.resize}
                 files={_props.files}
                 route={_props.route}/>
              <div className="g-mc flex felx-l felx-l-l" style={{"height": "calc(100% - 37px)"}}>
                 <div className="mc-l flex-item-gsb-1" style={{"height":"100%"}}>
                    <Menu
                        actions={_props.actions}
                        login={_props.login}
                        files={_props.files} 
                        menu={_props.menu}
                        sort={_props.sort}
                        route={_props.route}
                        routeLastUpdated={_props.routeLastUpdated}
                        noticeMsgLastUpdated={_props.noticeMsgLastUpdated}
                        noticeMsg={_props.noticeMsg}
                        menuModel={2} sortModel={2} displayMode={dispaly_mode} inItData={[SORT_FILE_NAME,SORT_ASC]}/>                 
                    <FileListTable 
                        resize={_props.resize}
                        login={_props.login}
                        files={_props.files}
                        actions={_props.actions}
                        actionsLF={_props.actionsLF}
                        route={_props.route}
                        routeLastUpdated={_props.routeLastUpdated}
                        getConfig={_props.getConfig}
                        configLastUpdated={_props.configLastUpdated}
                        delectScanDocs={_props.delectScanDocs}
                        delectScanDocsLastUpdated={_props.delectScanDocsLastUpdated}
                        pasteData={_props.pasteData}
                        pasteDataLastUpdated={_props.pasteDataLastUpdated}
                        fileItemData={_props.fileItemData}
                        fileItemDataLastUpdated={_props.fileItemDataLastUpdated}                                                 
                        displayMode={dispaly_mode}
                        jsMsgHandle={_props.jsMsgHandle}
                        jsMsgHandleLastUpdated={_props.jsMsgHandleLastUpdated}/>
                 </div>
                 <div className="mc-r flex-item-gsb-0" style={{"height":"100%"}}>
                     <FileInfoDetail 
                        resize={_props.resize}
                        login={_props.login}
                        actions={_props.actions}
                        actionsLF={_props.actionsLF}
                        attributes={_props.attributes}
                        attributesLastUpdated={_props.attributesLastUpdated}
                        fileInfoData={_props.fileInfoData}
                        fileInfoDataLastUpdated={_props.fileInfoDataLastUpdated}/>
                 </div>  
              </div>
          </div>
        )
    } 
    componentWillReceiveProps(nextProps) {
        if( nextProps.modeChangeMsg && nextProps.modeChangeMsgLastUpdated !== this.props.modeChangeMsgLastUpdated ){
            this.setState({
                dispaly_mode: nextProps.modeChangeMsg
            })
        }
    } 
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))      
    }    
}
MainContent.defaultProps = {
    menu: addArray(FILE_MENU, [MENU_BATCH_EDIT, MENU_IMMEDIATELY_SCAN, MENU_DEL]),
    sort: addArrayObj(FILE_SORT, [SORT_FILE_NAME, SORT_FILE_SIZE, SORT_FILE_UPDATE_TIME, SORT_FILE_TYPE, SORT_ASC, SORT_DES]) 
}
export default immutableRenderDecorator(MainContent)
