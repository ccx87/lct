import React, { Component, PropTypes } from 'react'

import { log } from '../../constants/UtilConstant'

class RankingTable extends Component {
	constructor(props) {
    	super(props);
    	this.state = {};
    	log("RankingTable");		
	}	
	render() {
		const { onRecordItem } = this.props
		return <div className="ranking-table">
					<table className="table">
				    	<colgroup>
	                		<col className="col-1" />
	                		<col className="col-2" />
	                		<col className="col-3" />
	                		<col className="col-4" />
	                	</colgroup>		               
	                    <tbody>
	                         <tr>
	                            <td>1</td>
	                            <td><i className="icons icons-18 ranking-up-bg"></i></td>
	                            <td>方正字体</td>
	                            <td>4121511</td>
	                         </tr>
	                         <tr>
	                            <td>2</td>
	                            <td><i className="icons icons-18 ranking-down-bg"></i></td>
	                            <td>方正字体</td>
	                            <td>412115</td>
	                         </tr>
	                         <tr>
	                            <td>3</td>
	                            <td>-</td>
	                            <td>方正字体</td>
	                            <td>41125</td>
	                         </tr>
	                         <tr>
	                            <td>4</td>
	                            <td><i className="icons icons-18 ranking-new-bg"></i></td>
	                            <td>方正字体</td>
	                            <td>8125</td>
	                         </tr>
	                         <tr>
	                            <td>5</td>
	                            <td>-</td>
	                            <td>方正字体</td>
	                            <td>412</td>
	                         </tr>
	                         <tr>
	                            <td>6</td>
	                            <td><i className="icons icons-18 ranking-down-bg"></i></td>
	                            <td>方正字体</td>
	                            <td>412115</td>
	                         </tr>
	                         <tr>
	                            <td>7</td>
	                            <td>-</td>
	                            <td>方正字体</td>
	                            <td>41125</td>
	                         </tr>
	                         <tr>
	                            <td>8</td>
	                            <td><i className="icons icons-18 ranking-new-bg"></i></td>
	                            <td>方正字体</td>
	                            <td>8125</td>
	                         </tr>
	                         <tr>
	                            <td>9</td>
	                            <td><i className="icons icons-18 ranking-up-bg"></i></td>
	                            <td>方正字体</td>
	                            <td>4121511</td>
	                         </tr>                         	                         	                         	                         	                         	                         	                         
	                    </tbody>
			       </table>			           
		       </div>
	}
	componentDidMount() {
	     
	}
	componentDidUpdate(nextProps, nextState) {
	
	}
}
export default RankingTable