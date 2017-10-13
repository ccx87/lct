import React, { Component, PropTypes } from 'react'

import { absVerticalCenter } from '../../constants/DomConstant'
import { dragDrop, log } from '../../constants/UtilConstant'
import { TAG_LIST } from '../../constants/DataConstant'

/* 弹出层--选择标签  */
class TagList extends Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		tagData: []
    	};
    	log("TagList");		
	}
	selectTagBtn(data, event) {
        event.stopPropagation();
        event.preventDefault();
        const a_Elem = event.currentTarget,
              i_Elem = a_Elem.querySelector('i'),
              tagData  = this.state.tagData;            
        if( i_Elem.className == 'icons icons-18 tag-active-bg' ){
            i_Elem.className = ''
            for( let i = 0; i < tagData.length; i++ ){
            	if( tagData[i].id == data.id ){
            		tagData.splice(i, 1)
            		break
            	}
            }
        }else{
	        if( tagData.length >= 4 ){
	        	return false
	        }        	
        	tagData.push(data)
        	i_Elem.className = 'icons icons-18 tag-active-bg'
        }      
	}
	tagSaveBtn(event) {
        event.stopPropagation();
        event.preventDefault();		
		this.props.actions.selectTagSave(this.state.tagData)
		this.props.actions.triggerDialogInfo(null)
	}
	render() {
		const { actions, dialogData } = this.props
		log(this.props)
		return <div className="dialog tag-list-layer" ref="verticalCenter">
		           <div className="dialog-title">
		               <span>选择标签</span>
		               <a className="abs close-dialog" onClick={() => actions.triggerDialogInfo(null)}><i className="icons icons-18 close-dialog-bg"></i></a>
		           </div>
		           <div className="dialog-content">
		               <p className="p-dc">选择适合的标签，最多<span className="col-red">4</span>个</p>
		               <ul className="tag-list scllorBar_tag">
		                   {
		                   	   TAG_LIST && TAG_LIST.length > 0 ?
		                   	       TAG_LIST.map((item, index1) => {
                                       return <li className="tag-item clearfix" key={index1}>
                                                 <div className="tag-type g-l">{item.text}</div>
                                                 <div className="tag-name">
                                                     {
                                                     	 item.tag && item.tag.length > 0 ?
                                                     	    item.tag.map((tag, index2) => {
                                                     	    	if( dialogData && dialogData.codeData && dialogData.codeData.length > 0 ){
                                                     	    		this.state.tagData = dialogData.codeData
                                                     	    		for( let i = 0; i < dialogData.codeData.length; i++ ){
                                                     	    			if( dialogData.codeData[i].id == tag.id ){
                                                     	    				return <a key={index2} className="name" onClick={this.selectTagBtn.bind(this, tag)}>{tag.text}<i className="icons icons-18 tag-active-bg"></i></a>
                                                     	    			}
                                                     	    		}
                                                     	    	}
                                                     	    	return <a key={index2} className="name" onClick={this.selectTagBtn.bind(this, tag)}>{tag.text}<i></i></a>
                                                     	    })
                                                     	 :
                                                     	    null    
                                                     }
                                                 </div>
                                              </li>
		                   	       })
		                   	   :
		                   	       null    
		                   }                                                      
		               </ul>
		           </div>
		           <div className="dialog-footer">
		                <a className="dialog-btn confirm-btn" onClick={this.tagSaveBtn.bind(this)}>保存并关闭</a>
		           </div>
		       </div>  
	}
	componentDidMount() {
		if(this.refs.verticalCenter){
			const optElem = document.querySelector('.body-opacity-layer'),
			      parElem = document.querySelector('.tag-list-layer'),
			      dragElem = parElem.querySelector('.dialog-title')			
			optElem.style.display = 'block'			
			absVerticalCenter(this.refs.verticalCenter)
			dragDrop(dragElem, parElem)
		}
		$(".scllorBar_tag").mCustomScrollbar({
			theme:"dark-3",
			scrollInertia:550
		});		
	}		
}
export default TagList
