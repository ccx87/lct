import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { isEmpty, log } from '../../../constants/UtilConstant' 
import { SHOW_DIALOG_TAGLIST, SHOW_DIALOG_ALERT } from '../../../constants/TodoFilters'
import { ROUTES } from '../../../constants/DataConstant'

//创建
class Create extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
          nameVal: ""
      };
    	log("Create");		
	}
  keyDownReturn(event) {
      const e = event || window.event || arguments.callee.caller.arguments[0];
      if( e ){
          this.state.nameVal = event.currentTarget.value;         
      }
      return false
  }
  keyUpReturn(event) {
      const input_Elem = event.currentTarget,
            btn_Elem = this.refs.confirmBtnRef,
            reg = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
      if( input_Elem.value == '' ){
          btn_Elem.className = 'a-btn confirm'
          this.state.nameVal = ''
      } else{     
          if( !reg.test(input_Elem.value) ){
               input_Elem.value = this.state.nameVal
               if( isEmpty(input_Elem.value) ){
                   btn_Elem.className = 'a-btn confirm'
               }else {
                   btn_Elem.className = 'a-btn confirm active'
               }
          }else{
               btn_Elem.className = 'a-btn confirm active'
          }
      }
      return false
  }
  confirmSave(event) {
      event.stopPropagation();
      event.preventDefault();
      const login = this.props.login;
      if( login && login.loginUserData ){
          if( login.loginUserData.id == null ){
              this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "登录后才能创建字体单",auto: true,speed: 1500,statu: 0})
              return false; 
          }
      }
      if( event.currentTarget.className == 'a-btn confirm active' ){
          event.currentTarget.disabled = true;
          event.currentTarget.innerHTML = '保存中';        
          let tagStr = '';
          if( this.props.tag ){
              for ( let i = 0; i < this.props.tag.length; i++ ){
                  if( i < this.props.tag.length - 1 ){
                      tagStr += this.props.tag[i].text + ' '
                  }else{
                      tagStr += this.props.tag[i].text
                  }
              }
          } 
          const data = {
                userId: this.props.login.loginUserData.id,
                listName: this.refs.createInputRef.value,
                tag: tagStr,
                brief: this.refs.createTextareaRef.value,
                coverImg: null
          }
          this.props.actions.addSingleFont(data)       
      }       
  }
  canceCreate() {
    this.props.actions.initializationData();
     this.props.actions.getInItRoute({
         route: ROUTES[0], 
         subRoute: ROUTES[0].data[0]
     })    
  }
	render() {
    const { actions, tag } = this.props
		return <div className="content-create-cf">
                   <div className="title">
                        编辑字体单
                   </div>
                   <div className="content">
                        <div className="c-l">
                            <dl className="clearfix">
                               <dt>字体单名：</dt>
                               <dd><input type="text" ref="createInputRef" maxLength="20" className="create-input" 
                                       onKeyDown={this.keyDownReturn.bind(this)}
                                       onKeyUp={this.keyUpReturn.bind(this)}/>
                               </dd>
                               <dt>标签：</dt>
                               <dd>
                                  {
                                     tag && tag.length > 0 ?
                                         tag.map((item, index) =>
                                             <span className="tag-item col-red" key={index}>{item.text}</span>
                                         )     
                                     :
                                         null   
                                  } 
                                  <a className="a-tag" onClick={() => actions.triggerDialogInfo({type: SHOW_DIALOG_TAGLIST, codeData: tag})}>选择标签</a>  
                               </dd>
                               <dt>简介：</dt>
                               <dd><textarea ref="createTextareaRef" className="create-textarea"></textarea></dd>                                                              
                            </dl>
                        </div>
                        <div className="c-r">
                            <img src="" alt="" className="cover-img"/>
                            <a className="a-btn edit-img-btn">编辑封面</a>  
                        </div>
                   </div>
                   <div className="btn-save">
                        <button type="button" className="a-btn confirm" ref="confirmBtnRef" onClick={this.confirmSave.bind(this)}>保存</button>
                        <button type="button" className="a-btn cancel" onClick={this.canceCreate.bind(this)}>取消</button>
                   </div>
		       </div>
	}
  componentWillReceiveProps(nextProps){
     if( nextProps.creatSingleRoute && nextProps.singleLastUpdated !== this.props.singleLastUpdated ){
         if( nextProps.creatSingleRoute.error_code == 101 ){
             const btn_Elem = document.querySelector('.a-btn.confirm');
             btn_Elem.innerHTML = '保存';
             btn_Elem.disabled = false;
             this.props.actions.triggerDialogInfo({type: SHOW_DIALOG_ALERT,text: "创建字体单失败",auto: true,speed: 1500,statu: 0})
         }
     }
  }
  componentDidUpdate(nextProps){

  }	
}
Create.propTypes = {
	
}
const mapStateToProps = (state) => {
  return {
    tag: state.events.selectTagData,
    tagLastUpdated: state.events.tagLastUpdated,

    creatSingleRoute: state.inIt.creatSingleRoute,
    singleLastUpdated: state.inIt.singleLastUpdated
  }
}
export default connect(
  mapStateToProps
)(Create)
