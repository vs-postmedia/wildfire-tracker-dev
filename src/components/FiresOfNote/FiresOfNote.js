import React from 'react';
import FireCard from '../FireCard/FireCard';
import fire_centers from '../../data/fire-centers.json';

// import './FiresOfNote.css';

const FiresOfNote = (props) => {
	return (
		<div className='fon'>
			<h2>Fires of Note</h2>
			{
				fire_centers.map((d, i) => {
					let card;
					const fon = props.data.filter(fire => fire.FIRE_CENTR === d.id);

					if (fon.length > 0) {
						card = (
							<FireCard className='fire-card' 
								attribution={props.attribution}
								data={props.data[i]}
								fireCenter={d.id}
								tiles={props.tiles}>
							</FireCard>
						)
					} else {
						card = <p>No fires of note</p>
					}

					return (
						<div className='fire-center' key={d.id}>
							<h2 className='fire-center'>{`${d.name} Fire Centre`}</h2>
							{card}
						</div>
					)
				})
			}
		</div>
	);
}

export default FiresOfNote;
