import React, { Component } from 'react';
import Aux from '../Aux/Aux';
import Tabletop from 'tabletop';
import CircleMap from '../CircleMap/CircleMap';
import SummaryBox from '../SummaryBox/SummaryBox';
import './WildfireTracker.css';


export class WildfireTracker extends Component {
	constructor(props) {
		super(props);

		this.state = {
			center: [54.184179, -125.652423],
			classField: 'FIRE_STATU',
			data: [],
			maxZoom: 8,
			minZoom: 3,
			zoom: 5
		}
	}
	componentDidMount() {
		// load data from Google sheet
		Tabletop.init({
			key: this.props.sheet,
			callback: (data, tabletop) => {
				this.setState({
					data: data
				});
			},
			simpleSheet: true
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
					data={this.state.data}>
				</SummaryBox>
			</Aux>
		);
	}
}

export default WildfireTracker;