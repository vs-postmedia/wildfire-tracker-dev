import React from 'react';
import Aux from '../Aux/Aux';

const WildfireTooltip = (props) => {
	
	return(
		<Aux>
			<h3>Status: {props.data.FIRE_STATU}</h3>
			<p>Location: {props.data.GEOGRAPHIC}</p>
			<p>Size: {(props.data.CURRENT_SI / 100).toFixed(2)} square kilometers </p>
		</Aux>
	)
}

export default WildfireTooltip;