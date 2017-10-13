import React, { Component, PropTypes } from 'react'
import { immutableRenderDecorator } from 'react-immutable-render-mixin'

import { log, isEmpty } from '../../constants/UtilConstant'

//进度条
class ProgressBar extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            tempProgress: '0%',
            stepProgress1: '0%',
            stepProgress2: '0%',
            timer: null
        };
      	log("ProgressBar--进度条");		
  	}
    inItTempProgress(_props) {
        //没有新文件需要扫描时且收到2001的标识符时，activePage=0的进度直接到100%
        if( _props.connectMsg && _props.connectMsg.error_code == 2001 ){
            clearInterval(this.state.timer);
            this.setState({
                tempProgress: '100%'
            }) 
            return false           
        }
        if( _props.activePage == 0 && !this.state.timer ){
            let times = 10;
            this.state.timer = setInterval(() => {
                times--
                if( times <= 0 ){
                    clearInterval(this.state.timer); 
                }
                let timediff = (10 - times) * 10;
                if( timediff >= 100 ){
                    timediff = 90;
                }
                this.setState({
                    tempProgress: timediff +'%'
                })
            },1000);
        }
        if( _props.activePage > 0 ){
            clearInterval(this.state.timer);
            let progress = '0%',
                step1 = this.state.stepProgress1,
                step2 = this.state.stepProgress2;
            if( _props.progressData != null ){  
                progress = _props.progressData.total_progress >= 0 ? _props.progressData.total_progress +'%' : '0%'; 
                if( _props.activePage == 1 ){
                    step1 = progress +'%';                   
                }else if( _props.activePage == 2 ){
                    step1 = '100%';
                    step2 = progress +'%';
                }else {
                    step1 = step2 = '100%';
                }
            }
            this.setState({
                tempProgress: '100%',
                stepProgress1: step1,
                stepProgress2: step2
            })            
        }               
    }	       		
    render() {
        const { thisData, progressData, activePage } = this.props
        const { tempProgress, stepProgress1, stepProgress2 } = this.state
        const classes = 'pb-item flex flex-c flex-item-gsb-0',
              classesed = 'pb-item flex flex-c flex-item-gsb-0 active';
        return (
            <div className="progress-bar h-full flex flex-c flex-c-c">
                <div className="active-page-pb flex flex-c flex-c-c">
                    <div className={ activePage >= 0 ? classesed : classes}>
                        <span className="step-item step-1 flex flex-c flex-c-c flex-item-gsb-0"></span>
                        <span className="step-pb-bg h-full flex-item-gsb-1">
                           <span className="pb-bg abs" style={{width: tempProgress}}></span>
                        </span>
                    </div>
                    <div className={ activePage >= 1 ? classesed : classes}>
                        <span className="step-item step-2 flex flex-c flex-c-c flex-item-gsb-0">1</span>
                        <span className="step-pb-bg h-full flex-item-gsb-1">
                            <span className="pb-bg abs" style={{width: stepProgress1}}></span>
                        </span>
                    </div>
                    <div className={ activePage >= 2 ? classesed : classes}>
                        <span className="step-item step-2 flex flex-c flex-c-c flex-item-gsb-0">2</span>
                        <span className="step-pb-bg h-full flex-item-gsb-1">
                           <span className="pb-bg abs" style={{width: stepProgress2}}></span>
                        </span>
                    </div>
                    <div className={ activePage >= 3 ? classesed : classes}>
                        <span className="step-item step-1 flex flex-c flex-c-c flex-item-gsb-0"></span>
                    </div>                                                            
                </div>
            </div>
        )
    }
    componentDidMount() {
        this.inItTempProgress(this.props)
    }
    componentWillReceiveProps(nextProps) {
        this.inItTempProgress(nextProps)
    }
    componentWillUnmount() {
        if( this.state.timer ){
            clearInterval(this.state.timer);
        } 
    }
}
export default immutableRenderDecorator(ProgressBar)