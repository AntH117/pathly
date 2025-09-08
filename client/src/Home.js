import './Home.css';
import React from 'react';
import { Map, Route, RouteMatrix, useMapsLibrary  } from '@vis.gl/react-google-maps';
import { motion, setDragLock } from "motion/react"
import Icons from './Icons/Icons';
import SearchBox from './SearchBox';
import { useTravelTimes } from "./TravelTimesContext";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css';


export default function Home({locations, setLocations, startLocation, setStartLocation, markers, setMarkers}) {
    const { travelTimes, setTravelTimes } = useTravelTimes();
    function StartLocation() {

        return <div className='start-location-body'>
        <span style={{display: 'flex', justifyContent: 'center', marginRight: '1rem'}}><Icons.Location width={'22px'} height={'22px'} color={'red'}/></span>
        <span style={{width: '90%'}}><p>{startLocation?.formatted_address || 'Add location to start'}</p></span>
        </div>
    }

    function handleLocationChange({place, start, locationId, transportType}) {
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
                return x.id === locationId ? {...x, location: {...place, transportType} }: x
            }))
        }
    }
    
    function Locations() {

        const [totalTripTime, setTotalTripTime] = React.useState()
        function addTripTime(array) {
            let total = 0;

        }
        console.log(travelTimes)
        const transportIcons = {
            'Car': <Icons.Car width={'80%'} height={'80%'} color={'gray'}/>,
            'Transit': <Icons.Train width={'80%'} height={'80%'} color={'gray'}/>,
            'Walking': <Icons.Walking width={'80%'} height={'80%'} color={'gray'}/>,
            'Biking': <Icons.Bike width={'80%'} height={'80%'} color={'gray'}/>
        }

        function IndividualLocation({id}) {
            const locationId = id
            const locationName = locations.find(item => item.id == locationId).location?.formatted_address
            const locationObject = locations.find(item => item.id == locationId)
            const locationExists = locations.find((l) => {
                    return l.id === locationId
                })?.location
            
            const locationInformation = travelTimes.find((t) => 
                t.destination.placeId === locationObject?.location?.place_id //destination
            )
            //Set selected transport type
            const [selectedTransport, setSelectedTransport] = React.useState(
                locationExists ? {icon: transportIcons[locationExists.transportType], name: locationExists.transportType} : {icon: transportIcons['Car'], name: 'Car'}
            )
            

            // Set change when transport type changes
            function handleTransportChange({icon, name}) {
                if (locationExists) {
                    setLocations(prevLocations  => prevLocations.map((x) => { 
                        return x.id === locationId ? {...x, location: {...x.location, transportType: name} }: x
                    }))
                }
                setSelectedTransport({icon, name})
            }

            function handleLocationDelete() {
                setLocations(locations.filter((location) => location.id !== locationId))
                setMarkers(markers.filter((marker) => marker.id !== locationId))
                setTravelTimes(pre => pre.filter((t) => t.destination.placeId !== locationObject.location.place_id))
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

            function LocationInfo() {
                return <motion.div className='location-info-body'
                    whileHover={{
                        opacity: 1,
                        scale: 1.1
                    }}
                    data-tooltip-id="my-tooltip" 
                >
                    <Icons.Info width={'80%'} height={'80%'} color={'rgb(122, 122, 122)'}/>
                    <Tooltip id="my-tooltip" place="top" content={`Total distance: ${locationInformation.distance.text}`} />
                </motion.div>
            }

            function TransportSelect() {
                const [toggleDropdown, setToggleDropDown] = React.useState(false)

                function TransportDropDown() {
                    return (
                        toggleDropdown && <div className='transport-dropdown-body'>
                            {Object.entries(transportIcons).map(([name, icon]) => (
                                <TransportOption
                                    key={name}
                                    icon={icon}
                                    name={name}
                                />
                            ))}
                        </div>
                    )
                }

                function TransportOption({icon, name}) {
                    
                    return selectedTransport.name !== name && <motion.div className='transport-option-body' onClick={() => handleTransportChange({icon: icon, name: name})}
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
                        {selectedTransport.icon}
                    </div>
                    <p className='transport-name'>{selectedTransport.name}</p>
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
                        <div className='location-time-taken'>{locationInformation?.duration.text}</div>
                    </div>
                    <SearchBox placeholder={'Add location'} onPlaceSelected={(place) => handleLocationChange({place, locationId, transportType: selectedTransport.name})} initialValue={locationName}/>
                </div>
                <motion.div className='individual-location-cancel' onClick={() => handleLocationDelete()}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.90 }}

                >
                    <Icons.X color={'rgb(255, 169, 169)'} width={'100%'} height={'100%'}/>
                </motion.div>
                <LocationInfo />
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
            <div className='locations-total-duration'>
                {`Trip Time:`}
            </div>
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