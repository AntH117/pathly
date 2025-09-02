import { Map, useMap, Marker } from '@vis.gl/react-google-maps';
import './Maps.css';
import React from 'react';


export default function Maps({startLocation, markers}) {
    const map = useMap()

    function startLocationZoom() {
        const lat = startLocation.geometry.location.lat();
        const lng = startLocation.geometry.location.lng();
        map.setCenter({ lat, lng });
        map.setZoom(15);
    }

    console.log(startLocation)
    React.useEffect(() => {
        if (startLocation) {
            startLocationZoom()
        }
    }, [startLocation])


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
                >
                    {markers.map((m) => (
                        <Marker key={m.id} position={m.position} />
                    ))}
                </Map>
            </span>
        </div>
    )
}