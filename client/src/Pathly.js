import './Pathly.css';
import React from 'react';
import { Map } from '@vis.gl/react-google-maps';
import Home from './Home';

function Maps() {
    // setting center/zoom locks the movement/zoom
    return (
        <div className='pathly-map-body'>
            <span style={{width: '90%', height: '90%', borderRadius: '20px', overflow: 'hidden'}}>
                <Map
                    defaultZoom={12}
                    defaultCenter={{ lat: -33.8688, lng: 151.2093 }}
                    colorScheme='LIGHT' //Implement dark mode
                    streetViewControl={false} //Remove street view
                    mapTypeControl={false} //Remove satelite toggle
                    fullscreenControl={false} //Remove full screen toggle
                />
            </span>
        </div>
    )
}


export default function Pathly() {

    
    return <div className='pathly-body'>
        <div className='pathly-travel-body'>
            <Home />
        </div>
        <Maps />
    </div>
}