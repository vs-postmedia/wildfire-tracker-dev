import React from 'react';
import fire_centers from '../../data/fire-centers.json';

import './FiresOfNote.css';

const FiresOfNote = (props) => {
	return (
		<div className='fon'>
			<h2>Fires of Note</h2>
			{ props.data[0] &&
				<h2>{`Fire name: ${props.data[0].fire_name}`}</h2>
			}

		</div>
	);
}

export default FiresOfNote;