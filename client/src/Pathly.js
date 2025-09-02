import './Pathly.css';
import React from 'react';
import Home from './Home';
import Maps from './Maps';


export default function Pathly() {
    const [locations, setLocations] = React.useState([])
    const [startLocation, setStartLocation] = React.useState(null)
    const [markers, setMarkers] = React.useState([])

    console.log(startLocation)

    return <div className='pathly-body'>
        <div className='pathly-travel-body'>
            <Home locations={locations} setLocations={setLocations} startLocation={startLocation} setStartLocation={setStartLocation} markers={markers} setMarkers={setMarkers} />
        </div>
        <Maps startLocation={startLocation} markers={markers} locations={locations}/>
    </div>
}