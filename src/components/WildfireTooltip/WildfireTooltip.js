import React from 'react';
import './WildfireTooltip.css';

const WildfireTooltip = (props) => {
	return(
		<div className="wf-tooltip">
			<h3>{props.data.GEOGRAPHIC}</h3>
			<p className={`status ${props.data.FIRE_STATU.toLowerCase().replace(/\s/g, '-')}`}>Status: {props.data.FIRE_STATU}</p>
			<p>{`A ${checkSize(props)} square kilometre fire started on ${props.data.ignition_date}.`}</p>

			<p>Suspected cause: {formatFireCause(props.data.FIRE_CAUSE)}</p>
		</div>
	)
};

function checkSize(props) {
	let size = (props.data.CURRENT_SI / 100).toFixed(2);
	return size < 0.01 ? 'less than 0.01' : size;
}

function formatFireCause(text) {
	return text === '' ? 'unknown' : text.toLowerCase();
}

export default WildfireTooltip;