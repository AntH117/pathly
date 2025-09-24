import './Destinations.css';
import React from 'react';
import { Map, Route, RouteMatrix, useMapsLibrary  } from '@vis.gl/react-google-maps';
import { motion, setDragLock } from "motion/react"
import Icons from './Icons/Icons';
import SearchBox from './SearchBox';
import { useTravelTimes } from "./TravelTimesContext";
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css';
import ReturnLocation from './ReturnLocation';
import { useNavigate, useOutletContext } from "react-router-dom";

import DepArrTime from './DepArrTime';

export default function Destinations() {
        const navigate = useNavigate()
        const { travelTimes, setTravelTimes } = useTravelTimes();
        // Accessing props
        const {
            locations,
            setLocations,
            startLocation,
            setStartLocation,
            markers,
            setMarkers,
            returnTrip,
            setReturnTrip,
            returnToggle,
            setReturnToggle
          } = useOutletContext();

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
                if (place) {
                    setStartLocation(place);
                }
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
                for (const location of array) {
                    total += location.duration.value
                }
                const hours = Math.floor(total/60/60)
                const minutes = Math.round((total/60/60) % 1 * 60)
                if (hours === 0) {
                    setTotalTripTime(`${minutes} m`)
                } else {
                    setTotalTripTime(`${hours} hr ${minutes} m`)
                }
            }
    
            React.useEffect(() => {
                addTripTime(returnToggle ? travelTimes : travelTimes.filter(t => !t.return))
            }, [travelTimes])
     
            function addLocation() {
                const newItem = {
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
                  };
                  setLocations([...locations, newItem])
            }

            // Set return trip location on start location change
            const returnIdRef = React.useRef(Date.now().toString() + Math.random().toString(36).substr(2, 9));
            React.useEffect(() => {
                if (startLocation) {
                  setReturnTrip(prev => {
                    if (
                      prev?.place_id === startLocation.place_id
                    ) {
                      return prev;
                    }
                    return { ...startLocation, transportType: returnTrip?.transportType, return: true, locationId: returnIdRef.current };
                  });
                }
              }, [startLocation]);
            return <>
            <div className='pathly-locations-body'>
                    <div className='location-name-body'>
                        {locations.map((location) => {
                            return <IndividualLocation id={location.id} key={location.id}/>
                        })}
                    </div>
                </div>
                {startLocation && <div className='ring-add-container'>
                    <div className='ring-add' onClick={() => addLocation()}>
                        <Icons.Plus />
                    </div>
                </div>}
                {returnToggle &&
                 <ReturnLocation 
                    locationInformation={startLocation}  
                    returnTrip={returnTrip}
                    setReturnTrip={setReturnTrip} 
                    returnToggle={returnToggle} 
                    startLocation={startLocation}
                 />}
                <div className='locations-total-duration'>
                    {`Trip Time: ${totalTripTime}`}
                </div>
            </>
        }
    
        // Individual Locations
        const IndividualLocation = React.memo(function IndividualLocation({id}) {
            const transportIcons = {
                'Car': <Icons.Car width={'80%'} height={'80%'} color={'gray'}/>,
                'Transit': <Icons.Train width={'80%'} height={'80%'} color={'gray'}/>,
                'Walking': <Icons.Walking width={'80%'} height={'80%'} color={'gray'}/>,
                'Biking': <Icons.Bike width={'80%'} height={'80%'} color={'gray'}/>
            }
    
            const locationId = id
            const locationName = locations.find(item => item.id == locationId).location?.formatted_address
            const locationObject = locations.find(item => item.id == locationId)
            const locationExists = locations.find((l) => {
                    return l.id === locationId
                })?.location
            const locationInformation = travelTimes.find((t) => 
                t.locationId === locationObject?.id 
            )
            console.log(travelTimes)
            //Set selected transport type
            const [selectedTransport, setSelectedTransport] = React.useState(
                locationExists ? {icon: transportIcons[locationExists.transportType], name: locationExists.transportType} : {icon: transportIcons['Car'], name: 'Car'}
            )
            
            // Set expanded info
            const [expandInfo, setExpandInfo] = React.useState(false)
    
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
                if (locationObject?.location) {
                    setTravelTimes(pre => pre.filter((t) => t.locationId !== locationObject.id))
                }
            }
            
            function Rings() {
                const [markerHeight, setMarkerHeight] = React.useState(0);
                const containerRef = React.useRef(null);
              
                React.useEffect(() => {
                  if (containerRef.current) {
                    setMarkerHeight(containerRef.current.clientHeight);
                  }
                }, []);
    
                return (
                <div className='location-markers' ref={containerRef}>
                    <div className='ring-container' style={{top: 0}}>
                        <div className='ring'></div>
                    </div>
                    <div className='ring-container' style={{bottom: 0}}>
                        <div className='ring'></div>
                    </div>
                    <div className='ring-line-container' style={{width: (markerHeight - 3 * 16)}}>
    
                    </div>
                </div>
                )
            }
            
            function ExpandedLocationInfo() {
    
                function IndividualLocationInfo({title, info}) {
                    return (
                        <div className='more-location-info'>
                            {title}: <span style={{color: '#3e8abd'}}>{info}</span>
                        </div>
                    )
                }
                return <div className='more-location-body' style={expandInfo ? {height: 'fit-content'} : {height: '1.5rem'}}>
                    <motion.div className='more-location-icon'
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.90 }}
                        onClick={() => setExpandInfo(!expandInfo)}
                    >
                        {expandInfo ? <Icons.Minus width={'100%'} height={'100%'} color={'#3e8abd'}/> : <Icons.Plus width={'100%'} height={'100%'} color={'#3e8abd'}/>}
                    </motion.div>
                    <div className='more-location-info-body'>
                        <IndividualLocationInfo title={'Time taken'} info={locationInformation?.duration.text}/>
                        <IndividualLocationInfo title={'Distance'} info={locationInformation?.distance.text}/>
                    </div>
                </div>
            }
    
            function LocationInfo() {
                return <motion.div className='location-info-body'
                    whileHover={{
                        opacity: 1,
                    }}
                    data-tooltip-id="my-tooltip" 
                    onClick={() => navigate(`/location/${id}`)}
                >
                    <Icons.Info width={'80%'} height={'80%'} color={'rgb(122, 122, 122)'}/>
                    <Tooltip id="my-tooltip" place="top" content={`More info`} />
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
                    </div>
                    {locationInformation && <ExpandedLocationInfo />}
                    <SearchBox placeholder={'Add location'} 
                        onPlaceSelected={(place) => handleLocationChange({place, locationId, transportType: selectedTransport.name, start: false})} 
                        initialValue={locationName}
                        height={'2rem'}
                        />
                </div>
                <motion.div className='individual-location-cancel' onClick={() => handleLocationDelete()}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.90 }}
    
                >
                    <Icons.X color={'rgb(255, 169, 169)'} width={'100%'} height={'100%'}/>
                </motion.div>
                <LocationInfo />
            </div>
        })
    
        function ReturnTrip() {
    
            return (
                <div className='location-return-body'>
                <input 
                type="checkbox" 
                onChange={(e) => setReturnToggle(e.target.checked)} 
                checked={returnToggle} 
                />
                Return trip
            </div>
            )
            
        }
        
    return <>
        <motion.div className='pathly-start-body'>
            <Icons.LookingGlass />
            <SearchBox onPlaceSelected={(place) => handleLocationChange({place, start: true})} start={true} height={'50%'} initialValue={startLocation?.formatted_address}/>
        </motion.div>
        <StartLocation />
        {startLocation && <DepArrTime />}
        {locations?.length > 0 && <ReturnTrip returnTrip={returnTrip}/>}
        {startLocation && <Locations />}
    </>
}
