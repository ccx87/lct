import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { SHOW_DOWNLOADED, SHOW_DOWNLOADING } from '../../../constants/TodoFilters'
import { DOWNLOAD_TAB, PAGE_TYPE } from '../../../constants/DataConstant'
import { loadingHtml } from '../../../constants/RenderHtmlConstant'
import { keySort, log, objClone } from '../../../constants/UtilConstant'

import Switch from '../../../modules/Switch'
import Panel from '../../../modules/functionBarModel/Panel'
import DownloadedTable from '../../../modules/tableModel/DownloadedTable'
import DownloadingTable from '../../../modules/tableModel/DownloadingTable'

//我的字体--下载管理
class DownloadManager extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		initTimeout: null,
    		filter: SHOW_DOWNLOADED
    	};
    	log("DownloadManager--下载管理");		
	}
  	handleShow(filter) {
  		this.setState({ filter })
  	}	
	render() {
		const { fonts } = this.props
		const { filter } = this.state
        let downloaded = [], downloading = [];
        if( fonts.downloadListData != null && fonts.downloadListData.data && fonts.downloadListData.data.length > 0 ){
        	for( let i = 0; i < fonts.downloadListData.data.length; i++ ){
              if( fonts.downloadListData.data[i].download_state == 0 ){
                if( fonts.downloadListData.data[i].is_del ){
              	   downloaded.push(fonts.downloadListData.data[i])
                }else{
                   downloaded.unshift(fonts.downloadListData.data[i])
                }
              }else{
              	  downloading.push(fonts.downloadListData.data[i])
              }
        	}
        }			     
		return <div className="download-manager">
		           <Switch options={DOWNLOAD_TAB} filter={filter} onShow={this.handleShow.bind(this)}/>
		           {
		           	    fonts.downloadListData ?
		               	   filter === SHOW_DOWNLOADED ?
	               	      	    <div className="dm-content">
		               	      	    <Panel filter={filter} {...this.props}/>
		               	      	    <DownloadedTable downloaded={downloaded} {...this.props}/>
	               	      	    </div>  
		               	   :
		               	   filter === SHOW_DOWNLOADING ? 
	               	      	  downloading.length > 0 ?
	               	      	     <div className="dm-content">
	               	      	        <Panel filter={filter} {...this.props}/>
	               	      	     	<DownloadingTable downloading={downloading} {...this.props}/>
	               	      	     </div>
	               	      	  :
	               	      	     <div className="dm-content">
	               	      	     	<div className="abs no-data">
	               	      	     	    <p className="flex">暂无正在下载的记录</p>
	               	      	     	</div>
	               	      	     </div> 					               	      	  
		               	   :
		               	      null     
				        :
				            loadingHtml(true)   	      
		           }
		       </div>
	}
  getDownloadStep(temp, _props) {
      if( _props.downloadBeging && !isEmpty(_props.downloadBeging.result) ){
          setTimeout(() => {
              console.log('已有正在下载的id：', _props.downloadBeging.result)
              this.props.actions.getDownloadList(1, _props.downloadBeging.result)
          },500)
      }else{
          if( _props.downloadIds && _props.downloadIds.length > 0 ){
              //if( temp && _props.downloadIds && _props.downloadIds[0] && this.props.downloadIds && 
              //    this.props.downloadIds[0] && _props.downloadIds[0] == this.props.downloadIds[0] ){
              //    console.log('已经请求过了的下载id：',_props.downloadIds[0])
              //    return 
              //}              
              const login_id = _props.login && _props.login.loginUserData && _props.login.loginUserData.id;
              console.log('新的下载id：', _props.downloadIds[0])
              setTimeout(() => {
                  this.props.actions.getDownloadFontBeging(login_id, _props.downloadIds[0]) 
              },500)
          }
      }     
  }  
	componentDidMount() {
		setTimeout(() => {
			this.props.actions.getDownloadList(0, null, this.props.type)
		},50)
    setTimeout(() => {
      this.getDownloadStep(0, this.props)
    },200)
	}
	componentWillReceiveProps(nextProps){
		const fonts = nextProps.fonts;
      if( nextProps.addDownloadLastUpdated !== this.props.addDownloadLastUpdated ){
          this.getDownloadStep(1, nextProps)
      }
      if( nextProps.downloadBegingLastUpdated !== this.props.downloadBegingLastUpdated ){
          console.log('第二步：', nextProps.downloadBeging && nextProps.downloadBeging.result)
          setTimeout(() => {
              this.props.actions.getDownloadList(1, nextProps.downloadBeging.result)
          },500)      
      }     
        if( fonts.downloadLastUpdated !== this.props.fonts.downloadLastUpdated ){
            if( nextProps.idData && nextProps.idData.length > 0 ){
               if( fonts.downloadListData != null && fonts.downloadListData.data && fonts.downloadListData.data.length > 0 ){
                    if( nextProps.downloadListData && nextProps.downloadListData.data && nextProps.downloadListData.data.length > 0 ){
                    	  //如果当前有正在下载的字体，则push进去
                        fonts.downloadListData.data.push(nextProps.downloadListData.data[0])
                    }
                    nextProps.idData.forEach(item => {
                    	fonts.downloadListData.data.forEach((it, index) => {
                    		if( item.font_id == it.font_id ){
                            fonts.downloadListData.data.splice(index, 1)
                    		}
                    	})
                    	item["speed"] = 0
                        fonts.downloadListData.data.push(item)                        	
                    })
               }else{
               		fonts["downloadListData"]["data"] = nextProps.idData
                    if( nextProps.downloadListData && nextProps.downloadListData.data && nextProps.downloadListData.data.length > 0 ){
                       fonts.downloadListData.data.unshift(nextProps.downloadListData.data[0])
                    }               	
                   
               }
            }
        }
      	if( nextProps.downloadListData && nextProps.downloadListData.length > 0 && nextProps.downloadLastUpdated !== this.props.downloadLastUpdated ){
      		nextProps.downloadListData.forEach(item => {
      			if( item.download_state == 0 || item.download_state == 3 ){
      				setTimeout(() => {
		            	this.props.actions.initializationEventsCallback('DOWNLOAD', [item.font_id])
		        	}, 50)
		            this.props.actions.downloadMessage({number: 1})      				
      			}else if( item.download_state == 1 ){
      				setTimeout(() => {
                  this.props.actions.getDownloadList(1, item.font_id)
      				},500)
      			}
      		})
	        if( fonts.downloadListData != null && fonts.downloadListData.data && fonts.downloadListData.data.length > 0 ){
              for(let i = 0, lens = fonts.downloadListData.data.length; i < lens; i++){
                	const newItem = nextProps.downloadListData.filter(it => it.font_id == fonts.downloadListData.data[i].font_id)
                  if( newItem && newItem[0] ){
                    	fonts.downloadListData.data[i] = newItem[0]
                    	break;
                  }
              }
	        }
      	} 		
	}
	componentWillUnmount(){
		log('退出下载管理页面并清空数据');
    this.props.actions.eventsInitializationData();
		this.props.actions.initializationData();
    //this.props.actions.initializationLoadingData();			   			
	}				
}	
DownloadManager.defaultProps = {
	type: objClone(PAGE_TYPE.Font_Assistant.download_manager)
}
const mapStateToProps = (state) => {
	return {
	  idData: state.inIt.idData,	
      downloadIds: state.inIt.downloadIds,
      addDownloadLastUpdated: state.inIt.addDownloadLastUpdated,

      downloadListData: state.inIt.downloadListData,
      downloadLastUpdated: state.inIt.downloadLastUpdated,
      
      downloadBeging: state.inIt.downloadBeging,
      downloadBegingLastUpdated: state.inIt.downloadBegingLastUpdated      
	}
}
export default connect(
  mapStateToProps
)(DownloadManager)
