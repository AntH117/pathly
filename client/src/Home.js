import './Home.css';
import React from 'react';
import { Map, Route, RouteMatrix, useMapsLibrary  } from '@vis.gl/react-google-maps';
import { motion, setDragLock } from "motion/react"
import Icons from './Icons/Icons';
import SearchBox from './SearchBox';

export default function Home({locations, setLocations, startLocation, setStartLocation, markers, setMarkers}) {

    function StartLocation() {

        return <div className='start-location-body'>
        <span style={{width: '10%', display: 'flex', justifyContent: 'center'}}><Icons.Location width={'22px'} height={'22px'} color={'red'}/></span>
        <span style={{width: '90%'}}><p>{startLocation?.formatted_address || 'Add location to start'}</p></span>
        </div>
    }

    function handleLocationChange({place, start, locationId}) {
        const newMarker = {
            id: locationId || 'start',
            name: place.name,
            position: {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            }
        };
        setMarkers(prev => {
            const exists = prev.find(marker => marker.id === newMarker.id);
            if (exists) {
              // replace the existing marker
              return prev.map(marker => marker.id === newMarker.id ? newMarker : marker);
            } else {
              // add a new marker
              return [...prev, newMarker];
            }
          });
        if (start) {
            setStartLocation(place)
        } else {
            setLocations(locations.map((x) => { 
                return x.id === locationId ? {...x, location: place }: x
            }))
        }
    }
    
    function Locations({length}) {
        console.log(locations)
        function IndividualLocation({id}) {
            const locationId = id
            const locationName = locations.find(item => item.id == locationId).location?.formatted_address

            function handleLocationDelete() {
                setLocations(locations.filter((location) => location.id !== locationId))
                setMarkers(markers.filter((marker) => marker.id !== locationId))
            }

            console.log(locations)
            return <div className='individual-location-body'>
                <SearchBox placeholder={'Add location'} onPlaceSelected={(place) => handleLocationChange({place, locationId})} initialValue={locationName}/>
                <div className='individual-location-cancel' onClick={() => handleLocationDelete()}>
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
                <SearchBox onPlaceSelected={(place) => handleLocationChange({place, start: true})}/>
            </motion.div>
            <StartLocation />
            {startLocation && <Locations />}
        </div>
    }

    return <div className='pathly-home-body'>
        <h1>Pathly</h1>
        <Destinations />
    </div>
}