import React, { Component } from 'react';
import Tabletop from 'tabletop';
import CardList from '../CardList/CardList';

import fire_centers from '../../data/fire-centers.json';


export class FireCards extends Component {
	constructor(props) {
		super(props);

		this.listClickHandler = this.listClickHandler.bind(this);
	}

	state = {
		centre_id: null,
		data: [],
		fire_id: null,
		fire_centre: '',
		main_fire_data: null
	}


	componentDidMount() {
		// load data from Google sheet
		Tabletop.init({
			key: this.props.sheet,
			callback: (data, tabletop) => {
				const fire_data = this.parseSearchParams(data);

				this.setState(fire_data);
				this.fetchFireData(fire_data);
			},
			simpleSheet: true
		});
	}



	fetchFireData(data) {
		const fire_ids = data.fon.map(d => {
			return d.FIRE_NT_ID;
		})

		Tabletop.init({
			key: this.props.fonSheet,
			callback: (data, tabletop) => {
				let fon = [];
				let current_state_data = this.state.data;

				// loop through the object returned & push the google sheets data into an array
				for (let fire in data) {
					data[fire].elements[0].fire_id = fire;
					fon.push(data[fire].elements[0]);
				}
	
				// update our state with the new data
				this.setState({
					data: [...fon, ...current_state_data],
					main_fire_data: this.getMainFire(fon, this.state.fire_id)
				});
			},
			simpleSheet: false,
			wanted: fire_ids
		});
	}

	filterFires(data, id) {
		return data.filter(d => (parseInt(d.FIRE_CENTR) === id && d.FIRE_NT_ID));
	}

	getFireCentreID(fire_centre) {
		const id = fire_centers.filter(d => {
			console.log(d, fire_centre)
			return d.name.toLowerCase() === fire_centre ? d.id : null;
		});

		if (id.length > 0) {
			return id[0].id;
		} else {
			return null;
		}
	}

	getMainFire(fon, fire_id) {
		return fon.filter(d => d.fire_id === fire_id);
	}

	listClickHandler(fire) {
		const main_fire = this.state.main_fire_data;
		// reset the main fire
		main_fire.length = 0;
		main_fire.push(fire)

		this.setState({
			main_fire_data: main_fire
		});
	}

	parseSearchParams(data) {
		let state_data = {};
		
		// grab out url params
		const query = new URLSearchParams(this.props.location.search);
		
		// & store 'em
		for (let param of query.entries()) {
			state_data[param[0]] = param[1];
		}

		// get the fire id 
		state_data.centre_id = this.getFireCentreID(state_data.fire_centre);

		// filter for the relevant fire center data
		state_data.fon = this.filterFires(data, state_data.centre_id);

		// if URL contains fire centre that doesn't exist
		if (!state_data.centre_id) { state_data.fire_centre = 'Unknown'; }

		console.log(state_data)

		return state_data
	}

	titleCase(str) {
		str = str.toLowerCase().split(' ');
		for (var i = 0; i < str.length; i++) {
			str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
		}
		return str.join(' ');
	}

	render() {
		return (
			<div>
				<h1>{`${this.titleCase(this.state.fire_centre)} Fire Centre`}</h1>
				<CardList 
					data={this.state.data}
					fire_id={this.state.fire_id}
					main_fire={this.state.main_fire_data}
					onClick={this.listClickHandler}
					listClickHandler={this.listClickHandler}>
				</CardList>
			</div>
		);
	}
}


export default FireCards