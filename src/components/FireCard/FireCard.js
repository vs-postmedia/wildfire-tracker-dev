import React from 'react';
import CircleMap from '../CircleMap/CircleMap';

import './FireCard.css';

const FireCard = (props) => {
	const fire = props.data;
	
	// split resources into key/value pairs
	// const resource_list = fire.resources.split(',');
	// const resources = mapToObject(resource_list);

	const map_options = {
		center: [fire.LATITUDE.toString(), fire.LONGITUDE.toString()],
		classField: 'fon',
		maxZoom: 8,
		minZoom: 4,
		radius: 10,
		zoom: 5
	};

	return (
		<div className='main-card'>
			<div className='text'>
				<header>
					<h3>{fire.fire_name.split(' (')[0]}</h3>
					<p>{fire.location}</p>
				</header>
				<div className='status-box'>
					<div className='status-item'>
						<h2 className={`${fire.status.replace(/\s/g, '-').toLowerCase()} big-num`}>{fire.status}</h2>
						<p className='label'>Status</p>
					</div>
					{ fire.containment.length > 0 &&
						<div className='contain'>
							<h2 className='big-num'>fire.containment</h2>
							<p className='label'>Contained</p>
						</div>
					}
				</div>

				<p className='started-date'>{`Started ${fire.discovered.split('day, ')[1]}`}</p>
				
				<div className='stat-box'>
					<span className='size icon'></span>
					<p>{`Size: ${fire.size}`}</p>
				</div>
			</div>
			
			<CircleMap id="fon-mapview"
				attribution={props.attribution}
				center={map_options.center}
				circleMarkerClassField={map_options.classField}
				data={[fire]}
				maxZoom={map_options.maxZoom}
				minZoom={map_options.minZoom}
				radius={map_options.radius}
				range={[5,5]}
				tiles={props.tiles}
				zoom={map_options.zoom}>
			</CircleMap>
			<p>{fire.status_details.split(' ,,')[0].split(',For')[0]}</p>
		</div>
	);
}

// function mapToObject(arr) {
// 	const obj = arr.map(d => {
// 		return {
// 			value: parseInt(d.substr(0, d.indexOf(' '))),
// 			label: d.substr(d.indexOf(' ') + 1)
// 		};
// 	});

// 	return obj;
// }

export default FireCard;



