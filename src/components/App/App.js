import React from 'react';
import WildfireTracker from '../WildfireTracker/WildfireTracker';
import './App.css';
import mapboxConfig from '../../data/mapbox-config';


// Wildfires url
const currentFiresURL = 'https://storage.googleapis.com/wildfire_data/wildfires.json';
// Fires of note
const firesOfNoteURL = 'https://storage.googleapis.com/wildfire_data/fon.json';
// Fire perimeters
const firePerimeters = 'https://storage.googleapis.com/wildfire_data/perimeters.json';

// map tiles & attribution
const mapboxStyle = 'mapbox://styles/mapbox/outdoors-v11';
const map_url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy;<a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors';





function App() {
	return (
		<WildfireTracker
		  	fonData={firesOfNoteURL}
			currentData={currentFiresURL}
			firePerimeters={firePerimeters}
			mapboxConfig={mapboxConfig}
			mapboxStyle={mapboxStyle}
			tiles={map_url}
			attribution={attribution}>
		</WildfireTracker>
	);
}

export default App;
