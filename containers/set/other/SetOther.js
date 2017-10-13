import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import StaticTitleBar from '../../../modules/StaticTitleBar'
import { log } from '../../../constants/UtilConstant'

class SetOther extends Component {
  	constructor(props) {
      	super(props);
      	this.state = {
            set_path_data: null,
            download: null 
        };
      	log("SetOther");		
  	}	
    updataPathBtn(data, event){
        this.state.set_path_data = data;
        this.props.actions.openFileRequest(3, data.value)
    }
    render() {
        const { route } = this.props
        const { download } = this.state
        //<StaticTitleBar fontSize={12} text={'其它设置'}/>
        return (
          <div className="set-other">
              <StaticTitleBar fontSize={14} text={'常规设置'}/>
              <div className="main_container">
                  <div className="item-other">
                      <div className="io-item">
                          <p>
                             <span className="col-3 font-weight7">下载目录：</span>
                             <span className="col-hui">默认将下载到该文件夹目录下</span>
                          </p>
                          <p>
                             <span className="path-text">{download ? download.value : ""}</span>
                             <a href="javascript:;" className="abtn" onClick={this.updataPathBtn.bind(this, download)}>更改目录</a> 
                          </p>

                      </div>
                  </div>
              </div>

          </div>
        )
    } 
    componentWillReceiveProps(nextProps) {
        log(22222,nextProps)
        if( nextProps.getConfig &&  nextProps.getConfig.data ){
             const n_g = nextProps.getConfig.data 
            if(  n_g && n_g.download_path ){
                this.setState({
                    download: {key: 'download_path', value: n_g.download_path.value}
                })
            } 
        }
        if( nextProps.openFilePath_3 && nextProps.openFile3LastUpdate !== this.props.openFile3LastUpdate ){
            if( nextProps.openFilePath_3.data && this.state.set_path_data ){
                this.state.set_path_data.value = nextProps.openFilePath_3.data; 
                let data = []
                data.push(this.state.set_path_data)
                this.props.actions.setConfigRequest(data) 
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
)(SetOther)
