import React, { Component, Fragment } from 'react';
import Axios from 'axios'
import WildfireMap from '../WildfireMap/WildfireMap';
import FiresOfNote from '../FiresOfNote/FiresOfNote';

export class WildfireTracker extends Component {
	constructor(props) {
		super(props);

		Axios.get(this.props.currentData)
			.then(resp => {
				// we don't always have fires of note
				const fon_list = resp.data;
				// if (fon_list.length > 0) this.setupFiresOfNote(fon_list);

				// update our state with the new data
				this.setState({
					data: resp.data,
					data_all: resp.data
				});
			});

		this.toggleFireTypeHandler = this.toggleFireTypeHandler.bind(this);
	}

	state = {
		data: [],
		data_all: [],
		data_fon: []
	}

	componentDidMount() {
		
	}

	setupFiresOfNote(data) {
		const promises = [];
		const all_fires = data;

		promises.push(Axios.get(this.props.fonData));
		promises.push(Axios.get(this.props.firePerimeters));

		Axios.all(promises)
			.then(results => {
				let fires_of_note = [];

				// separate our results
				const fon_data = results.filter(d => d.config.url.includes('fon.json'));
				let perim_data = results.filter(d => d.config.url.includes('perimeters.json'));
				perim_data = perim_data[0].data;

				// loop through the object returned & push the FON data into an array
				for (let fon in fon_data) {
					const data = fon_data[fon].data;
					
					// merge fon details with basic fire data
					const fire_merged = this.mergeFireDetails(data[fon], all_fires);

					console.log(fire_merged)
					// find the matching perimeter data
					const perimeter = perim_data.filter(d => d.properties.FIRE_NUMBE === fire_merged.FIRE_NUMBE);
					// add permieter data
					perimeter[0].properties = fire_merged;
					// fire_merged.geometry = perimeter[0].geometry;

					fires_of_note.push(perimeter[0]);
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
					config={this.props.mapboxConfig}
					data={this.state.data}
					data_all={this.state.data_all}
					mapboxStyle={this.props.mapboxStyle}
					tiles={this.props.tiles}
					toggleFireTypeHandler={this.toggleFireTypeHandler}>
				</WildfireMap>

				<FiresOfNote
					attribution={this.props.attribution}
					config={this.props.mapboxConfig}
					data={this.state.data_fon}
					mapboxStyle={this.props.mapboxStyle}
				></FiresOfNote>
			</Fragment>
		);
	}
}

export default WildfireTracker;