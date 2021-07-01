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
				// filter "out" fires so they don't overwhelm map
				const noOut = {
					type: 'FeatureCollection',
					features: resp.data.features.filter(d => d.properties.FIRE_STATU !== 'Out')
				};

				// update our state with the new data
				this.setState({
					data: noOut,
					data_all: resp.data,
				});

				this.setupFiresOfNote(resp.data);
			});

		this.toggleFireTypeHandler = this.toggleFireTypeHandler.bind(this);
	}

	setupFiresOfNote(data) {
		const promises = [];

		promises.push(Axios.get(this.props.fonData));
		promises.push(Axios.get(this.props.firePerimeters));

		Axios.all(promises)
			.then(results => {
				// separate our results
				const fon_data = results.filter(d => d.config.url.includes('fon.json'))[0].data;
				const perim_data = results.filter(d => d.config.url.includes('perimeters.json'))[0].data;

				// get fons from the main data set & merge the details
				const fires_of_note = data.features.filter(d => {
					if (d.properties.FIRE_STATU === 'Fire of Note') {
						// get details of the fire of note
						const fon = fon_data.filter(fon => fon.fire_id === d.properties.FIRE_NT_ID)[0];

						// merge data
						d.properties = {...fon, ...d.properties};

						return d;
					}
				});

				console.log(fires_of_note)

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
		// } else if (fire_class === 'out') {
		// 	console.log('OUT')
		} else {
			return this.state.data_all.features.filter(d => d.properties.FIRE_STATU.replace(/\s/g, '-').toLowerCase() === fire_class);
		}
	}

	toggleFireTypeHandler(e) {
		let fire_data = {
			type: 'FeatureCollection'
		};
		let fire_class = e.target.className.split(' ')[1];


		if (fire_class === this.state.data_displayed) {
			// keep 
			fire_data.features = this.state.data_all.features.filter(d => d.properties.FIRE_STATU !== 'Out');
			// reset
			fire_class = null;
		} else if (fire_class === 'out') {
			console.log('OUT')
			fire_data = this.state.data_all;
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