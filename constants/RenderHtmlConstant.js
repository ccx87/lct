import React, { Component, PropTypes } from 'react'

module.exports = {
	loadingHtml: function(statu){
		return <div className="loading" id="loading" style={{"display": statu ? "block" : "none"}}>
		           <p><i className="loading-bg"></i>正在加载中，请稍候</p>
		       </div>
	},
	loadingHtml2: function(data){
		return <div className="loading" id="initLoading">
		           <p><i className="loading-bg"></i></p>
		           <p>{data}</p>
		       </div>  
	},
	loadingHtml3: function(text){
		return <div className="loading col-6">
		           <p><i className="loading-bg2"></i><span className="left-m-5">{text ? text : "正在加载中，请稍候"}</span></p>
		       </div>  
	},	
	errorHtml: function(){
		return <div className="error-dialog-layer" id="Error1" ref="msgNoticeRef">
		           <div className="opt1"></div> 
		           <p className="error1"><i className="error-bg"></i>因合作方要求，该资源暂时下架（&gt;_&lt;）</p>
		       </div>		
	},
	msgAlertHtml: function(text, color) {
		//弹窗带箭头提示
		return 	<div className="abs msg-alert-layer">
		            <b className="arrow-bottom"><i className="bottom-arrow1"></i><i className="bottom-arrow2"></i></b>
		            {
		            	color ?
		            	   <p className={color}>{text}</p>
		            	:
		            	   <p>{text}</p>   
		            }
		        </div>
	},
	msgAlertTitleHtml: function(text) {
		//模拟a标签hover时的title状态
		return 	<div className="abs msg-alert-layer">
		            <p>{text}</p>
		        </div>
	},
	msgAlertSuccessHtml: function(text, icons) {
		//相当于dialog里的alert里的成功提示
		return <div className="alert-dialog-layer" id="Alert" ref="msgAlertSuccessHtmlRef">
		           <div className="opt"></div> 
		           <p className="alert flex flex-c flex-c-c">
		               {
		               	   !icons ?
		               	      <i className="icons icons-40 ok-alert-bg"></i>	               	      
		               	   :
		               	   icons && icons == 'false' ?
		               	      null
		               	   :
		               	      null         
		               }
		               {text}
		           </p>
		       </div>		
	},	
	msgAlertErrorHtml: function(text) {
		//相当于dialog里的alert里的错误提示
		return <div className="alert-dialog-layer" id="Alert">
		           <div className="opt"></div> 
		           <p className="alert flex flex-c flex-c-c">
		               <i className="icons icons-40 error-alert-bg"></i>
		               {text}
		           </p>
		       </div>		
	},
	msgConfirmHtml: function(data){
		//相当于dialog里的confirm里的选择提示
		if( !data ) return null;
	    return <div className="confirm-dialog-layer dialog" id="Confirm" ref="msgConfirmHtmlRef">
		           <div className="dialog-title">
		               <span>{data.title}</span>
		           </div>
		           <div className="dialog-content">
			            <p className="flex flex-c flex-c-c flex-dir-column" style={{"minHeight":"100px", "lineHeight":"25px", "fontSize":"12px"}} dangerouslySetInnerHTML={{__html: data.text}}></p>		               
		           </div>
		           {
		           	   data.btnCustomize ?
				           <div className="dialog-footer">
				               {
				               	   data.btnCustomize.cancel ?
				               	      <a style={{"fontSize":"12px"}} className="dialog-btn cancel-btn" onClick={() => data.btnCustomize.cancel.fn ? data.btnCustomize.cancel.fn() : data.onClose()}>{data.btnCustomize.cancel.text ? data.btnCustomize.cancel.text : "取消"}</a>
				               	   :
				               	      null    
				               }
				           	   { 
                                   data.btnCustomize.confirm ?
                                      <a style={{"fontSize":"12px"}} className="dialog-btn confirm-btn" onClick={() => data.btnCustomize.confirm.fn ? data.btnCustomize.confirm.fn() : data.onConfirm()}>{data.btnCustomize.confirm.text ? data.btnCustomize.confirm.text : "确认"}</a>
                                   :
                                      null   
				           	   }
				           </div>		           	       
		           	   :
				           <div className="dialog-footer">
				           	   <a style={{"fontSize":"12px"}} className="dialog-btn cancel-btn" onClick={() => data.onClose()}>取消</a> 
				               <a style={{"fontSize":"12px"}} className="dialog-btn confirm-btn" onClick={() => data.onConfirm()}>确认</a>
				           </div>
		           }   		           		           	   
				</div>
	},
    NoDataHtml: function(text){
		return <div className="no-data flex flex-c flex-c-c">
		          <div className="center">
			          <i className="img-files-bg icons-80"></i>
			          <p className="no-data-text col-9">{text}</p>
		          </div>
		       </div>        
    },
    NoDataTextHtml: function(text){
		return <div className="no-data flex flex-c flex-c-c" style={{"width": "100%"}}>
			          <p className="no-data-text col-9">{text}</p>
		       </div>        
    },
    beginGuideHtml: function(step,imgsrc,text,onevent,onsend,oncolse) {
        return <div className={step == 1 ? "fixed" : "abs"} id="begin-guide">
                   <div className={step != 4 ? "flex flex-c flex-l-l" : "flex flex-c flex-l-l flex-dir-column"}>
                     <img className="img" src={imgsrc} alt="新手引导"/>
                     <p className="content flex flex-c flex-c-c flex-dir-column">
                         <span className="abs opt"></span>
                         <span className="abs close" onClick={() => oncolse()}>×</span>
                         <span className="text" dangerouslySetInnerHTML={{__html: text}}></span>
                         <span className="sp-btn flex flex-c flex-c-c">
	                         {
	                         	step == 3 || step == 4 ?
	                         	   <a className="flex flex-c flex-c-c btn ok" onClick={() => onevent()}>知道了</a> 
	                         	:
	                         	   <a className="flex flex-c flex-c-c btn next" onClick={() => onevent()}>下一步</a> 
	                         }
	                         <a className="flex flex-c flex-c-c btn no" onClick={() => onsend()}>不再显示</a>
                         </span>
                         
                     </p>
                   </div>
               </div>
    }        
};