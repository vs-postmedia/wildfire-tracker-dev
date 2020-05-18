import React from 'react';
import './SummaryBox.css';

const SummaryBox = (props) => {
	const fire_stats = calculateFireStats(props);

	return (
		<div className="summary-box" onClick={props.toggleFireTypeHandler}>
			<h2>Latest wildfire stats</h2>
	
			<div className="stat-box">
				<div className="stat">
					<p className="big-num new">{fire_stats.new_fires}</p>
					<p className="label">New</p>
				</div>

				<div className="stat">
					<p className="big-num being-held">{fire_stats.held_fires}</p>
					<p className="label">Held</p>
				</div>

				<div className="stat">
					<p className="big-num under-control">{fire_stats.controlled_fires}</p>
					<p className="label">Controlled</p>
				</div>

				<div className="stat">
					<p className="big-num out">{fire_stats.out_fires}</p>
					<p className="label">Out</p>
				</div>
			</div>
			<p className="last-update">Last updated: {fire_stats.last_update}</p>
		</div>
	);
}

function calculateFireStats(props) {
	let stats = {
		out_fires: 0,
		new_fires: 0,
		held_fires: 0,
		controlled_fires: 0,
		last_update: 'Waiting for data...'
	}
	
	if (props.data.features) {
		const data = props.data.features;

		let hectares_burned = data.reduce((sum, item) => {
			return sum + parseFloat(item.properties.CURRENT_SI);
		}, 0);

		stats.km_burned = (hectares_burned / 100).toFixed(0);
		stats.total_fires = data.length + 1;

		stats.last_update = data.length > 0 ? returnCurrentTime(data[0].properties.last_update) : 'Not available';

		for (let i = 0; i < data.length; ++i) {
			if (data[i].properties.FIRE_STATU === 'New' | data[i].properties.FIRE_STATU === 'Out of Control') {
				stats.new_fires++;
			} else if (data[i].properties.FIRE_STATU === 'Being Held') {
				stats.held_fires++;
			} else if (data[i].properties.FIRE_STATU === 'Under Control') {
				stats.controlled_fires++;
			} else {
				stats.out_fires++;
			}
		}
	}

	return stats;
}

function returnCurrentTime(ts) {
	const timestamp = new Date(parseInt(ts));
	const month = returnMonth(timestamp.getUTCMonth());

	return `${month} ${timestamp.toLocaleDateString().split('/')[1]}, ${timestamp.getUTCFullYear()} at ${timestamp.toLocaleTimeString()}`
}

function returnMonth(month_num) {
	const month_lookup = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	return month_lookup[parseInt(month_num)];
}


export default SummaryBox;
