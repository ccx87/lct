import React, { Component, PropTypes } from 'react'
import { isEmpty, regexStr, log, objClone } from '../../constants/UtilConstant'
import { msgAlertHtml } from '../../constants/RenderHtmlConstant'
import { ROUTES, PAGE_TYPE, GET_REGEX_MATCH } from '../../constants/DataConstant'

class FontMain extends Component {
  	constructor(props) {
    	super(props);
    	this.state = {
          stAlert: {
              show: false,
              text: ""
          }        
      };
  	}
    setStAlert(show, text) { 
        this.setState({
            stAlert: {
                show: show,
                text: text
            }
        })
        setTimeout(() => {
            this.setState({
                stAlert: {
                    show: false,
                    text: ''
                }
            }) 
        }, 2000)
    } 
    eventsKeyDownSearch(event){
      var keyCode = window.event ? event.keyCode : event.which;
      if(keyCode == 13) {
          this.SearchFor() 
      }
      return false;
    }       	
    SearchFor(){
        const inputUrl1DOM = this.refs.inputUrlsf.value;
        if( isEmpty(inputUrl1DOM) ) {
             this.setStAlert(true, '请输入要搜索的字体名')
             return false
        }
        if( regexStr(inputUrl1DOM, GET_REGEX_MATCH.only_letter) ){
             this.setStAlert(true, '不能少于两个字符')
             return false
        }
        const btnDom = document.getElementById('font-search-btn')
        if( btnDom ){
            btnDom.disabled = true
            btnDom.innerHTML = '搜索中...'
        }
        try{
            window.asyncStopGetDragDropFileRequest() //关闭拖拽监听
        }catch(e){}        
        setTimeout(() => {
            this.props.actionsST.searchfont({data:inputUrl1DOM, type: 'FontMain'}) 
        }, 30)
   }
    render() {
        const { stAlert } = this.state
        return <div className='clearfix search-font'>
        		       <h3 className='search-title'>字体搜索下载</h3>
        		       <div className="stdiv clearfix" onKeyDown={this.eventsKeyDownSearch.bind(this)}>
                        <div style={{"position":"relative"}}>
                            {
                                stAlert.show ? 
                                   msgAlertHtml(stAlert.text)
                                :
                                   null
                            }
            		        		<input type="text" id="inputUrl1" 
                              placeholder="请输入字体原始名或PS名，如：方正中倩、FZZQJW" 
                              autoComplete="off" className="st-input ft-input" name="inputurl" 
                              ref="inputUrlsf"/>
            		            <button id="font-search-btn" className="st-btn st-self st-select" onClick={this.SearchFor.bind(this)}>搜索一下</button>
                        </div>
                  </div>         
               </div>
    }    
    componentDidUpdate(nextProps,nextState) {
        const btnDom = document.getElementById('font-search-btn')
        if( btnDom ){
            btnDom.disabled = false
            btnDom.innerHTML = '搜索一下'
        }        
    }  
}
export default FontMain