import './ExpandedLocation.css';
import React from 'react';
import { motion, setDragLock } from "motion/react"
import Icons from './Icons/Icons';
import { useTravelTimes } from "./TravelTimesContext";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css';
import { Outlet } from 'react-router-dom';
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";

export default function ExpandedLocation() {
    const { pathname } = useLocation()
    const locationId = pathname.split('/').at(-1)
    const { travelTimes, setTravelTimes } = useTravelTimes();

    console.log(travelTimes)

    // Accessing props
    const {
        locations,
        } = useOutletContext();

    const locationInfo = locations.find(l => l.id === locationId)
    const locationTravel = travelTimes.find(t => t.locationId === locationId)

    // console.log(locationInfo)

    return <div className='expanded-location-body'>

    </div>
}