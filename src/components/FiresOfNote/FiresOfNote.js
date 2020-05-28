import React from 'react';
import Slider from "react-slick";
import FireCard from '../FireCard/FireCard';
import fire_centers from '../../data/fire-centers.json';

// Import css files
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './FiresOfNote.css';

// slider params
const settings = {
	autoplay: true,
	autoplaySpeed: 7500,
	centerMode: true,
	centerPadding: '25px',
	dots: true,
	draggable: false,
	infinite: true,
	lazyLoad: 'ondemand',
	speed: 500,
	slidesToShow: 1,
	slidesToScroll: 1
};

const FiresOfNote = (props) => {
	return (
		<div className='fon'>
			<h1>Wildfires of Note</h1>
			<p>Wildfires of note are those which are highly visible or that pose a potential threat to public safety. The wildfires are grouped by B.C.’s regional fire centres.</p>
			<p>The province of B.C. is divided into six regional fire centres: Cariboo, Coastal, Kamloops, Northwest, Prince George and Southeast.</p>
			<Slider {...settings}>
				{
					fire_centers.map((d, i) => {
						let card;
						const fon = props.data.filter(fire => {
							return parseInt(fire.properties.ZONE) === parseInt(d.id)
						});

						if (fon.length > 0) {
							card = fon.map((d, i) => {
								return (
									<FireCard className='fire-card' 
										attribution={props.attribution}
										config={props.config}
										container='fon-mapview'
										data={fon[i]}
										fireCenter={d.id}
										key={`fire-card-${i}`}
										mapboxStyle={props.mapboxStyle}>
									</FireCard>
								)	
							});
						} else {
							card = <p className="no-fires">No fires of note</p>
						}

						return (
							<div className='fire-center' key={d.id}>
								<h2 className='fire-center'>{`${d.name} Fire Centre`}</h2>
								{card}
							</div>
						)
					})
				}
			</Slider>
		</div>
	);
}

export default FiresOfNote;
