import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { clientHeight, velocityPrveOrNext } from '../../constants/DomConstant'
import { log, isEmpty, addClass, removeClass, dragDrop, dragLineDrop, getmCustomScrollbar } from '../../constants/UtilConstant'
import { SHOW_DIALOG_ALERT } from '../../constants/TodoFilters'

import Preview from '../../modules/smallModel/Preview'
import KeyWord from '../../modules/smallModel/KeyWord'
import FileAttr from '../../modules/smallModel/FileAttr'
import FileFonts from '../../modules/smallModel/FileFonts'
import ColorChannel from '../../modules/smallModel/ColorChannel'

let hasDrag = false;
class FileInfoDetail extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		attrData: null,
    		fmData: null
    	};
    	log("FileInfoDetail");		
	}	
	render() {
	    const { fmData, attrData } = this.state;
	    log("文件属性数据：",fmData)		
		//重组数据--字体（目前屏蔽）
		// let newObj = {};
		// if( fmData && fmData.data && fmData.data.length > 0 ){		
  		//     newObj = getNewArrayFontList(fmData.data)
  		// }
  		// 字体
        // <FileFonts 
	       //  paddedData={newObj.paddedData} 
	       //  fmData={newObj.newArray} 
	       //  fontData={newObj.fontData}
	       //  active={false}
	       //  {...this.props}/>
    	//console.log("字体数据：",newObj)
    	//标签：<KeyWord actions={this.props.actions} attrData={attrData} fmData={fmData} active={true}/>
		return <div className="main-content-detail" ref="dragPanelRef">
		            <div className="drag-line-vertical abs" ref="dragDivRef"></div>
		            <div className="scllorBar_mainContent_detail" ref="clientHeight" style={{"height":"100%"}}>
	                    <Preview fmData={fmData} active={true} actions={this.props.actions}/>
	                    <FileAttr attributesLastUpdated={this.props.attributesLastUpdated} attrData={attrData} fmData={fmData} active={true} />
	                    <ColorChannel fmData={fmData} active={true}/>	                    	                     
                    </div>                                                                                		           
		       </div>
	}
	componentDidMount() {
		//clientHeight(this.refs.clientHeight,this.props.resize.h,73)
		getmCustomScrollbar($(".scllorBar_mainContent_detail"))

		//实例化预览图上下拖拽
		const dragElem = this.refs.dragDivRef,
		      parElem = this.refs.dragPanelRef;
		if( dragElem && parElem ){
			dragLineDrop(dragElem, parElem, 247, 'left', $('.velocity_ul_img li'))
		}		
	}
	componentWillReceiveProps(nextProps) {
		log('FileInfoDetail==========>componentWillReceiveProps')
		log(nextProps)
		log(this.props)
		//若图片信息有生成
        if( nextProps.attributesLastUpdated !== this.props.attributesLastUpdated && nextProps.attributes ) {
            if( nextProps.attributes && nextProps.attributes.is_file ){
	            this.setState({
	            	attrData: nextProps.attributes,
	             	fmData: nextProps.attributes.thumb_image
	            })
            }else{
            	this.setState({
            		attrData: nextProps.attributes,
            		fmData: null
            	})
            }        	
        }
		//若图片信息没有自动生成，则返回该接口数据
		if( nextProps.fileInfoData && nextProps.fileInfoDataLastUpdated !== this.props.fileInfoDataLastUpdated ){
			if( nextProps.fileInfoData.error_code == 0 && nextProps.fileInfoData.data ){
				try{			
                    const thumb_image = JSON.parse(nextProps.fileInfoData.data);
		            this.setState({
		             	fmData: thumb_image
		            })
	        	}catch(e){
	        		this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "解析文件信息失败",auto: true,speed: 1500,statu: 0})
	        	}
            }else{
				this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "获取文件信息失败",auto: true,speed: 1500,statu: 0})
            }
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
        //判断数据是否变化       
        const thisProps = this.props || {}, thisState = this.state || {};
        if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
              Object.keys(thisState).length !== Object.keys(nextState).length) {
            return true;
        }
        for (const key in nextProps) {
            if (thisProps[key] !== nextProps[key] || !is(thisProps[key], nextProps[key])) {
              return true;
            }
        }
        for (const key in nextState) {
            if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
              return true;
            }
        }
		log('shouldComponentUpdate---（FileInfoDetail）优化起作用---')
        return false	              	
	}
	componentDidUpdate(nextProps, nextState) { 	   
		if(nextProps.resize.h !== this.props.resize.h){
			//clientHeight(this.refs.clientHeight,this.props.resize.h,73)
			getmCustomScrollbar($(".scllorBar_mainContent_detail"), null, "update")
    	}
    	//重新实例化拖拽，比如没有预览图的时候。
        if( !hasDrag && $('.velocity_ul_img li').length > 0 ){
        	hasDrag = true;
			const dragElem = this.refs.dragDivRef,
			      parElem = this.refs.dragPanelRef;
			if( dragElem && parElem ){
				dragLineDrop(dragElem, parElem, 247, 'left', $('.velocity_ul_img li'))
			}        	
        }else{
        	hasDrag = false;
        }
        //滚动条
        if( nextProps.attributesLastUpdated !== this.props.attributesLastUpdated ){
        	//getmCustomScrollbar($(".scllorBar_mainContent_detail"))
        }
	}	     
}
export default immutableRenderDecorator(FileInfoDetail)