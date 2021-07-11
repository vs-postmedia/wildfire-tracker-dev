import React, { Component } from 'react';
// import mapboxgl from 'mapbox-gl';
import maplibregl from 'maplibre-gl';
import WildfireTooltip from '../WildfireTooltip/WildfireTooltip';

// CSS
import './maplibre-gl.css';
import './CircleMap.css';

import firesmoke from '../../data/test.png'

const evacZoomLevel = 6;
const evacMinSize = 220000000;

export class CircleMap extends Component {
	map;
	state = {};
	// prep the popup
	// popup = new mapboxgl.Popup({
	popup = new maplibregl.Popup({
		closeButton: false,
		closeOnClick: true
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
		
		this.map = new maplibregl.Map({
			// container: this.props.container,
			center: [this.props.center[1], this.props.center[0]],
			container: this.mapContainer,
			maxZoom: this.props.maxZoom,
			minZoom: this.props.minZoom,
			style: this.props.mapboxStyle,
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

		// has a feature been selected?
		if (this.props.selectedFeature && this.props.selectedFeature !== prevProps.data) {
			this.flyToLocation(this.props.selectedFeature);
			this.showPopup(this.props.selectedFeature, true)
		}
	}

	flyToLocation(currentFeature) {
		this.map.flyTo({
			center: currentFeature.geometry.coordinates,
			zoom: 8
		});
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

	showPopup(e, sidebarClick) {
		// console.log(e)
		let coords, text;

		if (sidebarClick) {
			coords = {
				lng: e.geometry.coordinates[0],
				lat: e.geometry.coordinates[1]
			}
			text = this.setupPopupText(e.properties);
		} else {
			coords = e.lngLat;
			text = this.setupPopupText(e.features[0].properties);
		}
		// change cursor style as UI indicator
		this.map.getCanvas().style.cursor = 'pointer';

		// set coords based on mouse position
		this.popup.setLngLat(coords)
			// popup content to be displayed
			.setHTML(text)
			.addTo(this.map)
	}

	renderMap(data) {
		this.prepData(data);

		// add fire location
		this.map.on('load', () => {
			// Find the first symbol layer in the map style so we can keep them on top
			let firstSymbolId;
			const layers = this.map.getStyle().layers;
			
			for (let i = 0; i < layers.length; i++) {
				if (layers[i].type === 'symbol') {
					firstSymbolId = layers[i].id;
					break;
				}
			}

			// firesmoke.a
			this.map.addSource('fire-smoke', {
				type: 'image',
				url: this.props.fireSmokeUrl,
				coordinates: [
					[-160,70],
					[-52,70],
					[ -52,32],
					[-160,32]
				]
			});
			this.map.addLayer({
				id: 'fire-smoke',
				source: 'fire-smoke',
				type: 'raster',
				paint: {
					'raster-opacity': 0.6
				}
			}, firstSymbolId);

			// Evac and alerts
			this.map.addSource('evacs_alerts', {
				type: 'geojson',
				'data': this.props.evacsAlerts
			});
			// polygons
			this.map.addLayer({
				id: 'evac-data',
				source: 'evacs_alerts',
				type: 'fill',
				paint: {
					'fill-color': [
						'match',
						['get', 'OA_STATUS'],
						'Alert',
						'#FACE7C',
						'Order',
						'#e67154',
						'Tactical',
						'#A7A9AB',
						'#A7A9AB'
					],
					'fill-opacity': 0.6
				}
			// place layer underneath this layer
			}, firstSymbolId);
					
			// labels
			this.map.addLayer({
				id: 'evac-data-text',
				minzoom: evacZoomLevel,
				source: 'evacs_alerts',
				type: 'symbol',
				// we don't need to label every single evac zone...
				filter: ['>', ['get', 'AREA_SQM'], evacMinSize],
				layout: {
					'symbol-placement': 'point',
					'text-field': [
						'format',
						['concat', 'Evacuation ', ['get', 'OA_STATUS']],
						{
							'font-scale': 0.9,
							'font-weight': 800
						}
					],
				},
				paint: {
					'text-color': 'rgba(255,255,255,1)',
					'text-halo-blur': .25,
					'text-halo-color': [
						'match',
						['get', 'OA_STATUS'],
						'Alert',
						'#F6B31C',
						'Order',
						'#DD2D25',
						'Tactical',
						'#A7A9AB',
						'#A7A9AB' // fallback
					],
					'text-halo-width': 1
				}
			});

			// wildfires
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
						/* fallback */ '#9b3f86'
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
			},
			// place layer underneath this layer
			firstSymbolId);

			// Add zoom and rotation controls to the map.
			this.map.addControl(new maplibregl.NavigationControl());

			// show & hide the popup
			this.map.on('click', 'wildfires', this.showPopup);
			this.map.on('mouseenter', 'wildfires', this.showPopup);
			this.map.on('mouseleave', 'wildfires', this.hidePopup);
			// this.map.on('mouseenter', 'evacs_alerts', this.showPopup);
			// this.map.on('mouseleave', 'evacs_alerts', this.hidePopup);
			
			// Change the cursor to a pointer when the mouse is over the places layer.
			this.map.on('mouseenter', 'places', function () {
				this.map.getCanvas().style.cursor = 'pointer';
			});
			 
			// Change it back to a pointer when it leaves.
			this.map.on('mouseleave', 'places', function () {
				this.map.getCanvas().style.cursor = '';
			});
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