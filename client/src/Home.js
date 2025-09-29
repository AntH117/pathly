import './Home.css';
import React from 'react';
import { Map, Route, RouteMatrix, useMapsLibrary  } from '@vis.gl/react-google-maps';
import { motion, setDragLock } from "motion/react"
import Icons from './Icons/Icons';
import SearchBox from './SearchBox';
import { useTravelTimes } from "./TravelTimesContext";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css';
import ReturnLocation from './ReturnLocation';
import { Outlet } from 'react-router-dom';

export default function Home({locations, setLocations, startLocation, setStartLocation, markers, setMarkers, returnTrip, setReturnTrip, returnToggle, setReturnToggle, setTripLeaveTime}) {
    const [depArrTime, setDepArrTime] = React.useState('Immediately')
    return <div className='pathly-home-body'>
        <h1>Pathly</h1>
        <div className='pathly-outlet-body'>
            <Outlet context={{
                locations, 
                setLocations, 
                startLocation, 
                setStartLocation, 
                markers, 
                setMarkers, 
                returnTrip, 
                setReturnTrip, 
                returnToggle, 
                setReturnToggle, 
                setTripLeaveTime,
                depArrTime, 
                setDepArrTime
                }}/>
        </div>
    </div>
}