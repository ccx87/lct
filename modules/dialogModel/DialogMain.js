import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import {
	SHOW_GUILD_1,
	SHOW_GUILD_2,
	SHOW_ADD_FRIENDS,
	DOWNLOAD_NG_FILE,
	SHOW_MANUAL_SCAN,
	SHOW_DIALOG_CLFF,
	SHOW_DIALOG_ALERT,
	SHOW_DIALOG_ERROR,
	SHOW_DIALOG_SETUP,
	SHOW_MODIFY_COMMENT,
	SHOW_DIALOG_CONFIRM,
	SHOW_SELECT_FOLDERS,
	SHOW_DIALOG_TAGLIST,
	SHOW_LOCAL_FILES_SCAN,
	SHOW_DIALOG_LOGIN_LAYER,
	SHOW_LOCAL_FOLDER_SCAN_SET,
	SHOW_DIALOG_MOVE_PREVIEW_FILES,
	SHOW_NO_FILES_SCAN_PROCESS
} from '../../constants/TodoFilters'
import { log } from '../../constants/UtilConstant'

import Error from './Error'
import Alert from './Alert'
import Setup from './Setup'
import Guild1 from './Guild1'
import Guild2 from './Guild2'
import Confirm from './Confirm'
import TagList from './TagList'
import ManualScan from './ManualScan'
import FontFolder from './FontFolder'
import LoginLayer from './LoginLayer'
import AddFriends from './AddFriends'
import SelectFolders from './SelectFolders'
import ModifyComment from './ModifyComment'
import LocalFilesScan from './LocalFilesScan'
import DownloadNgFile from './DownloadNgFile'
import LocalFolderScanSettings from './LocalFolderScanSettings'
import MovePreviewFiles from './MovePreviewFiles'
import NoFilesScanProcess from './NoFilesScanProcess'

class DialogMain extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("DialogMain");		
	}
	render() {
		const { dialogData } = this.props
		return <div className="dialog-main unbody">
		            {
		            	dialogData ?
		            	    dialogData.type === SHOW_GUILD_1 ?
                               <Guild1 {...this.props}/>
		            	    :
		            	    dialogData.type === SHOW_GUILD_2 ?
                               <Guild2 {...this.props}/>
		            	    :		            	    
		            	    dialogData.type === SHOW_DIALOG_SETUP ?
                               <Setup {...this.props}/>
		            	    :
		            	    dialogData.type === SHOW_MANUAL_SCAN ?
							   <ManualScan {...this.props}/>
		            	    :
			            	dialogData.type === SHOW_DIALOG_CLFF ?
			            	   <FontFolder {...this.props}/>
			            	:
			            	dialogData.type === SHOW_DIALOG_ALERT ?
			            	   <Alert {...this.props}/>
			            	:		            	
			            	dialogData.type === SHOW_DIALOG_ERROR ?
			            	   <Error {...this.props}/>
			            	:
			            	dialogData.type === SHOW_DIALOG_CONFIRM ?
			            	   <Confirm {...this.props}/>
			            	:
			            	dialogData.type === SHOW_DIALOG_TAGLIST ?
                               <TagList {...this.props}/> 
			            	:   
			            	dialogData.type === SHOW_LOCAL_FOLDER_SCAN_SET ?
			            	   <LocalFolderScanSettings {...this.props}/>
			            	: 
			            	dialogData.type === SHOW_DIALOG_LOGIN_LAYER ?
                               <LoginLayer {...this.props}/>
			            	:  
			            	dialogData.type === SHOW_ADD_FRIENDS ?
                               <AddFriends {...this.props}/> 
			            	:   
			            	dialogData.type === SHOW_MODIFY_COMMENT ?
			            	   <ModifyComment {...this.props}/>
			            	:  
			            	dialogData.type === SHOW_LOCAL_FILES_SCAN ?
			            	   <LocalFilesScan {...this.props}/>
			            	:   
			            	dialogData.type === SHOW_DIALOG_MOVE_PREVIEW_FILES ?
			            	   <MovePreviewFiles {...this.props}/>
			            	:   
			            	dialogData.type === SHOW_NO_FILES_SCAN_PROCESS ?
			            	   <NoFilesScanProcess {...this.props}/>
			            	: 
			            	dialogData.type === SHOW_SELECT_FOLDERS ?
			            	   <SelectFolders {...this.props}/>
			            	:  
			            	dialogData.type === DOWNLOAD_NG_FILE ?
                               <DownloadNgFile {...this.props}/> 
			            	:    
			            	   null
			            :
			                null	        
		            }
		            <div className="abs body-opacity-layer unbody" id="body-opacity-layer"></div>
		       </div>
	}	
	componentWillReceiveProps(nextProps) {
		if( nextProps.dialogLastUpdated !== this.props.dialogLastUpdated ) {
			const optElem = document.getElementById('body-opacity-layer');
			if( optElem ){
				if( nextProps.dialogData ){
					if( nextProps.dialogData.type === SHOW_DIALOG_ALERT && 
						nextProps.dialogData.auto ){
                        optElem.style.display = 'none'
                        return; 
					}
					optElem.style.display = 'block'
				}else{
					optElem.style.display = 'none'				
				}			
			}			
		}
	}	
	shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))		
	}	
}
const mapStateToProps = (state) => {
	return {
		dialogLastUpdated: state.events.dialogLastUpdated,
		dialogData: state.events.dialogData,

        jsMsgHandle: state.inIt.jsMsgHandle,
        jsMsgHandleLastUpdated: state.inIt.jsMsgHandleLastUpdated 		
	}
}	
export default connect(
  mapStateToProps
)(immutableRenderDecorator(DialogMain))