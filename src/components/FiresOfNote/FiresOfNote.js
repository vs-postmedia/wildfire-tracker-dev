import React from 'react';
import FireCard from '../FireCard/FireCard';
import fire_centers from '../../data/fire-centers.json';

import './FiresOfNote.css';

const FiresOfNote = (props) => {
	return (
		<div className='fon'>
			<h1>Wildfires of Note</h1>
			<p>Wildfires of note are those which are highly visible or that pose a potential threat to public safety. The wildfires are categorizes by fire centres.</p>
			<p>The province of B.C. is divided into six regional fire centres: Cariboo, Coastal, Kamloops, Northwest, Prince George and Southeast.</p>


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
