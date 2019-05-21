import React from 'react';
import './App.css';
import WildfireTracker from '../WildfireTracker/WildfireTracker';


// google sheet that stores fire data
const googleSheetURL = 'https://docs.google.com/spreadsheets/d/1mg71j-P91H_PpA9OufEPIRrDgpK80nWpN1CKH9LlIBk/edit?usp=sharing';
// map tiles & attribution
const map_url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = 'attribution="&copy;<a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"';



function App() {
	return (
	  	<div className="App">
	  		<h1>B.C. Wildfire Tracker</h1>
			<WildfireTracker 
				sheet={googleSheetURL}
				tiles={map_url}
				attribution={attribution}>
			</WildfireTracker>
	  	</div>
	);
}

export default App;
