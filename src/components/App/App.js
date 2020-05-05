import React from 'react';
// import { BrowserRouter, Route } from 'react-router-dom';
import WildfireTracker from '../WildfireTracker/WildfireTracker';
import './App.css';

// Wildfires url
const currentFiresURL = 'https://storage.googleapis.com/wildfire_data/wildfires.json';
// Fires of note
const firesOfNoteURL = 'https://storage.googleapis.com/wildfire_data/fon.json';

// map tiles & attribution
const map_url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy;<a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors';



function App() {
	return (
		<WildfireTracker
		  	fonData={firesOfNoteURL}
			currentData={currentFiresURL}
			tiles={map_url}
			attribution={attribution}>
		</WildfireTracker>
	);
}

export default App;
