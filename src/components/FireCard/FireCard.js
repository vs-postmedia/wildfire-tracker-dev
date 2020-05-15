import React from 'react';
import InsetMap from '../InsetMap/InsetMap';
// import CircleMap from '../CircleMap/CircleMap';

import './FireCard.css';

const FireCard = (props) => {
	const fire = props.data;

	const map_options = {
		center: [fire.LATITUDE.toString(), fire.LONGITUDE.toString()],
		classField: 'fire-of-note',
		maxZoom: 8,
		minZoom: 4,
		radius: 10,
		zoom: 5
	};

	console.log()

	return (
		<div className='fire-card'>
			<div className='row'>
			<div className='text'>
				<header>
					<h3>{fire.fire_name.split(' (')[0]}</h3>
					<p>{fire.location}</p>
				</header>
				<div className='status-box'>
					<div className='status-item'>
						<h2 className={`${fire.FIRE_STATU.replace(/\s/g, '-').toLowerCase()} big-num`}>{fire.FIRE_STATU}</h2>
						<p className='label'>Status</p>
					</div>
					{ fire.containment.length > 0 &&
						<div className='containment-item'>
							<h2 className='big-num'>fire.containment</h2>
							<p className='label'>Contained</p>
						</div>
					}
				</div>

				<div className='stat-box'>
					<div className='stat'>
						<span className='started icon'></span>
						<p><strong>Started:</strong></p> 
						<p className='started-date'>{`${fire.discovered.split('day, ')[1]}`}</p>
					</div>
					<div className='stat'>
						<span className='size icon'></span>
						<p><strong>Size:</strong></p> 
						<p>{`${haToKm(fire.CURRENT_SI)} km square`}</p>
					</div>
					<div className='stat'>
						<span className='cause icon'></span>
						<p><strong>Cause:</strong></p> 
						<p>{`${fire.cause}`}</p>
					</div>
				</div>
			</div>
			<div id="fon-mapview"></div>
			
			<InsetMap
				center={map_options.center}
				data={fire}
				maxZoom={map_options.maxZoom}
				minZoom={map_options.minZoom}
				range={[5,5]}
				tiles={props.tiles}
				zoom={map_options.zoom}>
			</InsetMap>
			
			</div>
			
		</div>
	);
}
// <p className="row">{fire.status_details.split(' ,,')[0].split(',For')[0]}</p>
function haToKm(number) {
	let size = (number / 100).toFixed(2);
	return size;
}

export default FireCard;



/*
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
*/