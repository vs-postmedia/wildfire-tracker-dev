import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import WildfireMap from '../WildfireMap/WildfireMap';


// google sheet that stores fire data
const googleSheetURL = 'https://docs.google.com/spreadsheets/d/1mg71j-P91H_PpA9OufEPIRrDgpK80nWpN1CKH9LlIBk/edit?usp=sharing';
// map tiles & attribution
const map_url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
// const map_url = 'https://api.maptiler.com/maps/topo/{z}/{x}/{y}.png?key=arETEBBqRxRrA5v30F6H'; // topo
// const map_url = 'https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=arETEBBqRxRrA5v30F6H'; // satellite hybrid
const attribution = '&copy;<a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors';



function App() {
	return (
		<BrowserRouter>
		  	<div className="App">
		  		<h1>B.C. Wildfire Tracker</h1>
		  		<Route path='/' exact 
		  			render={(props) => (
		  				<WildfireMap {...props}
							sheet={googleSheetURL}
							tiles={map_url}
							attribution={attribution}>
						</WildfireMap>
		  			)} 
		  		/>
		  		
				{/**/}
		  	</div>
	  	</BrowserRouter>
	);
}

export default App;
