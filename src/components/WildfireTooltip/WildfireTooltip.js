import React from 'react';
import Aux from '../Aux/Aux';

const WildfireTooltip = (props) => {
	return(
		<Aux>
			<h3>Status: {props.data.FIRE_STATU}</h3>
			<p>Location: {props.data.GEOGRAPHIC}</p>
			<p>Size: {checkSize(props)} square kilometers.</p>
		</Aux>
	)
};

function checkSize(props) {
	let size = (props.data.CURRENT_SI / 100).toFixed(2);
	return size < 0.01 ? 'Spot fire. Less than 0.01' : size;
}

export default WildfireTooltip;