import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoibmdyaWZmaXRocy1wb3N0bWVkaWEiLCJhIjoiY2p5eWluaDR1MHoycTNpbnZhYnE1ZGJ5YyJ9.ky9G5qVIJn0gz_y7tULp6Q';


class InsetMap extends Component {
	mapRef = React.createRef();
	map;


	componentDidMount() {
		console.log(this.props)
		this.map = new mapboxgl.Map({
			// container: this.mapRef.current,
			container: 'fon-mapview',
			style: 'mapbox://styles/mapbox/outdoors-v11',
			center: [this.props.center[1], this.props.center[0]],
      		zoom: this.props.zoom
		});
	}

	render() {	
		return (
			<div>
				<div ref={this.map}></div>
			</div>
		);
	}
}

export default InsetMap;