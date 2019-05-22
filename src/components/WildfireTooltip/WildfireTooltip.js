import React from 'react';
import './WildfireTooltip.css';

const WildfireTooltip = (props) => {
	return(
		<div className="wf-tooltip">
			<h3>{props.data.GEOGRAPHIC}</h3>
			<p className={`status ${props.data.FIRE_STATU.toLowerCase().replace(/\s/g, '-')}`}>Status: {props.data.FIRE_STATU}</p>
			<p>{`A fire that is currently ${checkSize(props)} square kilometres started on ${props.data.ignition_date}.`}</p>
			
			<p>Cause: {formatFireCause(props.data.FIRE_CAUSE)}</p>
		</div>
	)
};

function checkSize(props) {
	let size = (props.data.CURRENT_SI / 100).toFixed(2);
	return size < 0.01 ? 'less than 0.01' : size;
}

function formatFireCause(text) {
	return text == '' ? 'Not available' : text;
}

export default WildfireTooltip;