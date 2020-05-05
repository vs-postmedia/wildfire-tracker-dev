import React, { Component, Fragment } from 'react';
import CircleMap from '../CircleMap/CircleMap';
import SummaryBox from '../SummaryBox/SummaryBox';
import './WildfireMap.css';


export class WildfireTracker extends Component {
	map_options = {
		center: [54.184179, -125.652423],
		classField: 'FIRE_STATU',
		maxZoom: 8,
		minZoom: 3,
		zoom: 5
	}

	render() {
		return (
			<Fragment>
				<h1>B.C. Wildfire Tracker</h1>
				<CircleMap id="mapview"
					attribution={this.props.attribution}
					center={this.map_options.center}
					circleMarkerClassField={this.map_options.classField}
					data={this.props.data}
					maxZoom={this.map_options.maxZoom}
					minZoom={this.map_options.minZoom}
					tiles={this.props.tiles}
					zoom={this.map_options.zoom}>
				</CircleMap>
				<SummaryBox
					data={this.props.data_all}
					toggleFireTypeHandler={this.props.toggleFireTypeHandler}>
				</SummaryBox>
			</Fragment>
		);
	}
}

export default WildfireTracker;
