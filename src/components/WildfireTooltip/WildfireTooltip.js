import React from 'react';
import Aux from '../Aux/Aux';

const WildfireTooltip = (props) => {
	return(
		<Aux>
			<p>Location: {props.data.GEOGRAPHIC}</p>
		</Aux>
	)
}

export default WildfireTooltip;