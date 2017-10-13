import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'
import { is } from 'immutable'

import { log } from '../../constants/UtilConstant'
import { showOrHideItem } from '../../constants/DomConstant'
import { COLOR_CHANNEL, COLOR_MODE_CMYK, COLOR_MODE_RGB, NOT_YET } from '../../constants/TextConstant'

class ColorChannel extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {};
        this.clickTitleBtn = this.clickTitleBtn.bind(this)
      	log("ColorChannel");		
  	}	
    clickTitleBtn(event) {
          event.stopPropagation();
          event.preventDefault();
          const this_Elem = event.currentTarget,
                sib_Elem = this_Elem.nextSibling,
                i_Elem = this_Elem.querySelector('.open-info-bg');
          showOrHideItem(sib_Elem, i_Elem, 'rotate-90-bg')      
    }    		
    render() {
        const { fmData, active } = this.props;
        return (
            <div className={active ? "detail-item color-channel active" : "detail-item color-channel"}>
                <a href="javascript:;" className="title flex flex-c" onClick={this.clickTitleBtn}>
                    <i className={active ? "icons icons-9 open-info-bg rotate-90-bg" : "icons icons-9 open-info-bg"}></i>
                    <span className="text">
                        {COLOR_CHANNEL}
                        {fmData && fmData.color_set && fmData.color_set.constructor == Array ? "（"+ fmData.color_set.length +"）" : null }
                    </span>
                </a> 
                {
                    fmData !== null ?
                      <div className="di-main">
                          <div className="colorChannel-content">
                             {
                                 fmData.color_mode == 'CMYK' ?
                                     <div className="color-mode">
                                         <i className="icons icons-18 cmyk-mode-bg"></i>
                                         <span className="color-name">{COLOR_MODE_CMYK}</span>
                                     </div> 
                                 :
                                 fmData.color_mode == 'RGB' ?
                                     <div className="color-mode">
                                         <i className="icons icons-18 rgb-mode-bg"></i>
                                         <span className="color-name">{COLOR_MODE_RGB}</span>
                                     </div>  
                                 :
                                     null              
                             }
                             {
                                 fmData.color_set && fmData.color_set.constructor == Array && fmData.color_set.length > 0 ?
                                     fmData.color_set.map((item, index) => {
                                          if( item.bIsUsed ){
                                             const rgb = "rgb("+ item.red +','+ item.green + ','+ item.blue + ')';
                                             return <div className="color-item" key={index}>
                                                        <i className="color-bg" style={{"backgroundColor": rgb}}></i>
                                                        <span className="color-name">{item.name}</span>
                                                    </div>
                                          }else{
                                             return <div className="color-item" key={index}>
                                                        <i className="icons color-bg invalid-color-bg"></i>
                                                        <span className="color-name">{item.name}</span>
                                                    </div>                             
                                          }                                               
                                     })
                                 :
                                     null               
                            }
                          </div>
                      </div>
                    :
                      null  
                }                                                   
            </div>  
        )
    }	
    shouldComponentUpdate(nextProps, nextState) {
        return !(this.props === nextProps || is(this.props, nextProps)) ||
               !(this.state === nextState || is(this.state, nextState))      
    }  
}
export default immutableRenderDecorator(ColorChannel)