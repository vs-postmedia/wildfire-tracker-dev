import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import WildfireTooltip from '../WildfireTooltip/WildfireTooltip';

import './CircleMap.css';


export class CircleMap extends Component {
	map;
	state = {};
	// prep the popup
	popup = new mapboxgl.Popup({
		closeButton: false,
		closeOnClick: false
	});

	constructor(props) {
		super(props);

		// bind popup to main component
		this.showPopup = this.showPopup.bind(this);
		this.hidePopup = this.hidePopup.bind(this);
	}

	componentDidMount() {
		const data = this.props.data;

		// extents for circles
		this.extent_calcuted = false;
		// set the min/max sizes for circles
		this.range = this.props.range ? this.props.range : [3,50];

		// API key
		mapboxgl.accessToken = this.props.config.accessToken;
		
		this.map = new mapboxgl.Map({
			// container: this.props.container,
			container: this.mapContainer,
			style: this.props.mapboxStyle,
			center: [this.props.center[1], this.props.center[0]],
      		zoom: this.props.zoom
		});

		// render the map
		if (data.features) {
			this.renderMap(data);
		}
	}

	componentDidUpdate(prevProps) {
		if (this.state.mapIsLoaded) {
			if (this.props.data !== prevProps.data) {
			    this.map.getSource('wildfires').setData(this.props.data);
			}
		} else {
			this.renderMap(this.props.data);
		}
		
	}

	getExtent(data) {
		let fire_size = [];

		data.forEach(d => {
			fire_size.push(parseFloat(d.properties.CURRENT_SI));
		});
		return [Math.min(...fire_size), Math.max(...fire_size)];
	}

	hidePopup() {
		this.map.getCanvas().style.cursor = '';
		this.popup.remove();
	}

	mapRange(extent, range, value) {
		return range[0] + (value - extent[0]) * (range[1] - range[0]) / (extent[1] - extent[0]);
	}
	
	prepData(data) {
		// we only want to calculate the extent once, otherwise the circle size changes when toggling by fire_type, which is confusing
		if (!this.extent_calcuted) {
			this.extent = this.getExtent(data.features);
			this.extent_calcuted = true;
		}

		// calculate circle size
		data.features.forEach((d,i) => {
			const radius = this.mapRange(this.extent, this.range, d.properties.CURRENT_SI);
			d.properties.radius = Math.log(radius) * 4;
		});

		// reorder array by CURRENT_SI, largest -> smallest
		data.features.sort((a,b) => {
			return b.CURRENT_SI - a.CURRENT_SI;
		});
	}

	setupPopupText(properties) {
		return WildfireTooltip(properties);
	}

	showPopup(e) {
		// change cursor style as UI indicator
		this.map.getCanvas().style.cursor = 'pointer';
		// popup content to be displayed
		const text = this.setupPopupText(e.features[0].properties);

		// set coords based on mouse position
		this.popup.setLngLat(e.lngLat)
			.setHTML(text)
			.addTo(this.map)
	}

	renderMap(data) {
		this.prepData(data);

		// add fire location
		this.map.on('load', () => {
			this.map.addSource('wildfires', {
				type: 'geojson',
				data: data
			});

			this.map.addLayer({
				id: 'wildfires',
				type: 'circle',
				source: 'wildfires',
				paint: {
					'circle-color': [
						'match',
						['get', 'FIRE_STATU'],
						'New',
						'#DD2D25',
						'Out of Control',
						'#DD2D25',
						'Being Held',
						'#F26B21',
						'Under Control',
						'#0062A3',
						'Out',
						'#6D6E70',
						/* other */ '#F6B31C'
					],
					'circle-opacity': 0.7,
					// probably a better way to do this...
					'circle-radius': [
						'*',
						['get', 'radius'],
						1
					],
					'circle-stroke-width': 0.5,
					'circle-stroke-color': '#FFF'
				}
			});

			// show & hide the popup
			this.map.on('mouseenter', 'wildfires', this.showPopup);
			this.map.on('mouseleave', 'wildfires', this.hidePopup);
		});

		this.setState({
			mapIsLoaded: true
		});
	}

	render() {
		return (
			<div ref={el => this.mapContainer = el} />
		);
	}
}


export default CircleMap;