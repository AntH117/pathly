import './ExpandedLocation.css';
import React from 'react';
import { motion, setDragLock } from "motion/react"
import Icons from '../icons/Icons';
import { useTravelTimes } from '../context/TravelTimesContext';
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css';
import { Outlet } from 'react-router-dom';
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import dayjs from 'dayjs';

function useBreakpoint(breakpoint = 800) {
    const [isLarge, setIsLarge] = React.useState(() => window.innerWidth > breakpoint);

    React.useEffect(() => {
        const check = () => setIsLarge(window.innerWidth > breakpoint);
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, [breakpoint]);

    return isLarge; 
}

export default function ExpandedLocation() {
    //check for desktop
    const isLargeScreen = useBreakpoint(900);
    const [desktop, setDestop] = React.useState(isLargeScreen)
    React.useEffect(() => {
        setDestop(isLargeScreen)
    }, [isLargeScreen])

    const [departureTimes, setDepartureTimes] = React.useState(null)
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const locationId = pathname.split('/').at(-1)
    const { travelTimes, setTravelTimes } = useTravelTimes();
    // Accessing props
    const {
        locations,
        } = useOutletContext();
    const locationTravel = travelTimes.find(t => t.locationId === locationId)

    React.useEffect(() => {
        if (locationTravel) {
            const depTimes = calculateDepartureTime(locationTravel.instructions)
            setDepartureTimes(depTimes)
        }
    }, [locationTravel])


    if (!locationTravel) return

    function calculateDepartureTime(instructions) {
        const initialDeparture = locationTravel.departureTime; 
        let tempDepTimes = [];
        for (let i = 0; i < instructions.length; i++) {
            if (instructions[i]?.transit) {
                tempDepTimes.push(instructions[i].transit.departure_time.value);
            } else {
                tempDepTimes.push(null);
            }
        }
        for (let j = 0; j < tempDepTimes.length; j++) {
            if (j === 0 && tempDepTimes[j] === null) {
                tempDepTimes[j] = initialDeparture;
            } else if (tempDepTimes[j] === null) {
                tempDepTimes[j] = dayjs(tempDepTimes[j - 1]).add(instructions[j - 1].duration.value, 'second').toDate();
            }
        }
        return tempDepTimes;
    }



    function TravelInstructions({info, num}) {
        const transportIcons = {
            'DRIVING': <Icons.Car width={'80%'} height={'80%'} color={'gray'}/>,
            'TRANSIT': <Icons.Train width={'80%'} height={'80%'} color={'gray'}/>,
            'WALKING': <Icons.Walking width={'80%'} height={'80%'} color={'gray'}/>,
            'BIKING': <Icons.Bike width={'80%'} height={'80%'} color={'gray'}/>
        }

        function TransitDisplay({name, text_color, color}) {

            return <div className='transit-display' style={{color: text_color, backgroundColor: color}}>
                {name}
            </div>
        }

        const plainText = info.instructions.replace(/<[^>]+>/g, "");

        return <div className='travel-instruction-body'>
                <div className='travel-instruction-time'>
                    {departureTimes ? departureTimes[num].toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                </div>
            <div className='travel-instruction-left-body'>
                <div className='travel-instruction-icon'>
                    {transportIcons[info.travel_mode]}
                </div>
                <span style={{maxWidth: '70%', width: 'fit-content', height: 'fit-content'}}>{plainText}</span>
                {info.travel_mode === 'TRANSIT' && <TransitDisplay name={info.transit.line?.short_name} text_color={info.transit.line?.text_color} color={info.transit.line?.color}/>}
            </div>
            {desktop && <div className='travel-instruction-duration'>
                {info.duration.text}
            </div>}
        </div>
    }

    return locationTravel && <div className='expanded-location-body'>
    <div className='expanded-location-back' onClick={() => navigate('/')}>
        <Icons.Return />
    </div>
    <div className='expanded-location-destination'>
        <h1>{locationTravel?.destination.name}</h1>
        <p style={{color: 'gray'}}>{locationTravel?.destination.formatted_address}</p>
    </div>
    <div className='expanded-location-travel'>
        Travel info from <span style={{marginLeft: '0.3rem', fontWeight: 'bold'}}>{locationTravel?.origin.formatted_address}</span>:
    </div>
    <div className='expanded-location-travel-instructions'>
        {locationTravel?.instructions.map((instruction, i) => {
            return <TravelInstructions info={instruction} num={i}/>
        })}
    </div>
</div>
}