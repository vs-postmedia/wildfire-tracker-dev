import React, { Component, Fragment } from 'react';
import Axios from 'axios'
import WildfireMap from '../WildfireMap/WildfireMap';
import FiresOfNote from '../FiresOfNote/FiresOfNote';

export class WildfireTracker extends Component {

	state = {
		data: [],
		data_all: [],
		data_fon: []
	}

	componentDidMount() {
		Axios.get(this.props.currentData)
			.then(resp => {
				// update our state with the new data
				this.setState({
					data: resp.data,
					data_all: resp.data
				});

				this.setupFiresOfNote(resp.data);
			});

		this.toggleFireTypeHandler = this.toggleFireTypeHandler.bind(this);
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
				const perimeters = results.filter(d => d.config.url.includes('perimeters.json'));
				const perim_data = perimeters[0].data;

				// loop through the object returned & push the FON data into an array
				fon_data[0].data.forEach((d,i) => {
					// merge fon details with basic fire data
					const fire_merged = this.mergeFireDetails(d, all_fires.features);

					// find the matching perimeter data
					const perimeter = perim_data.filter(d => {
						return d.properties.FIRE_NUMBE === fire_merged.FIRE_NUMBE;
					});
										
					if (perimeter.length > 0) {
						// add perimeter data
						perimeter[0].properties = fire_merged;
						// fire_merged.perimeter = perimeter[0].properties;
					} else {
						perimeter.push({
							properties: fire_merged,
							type: 'non-feature'
						});
					}
					fires_of_note.push(perimeter[0]);
				})

				// update our state with the new data 
				this.setState({
					data_fon: fires_of_note
				});
				
			});
	}

	filterFireData(fire_class) {
		// currently, 'new' & 'out-of-control' fires are listed as new. Not sure if this is ideal. 
		if (fire_class === 'new') {
			let data_array = [];
			this.state.data_all.features.forEach(d => {
				const fire_status = d.properties.FIRE_STATU.replace(/\s/g, '-').toLowerCase();

				if (fire_status === fire_class | fire_status === 'out-of-control') {
					data_array.push(d);
				}
			});

			return data_array;
		} else {
			return this.state.data_all.features.filter(d => d.properties.FIRE_STATU.replace(/\s/g, '-').toLowerCase() === fire_class);
		}
	}

	mergeFireDetails(fon, all_fires) {
		let fire_data;

		all_fires.forEach(d => {
			if (d.properties.FIRE_NT_ID === fon.fire_id) {
				fire_data = {...fon, ...d.properties};
			}
		});

		return fire_data;
	}

	toggleFireTypeHandler(e) {
		let fire_data = {
			type: 'FeatureCollection'
		};
		let fire_class = e.target.className.split(' ')[1];

		if (fire_class === this.state.data_displayed) {
			fire_data = this.state.data_all;
			fire_class = null;
		} else {
			fire_data.features = this.filterFireData(fire_class);
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
					config={this.props.mapboxConfig}
					data={this.state.data}
					data_all={this.state.data_all}
					mapboxStyle={this.props.mapboxStyle}
					tiles={this.props.tiles}
					toggleFireTypeHandler={this.toggleFireTypeHandler}>
				</WildfireMap>

				<FiresOfNote
					config={this.props.mapboxConfig}
					data={this.state.data_fon}
					mapboxStyle={this.props.mapboxStyle}
				></FiresOfNote>
			</Fragment>
		);
	}
}

export default WildfireTracker;