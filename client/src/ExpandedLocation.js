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
    const navigate = useNavigate()
    const { pathname } = useLocation()
    const locationId = pathname.split('/').at(-1)
    const { travelTimes, setTravelTimes } = useTravelTimes();
    // Accessing props
    const {
        locations,
        } = useOutletContext();
    const locationTravel = travelTimes.find(t => t.locationId === locationId)

    // const [departureTimes, setDepartureTimes] = React.useState([])

    // function findDepartureTimes() {
    //     const departureTime = locationTravel?.departureTime
    //     let finalTimes = [departureTime]
    //     const instructions = locationTravel.instructions || []

    //     console.log(departureTime)
    //     for (let i = 0; i < instructions.length - 1; i++) {
    //         const travelDuration = instructions[i].duration.value
    //         if (instructions.transit) {
    //             finalTimes.push(instructions.transit.departureTime)
    //         } else {
    //             const nextDeparture = new Date(finalTimes[i].getTime() + travelDuration * 1000)
    //             finalTimes.push(nextDeparture)
    //         }
    //         setDepartureTimes(finalTimes)
    //     }

    // }
    // React.useEffect(() => {
    //     findDepartureTimes()
    // }, [])


    if (!locationTravel) return

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
            <div className='travel-instruction-left-body'>
                <div className='travel-instruction-icon'>
                    {transportIcons[info.travel_mode]}
                </div>
                <span style={{maxWidth: '70%', width: 'fit-content'}}>{plainText}</span>
                {info.travel_mode === 'TRANSIT' && <TransitDisplay name={info.transit.line?.short_name} text_color={info.transit.line?.text_color} color={info.transit.line?.color}/>}
            </div>
            <div className='travel-instruction-duration'>
                {info.duration.text}
            </div>
        </div>
    }
    console.log(locationTravel)
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