import React, { Component } from 'react';
import Aux from '../Aux/Aux';
import Tabletop from 'tabletop';
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
		Tabletop.init({
			key: this.props.sheet,
			callback: (data, tabletop) => {
				// get a list of fires of note then go grab the data from the corresponding google sheet
				const fon_list = data.filter(d => d.FIRE_STATU === 'Fire of Note');
				this.fetchFireData(fon_list);

				// update our state with the new data
				this.setState({
					data: data,
					data_all: data
				});
			},
			simpleSheet: true
		});
	}

	fetchFireData(data) {
		const all_fires = data;

		let fire_ids = data.map(d => {
			return d.FIRE_NT_ID;
		});

		Tabletop.init({
			key: this.props.fonSheet,
			callback: (data, tabletop) => {
				let fires_of_note = [];

				// loop through the object returned & push the google sheets data into an array
				for (let fire in data) {
					const fon = data[fire].elements[0];
					// google sheet returns an object of objects with the key being the fire ID
					fon.fire_id = fire;

					// merge fon details with basic fire data
					const fire_merged = this.mergeFireDetails(fon, all_fires);

					fires_of_note.push(fire_merged)
				}

				// update our state with the new data
				this.setState({
					data_fon: fires_of_note
				});
			},
			simpleSheet: false,
			wanted: fire_ids
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
			<Aux>
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
			</Aux>
		);
	}
}

export default WildfireTracker;