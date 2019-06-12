import React from 'react';
import './MainCard.css';

const MainCard = (props) => {
	const fire = props.data[0];
	const resource_list = fire.resources.split(',');
	const status_list = fire.status_details.substr(0, fire.status_details.indexOf(' ,'));
	
	// split status & resources into key/value pairs
	const resources = mapToObject(resource_list);
	const status = mapToObject([status_list]);

	console.log(status, resources)
	return (
		<div className='main-card'>
			<div className='text'>
				<header>
					<h2>{fire.fire_name.split(' (')[0]}</h2>
					<p>{fire.location}</p>
				</header>

				<div className='status-box'>
					{status.map(d => {
						return (
							<div key={d.value}>
								<p className='num'>{`${d.value}%`}</p>
								<p className='label'>{d.label}</p>
							</div>
						)
					})}
				</div>


				<p className='started-date'>{`Started ${fire.discovered.split('day, ')[1]}`}</p>
				
				
				<div className='stat-box'>
					<span className='size icon'></span>
					<p>{fire.size}</p>
				</div>
				<div className='stat-box'>
					<span className='resources icon'></span>
					<p>{fire.resources}</p>
				</div>
			</div>
			<div className='map'></div>
			<p>{fire.status_details.split(' ,,')[0]}</p>
		</div>
	);
}

function mapToObject(arr) {
	const obj = arr.map(d => {
		return {
			value: parseInt(d.substr(0, d.indexOf(' '))),
			label: d.substr(d.indexOf(' ') + 1)
		};
	});

	return obj;
}

export default MainCard;