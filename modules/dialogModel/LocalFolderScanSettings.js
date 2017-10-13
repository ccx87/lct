import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { absVerticalCenter } from '../../constants/DomConstant'
import { dragDrop, log } from '../../constants/UtilConstant'
import { TAG_LIST, FOLDER_SCAN_SET_TAB } from '../../constants/DataConstant'
import { SHOW_FOLDER_SETTINGS, SHOW_PARAMENTER_SETTINGS, SHOW_SOFTWARE_SETTINGS } from '../../constants/TodoFilters'

import Switch from '../../modules/Switch'
import FolderSettings from '../smallModel/FolderSettings'
import SoftwareSettings from '../smallModel/SoftwareSettings'
import ParamenterSettings from '../smallModel/ParamenterSettings'

/* 弹出层--本地文件夹扫描设置  */
class LocalFolderScanSettings extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
      		 filter: SHOW_FOLDER_SETTINGS,
           colseAt: null 
      	};
      	log("LocalFolderScanSettings");		
  	}
    handleShow(filter) {
    		this.setState({ filter })
    }	
    closeDialog(event) {
        this.setState({colseAt: Date.now()})
    }
  	render() {
  		const { actions } = this.props
  		const { filter, colseAt } = this.state
  		log(this.props)
  		return <div className="dialog local-folder-scan-set-layer" ref="verticalCenter">
  		           <div className="dialog-title flex flex-c">
  		               <span style={{"width": "100%"}}>本地文件夹扫描设置</span>
  		               <a className="close-dialog" onClick={this.closeDialog.bind(this)}><i className="icons icons-18 close-dialog-bg"></i></a>
  		           </div>
  		           <div className="dialog-content">
  		               <Switch options={FOLDER_SCAN_SET_TAB} filter={filter} onShow={this.handleShow.bind(this)} arrow={"bottom"}/>
  		               {
                             filter === SHOW_FOLDER_SETTINGS ?
                                <FolderSettings {...this.props} colseAt={colseAt}/>
                             :
                             filter === SHOW_PARAMENTER_SETTINGS ? 
                                <ParamenterSettings {...this.props} colseAt={colseAt}/>
                             : 
                             filter === SHOW_SOFTWARE_SETTINGS ? 
                                <SoftwareSettings {...this.props} colseAt={colseAt}/>
                             : 
                                null                                                       
  		               }
  		           </div>
  		       </div>  
  	}
  	componentDidMount() {
  		  if(this.refs.verticalCenter){
  			    const parElem = document.querySelector('.local-folder-scan-set-layer'),
  			        dragElem = parElem.querySelector('.dialog-title')			
  			    absVerticalCenter(this.refs.verticalCenter)
  			    dragDrop(dragElem, parElem)
  		  }
        //初始化面板tab项
        if( this.props.dialogData && this.props.dialogData.filter ){
            this.setState({filter: this.props.dialogData.filter}) 
        }
  		  //初始化面板数据getConfig
        //这里重新调用一下是为了在外部重命名或删除了扫描路径后实时显示在面板上
        this.props.actions.getConfigInfo(null,'INIT_GET_CONFIG_DEFAULT')
  	}
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))        
    }
    componentDidUpdate(nextProps, nextState) {     
        if(nextProps.resize.h != this.props.resize.h || nextProps.resize.w != this.props.resize.w ){
        	absVerticalCenter(this.refs.verticalCenter)      
        }                
    } 			
}
const mapStateToProps = (state) => {
  	log('LocalFolderScanSettings----mapStateToProps')
  	log(state)
      return {
          files: state.files                	    
      }
}
export default connect(
    mapStateToProps
)(immutableRenderDecorator(LocalFolderScanSettings))
