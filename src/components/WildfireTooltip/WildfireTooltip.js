// import React from 'react';
import './WildfireTooltip.css';

const WildfireTooltip = (props) => {
	return `
		<div>
			<h3>${props.GEOGRAPHIC}</h3>
			<p class="status ${props.FIRE_STATU.toLowerCase().replace(/\s/g, '-')}">Status: ${props.FIRE_STATU}</p>
			<p>A fire of ${checkSize(props)} square kilometres started on ${props.ignition_date}.</p>

			<p>Suspected cause: ${formatFireCause(props.FIRE_CAUSE)}</p>
		</div>
	`;
};

function checkSize(props) {
	let size = (props.CURRENT_SI / 100).toFixed(2);
	return size < 0.01 ? 'less than 0.01' : size;
}

function formatFireCause(text) {
	return text === '' ? 'unknown' : text.toLowerCase();
}

export default WildfireTooltip;