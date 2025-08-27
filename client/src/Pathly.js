import './Pathly.css';
import React from 'react';

function Maps() {
    return (
    <gmp-map
        center={{ lat: -33.8688, lng: 151.2093 }}
        zoom={10}
        map-id="DEMO_MAP_ID"
        style={{ width: "100%", height: "100%" }}
      >
        <gmp-advanced-marker
          position={{ lat: -33.8688, lng: 151.2093 }}
          title="Sydney"
        ></gmp-advanced-marker>
      </gmp-map>
    )
}

export default function Pathly() {

    
    return <div className='pathly-body'>
        <Maps />
    </div>
}