import React, { Component } from 'react';
import { CircleMarker, Map, TileLayer, Tooltip} from 'react-leaflet';
import WildfireTooltip from '../WildfireTooltip/WildfireTooltip';
// import range from './range';

import './CircleMap.css';


export class CircleMap extends Component {	
	render() {
		console.log(this.props);
		const range = this.props.range ? this.props.range : [3,50];
		const extent = getExtent(this.props.data);

		const fills = {
			'being-held': 'orange',
			'new': 'red',
			'out': 'darkgrey',
			'under-control': 'steelblue'
		}

		// TO DO
		// reorder array by CURRENT_SI, largest -> smallest

		

		return (
			<Map 
				center={this.props.center} 
				zoom={this.props.zoom}>

				<TileLayer url={this.props.tiles} 
					attribution={this.props.attribution} 
					maxZoom={this.props.maxZoom}
					minZoom={this.props.minZoom}/>
				
				{this.props.data.map(d => {
					const classField = d[this.props.circleMarkerClassField].toLowerCase().replace(/\s/g, '-');

					return <CircleMarker key={d.FIRE_ID} 
						center={[d.LATITUDE, d.LONGITUDE]} 
						className={`circle-marker ${classField}`}
						color='#FFFFFF'
						// fillColor={d[this.props.circleMarkerClassField] ? fills[classField] : 'darkgrey'}
						fillOpacity='0.7'
						radius={mapRange(extent, range, d.CURRENT_SI)}
						stroke={false}
						weight='1'>
							<Tooltip>
								<WildfireTooltip data={d}></WildfireTooltip>
							</Tooltip>
					</CircleMarker>
				})}
			</Map>
		);
	}
}

const getExtent = function(data) {
	let fire_size = [];

	data.forEach(d => {
		fire_size.push(parseFloat(d.CURRENT_SI));
	});

	return [Math.min(...fire_size), Math.max(...fire_size)];
}

const mapRange = function(from, to, s) {
  return to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
};


export default CircleMap;