import '../styles/Pathly.css';
import React from 'react';
import Home from './Home';
import Maps from './Maps';
import { useTravelTimes } from '../context/TravelTimesContext';
import dayjs from 'dayjs';

export default function Pathly() {
    const now = new Date()
    const [locations, setLocations] = React.useState([])
    const [startLocation, setStartLocation] = React.useState(null)
    const [markers, setMarkers] = React.useState([])
    const [returnTrip, setReturnTrip] = React.useState(null)
    const [returnToggle, setReturnToggle] = React.useState(false)
    const [tripLeaveTime, setTripLeaveTime] = React.useState(now)
    const [depArrTime, setDepArrTime] = React.useState('Immediately')

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
                returnToggle={returnToggle}
                setReturnToggle={setReturnToggle}
                setTripLeaveTime={setTripLeaveTime}
                tripLeaveTime={tripLeaveTime}
                depArrTime={depArrTime}
                setDepArrTime={setDepArrTime}
            />
        </div>
        <div className='pathly-map-outer-body'>
            <Maps 
                startLocation={startLocation} 
                markers={markers} 
                locations={locations} 
                returnTrip={returnTrip}
                returnToggle={returnToggle}
                tripLeaveTime={tripLeaveTime}
                depArrTime={depArrTime}
            />
        </div>
    </div>
}