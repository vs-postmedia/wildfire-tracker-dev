import React from 'react';
// import { BrowserRouter, Route } from 'react-router-dom';
import WildfireTracker from '../WildfireTracker/WildfireTracker';

import './App.css';


// google sheet that stores fire data
const currentFiresURL = `https://docs.google.com/spreadsheets/d/1mg71j-P91H_PpA9OufEPIRrDgpK80nWpN1CKH9LlIBk/edit?usp=sharing&${Date.now()}`;
// google sheet that stores fires of note
const firesOfNoteURL = 'https://docs.google.com/spreadsheets/d/1QLomki7aY5ZF4zhETtC40GRnSO7BcnwpqJMQxbUSLPQ/edit?usp=sharing';

// map tiles & attribution
const map_url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy;<a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors';



function App() {
	return (
		<WildfireTracker
	  	fonSheet={firesOfNoteURL}
		sheet={currentFiresURL}
		tiles={map_url}
		attribution={attribution}>
	</WildfireTracker>

	);
}

export default App;
