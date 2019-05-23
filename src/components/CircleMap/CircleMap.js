import React, { Component } from 'react';
import { CircleMarker, Map, TileLayer, Tooltip} from 'react-leaflet';
import WildfireTooltip from '../WildfireTooltip/WildfireTooltip';

import './CircleMap.css';


export class CircleMap extends Component {
	getExtent(data) {
		let fire_size = [];

		data.forEach(d => {
			fire_size.push(parseFloat(d.CURRENT_SI));
		});

		return [Math.min(...fire_size), Math.max(...fire_size)];
	}

	mapRange(from, to, s) {
		return to[0] + (s - from[0]) * (to[1] - to[0]) / (from[1] - from[0]);
	}

	render() {
		const range = this.props.range ? this.props.range : [3,50];
		const extent = this.getExtent(this.props.data);

		// reorder array by CURRENT_SI, largest -> smallest
		this.props.data.sort((a,b) => {
			return b.CURRENT_SI - a.CURRENT_SI;
		});

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
						fillOpacity='0.7'
						radius={this.mapRange(extent, range, d.CURRENT_SI)}
						stroke={true}
						weight='0.5'>
							<Tooltip>
								<WildfireTooltip data={d}></WildfireTooltip>
							</Tooltip>
					</CircleMarker>
				})}
			</Map>
		);
	}
}


export default CircleMap;