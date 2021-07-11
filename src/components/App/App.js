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
// evacuation order & alert perimeters
const evacsAlertsUrl = 'https://vs-postmedia-data.sfo2.digitaloceanspaces.com/wildfires/EMRG_OAAA_polygon.json';
// firesmoke png file
const fireSmokeUrl = 'https://vs-postmedia-data.sfo2.digitaloceanspaces.com/wildfires/fire-smoke-max.png';

// map tiles & attribution
const mapboxStyle = 'https://api.maptiler.com/maps/outdoor/style.json?key=pRmETZ6APJE6l5kAzesF';


function App() {
	return (
		<WildfireTracker
			currentData={currentFiresURL}
			evacsAlerts={evacsAlertsUrl}
			fireSmokeUrl={fireSmokeUrl}
		  	fonData={firesOfNoteURL}
			firePerimeters={firePerimeters}
			mapboxConfig={mapboxConfig}
			mapboxStyle={mapboxStyle}>
		</WildfireTracker>
	);
}

export default App;
