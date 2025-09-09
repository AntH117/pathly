import './Pathly.css';
import React from 'react';
import Home from './Home';
import Maps from './Maps';
import { useTravelTimes } from "./TravelTimesContext";

export default function Pathly() {
    const [locations, setLocations] = React.useState([])
    const [startLocation, setStartLocation] = React.useState(null)
    const [markers, setMarkers] = React.useState([])
    const { travelTimes, setTravelTimes } = useTravelTimes();
    const [returnTrip, setReturnTrip] = React.useState()

    return <div className='pathly-body'>
        <div className='pathly-travel-body'>
            <Home 
                locations={locations} 
                setLocations={setLocations} 
                startLocation={startLocation} 
                setStartLocation={setStartLocation} 
                markers={markers} 
                setMarkers={setMarkers} 
                returnTrip={returnTrip}
                setReturnTrip={setReturnTrip}
            />
        </div>
        <div className='pathly-map-outer-body'>
            <Maps 
                startLocation={startLocation} 
                markers={markers} 
                locations={locations} 
                returnTrip={returnTrip}
            />
        </div>
    </div>
}