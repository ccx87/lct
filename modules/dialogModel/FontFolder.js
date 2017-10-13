import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { absVerticalCenter } from '../../constants/DomConstant'
import { dragDrop, isEmpty, log, getMousePos } from '../../constants/UtilConstant'
import { SHOW_DIALOG_ALERT } from '../../constants/TodoFilters'
import { msgAlertErrorHtml, msgAlertTitleHtml } from '../../constants/RenderHtmlConstant'
import { DIRECTORY_LEVEL } from '../../constants/DataConstant'

/* 弹出层--选择本地字体文件夹  */
class FontFolder extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		fileList: [],
    		delList: [],
    		wait: [],
    		checkList: [],
    		moveList: [],
    		msg_sys: {
    			show: false,
    			text: ''
    		},
    		hoverData:{
    			hover: false,
    			text: '',
    			page: {
    				x: 0,
    				y: 0
    			}
    		}
    	};
    	log("FontFolder");		
	}
	addFileBtn(event) {
		this.props.actions.openFileRequest(3, null)
	}
	msgInfo(text){
        this.setState({
        	msg_sys: {
        		show: true,
        		text: text
        	}
        })
		setTimeout(() => {
			this.setState({
				msg_sys: {
					show: false,
					text: ''
				}
			})
		}, 1500) 		
	}
	checkMsg(item, event){
	    event.stopPropagation();
		event.preventDefault();
		//默认目录不能移除
        this.msgInfo('默认目录不能移除');       
        return false		
	}
	noCheckItem(item, enent){
		event.stopPropagation();
		event.preventDefault();
		this.msgInfo('该目录不存在');
		return false
	}
	checkItem(item, event) {
		event.stopPropagation();
		event.preventDefault();
		const li_Elem = event.currentTarget,
		      i_Elem = li_Elem.querySelector('i');
		if( i_Elem.className == 'icons icons-18 fn-checked' ){
			i_Elem.className = 'icons icons-18 fn-check';
	        for( let i = 0; i < this.state.checkList.length; i++ ){
	        	if( this.state.checkList[i] === item.path ){
                    this.state.checkList.splice(i, 1)
	        		let hasStr = false;
		    		for( let j = 0; j < this.state.wait.length; j++ ){
		    			if( this.state.wait[j] === item.path ){
	        				hasStr = true;
	        				break
		    			}
					}					
	    			if( !hasStr ){
						this.state.wait.push(item.path)
					}                    
	        		break;
	        	}
	        }
        }else{
        	i_Elem.className = 'icons icons-18 fn-checked';
    		let hasStr = false;
    		for( let m = 0; m < this.state.checkList.length; m++ ){
    			if( this.state.checkList[m] === item.path ){
    				hasStr = true;
    				break
    			}
			}
			if( !hasStr ){
				this.state.checkList.push(item.path)
			} 
    		for( let h = 0; h < this.state.wait.length; h++ ){
    			if( this.state.wait[h] === item.path ){
    				this.state.wait.splice(h, 1)
    				break
    			}
			}						        	
        }		
	}
	removeItem(item, event) {
        event.stopPropagation();
        event.preventDefault();
        for( let i = 0; i < this.state.fileList.length; i++ ){
        	if( this.state.fileList[i].path === item.path ){
        		this.state.fileList.splice(i, 1);
        		let hasStr = false;
        		for( let j = 0; j < this.state.delList.length; j++ ){
        			if( this.state.delList[j] === item.path ){
        				hasStr = true;
        				break
        			}
				}
    			if( !hasStr ){
					this.state.delList.push(item.path)
				}				
        		break;
        	}
        }
        for( let m = 0; m < this.state.checkList.length; m++ ){
        	if( this.state.checkList[m] === item.path ){
        		this.state.checkList.splice(m, 1); 			
        		break;
        	}
        } 
		for( let h = 0; h < this.state.wait.length; h++ ){
			if( this.state.wait[h] === item.path ){
				this.state.wait.splice(h, 1)
				break
			}
		}               
        $(".scllorBar_clff").mCustomScrollbar('destroy')
        this.setState({
        	fileList: this.state.fileList
        })
	}
	submitScanBtn(event) {
        const addFile = {}
		addFile['add'] = this.state.checkList;
		addFile['del'] = this.state.delList;
		addFile['add_wait'] = this.state.wait;     
		log(addFile)
        window.setScanPathRequest(JSON.stringify(addFile))
        setTimeout(() => {
			this.props.actions.isScanFinishedRequest(); 
        }, 100)  
        this.props.actions.triggerDialogInfo(null)      
	     //重新获取配置信息
	    setTimeout(() => {
	         this.props.actions.getConfigInfo()
	    },120)				
        return false       
	}
	moveEnterMaxText(item, event){
        event.stopPropagation();
        event.preventDefault();
        const page = getMousePos(event,this.refs.verticalCenter,10),
              elem = event.currentTarget;     
        this.setState({
        	hoverData: {
        		hover: true,
        		text: item.path + item.remark,
        		page: {
        			x: Math.abs(page.x),
        			y: Math.abs(page.y)
        		}
        	}
        })
        return false
	}	
	moveLeaveMaxText(event){
        event.stopPropagation();
        event.preventDefault();		
        this.setState({
        	hoverData: {
        		hover: false,
        		text: '',
        		page: {
        			x: 0,
        			y: 0
        		}
        	}
        })
        return false              
	}
	render() {
		const { actions, getConfig } = this.props
		const { fileList, checkList, msg_sys, hoverData } = this.state
		return <div className="dialog choose-local-layer" ref="verticalCenter">
		           <div className="dialog-title">
		               <span>选择本地字体文件夹</span>
		               <a className="abs close-dialog" onClick={() => actions.triggerDialogInfo(null)}><i className="icons icons-18 close-dialog-bg"></i></a>
		           </div>
		           <div className="dialog-content hover-model">
		               {
		               	   fileList.length > 0 ?
		               	      <p className="p-dc">将自动扫描您勾选的目录，文件增删实时同步</p>
		               	   :
		               	      <p className="p-dc">当前还未选择扫描目录</p>   
		               }
		               
		               <ul className="scllorBar_clff">
		                  {
		                  	  fileList.map((item, index) => {
		                  	  	  let hasItem = false
		                  	  	  if( item.control === DIRECTORY_LEVEL.first ){
	                                  return  <li key={index}>
	                                             <i className="icons icons-18 fn-checked" onClick={this.checkMsg.bind(this, item)}></i>
	                                             <span className="move-panel"
	                                                   onMouseEnter={this.moveEnterMaxText.bind(this, item)}
	                                                   onMouseLeave={this.moveLeaveMaxText.bind(this)}>
	                                                <span className="move-item">
		                                             	<span className="text">{item.path}</span>
		                                             	<span className="description">{item.remark}</span>
	                                             	</span>
	                                             </span>
	                                          </li> 
		                  	  	  }else{	                  	  	  	
	                                  return  <li key={index} onClick={item.is_exist ? this.checkItem.bind(this, item) : this.noCheckItem.bind(this, item) }>
	                                             {
                                                    checkList.map((elem, ii) => {
                                                    	if( elem === item.path && item.is_exist && item.type != 3 ){
                                                    		hasItem = true
                                                    		return <i key={ii} className="icons icons-18 fn-checked"></i>
                                                    	}
                                                    	return null
                                                    })                                             	    
	                                             }
	                                             {
	                                             	hasItem ?
	                                             	    null
	                                             	:
	                                             	    <i key={index} className="icons icons-18 fn-check"></i> 	                                             	
	                                             }
	                                             <span className="move-panel" 
	                                             	   onMouseEnter={this.moveEnterMaxText.bind(this, item)}
	                                                   onMouseLeave={this.moveLeaveMaxText.bind(this)}>  
	                                                <span className={item.is_exist ? "move-item" : "move-item text-through"}>
	                                             		<span className="text">{item.path}</span>
	                                             		<span className="description">{item.remark}</span>
	                                             	</span>
	                                             </span>
	                                             <a className="abs close-item" onClick={this.removeItem.bind(this, item)}>移除</a>
	                                          </li> 
                                  }                                         	  
		                  	  })
		                  }
		               </ul>
		               {
		               	    hoverData.hover ?
	                        	msgAlertTitleHtml(hoverData.text)
	                        :
	                            null
	                   }
		               {
		               	   msg_sys.show ?
		               	      msgAlertErrorHtml(msg_sys.text)
		               	   :
		               	      null   
		               }
		           </div>
		           <div className="dialog-footer">
		                <a className="dialog-btn confirm-btn" onClick={this.submitScanBtn.bind(this)}>确认</a>
		                <a className="dialog-btn add-file-btn" onClick={this.addFileBtn.bind(this)}>添加文件夹</a>   
		           </div>
		       </div>  
	}
	componentDidMount() {
		if(this.refs.verticalCenter){
			const optElem = document.querySelector('.body-opacity-layer'),
			      parElem = document.querySelector('.choose-local-layer'),
			      dragElem = parElem.querySelector('.dialog-title')			
			optElem.style.display = 'block'			
			absVerticalCenter(this.refs.verticalCenter)
			dragDrop(dragElem, parElem)
		}
		const getConfig = this.props.getConfig;
		if( getConfig && getConfig.data ){
			if( getConfig.data.scan_path ){
				if( !isEmpty(getConfig.data.scan_path.value) ){
				   const strArray =  $.parseJSON(getConfig.data.scan_path.value),
				         newArray = [{control: 0, type: 0, remark: "系统字体目录", path: ""}];	      
				   for( let i = 0; i < strArray.length; i++ ){
		                let data = {};		                    
		                if( strArray[i].control == 0 ){
	                        if( strArray[i].type == 1 ){
	                        	strArray[i]['remark'] = '（字体下载目录）'
	                        }else if( strArray[i].type == 0 ){
	                        	strArray[i]['remark'] = '（系统字体目录）'
	                        }else{
	                        	strArray[i]['remark'] = '（其它）'
	                        }
                    	}else{
                    		strArray[i]['remark'] = ''
                    		if( strArray[i].type == 3 ){
                                this.state.wait.push(strArray[i].path);
                    		}else{
								this.state.checkList.push(strArray[i].path);
							}						
                    	}
                        newArray.push(strArray[i])
				   }	       
                   this.setState({
                   	   fileList: newArray
                   })
				}
			}
		}		
	}
	componentWillReceiveProps(nextProps) {
		if( nextProps.openFilePath_3 && nextProps.openFile3LastUpdate !== this.props.openFile3LastUpdate ){
			const n_open = nextProps.openFilePath_3
            if( !isEmpty(n_open.data) ){
            	for( let i = 0; i < this.state.fileList.length; i++ ){
            		if( this.state.fileList[i].path === n_open.data ){
            			return false;
            		}
            	}
                const data = {control:1, is_exist:true, path:n_open.data, remark:'', type: 2};
                this.state.checkList.push(n_open.data);	
                this.state.fileList.push(data)
	    		for( let n = 0; n < this.state.delList.length; n++ ){
	    			if( this.state.delList[n] === data.path ){
	    				this.state.delList.splice(n, 1)
	    				break
	    			}
				}                          	
            }
            $(".scllorBar_clff").mCustomScrollbar('destroy')	            
		}
	}
	componentDidUpdate(nextProps, nextState) {
		$(".scllorBar_clff").mCustomScrollbar({theme:"dark-3",scrollInertia:550});
		if( this.state.hoverData.hover ){
			if( $('.msg-alert-layer').length > 0 ){
				const t_p = this.state.hoverData.page;
				$('.msg-alert-layer').css({left: t_p.x, top: t_p.y});
			}
		}
	}		
}
const mapStateToProps = (state) => {
	return {
		openFilePath_3: state.events.openFilePath_3,
		openFile3LastUpdate: state.events.openFile3LastUpdate
	}
}
export default connect(
  mapStateToProps
)(FontFolder)
