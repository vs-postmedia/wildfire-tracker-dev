import React, { Component } from 'react';
import { Map, TileLayer, Polygon, GeoJSON } from 'react-leaflet';


export class PolyMap extends Component {
	componentDidMount() {
		console.log(this)

	}

	render() {
		let coords;
		const props = this.props;

		if (props.data) {
			coords = props.data.geometry.coordinates;	
		}

		return (
			<Map 
				center={props.center} 
				zoom={props.zoom}>

				<TileLayer url={props.tiles} 
					attribution={props.attribution} 
					maxZoom={props.maxZoom}
					minZoom={props.minZoom}/>

				
				
				{ 
					this.props.data.geometry.coordinates.map((perim,i) => {
						console.log(perim)
						return <Polygon key={i} color="purple" positions={perim} /> 
					})
				}
			</Map>
		);
}
}


export default PolyMap;

/*
	
}
*/