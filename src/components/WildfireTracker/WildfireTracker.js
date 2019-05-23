import React, { Component } from 'react';
import Aux from '../Aux/Aux';
import Tabletop from 'tabletop';
import CircleMap from '../CircleMap/CircleMap';
import SummaryBox from '../SummaryBox/SummaryBox';
import './WildfireTracker.css';


export class WildfireTracker extends Component {
	constructor(props) {
		super(props);

		this.toggleFireTypeHandler = this.toggleFireTypeHandler.bind(this);
	}

	state = {
		center: [54.184179, -125.652423],
		classField: 'FIRE_STATU',
		data: [],
		data_all: [],
		maxZoom: 8,
		minZoom: 3,
		zoom: 5
	}
	componentDidMount() {
		// load data from Google sheet
		Tabletop.init({
			key: this.props.sheet,
			callback: (data, tabletop) => {
				this.setState({
					data: data,
					data_all: data
				});
			},
			simpleSheet: true
		});
	}

	toggleFireTypeHandler(e) {
		let fire_data;
		let fire_class = e.target.className.split(' ')[1];

		if (fire_class === this.state.data_displayed) {
			fire_data = this.state.data_all;
			fire_class = null;
		} else {
			fire_data = this.state.data_all.filter(d => d.FIRE_STATU.replace(/\s/g, '-').toLowerCase() === fire_class);
		}

		this.setState({
			data_displayed: fire_class,
			data: fire_data
		});
	}

	titleCase(str) {
		return str.replace(/\w\S*/g, function(txt) {
        	return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    	});
	}

	render() {
		return (
			<Aux>
				<CircleMap id="mapview"
					attribution={this.props.attribution}
					center={this.state.center}
					circleMarkerClassField={this.state.classField}
					data={this.state.data}
					maxZoom={this.state.maxZoom}
					minZoom={this.state.minZoom}
					tiles={this.props.tiles}
					zoom={this.state.zoom}>
				</CircleMap>
				<SummaryBox
					data={this.state.data_all}
					onClick={this.toggleFireTypeHandler}>
				</SummaryBox>
			</Aux>
		);
	}
}

export default WildfireTracker;