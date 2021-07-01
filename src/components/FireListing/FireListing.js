import React from 'react';
import './FireListing.css';


let buttonStatus = 'open';
const FireListing = (props) => {
	// console.log(props.data)
	let list;
	const fon = props.data.length > 0 ? props.data.filter(d => d.properties.FIRE_STATU === 'Fire of Note') : [];

	// NO FON? HIDE SIDEBAR
	if (fon.length > 0) {
		// YES FON
		list = fon.sort((a,b) => a.CURRENT_SI - b.CURRENT_SI)
			.map(d => {
				return ListItem(d.properties, props.flyToLocation);
			});	
	} else {
		// hide sidebar
		list = <li className="no-fires">Currently there are no fires of note in B.C.</li>
	}


	return (
		<div className="sidebar">
			<div className="header">
				<h2>Fires of Note</h2>
				<div className="button">
					<input type="checkbox" id="switch" onChange={toggleSidebar} checked/><label for="switch"></label>
				</div>
			</div>
			<ul id="listings" className={`listings ${buttonStatus}`}>
				{list}
			</ul>
		</div>
	);
}

function ListItem(data, clickHandler) {
	return (
		<li key={data.fire_id} id={data.fire_id} className="item" onClick={clickHandler}>
			<h4 className="title">{data.fire_name.split(' (')[0]}</h4>
			<p className="size">{data.CURRENT_SI / 100} sq. km</p>
			<p className="location">{data.location}</p>
		</li>
	);
}

function toggleSidebar(e) {
	console.log(e)
	const sidebar = document.getElementById('listings');

	if (buttonStatus === 'open') {
		e.target.className = 'closed';
		sidebar.className = 'listings closed';
		buttonStatus = 'closed';
	} else {
		e.target.className = 'open';
		sidebar.className = 'listings open';
		buttonStatus = 'open';
	}
}

export default FireListing;
