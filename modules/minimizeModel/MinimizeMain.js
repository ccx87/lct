import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { SHOW_MINMIZE_SHITU_FEATURE } from '../../constants/TodoFilters'
import { log, isEmpty } from '../../constants/UtilConstant'

//最小化--弹窗模块(可多个)
class MinimizeMain extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		minmizeArr: [],
            backShituProgress: 0
    	};
    	log("MinimizeMain");		
	}
    inItMizeFn(minmizeData) {
        if( minmizeData ){
            switch(minmizeData.type){
                case SHOW_MINMIZE_SHITU_FEATURE:
                    if( minmizeData.mode == 'add' ){
                        //通知其它区域--正在扫描中个别按扭操作是禁止的。
                        const allData = minmizeData.rawData ? minmizeData.rawData.allData : [];
                        this.props.actions.noticeMessage({action: false, type: 'SCAN', data: allData.allScanPathData});
                        //首页存在的话盘符图标替换成动态图标
                    }                
                break;
                default:
                break;
            }
        }
    }
	maximizePanel(item) {
		if( !item ) return;
		this.props.actions.triggerMinmizeInfo({type: item.type, mode:'del'})
		this.props.actions.triggerDialogInfo({
            type: item.rawData && item.rawData.type, 
            position: item.position, 
            codeData: item.data && item.data.data,
            rawData: item.rawData
        })
	}
	render() {
		const { minmizeData } = this.props
		const { minmizeArr } = this.state
		return (
			    <div className="minimize-main unbody">
		            {
		            	minmizeArr.length > 0 ?
		            	    minmizeArr.map((item, index) => {
		            	    	let _r = 265,
		            	    	    posx = {right: (index*_r)+'px'};
		            	    	let classes = "abs mmize-layer flex flex-c mmize-"+ item.type;
			            	    return <div key={index} className={classes} style={posx}>
			                                <div className="ml-left minimize-content flex-item-gsb-1">
			                                    <span className="mc-text">{item.data ? item.data.text : '--'}</span>
			                                    <span className="mc-val">{item.data ? item.data.defaultValue : '--'}</span>
			                                </div> 
			                                <div className="ml-right maximize-btn flex-item-gsb-0" onClick={this.maximizePanel.bind(this,item)}>
			                                     <span className="msg-hide abs">最大化</span> 
			                                </div>
					            	    </div>
		            	    })		            	
			            :
			                null	        
		            }
		        </div>
		    )   
	}
    componentDidMount() {
        this.inItMizeFn(this.props.minmizeData); 
    }
	componentWillReceiveProps(nextProps) {
		//最小化-增删-处理
        if( nextProps.minmizeData && nextProps.minmizeLastUpdated !== this.props.minmizeLastUpdated ){
            this.inItMizeFn(nextProps.minmizeData); 
            if( nextProps.minmizeData.mode == 'add' ){
            	//防止出现多个一样的最小化组件
            	let hasM = false;
            	for( let i = 0, len = this.state.minmizeArr.length; i < len; i++ ){
            		if( this.state.minmizeArr[i].type === nextProps.minmizeData.type ){
            			this.state.minmizeArr[i].data = nextProps.minmizeData.data
            			hasM = true;
            			break;
            		}
            	}     
            	if( !hasM ) this.state.minmizeArr.push(nextProps.minmizeData);      	
            }else{
            	//删除对应的最小化组件
            	for( let i = 0, len = this.state.minmizeArr.length; i < len; i++ ){
            		if( this.state.minmizeArr[i].type === nextProps.minmizeData.type ){
            			this.state.minmizeArr.splice(i, 1)
            			break;
            		}
            	}
            } 
        	this.setState({
        		minmizeArr: this.state.minmizeArr
        	})           
        }
    	//js分发数据jsMsgHandle
        if( nextProps.jsMsgHandle && nextProps.jsMsgHandleLastUpdated !== this.props.jsMsgHandleLastUpdated ){
            const jsModule = nextProps.jsMsgHandle.module,
                  jsData = nextProps.jsMsgHandle.param;  
            if( !jsData ){
				log('---返回数据为空---')
            	return;
            }      
            if( jsData.error_code != 0 ){
            	log(jsData.error +',(代码：'+ jsData.error_code +')')
            	return;
            } 
            const jsVal = jsData.data;  
            if( isEmpty(jsVal) && jsModule != 'connect_msg_t' ){
            	log('---返回数据data字段为空---');
                return;
            }        
            try{
                switch( jsModule ){
                    case 'get_feature_progress_t':
                        //获取识图信息
                        jsVal["type"] = SHOW_MINMIZE_SHITU_FEATURE;
                        this._featureProgress(jsVal);
                    break; 
                	default:
                        return false;
                	break;
                }
            }catch(e){
                log('扫描出错')
            }
        }
	}	
	shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))		
	}
    _featureProgress(jsData) {
        //获取识图信息-处理
    	for( let i = 0, len = this.state.minmizeArr.length; i < len; i++ ){
    		if( this.state.minmizeArr[i].type === jsData.type ){
                const tp = !isEmpty(jsData.total_progress) ? jsData.total_progress : 0;
                //防止进度数据回朔
                if( tp <= this.state.backShituProgress ) break;                 
                this.state.backShituProgress = tp;

                //data在最大化时数据用在进度百分比对应上
                //tipData是预览图生成所需要的组件--显示状态
                jsData['tipData'] = this.state.minmizeArr[i].data && this.state.minmizeArr[i].data.data && this.state.minmizeArr[i].data.data.tipData;
    		    const infoData = {
    		    	data: jsData, 
	                value: tp <= 100 ? tp +'%' : '100%',
                    defaultValue: tp < 100 ? tp +'%' : '扫描结束',
	            };
    		    if( jsData.total_progress < 100 ){
    		    	infoData['text'] = '正在从服务器获取识图信息...'
    		    }else{
    		    	infoData['text'] = ''  
                    //通知其它区域--正在扫描中个别按扭操作解除禁止。
                    this.props.actions.noticeMessage({action: true, type: 'SCAN'})                     
    		    }
    			this.state.minmizeArr[i].data = infoData
    			break;
    		}
    	} 
    }		
}
const mapStateToProps = (state) => {
	return {
		minmizeLastUpdated: state.events.minmizeLastUpdated,
		minmizeData: state.events.minmizeData,

        jsMsgHandle: state.inIt.jsMsgHandle,
        jsMsgHandleLastUpdated: state.inIt.jsMsgHandleLastUpdated 		
	}
}	
export default connect(
  mapStateToProps
)(immutableRenderDecorator(MinimizeMain))