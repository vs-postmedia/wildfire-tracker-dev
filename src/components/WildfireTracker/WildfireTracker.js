import React, { Component } from 'react';
import Tabletop from 'tabletop';
import CircleMap from '../CircleMap/CircleMap';
import './WildfireTracker.css';


const googleSheetURL = 'https://docs.google.com/spreadsheets/d/1mg71j-P91H_PpA9OufEPIRrDgpK80nWpN1CKH9LlIBk/edit?usp=sharing';



export class WildfireTracker extends Component {
	constructor(props) {
		super(props);

		this.state = {
			center: [51.584179, -120.652423],
			data: [],
			maxZoom: 8,
			minZoom: 3,
			zoom: 6
		}
	}
	componentDidMount() {
		// load data from Google sheet
		Tabletop.init({
			key: googleSheetURL,
			callback: fire_data => {
				this.setState({
					data: fire_data
				});
			},
			simpleSheet: true
		});
	}

	render() {
		return (
			<CircleMap id="mapview"
				center={this.state.center}
				data={this.state.data}
				maxZoom={this.state.maxZoom}
				minZoom={this.state.minZoom}
				zoom={this.state.zoom}>
			</CircleMap>
		);
	}
}

export default WildfireTracker;