import React, { Component, PropTypes } from 'react'
import ApiConstant from '../../constants/ApiConstant'
import { log, isEmpty, regexStr, funTransitionHeight } from '../../constants/UtilConstant'
import { msgAlertHtml } from '../../constants/RenderHtmlConstant'
import { SEARCH_ROUTES, CHANGE_RANGE, SHITU_MODE, GET_REGEX_MATCH } from '../../constants/DataConstant'
import {SEARCH_CENTER_TYPE} from '../../constants/AcceptConstant'
import { SHOW_SHITU_MAIN, SHOW_SHITU_INFO, SHOW_NO_FILES_SCAN_PROCESS, 
  SHOW_DIALOG_ALERT, SHOW_DIALOG_CONFIRM, JUMP_PAGE } from '../../constants/TodoFilters'

const pageKey = 'SHITU_IMG'
class Common extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            stAlert: {
                show: false,
                text: ""
            },
            isJump: true,
            ssTimer: null,
            shituMode: SHITU_MODE.text,
            isShituing: false
      	};
        this.imagePaste = this.imagePaste.bind(this)
  	} 	
    fileOpen() { 
		    this.props.actions.openFileRequest(0,1)
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
    shituTimeOut(page) {
        //开启识图超时定时器
        //如果识图在30秒内没有返回识图数据，则超时
        //先清除之前的定时器
        clearTimeout(this.state.ssTimer)
        this.state.ssTimer = setTimeout(() => {
            if( this.state.isJump ){
                this.props.actions.triggerDialogInfo({
                    type: SHOW_DIALOG_ALERT,
                    text: '识图超时，请重新识图',
                    auto: true, 
                    speed: 2000
                })
            }
            this.closeShitu(page, true);                    
            return;
        },30000);        
    } 
    getSendOptions(data) {
        if( !data || isEmpty(data.data) ){
            this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '识图内容不能为空', auto: true,speed: 3000}) 
            return
        }
        data['mode'] = data.mode || this.state.shituMode
        data['range'] = data.range || this.props.shituRange
        data['cmd'] = data.cmd || 2
        data['page_num'] = data.page_num || 0
        data['per_page_size'] = data.per_page_size || 1000
        data['is_init'] = data.is_init || true

        console.log("搜索中心识图出参：", data)
        this.props.actionsST.getShituImgResult(data)
        //允许跳转
        //this.setState({isJump:true})
        this.state.isJump = true
        //开启识图超时机制
        this.shituTimeOut(data.page)        
    }
    submitSearch(mode, event) {
        const inputUrlDom = this.refs.inputUrl,
              val = inputUrlDom && inputUrlDom.value;
        if( this.state.isShituing ){
            return
        }      
        if( !mode ){
            if( this.state.shituMode === SHITU_MODE.text ){
               mode = SHITU_MODE.text
            }else{
               mode = SHITU_MODE.image.base64
            }
        }
        let str1 = '请输入关键字再进行搜索',
            str2 = '请选择图片或截图后按Ctrl+V试试',
            tempStr = '';
        const page = this.props.page;    
        if( isEmpty(val) ){
            if( mode === SHITU_MODE.text ){
               tempStr = str1 
            }else{
               tempStr = str2
            }
            if( page === pageKey ){
               this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: tempStr, auto: true,speed: 3000}) 
            }else{
               this.setStAlert(true, tempStr) 
            }
            return
        }
        if( mode === SHITU_MODE.text ){
            $('.stdiv .opt').show()
        }else{
            if( !regexStr(val, GET_REGEX_MATCH.is_image) ){
                if( page === pageKey ){
                    this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: str2, auto: true,speed: 3000}) 
                }else{
                    this.setStAlert(true, str2)
                }
                return       
            }
            this.setState({
                shituMode: SHITU_MODE.image.base64,
                isShituing: true
            })                                     
        }       
        this.getSendOptions({data: val, mode: mode, page: page}) 
    }
    closeShitu(page, isurl) {
        this.setState({
            isJump: false,
            isShituing: false,
            shituMode: SHITU_MODE.text
        })
        if( !isurl ) this.refs.inputUrl.value = '';
        $('.stdiv .opt').hide();
        if( page === pageKey ){
            try{               
                window.asyncStopGetDragDropFileRequest() //关闭拖拽监听
            }catch(e){}                 
        }else{
            this.props.actionsST.startGetDragDropFile()//重新开启拖拽监听                           
        }                  
    }
    eventsKeyDownSearch(event){
        var keyCode = window.event ? event.keyCode : event.which;
        if(keyCode == 13) {
            this.submitSearch() 
        }
        return;
    }
    inputActive(temp, event) {
      const inputDom = event.currentTarget,
            boxDom = inputDom && inputDom.parentNode;
      if( boxDom ){
         if( temp ){
            boxDom.classList.add('focus');
         }else{
            boxDom.classList.remove('focus');
         }
      }      
    } 
    changeShituMode(mode, event) {
      this.setState({
         isJump: false,
         isShituing: false,
         shituMode: mode
      })
    }
    render() {
    	  const { shituRange, shituResultData, page } = this.props
        const { stAlert, shituMode, isShituing } = this.state
        let rangeText,keyWord;
        if( shituRange.value === CHANGE_RANGE.neighbor.value ){
           rangeText = '邻居'
        }else{
           rangeText = '本机'
        }
        if( shituResultData && shituResultData.sendPost && 
            shituResultData.sendPost.mode === SHITU_MODE.text ){
           keyWord = shituResultData.sendPost.data
        }
        return (
	          <div className="stdiv clearfix"  onKeyDown={this.eventsKeyDownSearch.bind(this)}>
                {
                    shituMode === SHITU_MODE.text ?
                        <div className="opt">
                            <div className="drag-here">
                                <div className="dh">
                                    <div className="drag-div">
                                        <span className="drag-text">
                                            <img src="./compress/img/loading6.gif" alt="loading..."/>
                                            正在搜索中，请稍候...
                                        </span>
                                    </div>    
                                    <i className="shitu-icon drag-bg drag-bg-5"></i>
                                    <i className="shitu-icon drag-bg drag-bg-6"></i>
                                    <i className="shitu-icon drag-bg drag-bg-7"></i>
                                    <i className="shitu-icon drag-bg drag-bg-8"></i>
                                </div>
                            </div>
                            <div className="drag-close" onClick={this.closeShitu.bind(this,page,false)}>
                                <i className="shitu-icon drag-bg-close"></i>
                            </div>
                        </div>
                    :
                        null    
                }
                {
                    shituMode === SHITU_MODE.text ?
                        <div className="st-box-panel flex flex-c-c">
                            <div className="st-box flex flex-c-c flex-item-gsb-1">
                                <input type="text" id="inputUrl" autoComplete="off" defaultValue={keyWord}
                                  className="st-input text-input" name="inputurl" ref="inputUrl" 
                                  placeholder={"请输入关键字搜索"+ rangeText +"素材"} 
                                  onFocus={this.inputActive.bind(this, 1)} 
                                  onBlur={this.inputActive.bind(this, 0)}/>
                                  {
                                    stAlert.show ?
                                        msgAlertHtml(stAlert.text)
                                    :
                                       null    
                                  }
                                <div className="stupload webuploader-container flex flex-c flex-c-c" id="fileAddBtn" ref="fileAddBtn" 
                                    onClick={this.changeShituMode.bind(this, SHITU_MODE.image.path)} >
                                    <i className="shitu-icon icons-20 change-shitu-bg"></i>
                                </div>
                            </div>
                            <button className="flex-item-gsb-0 st-btn st-self st-select" data-code="1" onClick={this.submitSearch.bind(this, SHITU_MODE.text)}>
                                搜索一下
                            </button>
                        </div>
                    :
                    shituMode === SHITU_MODE.image.path || shituMode === SHITU_MODE.image.base64 ?  
                        <div className="st-box-panel flex flex-dir-column">
                            <div className="panel-top flex flex-c-c">
                                <div className="st-box flex flex-c-c flex-item-gsb-1">
                                    <input type="text" id="inputUrl" autoComplete="off" defaultValue={keyWord}
                                      className="st-input url-input" name="inputurl" ref="inputUrl" 
                                      placeholder="请选择图片或截图后按Ctrl+V试试" disabled="true"/>
                                      {
                                        stAlert.show ?
                                            msgAlertHtml(stAlert.text)
                                        :
                                           null    
                                      }
                                </div>
                                <button className="flex-item-gsb-0 st-btn st-self st-select" data-code="1" onClick={this.submitSearch.bind(this, SHITU_MODE.image.base64)}>
                                    <i className="shitu-icon icons-20 submit-shitu-bg"></i>
                                </button>
                            </div>
                            <div className="panel-bottom">
                                <div className="shadow-div">
                                  <div className="pb-title flex flex-c-c">
                                     <span className="flex-item-gsb-1">仅支持jpg和png图片，最大不超过10M</span>
                                     <a className="flex-item-gsb-0" onClick={this.changeShituMode.bind(this, SHITU_MODE.text)}>
                                        <i className="shitu-icon icons-20 shitu-mode-close"></i>
                                     </a> 
                                  </div>
                                  <div className="pb-content flex flex-c flex-c-c">
                                     {
                                         isShituing ?
                                             <div className="upload">
                                                <p><img src="compress/img/upload-loading.gif" className="upload-loading"/></p>
                                                <p className="col-6" style={{"marginTop": "10px"}}>正在识别与搜索您{rangeText}的图片</p>
                                             </div>
                                         :
                                             <div className="init" style={{"width": "100%"}}>
                                                <div style={{"paddingTop": "10px", "paddingBottom": "10px", "background":"rgb(250,250,250)"}}>
                                                    {
                                                        page != pageKey ? 
                                                           <p className="col-6">拖拽图片到这里</p>
                                                        :
                                                           <p className="col-6">点击上传图片按扭</p>   
                                                    }
                                                    <p style={{"marginTop": "10px"}}><i className="shitu-icon icons-20 add-upload-img"></i></p>
                                                </div>
                                                <div>
                                                  <button className="button open-locaimg-btn" onClick={this.fileOpen.bind(this)}>
                                                      <i className="shitu-icon icons-20 shitu-upload-bg"></i>
                                                      <span>本地上传图片</span>
                                                  </button>                                             
                                                </div> 
                                             </div>
                                     }
                                  </div>
                                </div>
                            </div>
                        </div>
                    :
                        null                                                       
                }
	          </div>
        )
    } 
    componentDidMount() {   
        document.body.addEventListener('paste',this.imagePaste)
    }
    componentWillReceiveProps(nextProps) {    
        //服务器处理---在此处理正在识图的时候。
        if( nextProps.inItDocs && nextProps.inItDocs.isConnection && nextProps.inItDocs.isConnection.connect_flag != 0 ){
            if( $('.stdiv .opt').is(":visible") ){
                this.closeShitu(nextProps.page)
                const cmsgData = this.props.inItDocs.isConnection;
                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '服务器已断开，请稍候再试。(代码：'+ cmsgData.connect_flag + cmsgData.server +')',auto: true, speed: 2000})
                return;                               
            }     
        }         
        //通过打开文件方式
        if(nextProps.shituIdData && nextProps.shituIdDataLastUpdated !== this.props.shituIdDataLastUpdated){
            if( nextProps.shituIdData.error && nextProps.shituIdData.error == "nothing was selected!"){
                log("重新开启拖拽监听")
                this.props.actionsST.startGetDragDropFile()//重新开启拖拽监听               
                return false
            } else{
               this.setState({
                  isShituing: true
               })
               this.refs.inputUrl.value = nextProps.shituIdData.data
               this.getSendOptions({data: nextProps.shituIdData.data, mode: SHITU_MODE.image.path, page: nextProps.page})                          
            }          
        }
        // 通过拖拽文件方式
        if( nextProps.shituDragResultData && nextProps.shituDragResultDataLastUpdated !== this.props.shituDragResultDataLastUpdated){
            let types = SEARCH_CENTER_TYPE.split(','),
                type = /\.[^\.]+$/.exec(nextProps.shituDragResultData.data),
                falg = false;
            if( type ){    
                if( types.indexOf(type[0]) > -1 ){
                    falg = true;
                }             
            }
            if( !falg ){
                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: '该文件格式不支持<br />支持格式：JPG、JPEG、PNG、BMP',auto: true,speed: 3000,statu: 0})
                log("重新开启拖拽监听")
                this.props.actionsST.startGetDragDropFile()//重新开启拖拽监听             
            }else{ 
                this.setState({
                    isShituing: true,
                    shituMode: SHITU_MODE.image.path
                })
                setTimeout(() => {
                    this.getSendOptions({data:nextProps.shituDragResultData.data, mode: SHITU_MODE.image.path, page: nextProps.page}) 
                }, 200)
            }
        }
        //识图开始时判断本地是否有扫描过文件。
        if(nextProps.shituResultData && nextProps.shituResultDataLastUpdated != this.props.shituResultDataLastUpdated){
            //关闭超时机制
            clearTimeout(this.state.ssTimer)        
            if(nextProps.shituResultData.error_code == 0){
                //正在搜索时才触发
                if( this.state.isShituing || $('.stdiv .opt').is(":visible") ){
                    if( nextProps.page != pageKey ){
                        this.props.setRoute(SEARCH_ROUTES[1])
                    }
                    this.closeShitu(pageKey, true)
                }
            }else if(nextProps.shituResultData.error_code == 2402){
                this.closeShitu(nextProps.page, true)
                // 出现错误 文件未扫面
                // 弹出怎么扫描文件后再识图的提示
                try{
                    //弹出层时关闭拖拽
                    setTimeout(() => {
                        window.asyncStopGetDragDropFileRequest()
                    },500)
                }catch(e){}                
                this.props.actions.triggerDialogInfo({
                    type: SHOW_DIALOG_CONFIRM,
                    title: '系统提示',
                    text: '您尚未扫描任何文件夹，是否前往素材管理添加文件夹',
                    auto: true,
                    timeText: '秒后自动跳转',
                    speed: 5,
                    code: JUMP_PAGE,
                    codeData: {operation: "doc_select_folder_t", index: 1},
                    defaultFn: () => {
                        //开启拖拽
                        this.props.actionsST.startGetDragDropFile()                         
                    }
                })
            }else{               
                let strErr = isEmpty(nextProps.shituResultData.error) ? "识图失败" : nextProps.shituResultData.error
                this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: strErr, auto: true, speed: 3000, statu: 0}) 
                this.closeShitu(nextProps.page, true)
            }                            
        }
        //开启和关闭识图服务
        if(nextProps.shituSeriveData && nextProps.shituSeriveDataLastUpdated != this.props.shituSeriveDataLastUpdated){
            if (nextProps.shituSeriveData.error_code == 0) {
                //重新调用更新后的配置信息
                //有时会延时，直接使用返回的值去修改getConfig
                //this.props.actions.getConfigInfo()
                const getConfig = nextProps.getConfig
                if( getConfig && getConfig.data && getConfig.data.scan_docs_feature_switch ){
                   getConfig.data.scan_docs_feature_switch.value = nextProps.shituSeriveData.data 
                }  
                this.props.actions.triggerDialogInfo(null)                 
            }else{
               this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: nextProps.shituSeriveData.error ,auto: true,speed: 2000,statu: 0})
            }
        }
        if( nextProps.page != this.props.page ){
            if( nextProps.page == pageKey ){
                try{
                    window.asyncStopGetDragDropFileRequest() //关闭拖拽监听
                }catch(e){}
            }else{
                //开启拖拽
                this.props.actionsST.startGetDragDropFile()                
            }            
        }
    } 
    componentDidUpdate(nextProps, nextState) {
      if( nextState.shituMode === SHITU_MODE.text && 
          (this.state.shituMode === SHITU_MODE.image.path || this.state.shituMode === SHITU_MODE.image.base64) ){  
          const pbDom = document.querySelector('.st-box-panel .panel-bottom');
          if( pbDom ){
             pbDom.classList.add('active')
          }
          //funTransitionHeight(document.querySelector('.st-box-panel .panel-bottom'), 1650)
      }
    }   
    componentWillUnmount(){
        if( this.state.ssTimer ){
            clearTimeout(this.state.ssTimer);
        }               
        document.body.removeEventListener('paste',this.imagePaste)
    }
    imagePaste(e){     
        var clipboardData = e.clipboardData,i = 0,items, item, types;
        if( clipboardData ){
            items = clipboardData.items;

            if( !items ){
                return;
            }
            item = items[0];
            types = clipboardData.types || [];

            for(var i=0; i < types.length; i++ ){
                if( types[i] === 'Files' ){
                    item = items[i];
                    break;
                }
            }
            if( item && item.kind === 'file' && item.type.match(/^image\//i) ){
                this.imgReader( item );           
            }
        }
    }
    imgReader(item){
       var target = this;
       var blob = item.getAsFile(),
           reader = new FileReader();
        reader.onload = function( e ){
            var imgs =e.target.result;
            var img_src = imgs.split(',');
            target.setState({
                shituMode: SHITU_MODE.image.base64,
                isShituing: true
            })
            target.getSendOptions({data: img_src[1], mode: SHITU_MODE.image.base64, page: target.props.page})          
        };
        reader.readAsDataURL( blob );
    }
}
export default Common