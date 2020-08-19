import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import './InsetMap.css';



class InsetMap extends Component {
	mapRef = React.createRef();
	map;
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
		const id = this.props.data.properties.FIRE_NUMBE;

		// API key
		mapboxgl.accessToken = this.props.config.accessToken;

		console.log(this.props)
		this.map = new mapboxgl.Map({
			// container: this.mapRef.current,
			container: this.props.container,
			style: this.props.mapboxStyle,
			center: [this.props.center[1], this.props.center[0]],
      		zoom: this.props.zoom
		});

		/// not every fire has a perimeter
		if (data.type === 'Feature') {
			console.log(data)
			// add fire perimeter polygon
			this.map.on('load', () => {

				this.map.addSource('fire_perim', {
					type: 'geojson',
					data: data
				});

				console.log(this.map)

				this.map.addLayer({
					id: id,
					type: 'fill',
					source: 'fire_perim',
					paint: {
						'fill-color': '#DD2D25',
						'fill-opacity': 0.4
					}
				});

				// show & hide the popup
				this.map.on('mouseenter', id, this.showPopup);
				this.map.on('mouseleave', id, this.hidePopup);
			});
		} else {
			this.map.on('load', () => {
				this.map.addSource(data.properties.fire_number, {
					'type': 'geojson',
					'data': {
						'type': 'FeatureCollection',
						'features': [{
							// feature for fire location
							'type': 'Feature',
							'geometry': {
								'type': 'Point',
								'coordinates': [
									data.properties.LONGITUDE,
									data.properties.LATITUDE
								]
							},
							'properties': {
								'title': data.properties.FIRE_NT_NM,
								'radius': data.properties.radius * 2
							}
						}]
					}
				});

				this.map.addLayer({
					id: data.properties.fire_number,
					type: 'circle',
					source: data.properties.fire_number,
					paint: {
						'circle-color': 'green',
						'circle-opacity': 0.7,
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
				this.map.on('mouseenter', id, this.showPopup);
				this.map.on('mouseleave', id, this.hidePopup);
			});
		}
	}

	hidePopup() {
		this.map.getCanvas().style.cursor = '';
		this.popup.remove();
	}

	setupPopupText(properties) {
		return `<div className="popup-text"><h3>${properties.FIRE_NT_NM}</h3><p>${properties.cause_detail}</p></div>`
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

	render() {	
		return (
			<div>
				<div ref={this.map} id={this.props.container} className="fon-mapview"></div>
				<pre id="info"></pre>
			</div>
			
		);
	}
}

export default InsetMap;