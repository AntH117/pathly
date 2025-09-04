import './Home.css';
import React from 'react';
import { Map, Route, RouteMatrix, useMapsLibrary  } from '@vis.gl/react-google-maps';
import { motion, setDragLock } from "motion/react"
import Icons from './Icons/Icons';
import SearchBox from './SearchBox';

export default function Home({locations, setLocations, startLocation, setStartLocation, markers, setMarkers}) {

    function StartLocation() {

        return <div className='start-location-body'>
        <span style={{display: 'flex', justifyContent: 'center', marginRight: '1rem'}}><Icons.Location width={'22px'} height={'22px'} color={'red'}/></span>
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
        function IndividualLocation({id}) {
            const locationId = id
            const locationName = locations.find(item => item.id == locationId).location?.formatted_address

            function handleLocationDelete() {
                setLocations(locations.filter((location) => location.id !== locationId))
                setMarkers(markers.filter((marker) => marker.id !== locationId))
            }

            function Rings() {
                return (
                    <div className='location-markers'>
                    <div className='ring-container'>
                        <div className='ring'></div>
                    </div>
                    <div className='ring-container'>
                        <div className='ring'></div>
                    </div>
                </div>
                )
            }

            function TransportSelect() {
                const [toggleDropdown, setToggleDropDown] = React.useState(false)
                const [selected, setSelected] = React.useState({
                    icon: <Icons.Car width={'80%'} height={'80%'} color={'gray'}/>,
                    name: 'Car'
                })

                function TransportDropDown() {
                    return (
                        toggleDropdown && <div className='transport-dropdown-body'>
                            <TransportOption icon={<Icons.Car width={'80%'} height={'80%'} color={'gray'}/>} name={'Car'}/>
                            <TransportOption icon={<Icons.Train width={'80%'} height={'80%'} color={'gray'}/>} name={'Transit'}/>
                            <TransportOption icon={<Icons.Walking width={'80%'} height={'80%'} color={'gray'}/>} name={'Walking'}/>
                            <TransportOption icon={<Icons.Bike width={'80%'} height={'80%'} color={'gray'}/>} name={'Biking'}/>
                        </div>
                    )
                }

                function TransportOption({icon, name}) {
                    
                    return selected.name !== name && <motion.div className='transport-option-body' onClick={() => setSelected({icon: icon, name: name})}
                    whileHover={{backgroundColor: 'rgb(226, 224, 255)'}}
                >
                    <div className='transport-icon'>
                        {icon}
                    </div>
                    <p className='transport-name'>{name}</p>
                </motion.div>
                }

                return (
                <div className='transport-select-body' onClick={() => setToggleDropDown(!toggleDropdown)}>
                    <div className='transport-icon'>
                        {selected.icon}
                    </div>
                    <p className='transport-name'>{selected.name}</p>
                    <div className='transport-dropdown-icon'>
                        <Icons.ArrowDown width={'0.8rem'} height={'0.8rem'} color={'gray'}/>
                    </div>
                    <TransportDropDown />
                </div>
                )
            }

            return <div className='individual-location-body'>
                <Rings />
                <div className='individual-location-search'>
                    <div className='individual-location-transport'>
                        <TransportSelect />
                    </div>
                    <SearchBox placeholder={'Add location'} onPlaceSelected={(place) => handleLocationChange({place, locationId})} initialValue={locationName}/>
                </div>
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

        return <>
        <div className='pathly-locations-body'>
                <div className='location-name-body'>
                    {locations.map((location) => {
                        return <IndividualLocation id={location.id}/>
                    })}
                </div>
            </div>
            {startLocation && <div className='ring-add-container'>
                <div className='ring-add' onClick={() => addLocation()}>
                    <Icons.Plus />
                </div>
            </div>}
        </>
    }

    function Destinations() {

        return <div className='pathly-destinations-body'>
            <motion.div className='pathly-start-body'>
                <Icons.LookingGlass />
                <SearchBox onPlaceSelected={(place) => handleLocationChange({place, start: true})} start={true}/>
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