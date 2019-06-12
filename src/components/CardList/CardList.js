import React from 'react';
import Aux from '../Aux/Aux';
import MainCard from '../MainCard/MainCard';
import ThumbnailCard from '../ThumbnailCard/ThumbnailCard';

import './CardList.css';


const CardList = (props) => {
	const data = props.data.sort((a,b) => {
		return parseInt(b.fire_id) - parseInt(a.fire_id);
	});
 
	// get fire by ID in URL or latest fire
	const main_card = props.main_fire !== null ? props.main_fire : data[0];

	if (main_card && main_card.length > 0) {
		return (
			<Aux>
				<MainCard className='main-card' data={main_card}></MainCard>
				
				<div className='card-list'>
					<h2 className='subhead'>Fires of Note</h2>
					<ul>
			 			{ data.map(d => {
			 				return <ThumbnailCard 
			 					key={d.fire_id}
			 					data={d} 
			 					listClickHandler={props.listClickHandler}></ThumbnailCard>
						})}
					</ul>
				</div>
			</Aux>
		)
	} else {
		return (
			<h2>No fires of note</h2>
		)
	}
}


export default CardList;