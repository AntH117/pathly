import './Home.css';
import React from 'react';
import { Map, Route, RouteMatrix, useMapsLibrary  } from '@vis.gl/react-google-maps';
import { motion, setDragLock } from "motion/react"
import Icons from './Icons/Icons';
import SearchBox from './SearchBox';

export default function Home({locations, setLocations, startLocation, setStartLocation}) {

    function StartLocation() {

        return <div className='start-location-body'>
        <span style={{width: '10%', display: 'flex', justifyContent: 'center'}}><Icons.Location width={'22px'} height={'22px'} color={'red'}/></span>
        <span style={{width: '90%'}}><p>{startLocation?.formatted_address || 'Add location to start'}</p></span>
        </div>
    }
    function Locations({length}) {

        function IndividualLocation({id}) {
            const locationId = id
            const locationName = locations.find(item => item.id == locationId).location?.formatted_address
            function handleLocationChange(place) {
                setLocations(locations.map((x) => { 
                    return x.id === locationId ? {...x, location: place }: x
                }))
            }
            console.log(locations)
            return <div className='individual-location-body'>
                <SearchBox placeholder={'Add location'} onPlaceSelected={handleLocationChange} initialValue={locationName}/>
                <div className='individual-location-cancel' onClick={() => setLocations(locations.filter((location) => location.id !== locationId))}>
                    <Icons.X color={'rgb(255, 169, 169)'}/>
                </div>
            </div>
        }

        function addLocation() {
            const newItem = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
              };
              setLocations([...locations, newItem])
        }

        return <div className='pathly-locations-body'>
            <div className='location-markers'>
                {locations.map(() => {
                    return <div className='ring-container'>
                        <div className='ring'></div>
                    </div>
                })}
                {startLocation && <div className='ring-add-container'>
                    <div className='ring-add' onClick={() => addLocation()}>
                        <Icons.Plus />
                    </div>
                </div>}
            </div>
            <div className='location-name-body'>
                {locations.map((location) => {
                    return <IndividualLocation id={location.id}/>
                })}
            </div>
        </div>
    }

    function Destinations() {

        return <div className='pathly-destinations-body'>
            <motion.div className='pathly-start-body'>
                <Icons.LookingGlass />
                <SearchBox onPlaceSelected={setStartLocation}/>
            </motion.div>
            <StartLocation />
            <Locations />
        </div>
    }

    return <div className='pathly-home-body'>
        <h1>Pathly</h1>
        <Destinations />
    </div>
}