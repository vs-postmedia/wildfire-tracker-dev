// import React from 'react';
import './WildfireTooltip.css';

const WildfireTooltip = (props) => {
	return `
		<div>
			<h3>${props.GEOGRAPHIC}</h3>
			<p class="status ${props.FIRE_STATU.toLowerCase().replace(/\s/g, '-')}">Status: ${props.FIRE_STATU}</p>
			<p>A ${checkSize(props)} fire started on ${props.ignition_date.split(',')[0]}.</p>

			<p>Suspected cause: ${formatFireCause(props.FIRE_CAUSE)}</p>
		</div>
	`;
};

function checkSize(props) {
	let size = (props.CURRENT_SI / 100).toFixed(2);
	return size < 0.01 ? 'spot fire' : `${size} square kilometre`;
}

function formatFireCause(text) {
	return text === '' ? 'unknown' : text.toLowerCase();
}

export default WildfireTooltip;