import React, { Component } from 'react';
import './SummaryBox.css';


export class SummaryBox extends Component {
	componentDidUpdate() {
		
	}

	calculateFireStats(data) {
		let stats = {
			out_fires: 0,
			new_fires: 0,
			held_fires: 0,
			controlled_fires: 0
		}

		let hectares_burned = data.reduce((sum, item) => {
			return sum + parseFloat(item.CURRENT_SI);
		}, 0);

		stats.km_burned = (hectares_burned / 100).toFixed(0);
		stats.total_fires = data.length + 1;

		stats.last_update = this.props.data.length > 0 ? this.returnCurrentTime(this.props.data[0].last_update) : 'Not available';

		for (let i = 0; i < data.length; ++i) {
			if (data[i].FIRE_STATU === 'New' | data[i].FIRE_STATU == 'Out of Control') {
				stats.new_fires++;
			} else if (data[i].FIRE_STATU === 'Being Held') {
				stats.held_fires++;
			} else if (data[i].FIRE_STATU === 'Under Control') {
				stats.controlled_fires++;
			} else {
				stats.out_fires++;
			}
		}

		return stats;
	}

	returnCurrentTime(ts) {
		const timestamp = new Date(ts);
		const month = this.returnUTCMonth(timestamp.getUTCMonth());

		return `${month} ${timestamp.getUTCDate()}, ${timestamp.getUTCFullYear()} at ${timestamp.toLocaleTimeString()}`
	}

	returnUTCMonth(month_num) {
		const month_lookup = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

		return month_lookup[parseInt(month_num)];
	}

	render() {
		const fire_stats = this.calculateFireStats(this.props.data);
		// console.log(fire_stats, this.props.data)

		return (
			<div className="summary-box" onClick={this.props.onClick}>
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
}

export default SummaryBox;

		// <div className="stat">
		// 				<p className="big-num">{fire_stats.km_burned}</p>
		// 				<p className="label">Square km<br/>burned</p>
		// 			</div>