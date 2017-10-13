import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { getFontState, log, isEmpty, objClone } from '../../../constants/UtilConstant'
import { PAGE_TYPE, GET_FONT_STATE } from '../../../constants/DataConstant'
import { getDetectsFontRest } from '../../../constants/EventsConstant'
import { loadingHtml } from '../../../constants/RenderHtmlConstant'

import DetectionFontUpload from '../../../modules/uploadModel/DetectionFontUpload'
import DetectionTitle from '../../../modules/titleModel/DetectionTitle'
import DetectionTable from '../../../modules/tableModel/DetectionTable'
import DetectionDetail from '../../../modules/detailModel/DetectionDetail'
import TitleBar from '../../../modules/TitleBar'

//缺失字体--自动补齐
class AutoFill extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		detectionSuccess: true
    	};
    	log("MissingFont--自动补齐");		
	}
	render() {
		const { fonts, actions, mode } = this.props
        let newArray = [],
            fontData = [],
            paddedData = [];
		//重组数据
		if( fonts.missingPsFileDetectData && fonts.missingPsFileDetectData.error_code == 0 && 
			fonts.missingPsFileDetectData.data && fonts.missingPsFileDetectData.data.length > 0 ){
            const f_ps = fonts.missingPsFileDetectData.data;
            newArray = getDetectsFontRest(f_ps, false);
			for( let m = 0; m < newArray.length; m ++ ){
				let hasIn = false;
				for( let n = 0; n < newArray[m].data.length; n++ ){
					if( getFontState(newArray[m].data[n].font_state) === GET_FONT_STATE.installed || 
						getFontState(newArray[m].data[n].font_state) === GET_FONT_STATE.in_needupdate ){
						hasIn = true;
					}
					fontData.push(newArray[m].data[n]) //存储所有可以显示字体
				}
				if( !hasIn ){
					let hasPd = false;
					for( let k = 0; k < newArray[m].data.length; k++ ){
						if( !isEmpty(getFontState(newArray[m].data[k].font_state)) && 
							getFontState(newArray[m].data[k].font_state) !== GET_FONT_STATE.not_download &&
							getFontState(newArray[m].data[k].font_state) !== GET_FONT_STATE.not_find ){
							hasPd = true;
							paddedData.push(newArray[m].data[k]) //用来判断一键补齐数据,只补齐第一个
							break;
						}
					}
					if( !hasPd ){
						paddedData.push(newArray[m].data[0]) //用来判断一键补齐数据,只补齐第一个
					}
					//paddedData.push(newArray[m].data[0]) //用来判断一键补齐数据,只补齐第一个
				}
			}
		}
		//console.log(fonts, newArray, fontData, paddedData)
		return <div className="auto-fill" id="AutoFill">
		            {
		            	mode == 1 ?
			            	<TitleBar 
				               data={{dataLength: newArray.length, type: this.props.type}} {...this.props}/>
		            	:
		            	   null
		            }   
		            {
		           	    fonts.missingPsFileDetectData && fonts.missingPsFileDetectData.error_code == 0 ?
						   <div className="detection-font-main">
					           <DetectionTitle 
					               {...this.props} 
					               paddedData={paddedData} 
					               fontData={fontData} 
					               listData={newArray}
					               mode={mode}/>
					           <div className="list-info">
						           <DetectionTable 
						           {...this.props} 
						           paddedData={paddedData} 
						           listData={newArray} 
						           fontData={fontData}/>
						           <DetectionDetail {...this.props} less={99}/>
					           </div>
					       </div>		           	   
		           	   :
					 	   <DetectionFontUpload 
					 	      fonts={fonts} 
					 	      subRoute={this.props.subRoute} 
					 	      actions={actions} 
					 	      actionsST={this.props.actionsST}
					 	      type={objClone(this.props.type)}
					 	      mode={mode}/>
		            }
		       </div>
	}	
	componentWillReceiveProps(nextProps) {
        //更新安装成功后的重新计算缺失个数
        if( nextProps.installMsg && nextProps.installMsgLastUpdated !== this.props.installMsgLastUpdated ){
            const install = nextProps.installMsg.install,
                  fontData = nextProps.fonts.missingPsFileDetectData && nextProps.fonts.missingPsFileDetectData.data;
            if( install && fontData ){
                for( var i = 0, len = fontData.length; i < len; i++ ){
                    if( fontData[i].font_id === install.font_id ){
                        fontData[i].font_state = install.result.font_state;
                        fontData[i].path = install.result.path;
                        break;                    	
                    }
                }           	
            }
        }		
	}
	componentWillUnmount(){
		try{			
			if( this.props.mode != 2 ){
				log('关闭拖拽监听并清空数据');
		        this.props.actions.eventsInitializationData();
				this.props.actions.initializationData();			
	        	window.stopAsyncGetDragDropFileRequest() //关闭拖拽监听
        	}
    	}catch(e){}    			
	}			
}
AutoFill.defaultProps = {
	type: PAGE_TYPE.Font_Assistant.font_fill
}
const mapStateToProps = (state) => {
	return {
		openFilePath_0: state.events.openFilePath_0,
		openFile0LastUpdate: state.events.openFile0LastUpdate,

        installMsg: state.msg.installMsg,
        installMsgLastUpdated: state.msg.installMsgLastUpdated 		
	}
}
export default connect(
  mapStateToProps
)(AutoFill)