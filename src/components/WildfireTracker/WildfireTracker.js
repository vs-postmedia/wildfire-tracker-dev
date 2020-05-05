import React, { Component, Fragment } from 'react';
import Axios from 'axios'
import WildfireMap from '../WildfireMap/WildfireMap';
import FiresOfNote from '../FiresOfNote/FiresOfNote';

export class WildfireTracker extends Component {
	constructor(props) {
		super(props);

		this.toggleFireTypeHandler = this.toggleFireTypeHandler.bind(this);
	}

	state = {
		data: [],
		data_all: [],
		data_fon: []
	}

	componentDidMount() {
		Axios.get(this.props.currentData)
			.then(resp => {
				// get a list of fires of note then go grab the data from the corresponding google sheet
				// const fon_list = resp.data.filter(d => d.FIRE_STATU === 'Fire of Note');
				// we don't always have fires of note

				const fon_list = resp.data;
				if (fon_list.length > 0) this.setupFiresOfNote(fon_list);
				

				// update our state with the new data
				this.setState({
					data: resp.data,
					data_all: resp.data
				});
			});
	}

	setupFiresOfNote(data) {
		const all_fires = data;

		Axios.get(this.props.fonData)
			.then(resp => {
				const data = resp.data;
				let fires_of_note = [];

				// loop through the object returned & push the FON data into an array
				for (let fire in data) {
					// merge fon details with basic fire data
					const fire_merged = this.mergeFireDetails(data[fire], all_fires);

					fires_of_note.push(fire_merged)
				}

				// update our state with the new data – not sure why but undefined pops up in the array sometimes then everything breaks.
				this.setState({
					data_fon: fires_of_note.filter(fon => fon !== undefined)
				});
			});
	}

	filterFireData(fire_class) {
		// currently, 'new' & 'out-of-control' fires are listed as new. Not sure if this is ideal. 
		if (fire_class === 'new') {
			let data_array = [];
			this.state.data_all.forEach(d => {
				const fire_status = d.FIRE_STATU.replace(/\s/g, '-').toLowerCase();

				if (fire_status === fire_class | fire_status === 'out-of-control') {
					data_array.push(d);
				}
			});

			return data_array;
		} else {
			return this.state.data_all.filter(d => d.FIRE_STATU.replace(/\s/g, '-').toLowerCase() === fire_class);
		}
	}

	mergeFireDetails(fon, fires) {
		let fire_data;

		fires.forEach(d => {
			if (d.FIRE_NT_ID === fon.fire_id) {
				fire_data = {...fon, ...d};
			}
		});

		return fire_data;
	}

	toggleFireTypeHandler(e) {
		let fire_data;
		let fire_class = e.target.className.split(' ')[1];

		if (fire_class === this.state.data_displayed) {
			fire_data = this.state.data_all;
			fire_class = null;
		} else {
			fire_data = this.filterFireData(fire_class);
		}

		this.setState({
			data_displayed: fire_class,
			data: fire_data
		});
	}


	render() {
		return (
			<Fragment>
				<WildfireMap 
					attribution={this.props.attribution}
					data={this.state.data}
					data_all={this.state.data_all}
					tiles={this.props.tiles}
					toggleFireTypeHandler={this.toggleFireTypeHandler}>
				</WildfireMap>

				<FiresOfNote
					attribution={this.props.attribution}
					data={this.state.data_fon}
					tiles={this.props.tiles}
				></FiresOfNote>
			</Fragment>
		);
	}
}

export default WildfireTracker;