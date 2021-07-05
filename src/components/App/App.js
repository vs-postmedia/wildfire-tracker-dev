import React from 'react';
import WildfireTracker from '../WildfireTracker/WildfireTracker';
import './App.css';
import mapboxConfig from '../../data/mapbox-config';


// Wildfires url
const currentFiresURL = 'https://vs-postmedia-data.sfo2.digitaloceanspaces.com/wildfires.json';
// Fires of note
const firesOfNoteURL = 'https://vs-postmedia-data.sfo2.digitaloceanspaces.com/fon.json';
// Fire perimeters
const firePerimeters = 'https://vs-postmedia-data.sfo2.digitaloceanspaces.com/perimeters.json';
const evacsAlertsUrl = 'https://vs-postmedia-data.sfo2.digitaloceanspaces.com/wildfires/EMRG_OAAA_polygon.json';

// map tiles & attribution
const mapboxStyle = 'https://api.maptiler.com/maps/outdoor/style.json?key=d66XIdicygsmvu4cwios';


function App() {
	return (
		<WildfireTracker
			evacsAlerts={evacsAlertsUrl}
		  	fonData={firesOfNoteURL}
			currentData={currentFiresURL}
			firePerimeters={firePerimeters}
			mapboxConfig={mapboxConfig}
			mapboxStyle={mapboxStyle}>
		</WildfireTracker>
	);
}

export default App;
