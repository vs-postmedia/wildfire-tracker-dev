import React, { Component } from 'react';
import Tabletop from 'tabletop';
import CircleMap from '../CircleMap/CircleMap';
import './WildfireTracker.css';


export class WildfireTracker extends Component {
	constructor(props) {
		super(props);

		this.state = {
			center: [51.584179, -120.652423],
			classField: 'FIRE_STATU',
			data: [],
			maxZoom: 8,
			minZoom: 3,
			zoom: 6
		}
	}
	componentDidMount() {
		// load data from Google sheet
		Tabletop.init({
			key: this.props.sheet,
			callback: data => {
				this.setState({
					data: data
				});
			},
			simpleSheet: true
		});
	}

	render() {
		return (
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
		);
	}
}

export default WildfireTracker;