import React from 'react';
import './FireListing.css';



const FireListing = (props) => {
	// console.log(props.data)
	let list;
	const fon = props.data.length > 0 ? props.data.filter(d => d.properties.FIRE_STATU === 'Fire of Note') : [];

	// NO FON? HIDE SIDEBAR
	if (fon.length > 0) {
		// YES FON
		list = fon.map(d => {
			return ListItem(d.properties, props.flyToLocation);
		});	
	} else {
		// hide sidebar
	}


	return (
		<div className="sidebar">
			<div className="header">
				<h2>Fires of Note</h2>
			</div>
			<ul id="listings" className="listings">
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

export default FireListing;
