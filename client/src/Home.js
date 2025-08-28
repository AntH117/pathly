import './Home.css';
import React from 'react';
import { Map } from '@vis.gl/react-google-maps';
import { motion, setDragLock } from "motion/react"
import Icons from './Icons/Icons';

export default function Home() {

    function Locations({length}) {
        const [locations, setLocations] = React.useState([])

        function IndividualLocation() {

            return <div className='individual-location-body'>
                <p>Add Destination</p>
                <div className='individual-location-cancel' onClick={() => setLocations(locations.slice(0, locations.length - 1))}>
                    <Icons.X color={'rgb(255, 169, 169)'}/>
                </div>
            </div>
        }



        return <div className='pathly-locations-body'>
            <div className='location-markers'>
                {locations.map(() => {
                    return <div className='ring-container'>
                        <div className='ring'></div>
                    </div>
                })}
                <div className='ring-add-container'>
                    <div className='ring-add' onClick={() => setLocations([...locations, 1])}>
                        <Icons.Plus />
                    </div>
                </div>
            </div>
            <div className='location-name-body'>
                {locations.map((index) => {
                    return <IndividualLocation />
                })}
            </div>
        </div>
    }

    function Destinations() {

        return <div className='pathly-destinations-body'>
            <motion.div className='pathly-start-body'>
                <Icons.LookingGlass />
                <input className='pathly-start-input' placeholder='Start'></input>
            </motion.div>
            <Locations />
        </div>
    }

    return <div className='pathly-home-body'>
        <h1>Pathly</h1>
        <Destinations />
    </div>
}