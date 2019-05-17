import React, { Component } from 'react';
import { CircleMarker, Map, Popup, TileLayer, Tooltip} from 'react-leaflet';
import WildfireTooltip from '../WildfireTooltip/WildfireTooltip';

import './CircleMap.css';

const map_url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = 'attribution="&copy;<a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"';

export class CircleMap extends Component {
	
	render() {
		console.log(this.props.data[0]);

		return (
			<Map 
				center={this.props.center} 
				
				zoom={this.props.zoom}>
				<TileLayer url={map_url} attribution={attribution} maxZoom={this.props.maxZoom}
				minZoom={this.props.minZoom}/>
				
				{this.props.data.map(d => {
					console.log()
					return <CircleMarker key={d.FIRE_ID} center={[d.LATITUDE, d.LONGITUDE]} fillColor='red' radius={d.CURRENT_SI / 100}>
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